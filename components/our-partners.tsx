'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { motion } from 'motion/react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

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
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-foreground xsm:text-3xl text-center text-2xl font-bold lg:text-4xl"
      >
        Các đối tác của chúng tôi
      </motion.span>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="w-full py-10"
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex-[0_0_50%] items-center justify-center md:flex-[0_0_33.3333%] lg:flex-[0_0_25%]"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Image
                    width={150}
                    height={150}
                    unoptimized
                    src="/partners/samsung.png"
                    alt={`Partner ${n}`}
                    className="h-auto w-32 object-contain sm:w-36 lg:w-40"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OurPartners;
