"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

type Event = {
  id: string;
  title: string;
};

type VideoItem = {
  id: string;
  title: string | null;
  events?: Event[];
};

type VideoEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: VideoItem | null;
  onSave: (videoId: string, data: { title: string | null; eventIds: string[] }) => Promise<void>;
};

export function VideoEditDialog({
  open,
  onOpenChange,
  video,
  onSave,
}: VideoEditDialogProps) {
  const [title, setTitle] = useState("");
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  // Load events when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoadingEvents(true);
      fetch("/api/admin/events")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEvents(data.events || []);
          }
        })
        .catch((error) => {
          console.error("Failed to load events", error);
        })
        .finally(() => {
          setIsLoadingEvents(false);
        });
    }
  }, [open]);

  // Initialize form when video changes
  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setSelectedEventIds(video.events?.map((e) => e.id) || []);
    }
  }, [video]);

  const handleSave = async () => {
    if (!video) return;

    try {
      setIsLoading(true);
      await onSave(video.id, {
        title: title.trim() || null,
        eventIds: selectedEventIds,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu.");
    } finally {
      setIsLoading(false);
    }
  };

  const eventOptions = events.map((event) => ({
    value: event.id,
    label: event.title,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa video</DialogTitle>
          <DialogDescription>
            Cập nhật tên video và chọn các sự kiện mà video thuộc về.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Tên video</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên video..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="events">Sự kiện</Label>
            {isLoadingEvents ? (
              <div className="text-sm text-muted-foreground">Đang tải...</div>
            ) : (
              <MultiSelect
                options={eventOptions}
                selected={selectedEventIds}
                onSelectedChange={setSelectedEventIds}
                placeholder="Chọn sự kiện..."
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

