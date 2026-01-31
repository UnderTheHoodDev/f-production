"use client";

import { useState } from "react";

type Props = {
  src: string;
  title?: string | null;
  format?: string | null;
};

export function ImageView({ src, title, format }: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative">
      {/* Loading Spinner - centered, visible only when loading */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={title || "Studio image"}
        className={`max-h-[90vh] max-w-[90vw] object-contain rounded-lg transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"
          }`}
        onLoad={() => setLoading(false)}
      />

      {/* Title - only visible when loaded */}
      {!loading && title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 rounded-b-lg">
          <p className="text-sm font-medium">
            {title}
            {format && `.${format}`}
          </p>
        </div>
      )}
    </div>
  );
}
