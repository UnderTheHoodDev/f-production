"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

const OurPartners = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      speed: 1,
      startDelay: 0,
      stopOnInteraction: false,
    }),
  ]);

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-12 bg-background-secondary">
      <span className="font-bold text-4xl text-foreground">
        Các đối tác của chúng tôi
      </span>
      <div className="px-10 py-10 w-full">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex-[0_0_25%] flex items-center justify-center"
              >
                <Image
                  width={150}
                  height={150}
                  unoptimized
                  src="/partners/samsung.png"
                  alt={`Partner ${n}`}
                  className="object-contain max-w-60 h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPartners;
