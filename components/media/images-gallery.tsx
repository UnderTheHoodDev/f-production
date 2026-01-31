"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import { MoreVertical, CheckSquare, Square, Trash2, Calendar, Eye, EyeOff, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { ImageEditDialog } from "@/components/media/image-edit-dialog";
import { MultiSelect } from "@/components/ui/multi-select";

type Event = {
  id: string;
  title: string;
};

type ImageItem = {
  id: string;
  title: string | null;
  format: string | null;
  url: string;
  s3Key: string;
  showOnLanding?: boolean;
  createdAt: Date;
  updatedAt: Date;
  events?: Event[];
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  hasPrev: boolean;
};

type CurrentSort = {
  sortBy: string;
  sortOrder: string;
};

type Filters = {
  search: string;
};

type ImagesGalleryProps = {
  items: ImageItem[];
  pagination: PaginationInfo;
  currentSort: CurrentSort;
  filters: Filters;
};

type SortOption = "createdAt-desc" | "createdAt-asc" | "updatedAt-desc" | "updatedAt-asc";

export function ImagesGallery({ items, pagination, currentSort, filters }: ImagesGalleryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search input state with debounce
  const [searchInput, setSearchInput] = useState(filters.search);

  // Convert currentSort to SortOption format
  const sortBy = `${currentSort.sortBy}-${currentSort.sortOrder}` as SortOption;
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<{
    id: string;
    title: string | null;
  } | null>(null);
  const [imageToEdit, setImageToEdit] = useState<ImageItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [imagesToDeleteMultiple, setImagesToDeleteMultiple] = useState<string[] | null>(null);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isUpdatingEvents, setIsUpdatingEvents] = useState(false);
  const [showLandingSelector, setShowLandingSelector] = useState(false);
  const [isUpdatingLanding, setIsUpdatingLanding] = useState(false);

  // Create URL with updated params
  const createPageUrl = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  const createSortUrl = useCallback((newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    const [field, order] = newSort.split("-");
    params.set("sortBy", field);
    params.set("sortOrder", order);
    params.set("page", "1"); // Reset to page 1 on sort change
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  const createSearchUrl = useCallback((search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 on search
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  const createFilterUrl = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== undefined && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        router.push(createSearchUrl(searchInput));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, router, createSearchUrl]);

  const handleSortChange = (newSort: SortOption) => {
    router.push(createSortUrl(newSort));
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push(createSearchUrl(""));
  };

  const handleDeleteClick = (imageId: string, imageTitle: string | null) => {
    setImageToDelete({ id: imageId, title: imageTitle });
  };

  const handleEditClick = (item: ImageItem) => {
    setImageToEdit(item);
  };

  const handleSave = async (imageId: string, data: { title: string | null; eventIds: string[]; showOnLanding: boolean }) => {
    const response = await fetch(`/api/admin/media/${imageId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.message ?? "Không thể cập nhật ảnh.");
    }

    router.refresh();
  };

  const handleToggleSelect = (imageId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(items.map((item: ImageItem) => item.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteMultiple = () => {
    const ids = Array.from(selectedIds);
    setImagesToDeleteMultiple(ids);
  };

  const performDeleteMultiple = async () => {
    if (!imagesToDeleteMultiple || imagesToDeleteMultiple.length === 0) return;

    try {
      setIsDeletingMultiple(true);
      const deletePromises = imagesToDeleteMultiple.map((id) =>
        fetch(`/api/admin/media/${id}`, {
          method: "DELETE",
        })
      );

      const responses = await Promise.all(deletePromises);

      for (const response of responses) {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Không thể xóa một số ảnh.");
        }
      }

      setSelectedIds(new Set());
      setImagesToDeleteMultiple(null);
      router.refresh();
    } catch (error) {
      console.error("Delete multiple failed", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa ảnh.");
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  const handleOpenEventSelector = async () => {
    setShowEventSelector(true);
    if (events.length === 0) {
      setIsLoadingEvents(true);
      try {
        const response = await fetch("/api/admin/events");
        const data = await response.json();
        if (data.success) {
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoadingEvents(false);
      }
    }
  };

  const handleUpdateLandingBulk = async (showOnLanding: boolean) => {
    if (selectedIds.size === 0) return;

    try {
      setIsUpdatingLanding(true);
      const imageIds = Array.from(selectedIds);

      const updatePromises = imageIds.map((imageId) =>
        fetch(`/api/admin/media/${imageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showOnLanding,
          }),
        })
      );

      const responses = await Promise.all(updatePromises);

      for (const response of responses) {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Không thể cập nhật một số ảnh.");
        }
      }

      setShowLandingSelector(false);
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error("Update landing bulk failed", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật.");
    } finally {
      setIsUpdatingLanding(false);
    }
  };

  const handleUpdateEventsBulk = async () => {
    if (selectedIds.size === 0 || selectedEventIds.length === 0) return;

    try {
      setIsUpdatingEvents(true);
      const imageIds = Array.from(selectedIds);

      const updatePromises = imageIds.map((imageId) =>
        fetch(`/api/admin/media/${imageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventIds: selectedEventIds,
          }),
        })
      );

      const responses = await Promise.all(updatePromises);

      for (const response of responses) {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Không thể cập nhật một số ảnh.");
        }
      }

      setShowEventSelector(false);
      setSelectedEventIds([]);
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error("Bulk update events failed", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật sự kiện.");
    } finally {
      setIsUpdatingEvents(false);
    }
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

  // Check if search is active
  const hasActiveSearch = !!filters.search;

  // Toolbar component to reuse
  const renderToolbar = () => (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên ảnh..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {pagination.total} ảnh • Trang {pagination.page}/{pagination.totalPages || 1}
        </p>
        <Select value={sortBy} onValueChange={(value) => handleSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
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
    </div>
  );

  if (!items.length) {
    return (
      <div className="space-y-4">
        {renderToolbar()}
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {hasActiveSearch
              ? "Không tìm thấy ảnh nào phù hợp."
              : "Chưa có ảnh nào. Hãy tải ảnh lên để bắt đầu."}
          </p>
          {hasActiveSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(pathname)}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Search and Filter Toolbar */}
      {renderToolbar()}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((item: ImageItem) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <figure
              key={item.id}
              className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md ${isSelected
                ? "border-[#d9b588] ring-2 ring-[#d9b588]/30"
                : "border-border"
                }`}
            >
              {item.title && (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 dark:bg-muted/20">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => handleToggleSelect(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                  />
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                      >
                        Chỉnh sửa
                      </DropdownMenuItem>
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
                <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => handleToggleSelect(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background/80 backdrop-blur-sm"
                  />
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                      >
                        Chỉnh sửa
                      </DropdownMenuItem>
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
                onClick={() => {
                  const index = items.findIndex((img: ImageItem) => img.id === item.id);
                  setViewerIndex(index);
                }}
              >
                <Image
                  src={item.url}
                  alt={item.title || "Studio image"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  className="rounded-md object-cover transition-transform group-hover:opacity-80"
                  loading="lazy"
                />
              </div>
            </figure>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageUrl(pagination.page - 1))}
            disabled={!pagination.hasPrev}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Trang trước
          </Button>

          <div className="flex items-center gap-2">
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? "default" : "outline"}
                  size="sm"
                  className="w-9 h-9 p-0"
                  onClick={() => router.push(createPageUrl(pageNum))}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageUrl(pagination.page + 1))}
            disabled={!pagination.hasMore}
            className="gap-1"
          >
            Trang sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Image Viewer Overlay */}
      {viewerIndex !== null && (
        <ImageViewer
          images={items}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Edit Dialog */}
      <ImageEditDialog
        open={imageToEdit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setImageToEdit(null);
          }
        }}
        image={imageToEdit}
        onSave={handleSave}
      />

      {/* Action Bar - Hiển thị khi có items được chọn */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-fit px-4">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md whitespace-nowrap">
                {selectedIds.size} đã chọn
              </span>
              <Separator orientation="vertical" className="h-5!" />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-8 text-sm gap-1.5 px-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  Chọn tất cả
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="h-8 text-sm gap-1.5 px-2"
                >
                  <Square className="h-4 w-4" />
                  Bỏ chọn tất cả
                </Button>
              </div>
              {showEventSelector && (
                <>
                  <Separator orientation="vertical" className="h-5!" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-[180px]">
                      {isLoadingEvents ? (
                        <div className="text-xs text-muted-foreground px-2">Đang tải...</div>
                      ) : (
                        <MultiSelect
                          options={events.map((event) => ({
                            value: event.id,
                            label: event.title,
                          }))}
                          selected={selectedEventIds}
                          onSelectedChange={setSelectedEventIds}
                          placeholder="Chọn sự kiện..."
                          className="h-8"
                          position="top"
                        />
                      )}
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleUpdateEventsBulk}
                      className="h-8 text-sm gap-1.5 px-2"
                      disabled={isUpdatingEvents || selectedEventIds.length === 0}
                    >
                      {isUpdatingEvents ? "Đang cập nhật..." : "Xác nhận"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEventSelector(false);
                        setSelectedEventIds([]);
                      }}
                      className="h-8 text-sm px-2"
                    >
                      Hủy
                    </Button>
                  </div>
                </>
              )}
              {!showEventSelector && !showLandingSelector && (
                <>
                  <Separator orientation="vertical" className="h-5!" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenEventSelector}
                    className="h-8 text-sm gap-1.5 px-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Chọn sự kiện
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLandingSelector(true)}
                    className="h-8 text-sm gap-1.5 px-2"
                  >
                    <Eye className="h-4 w-4" />
                    Hiển thị trang chủ
                  </Button>
                </>
              )}
              {showLandingSelector && (
                <>
                  <Separator orientation="vertical" className="h-5!" />
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleUpdateLandingBulk(true)}
                      className="h-8 text-sm gap-1.5 px-2"
                      disabled={isUpdatingLanding}
                    >
                      <Eye className="h-4 w-4" />
                      {isUpdatingLanding ? "Đang cập nhật..." : "Hiển thị"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateLandingBulk(false)}
                      className="h-8 text-sm gap-1.5 px-2"
                      disabled={isUpdatingLanding}
                    >
                      <EyeOff className="h-4 w-4" />
                      {isUpdatingLanding ? "Đang cập nhật..." : "Ẩn"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLandingSelector(false)}
                      className="h-8 text-sm px-2"
                    >
                      Hủy
                    </Button>
                  </div>
                </>
              )}
            </div>
            <Separator orientation="vertical" className="h-5!" />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteMultiple}
              className="h-8 text-sm gap-1.5 px-2 dark:bg-red-500/80 dark:text-white dark:hover:bg-red-500 dark:border-red-500/50"
              disabled={isDeletingMultiple}
            >
              <Trash2 className="h-4 w-4" />
              {isDeletingMultiple ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </div>
      )}

      {/* Delete Single Confirm Dialog */}
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

      {/* Delete Multiple Confirm Dialog */}
      <DeleteConfirmDialog
        open={imagesToDeleteMultiple !== null}
        onOpenChange={(open) => {
          if (!open) {
            setImagesToDeleteMultiple(null);
          }
        }}
        onConfirm={performDeleteMultiple}
        title="Xác nhận xóa nhiều ảnh"
        description={
          imagesToDeleteMultiple
            ? `Bạn có chắc chắn muốn xóa ${imagesToDeleteMultiple.length} ảnh đã chọn? Hành động này không thể hoàn tác.`
            : ""
        }
        isLoading={isDeletingMultiple}
      />
    </div>
  );
}

