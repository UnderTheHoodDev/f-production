"use client";

import { CldImage } from "next-cloudinary";

type MediaItem = {
  id: string;
  url: string | null;
  publicId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type MediaGalleryProps = {
  items: MediaItem[];
};

export function MediaGallery({ items }: MediaGalleryProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-6 text-center text-sm text-foreground-secondary/70">
        Chưa có nội dung nào. Hãy tải ảnh/video lên Cloudinary để bắt đầu.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure
          key={item.id}
          className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
        >
          <CldImage
            width="600"
            height="400"
            src={item.url as string}
            alt="Cloudinary asset"
            className="h-48 w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <figcaption className="border-t border-black/5 px-4 py-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground-secondary">
              {new Date(item.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="ml-2 text-foreground-secondary/70">
              Cloudinary asset
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
