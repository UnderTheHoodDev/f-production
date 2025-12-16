"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Play, CheckSquare, Square, Trash2, Calendar } from "lucide-react";
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
import { VideoViewer } from "@/components/media/video-viewer";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { VideoEditDialog } from "@/components/media/video-edit-dialog";
import { MultiSelect } from "@/components/ui/multi-select";

type Event = {
  id: string;
  title: string;
};

type VideoItem = {
  id: string;
  title: string | null;
  youtubeUrl: string | null;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
  events?: Event[];
};

type VideosGalleryProps = {
  items: VideoItem[];
};

type SortOption = "createdAt-desc" | "createdAt-asc" | "updatedAt-desc" | "updatedAt-asc";

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string | null): string | null {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string | null): string | null {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function VideosGallery({ items }: VideosGalleryProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<{
    id: string;
    title: string | null;
  } | null>(null);
  const [videoToEdit, setVideoToEdit] = useState<VideoItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [videosToDeleteMultiple, setVideosToDeleteMultiple] = useState<string[] | null>(null);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isUpdatingEvents, setIsUpdatingEvents] = useState(false);

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

  const handleDeleteClick = (videoId: string, videoTitle: string | null) => {
    setVideoToDelete({ id: videoId, title: videoTitle });
  };

  const handleEditClick = (item: VideoItem) => {
    setVideoToEdit(item);
  };

  const handleSave = async (videoId: string, data: { title: string | null; eventIds: string[] }) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Không thể cập nhật video.");
      }

      router.refresh();
    } catch (error) {
      console.error("Save failed", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSelect = (videoId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(sortedItems.map((item) => item.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteMultiple = () => {
    const ids = Array.from(selectedIds);
    setVideosToDeleteMultiple(ids);
  };

  const performDeleteMultiple = async () => {
    if (!videosToDeleteMultiple || videosToDeleteMultiple.length === 0) return;

    try {
      setIsDeletingMultiple(true);
      const deletePromises = videosToDeleteMultiple.map((id) =>
        fetch(`/api/admin/videos/${id}`, {
          method: "DELETE",
        })
      );

      const responses = await Promise.all(deletePromises);
      
      for (const response of responses) {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Không thể xóa một số video.");
        }
      }

      setSelectedIds(new Set());
      setVideosToDeleteMultiple(null);
      router.refresh();
    } catch (error) {
      console.error("Delete multiple failed", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa video.");
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

  const handleUpdateEventsBulk = async () => {
    if (selectedIds.size === 0 || selectedEventIds.length === 0) return;

    try {
      setIsUpdatingEvents(true);
      const videoIds = Array.from(selectedIds);
      
      const updatePromises = videoIds.map((videoId) =>
        fetch(`/api/admin/videos/${videoId}`, {
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
          throw new Error(payload?.message ?? "Không thể cập nhật một số video.");
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
    if (!videoToDelete) return;

    try {
      setDeletingId(videoToDelete.id);
      const response = await fetch(`/api/admin/videos/${videoToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Không thể xóa video.");
      }

      setVideoToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Delete failed", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa video.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Chưa có video nào. Hãy thêm video YouTube để bắt đầu.
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tổng số: {items.length} video
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
        {sortedItems.map((item) => {
          const videoId = getYouTubeVideoId(item.youtubeUrl);
          const thumbnailUrl = item.thumbnail || getYouTubeThumbnail(videoId);
          const isSelected = selectedIds.has(item.id);

          return (
            <figure
              key={item.id}
              className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md ${
                isSelected 
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
                  const index = sortedItems.findIndex((vid) => vid.id === item.id);
                  setViewerIndex(index);
                }}
              >
                {thumbnailUrl ? (
                  <div className="relative h-full w-full rounded-md overflow-hidden">
                    <img
                      src={thumbnailUrl}
                      alt={item.title || "Video thumbnail"}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="rounded-full bg-white/90 p-3 shadow-lg">
                        <Play className="h-6 w-6 text-black fill-black ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full rounded-md bg-muted flex items-center justify-center">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </figure>
          );
        })}
      </div>

      {/* Video Viewer Overlay */}
      {viewerIndex !== null && (
        <VideoViewer
          videos={sortedItems}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Edit Dialog */}
      <VideoEditDialog
        open={videoToEdit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setVideoToEdit(null);
          }
        }}
        video={videoToEdit}
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
              {!showEventSelector && (
                <>
                  <Separator orientation="vertical" className="h-5!" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenEventSelector}
                    className="h-8 text-sm gap-1.5 px-2"
                    disabled={isLoadingEvents}
                  >
                    <Calendar className="h-4 w-4" />
                    Chọn sự kiện
                  </Button>
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
        open={videoToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setVideoToDelete(null);
          }
        }}
        onConfirm={performDelete}
        title="Xác nhận xóa video"
        description={
          videoToDelete?.title
            ? `Bạn có chắc chắn muốn xóa video "${videoToDelete.title}"? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác."
        }
        isLoading={deletingId !== null}
      />

      {/* Delete Multiple Confirm Dialog */}
      <DeleteConfirmDialog
        open={videosToDeleteMultiple !== null}
        onOpenChange={(open) => {
          if (!open) {
            setVideosToDeleteMultiple(null);
          }
        }}
        onConfirm={performDeleteMultiple}
        title="Xác nhận xóa nhiều video"
        description={
          videosToDeleteMultiple
            ? `Bạn có chắc chắn muốn xóa ${videosToDeleteMultiple.length} video đã chọn? Hành động này không thể hoàn tác.`
            : ""
        }
        isLoading={isDeletingMultiple}
      />
    </div>
  );
}

