"use client";

type MediaItem = {
  id: string;
  url: string;
  s3Key: string;
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
        Chưa có nội dung nào. Hãy tải ảnh lên để bắt đầu.
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
          <img
            src={item.url}
            alt="Image asset"
            className="h-48 w-full object-cover"
            loading="lazy"
          />
          <figcaption className="border-t border-black/5 px-4 py-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground-secondary">
              {new Date(item.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
