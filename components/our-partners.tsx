'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

const OurPartners = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      speed: 1,
      startDelay: 0,
      stopOnInteraction: false,
    }),
  ]);

  return (
    <div className="layout-padding bg-background-secondary flex flex-col items-center justify-center gap-4 py-6 sm:py-8 lg:gap-8 lg:py-12">
      <span className="text-foreground xsm:text-3xl text-center text-2xl font-bold lg:text-4xl">
        Các đối tác của chúng tôi
      </span>
      <div className="w-full py-10">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex-[0_0_50%] items-center justify-center md:flex-[0_0_33.3333%] lg:flex-[0_0_25%]"
              >
                <Image
                  width={150}
                  height={150}
                  unoptimized
                  src="/partners/samsung.png"
                  alt={`Partner ${n}`}
                  className="h-auto w-32 object-contain sm:w-36 lg:w-40"
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
