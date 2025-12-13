import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";

interface FilterSectionProps {
  handleFilterType: (type: string) => void;
  selectedFilter: string;
}

const ProductFilterSection = ({
  handleFilterType,
  selectedFilter,
}: FilterSectionProps) => {
  const filterTypes = [
    "TẤT CẢ",
    "TVC",
    "GIỚI THIỆU",
    "ẢNH EVENT",
    "PHIM NGẮN",
    "MV CA NHẠC",
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(
    filterTypes.findIndex((t) => t === selectedFilter)
  );
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveIndex(filterTypes.findIndex((t) => t === selectedFilter));
    }, 500);
  };

  const handleMouseEnter = (index: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveIndex(index);
  };

  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    const parent = containerRef.current;

    if (!el || !parent) return;

    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    setWidth(elRect.width);
    setPosition(elRect.left - parentRect.left);
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="relative flex gap-8">
      <div
        className="absolute top-0 left-0 h-full rounded-4xl bg-background-secondary transition-all duration-300 ease-out"
        style={{
          width,
          transform: `translateX(${position}px)`,
        }}
      />
      {filterTypes.map((type, index) => (
        <div
          key={type}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          onClick={() => handleFilterType(type)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          className={clsx(
            "relative z-10 cursor-pointer rounded-4xl px-5 py-3 font-medium text-[18px] transition-colors duration-300",
            activeIndex === index ? "text-foreground" : "text-[#1B1B1B]"
          )}
        >
          {type}
        </div>
      ))}
    </div>
  );
};

export default ProductFilterSection;
