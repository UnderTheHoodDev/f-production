"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getYouTubeVideoId } from "@/utils/youtube";

type VideoItem = {
  id: string;
  title: string | null;
  youtubeUrl: string | null;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type VideoViewerProps = {
  videos: VideoItem[];
  initialIndex: number;
  onClose: () => void;
};

export function VideoViewer({
  videos,
  initialIndex,
  onClose,
}: VideoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentVideo = videos[currentIndex];
  const videoId = getYouTubeVideoId(currentVideo.youtubeUrl);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, videos.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button - Top Right */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 h-10 w-10"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Prev Button - Left Side */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {/* Next Button - Right Side */}
      {currentIndex < videos.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Video Container */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] w-full aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        {videoId ? (
          <div className="relative w-full h-full">
            <iframe
              key={videoId}
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={currentVideo.title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-black/50 rounded-lg text-white">
            <p className="text-sm">URL YouTube không hợp lệ</p>
          </div>
        )}

        {/* Video Counter */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {currentIndex + 1} / {videos.length}
        </div>
      </div>
    </div>
  );
}
