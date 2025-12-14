import { useEffect } from "react";

type Params = {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
};

export function useProductViewHandler({
  currentIndex,
  total,
  onNext,
  onPrev,
  onClose,
}: Params) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && currentIndex < total - 1) onNext();
      if (e.key === "ArrowLeft" && currentIndex > 0) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, total, onNext, onPrev, onClose]);
}
