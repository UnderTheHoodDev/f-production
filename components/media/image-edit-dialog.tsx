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
import { Checkbox } from "@/components/ui/checkbox";

type Event = {
  id: string;
  title: string;
};

type ImageItem = {
  id: string;
  title: string | null;
  showOnLanding?: boolean;
  events?: Event[];
};

type ImageEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: ImageItem | null;
  onSave: (imageId: string, data: { title: string | null; eventIds: string[]; showOnLanding: boolean }) => Promise<void>;
};

export function ImageEditDialog({
  open,
  onOpenChange,
  image,
  onSave,
}: ImageEditDialogProps) {
  const [title, setTitle] = useState("");
  const [showOnLanding, setShowOnLanding] = useState(false);
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

  // Initialize form when image changes
  useEffect(() => {
    if (image) {
      setTitle(image.title || "");
      setShowOnLanding(image.showOnLanding || false);
      setSelectedEventIds(image.events?.map((e) => e.id) || []);
    }
  }, [image]);

  const handleSave = async () => {
    if (!image) return;

    try {
      setIsLoading(true);
      await onSave(image.id, {
        title: title.trim() || null,
        eventIds: selectedEventIds,
        showOnLanding,
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
          <DialogTitle>Chỉnh sửa ảnh</DialogTitle>
          <DialogDescription>
            Cập nhật tên ảnh và chọn các sự kiện mà ảnh thuộc về.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Tên ảnh</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên ảnh..."
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showOnLanding"
              checked={showOnLanding}
              onCheckedChange={(checked) => setShowOnLanding(checked as boolean)}
            />
            <Label
              htmlFor="showOnLanding"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Hiển thị trên trang chủ
            </Label>
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

