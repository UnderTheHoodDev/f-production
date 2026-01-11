import clsx from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';

interface FilterSectionProps {
  handleFilterType: (type: string) => void;
  selectedFilter: string;
}

const ProductFilterSection = ({
  handleFilterType,
  selectedFilter,
}: FilterSectionProps) => {
  const filterTypes = [
    'TVC',
    'GIỚI THIỆU',
    'ẢNH EVENT',
    'PHIM NGẮN',
    'MV CA NHẠC',
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(
    filterTypes.findIndex((t) => t === selectedFilter)
  );
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
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
    setHeight(elRect.height);
    setPositionX(elRect.left - parentRect.left);
    setPositionY(elRect.top - parentRect.top);
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-8"
    >
      <div
        className="bg-background-secondary absolute top-0 left-0 rounded-4xl transition-all duration-300 ease-out"
        style={{
          width,
          height,
          transform: `translate(${positionX}px, ${positionY}px)`,
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
            'relative z-10 cursor-pointer rounded-4xl px-4 py-2 font-medium transition-colors duration-300 sm:text-base md:px-5 md:py-3 lg:text-lg',
            activeIndex === index ? 'text-foreground' : 'text-[#1B1B1B]'
          )}
        >
          {type}
        </div>
      ))}
    </div>
  );
};

export default ProductFilterSection;
