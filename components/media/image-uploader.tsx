"use client";

import { useState } from "react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  folder?: string;
};

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type UploadInfo = {
  secure_url?: string;
  public_id?: string;
  original_filename?: string;
  display_name?: string;
  format?: string;
};

export function ImageUploader({ folder = "fproduction-admin/images" }: ImageUploaderProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (result: CloudinaryUploadWidgetResults) => {
    // Cloudinary có thể trả về single result hoặc array of results
    const results = Array.isArray(result?.info) ? result.info : [result?.info];
    
    const imagesToSave: Array<{
      url: string;
      publicId: string;
      title: string | null;
      format: string | null;
    }> = [];

    for (const info of results) {
      if (!info || typeof info !== "object") continue;

      const uploadInfo = info as UploadInfo;
      const secureUrl = uploadInfo.secure_url;
      const publicId = uploadInfo.public_id;
      
      if (!secureUrl || !publicId) {
        setError("Không lấy được URL hoặc publicId từ Cloudinary.");
        continue;
      }

      // Lấy title từ original_filename, nếu không có thì dùng display_name
      const title = uploadInfo.original_filename || uploadInfo.display_name || null;
      const format = uploadInfo.format || null;

      imagesToSave.push({
        url: secureUrl,
        publicId,
        title,
        format,
      });
    }

    if (imagesToSave.length === 0) return;

    // Tự động lưu vào database
    try {
      setIsUploading(true);
      setError(null);

      const savePromises = imagesToSave.map((image) =>
        fetch("/api/admin/media", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: image.url,
            publicId: image.publicId,
            title: image.title,
            format: image.format,
          }),
        })
      );

      const responses = await Promise.all(savePromises);
      
      for (const response of responses) {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Tải ảnh lên không thành công.");
        }
      }

      router.refresh();
    } catch (err) {
      console.error("Upload failed", err);
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!uploadPreset) {
    return (
      <p className="text-sm text-red-500">
        Chưa cấu hình NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET. Vui lòng bổ sung ENV để
        sử dụng tính năng upload.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{
          folder,
          multiple: true,
          tags: ["fproduction", "images"],
          resourceType: "image",
          maxImageFileSize: 10000000,
          maxImageWidth: 4500,
          maxImageHeight: 3000,
        }}
        onUploadAdded={() => {
          setIsUploading(true);
          setError(null);
        }}
        onClose={() => setIsUploading(false)}
        onSuccess={(result) => handleUpload(result)}
      >
        {({ open }) => (
          <Button
            type="button"
            onClick={() => open?.()}
            disabled={isUploading}
            className="bg-brand text-[#1f1f1f] hover:bg-brand-dark"
          >
            {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
          </Button>
        )}
      </CldUploadWidget>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

