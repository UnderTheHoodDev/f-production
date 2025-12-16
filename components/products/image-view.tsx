"use client";

import { CldImage } from "next-cloudinary";
import { useState } from "react";

type Props = {
  src: string;
  title?: string | null;
  format?: string | null;
};

export function ImageView({ src, title, format }: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      )}

      <CldImage
        width={1200}
        height={900}
        src={src}
        alt={title || "Product image"}
        className={`max-h-[90vh] max-w-[90vw] object-contain rounded-lg transition-opacity ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
        onLoadingComplete={() => setLoading(false)}
      />

      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 rounded-b-lg">
          <p className="text-sm font-medium">
            {title}
            {format && `.${format}`}
          </p>
        </div>
      )}
    </>
  );
}
