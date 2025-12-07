"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageViewer } from "@/components/media/image-viewer";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

type ImageItem = {
  id: string;
  title: string | null;
  format: string | null;
  url: string | null;
  publicId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ImagesGalleryProps = {
  items: ImageItem[];
};

type SortOption = "createdAt-desc" | "createdAt-asc" | "updatedAt-desc" | "updatedAt-asc";

export function ImagesGallery({ items }: ImagesGalleryProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<{
    id: string;
    title: string | null;
  } | null>(null);

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    
    switch (sortBy) {
      case "createdAt-desc":
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "createdAt-asc":
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "updatedAt-desc":
        return sorted.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "updatedAt-asc":
        return sorted.sort((a, b) => 
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      default:
        return sorted;
    }
  }, [items, sortBy]);

  const handleDeleteClick = (imageId: string, imageTitle: string | null) => {
    setImageToDelete({ id: imageId, title: imageTitle });
  };

  const performDelete = async () => {
    if (!imageToDelete) return;

    try {
      setDeletingId(imageToDelete.id);
      const response = await fetch(`/api/admin/media/${imageToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Không thể xóa ảnh.");
      }

      setImageToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Delete failed", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa ảnh.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Chưa có ảnh nào. Hãy tải ảnh lên Cloudinary để bắt đầu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tổng số: {items.length} ảnh
        </p>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Mới nhất (tạo)</SelectItem>
            <SelectItem value="createdAt-asc">Cũ nhất (tạo)</SelectItem>
            <SelectItem value="updatedAt-desc">Mới nhất (cập nhật)</SelectItem>
            <SelectItem value="updatedAt-asc">Cũ nhất (cập nhật)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {sortedItems.map((item) => (
          <figure
            key={item.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            {item.title && (
              <div className="flex items-center justify-between px-3 py-2 bg-muted/30 dark:bg-muted/20">
                <p className="text-xs font-medium text-foreground line-clamp-1 flex-1">
                  {item.title}
                  {item.format && `.${item.format}`}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item.id, item.title);
                      }}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {!item.title && (
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1 hover:bg-accent/80 rounded-sm bg-background/80 backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item.id, item.title);
                      }}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div 
              className="relative aspect-4/3 overflow-hidden bg-muted/30 dark:bg-muted/20 p-2 cursor-pointer"
              onDoubleClick={() => {
                const index = sortedItems.findIndex((img) => img.id === item.id);
                setViewerIndex(index);
              }}
            >
              <CldImage
                width="400"
                height="300"
                src={item.publicId || (item.url as string)}
                alt={item.title || "Studio image"}
                className="h-full w-full rounded-md object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
              />
            </div>
          </figure>
        ))}
      </div>

      {/* Image Viewer Overlay */}
      {viewerIndex !== null && (
        <ImageViewer
          images={sortedItems}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={imageToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setImageToDelete(null);
          }
        }}
        onConfirm={performDelete}
        title="Xác nhận xóa ảnh"
        description={
          imageToDelete?.title
            ? `Bạn có chắc chắn muốn xóa ảnh "${imageToDelete.title}"? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn xóa ảnh này? Hành động này không thể hoàn tác."
        }
        isLoading={deletingId !== null}
      />
    </div>
  );
}

