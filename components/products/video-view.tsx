"use client";

import { getYouTubeVideoId } from "@/utils/youtube";

type Props = {
  youtubeUrl?: string | null;
  title?: string | null;
};

export function VideoView({ youtubeUrl, title }: Props) {
  const videoId = getYouTubeVideoId(youtubeUrl || null) || "LIKOvbJ-DZg";

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-full bg-black/50 rounded-lg text-white">
        <p className="text-sm">URL YouTube không hợp lệ</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        className="absolute inset-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {title && (
        <div className="absolute -bottom-8 left-0 right-0 text-white/90 text-center">
          <p className="text-sm font-medium">{title}</p>
        </div>
      )}
    </div>
  );
}
