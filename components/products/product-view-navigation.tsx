"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

const ProductViewNavigation = ({
  canPrev,
  canNext,
  onPrev,
  onNext,
  onClose,
}: Props) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 h-10 w-10"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {canPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white hover:bg-white/20"
          onClick={onPrev}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {canNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white hover:bg-white/20"
          onClick={onNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}
    </>
  );
};

export default ProductViewNavigation;
