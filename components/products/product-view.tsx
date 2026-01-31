"use client";

import { useState } from "react";

import { ImageView } from "@/components/products/image-view";
import ProductViewNavigation from "@/components/products/product-view-navigation";
import { VideoView } from "@/components/products/video-view";
import { useProductViewHandler } from "@/hooks/use-product-view-handler";

type ProductItem = {
  id: string;
  title: string | null;
  type: "image" | "video";
  // For images
  format?: string | null;
  url?: string | null;
  publicId?: string | null;
  // For videos
  youtubeUrl?: string | null;
  thumbnail?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProductViewProps = {
  products: ProductItem[];
  initialIndex: number;
  setActiveProductView: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ProductView({
  products,
  initialIndex,
  setActiveProductView,
}: ProductViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const product = products[currentIndex];

  const handleNext = () => setCurrentIndex((i) => i + 1);
  const handlePrev = () => setCurrentIndex((i) => i - 1);
  const handleClose = () => setActiveProductView(false);

  useProductViewHandler({
    currentIndex,
    total: products.length,
    onNext: handleNext,
    onPrev: handlePrev,
    onClose: handleClose,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleClose}
    >
      <ProductViewNavigation
        canPrev={currentIndex > 0}
        canNext={currentIndex < products.length - 1}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
      />

      <div
        className={`relative ${product.type === "video"
            ? "max-w-[90vw] max-h-[90vh] w-full aspect-video"
            : "max-h-[90vh] max-w-[90vw]"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {product.type === "image" ? (
          <ImageView
            src={product.publicId || product.url!}
            title={product.title}
            format={product.format}
          />
        ) : (
          <VideoView youtubeUrl={product.youtubeUrl} title={product.title} />
        )}

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {currentIndex + 1} / {products.length}
        </div>
      </div>
    </div>
  );
}

export default ProductView;
