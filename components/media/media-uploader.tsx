"use client";

import { useState } from "react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type MediaUploaderProps = {
  folder?: string;
};

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function MediaUploader({ folder = "fproduction-admin" }: MediaUploaderProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (result: CloudinaryUploadWidgetResults) => {
    const info = result?.info;
    console.log("Upload result:", result);
    if (!info || typeof info !== "object") return;

    const secureUrl = (info as { secure_url?: string }).secure_url;
    if (!secureUrl) {
      setError("Không lấy được URL từ Cloudinary.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: secureUrl }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Tải ảnh lên không thành công.");
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
          tags: ["fproduction"],
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
            {isUploading ? "Đang tải lên..." : "Tải ảnh/video lên Cloudinary"}
          </Button>
        )}
      </CldUploadWidget>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

