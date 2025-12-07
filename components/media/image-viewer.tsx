"use client";

import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageItem = {
  id: string;
  title: string | null;
  format: string | null;
  url: string | null;
  publicId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ImageViewerProps = {
  images: ImageItem[];
  initialIndex: number;
  onClose: () => void;
};

export function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);

  const currentImage = images[currentIndex];

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setIsLoading(true);
      setImageKey((prev) => prev + 1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsLoading(true);
      setImageKey((prev) => prev + 1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setIsLoading(true);
        setImageKey((prev) => prev + 1);
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setIsLoading(true);
        setImageKey((prev) => prev + 1);
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onClose]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

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
      {currentIndex < images.length - 1 && (
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

      {/* Image Container */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          </div>
        )}
        
        <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
          <CldImage
            key={imageKey}
            width={1200}
            height={900}
            src={currentImage.publicId || (currentImage.url as string)}
            alt={currentImage.title || "Studio image"}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onLoad={handleImageLoad}
            onLoadingComplete={handleImageLoad}
          />
        
          {/* Image Title */}
          {currentImage.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 rounded-b-lg">
              <p className="text-sm font-medium">
                {currentImage.title}
                {currentImage.format && `.${currentImage.format}`}
              </p>
            </div>
          )}
        </div>

        {/* Image Counter */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

