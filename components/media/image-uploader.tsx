"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImagePlus } from "lucide-react";

type UploadProgress = {
  filename: string;
  progress: number;
  status: "pending" | "compressing" | "uploading" | "completed" | "failed";
  error?: string;
  originalSize?: number;
  compressedSize?: number;
};

export function ImageUploader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback(
    (filename: string, updates: Partial<UploadProgress>) => {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.filename === filename ? { ...upload, ...updates } : upload
        )
      );
    },
    []
  );

  const uploadToS3 = useCallback(
    async (
      file: File,
      presignedUrl: string,
      onProgress: (progress: number) => void
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload aborted"));
        });

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    },
    []
  );

  const getImageDimensions = useCallback(
    (file: File): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
          URL.revokeObjectURL(img.src);
        };
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      setError(null);

      // Initialize progress tracking
      const initialProgress: UploadProgress[] = acceptedFiles.map((file) => ({
        filename: file.name,
        progress: 0,
        status: "pending",
      }));
      setUploads(initialProgress);

      try {
        // Step 1: Compress images (Q98)
        const compressedFiles: File[] = [];

        for (const file of acceptedFiles) {
          updateProgress(file.name, {
            status: "compressing",
            originalSize: file.size,
          });

          try {
            // Skip compression for already small files (<500KB) or non-JPEG/PNG
            const isCompressible = file.type === "image/jpeg" || file.type === "image/png";
            const isSmall = file.size < 500 * 1024;

            if (isCompressible && !isSmall) {
              const compressed = await imageCompression(file, {
                maxSizeMB: 50,
                useWebWorker: true,
                initialQuality: 0.98,
                alwaysKeepResolution: true,
                fileType: file.type as "image/jpeg" | "image/png",
              });

              // Create a new File with the original name
              const compressedFile = new File([compressed], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              compressedFiles.push(compressedFile);
              updateProgress(file.name, {
                compressedSize: compressedFile.size,
              });
            } else {
              // Keep original file
              compressedFiles.push(file);
              updateProgress(file.name, {
                compressedSize: file.size,
              });
            }
          } catch (compressError) {
            console.warn("Compression failed, using original:", compressError);
            compressedFiles.push(file);
          }
        }

        // Step 2: Get presigned URLs
        const filesMetadata = compressedFiles.map((file) => ({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }));

        const presignedResponse = await fetch(
          "/api/admin/media/presigned-urls",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ files: filesMetadata }),
          }
        );

        if (!presignedResponse.ok) {
          const errorData = await presignedResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Không thể tạo URL upload"
          );
        }

        const { data: presignedData } = await presignedResponse.json();

        // Step 3: Upload to S3 with concurrency limit
        const batchSize = 3;
        const results: Array<{
          s3Key: string;
          title: string;
          format: string;
          fileSize: number;
          width: number;
          height: number;
        } | null> = [];

        for (let i = 0; i < compressedFiles.length; i += batchSize) {
          const batch = compressedFiles.slice(i, i + batchSize);
          const batchPresigned = presignedData.slice(i, i + batchSize);
          const batchOriginalFiles = acceptedFiles.slice(i, i + batchSize);

          const batchResults = await Promise.all(
            batch.map(async (file, batchIndex) => {
              const { presignedUrl, s3Key } = batchPresigned[batchIndex];
              const originalFile = batchOriginalFiles[batchIndex];

              try {
                updateProgress(originalFile.name, { status: "uploading" });

                // Upload compressed file to S3
                await uploadToS3(file, presignedUrl, (progress) => {
                  updateProgress(originalFile.name, { progress });
                });

                // Get image dimensions from original file
                let dimensions = { width: 0, height: 0 };
                try {
                  dimensions = await getImageDimensions(originalFile);
                } catch {
                  // Ignore dimension errors
                }

                updateProgress(originalFile.name, {
                  status: "completed",
                  progress: 100,
                });

                return {
                  s3Key,
                  title: originalFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
                  format: originalFile.name.split(".").pop()?.toLowerCase() || "",
                  fileSize: file.size, // Compressed size
                  width: dimensions.width,
                  height: dimensions.height,
                };
              } catch (err) {
                updateProgress(originalFile.name, {
                  status: "failed",
                  error: (err as Error).message,
                });
                return null;
              }
            })
          );

          results.push(...batchResults);
        }

        // Filter successful uploads
        const successfulUploads = results.filter(
          (r): r is NonNullable<typeof r> => r !== null
        );

        if (successfulUploads.length === 0) {
          throw new Error("Tất cả upload đều thất bại");
        }

        // Step 4: Save metadata to database
        const saveResponse = await fetch("/api/admin/media/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: successfulUploads }),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Không thể lưu thông tin ảnh"
          );
        }

        // Refresh the page to show new images
        router.refresh();

        // Close dialog and clear uploads after 1.5 seconds
        setTimeout(() => {
          setOpen(false);
          setUploads([]);
        }, 1500);
      } catch (err) {
        console.error("Upload failed:", err);
        setError((err as Error).message);
      } finally {
        setIsUploading(false);
      }
    },
    [router, updateProgress, uploadToS3, getImageDimensions]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".heic", ".heif"],
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isUploading,
  });

  const completedCount = uploads.filter((u) => u.status === "completed").length;
  const failedCount = uploads.filter((u) => u.status === "failed").length;

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing while uploading
    if (isUploading && !newOpen) return;
    setOpen(newOpen);
    if (!newOpen) {
      setUploads([]);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#d9b588] text-[#1f1f1f] hover:bg-[#c9a578]">
          <ImagePlus className="h-4 w-4 mr-2" />
          Tải ảnh lên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tải ảnh lên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragActive
                ? "border-[#d9b588] bg-[#d9b588]/10"
                : "border-border hover:border-[#d9b588]/50"
              }
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div
                className={`
                p-3 rounded-full transition-colors
                ${isDragActive ? "bg-[#d9b588]/20" : "bg-muted"}
              `}
              >
                <Upload
                  className={`h-6 w-6 ${isDragActive ? "text-[#d9b588]" : "text-muted-foreground"
                    }`}
                />
              </div>
              {isDragActive ? (
                <p className="text-[#d9b588] font-medium">Thả ảnh vào đây...</p>
              ) : (
                <>
                  <div>
                    <p className="font-medium">Kéo thả ảnh vào đây</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      hoặc click để chọn file
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hỗ trợ JPEG, PNG, WebP, GIF • Tối đa 50MB/ảnh • Tự động nén Q98
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Progress tracking */}
          {uploads.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  Tiến trình ({completedCount}/{uploads.length})
                </h4>
                {failedCount > 0 && (
                  <span className="text-xs text-red-500">
                    {failedCount} thất bại
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {uploads.map((upload) => (
                  <div
                    key={upload.filename}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50"
                  >
                    {/* Status Icon */}
                    <div className="shrink-0">
                      {upload.status === "completed" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {upload.status === "failed" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      {(upload.status === "uploading" || upload.status === "compressing") && (
                        <Loader2 className="h-4 w-4 text-[#d9b588] animate-spin" />
                      )}
                      {upload.status === "pending" && (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>

                    {/* Filename and Progress */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{upload.filename}</p>

                      {/* Compression info */}
                      {upload.status === "compressing" && (
                        <p className="text-xs text-muted-foreground">Đang nén...</p>
                      )}

                      {/* Size savings */}
                      {upload.originalSize && upload.compressedSize && upload.originalSize !== upload.compressedSize && (
                        <p className="text-xs text-green-600">
                          {formatFileSize(upload.originalSize)} → {formatFileSize(upload.compressedSize)}
                          {" "}
                          <span className="text-green-500">
                            (-{Math.round((1 - upload.compressedSize / upload.originalSize) * 100)}%)
                          </span>
                        </p>
                      )}

                      {upload.status === "uploading" && (
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-[#d9b588] transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      )}
                      {upload.error && (
                        <p className="text-xs text-red-500 mt-0.5 truncate">
                          {upload.error}
                        </p>
                      )}
                    </div>

                    {/* Progress Percentage */}
                    {upload.status === "uploading" && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {upload.progress}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Global Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                onClick={() => setError(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
