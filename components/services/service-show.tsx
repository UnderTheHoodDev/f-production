'use client';

import ProductItem from '@/components/products/product-item';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

const ServiceShow = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineHeights, setLineHeights] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const services = [
    {
      name: 'Sản xuất TVC Quảng cáo',
      products: [
        { type: 'video' },
        { type: 'image' },
        { type: 'image' },
        { type: 'image' },
        { type: 'image' },
        { type: 'image' },
      ],
    },
    {
      name: 'Quảng cáo',
      products: [
        { type: 'video' },
        { type: 'image' },
        { type: 'image' },
        { type: 'image' },
        { type: 'image' },
        { type: 'image' },
      ],
    },
  ];

  const calculateLineHeights = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportTrigger = window.innerHeight * 0.6;

    const containerTop = containerRect.top;
    const initialOffset = Math.max(0, containerTop - viewportTrigger);

    const newHeights: number[] = [];
    let newActiveIndex = 0;

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) {
        newHeights.push(0);
        return;
      }

      const rect = ref.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height + 16;

      const scrolledPast = viewportTrigger - sectionTop - initialOffset;

      if (scrolledPast > 0) {
        const fillHeight = Math.min(scrolledPast, sectionHeight);
        newHeights.push(Math.max(0, fillHeight));

        if (scrolledPast >= 32) {
          newActiveIndex = index;
        }
      } else {
        newHeights.push(0);
      }
    });

    setLineHeights(newHeights);
    setActiveIndex(newActiveIndex);
  }, []);

  useEffect(() => {
    requestAnimationFrame(calculateLineHeights);

    const handleScroll = () => {
      requestAnimationFrame(calculateLineHeights);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [calculateLineHeights]);

  return (
    <div
      ref={containerRef}
      className="layout-padding mb-3 flex flex-col gap-4 py-6 md:py-10 lg:mb-4"
    >
      {services.map((service, index) => {
        const isActive = activeIndex === index;
        const lineHeight = lineHeights[index] || 0;

        return (
          <div
            key={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className={cn(
              'relative flex flex-1 justify-center gap-2 transition-all duration-300 sm:gap-4'
            )}
          >
            <div
              className={cn(
                'relative flex min-w-12 flex-col items-center md:min-w-16'
              )}
            >
              {/* Background line (gray) */}
              <div
                className={cn(
                  'absolute left-1/2 h-[calc(100%+16px)] w-[1.5px] -translate-x-1/2 bg-[#DADADA] lg:w-0.5'
                )}
              />
              {/* Active line (primary) - fills gradually based on scroll */}
              <div
                className="bg-primary absolute left-1/2 w-[1.5px] -translate-x-1/2"
                style={{ height: `${lineHeight}px` }}
              />

              <div
                className={cn(
                  'z-10 flex items-center justify-center rounded-full border-2 bg-white transition-all duration-300',
                  isActive
                    ? 'border-primary size-12 sm:size-14 lg:size-16'
                    : 'size-10 border-[#DADADA] sm:size-12 lg:size-14'
                )}
              >
                <div
                  className={cn(
                    'rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-primary size-8 sm:size-10 lg:size-12'
                      : 'size-6 bg-[#DADADA] sm:size-8 lg:size-10'
                  )}
                />
              </div>
            </div>

            <div
              className={cn(
                'mt-2.5 flex flex-col gap-3 md:gap-4 lg:mt-3.25 lg:gap-5'
              )}
            >
              <span
                className={cn(
                  '-translate-y-px font-medium transition-all duration-300',
                  isActive
                    ? 'text-primary xsm:text-xl text-lg sm:text-2xl lg:text-3xl'
                    : 'xsm:text-lg text-base text-[#AFAFAF] sm:text-xl lg:text-2xl'
                )}
              >
                {service.name}
              </span>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-3">
                {service.products.map((product, productIndex) => (
                  <ProductItem
                    key={productIndex}
                    type={product.type as 'image' | 'video'}
                    handleActiveProductView={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceShow;
