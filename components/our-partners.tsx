'use client';

import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

type Partner = {
  id: string;
  name: string;
  logoUrl?: string;
};

const OurPartners = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      speed: 1,
      startDelay: 0,
      stopOnInteraction: false,
    }),
  ]);

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        const data = await response.json();
        if (data.success) {
          setPartners(data.partners);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartners();
  }, []);

  // Check if logos overflow the container width
  useEffect(() => {
    if (!containerRef.current) return;

    const checkOverflow = () => {
      const container = containerRef.current;
      if (!container) return;
      // Each logo slot is roughly 220px. If total > container width, we need scrolling.
      const totalWidth = partners.length * 220;
      const containerWidth = container.offsetWidth;
      setNeedsScroll(totalWidth > containerWidth);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [partners.length]);

  if (partners.length === 0) return null;

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
        Đối tác
      </motion.span>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="w-full py-6"
        ref={containerRef}
      >
        {needsScroll ? (
          /* Scrolling carousel for many logos */
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex items-center">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-[0_0_auto] px-6 sm:px-8 lg:px-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        title={partner.name}
                        className="h-20 w-auto object-contain transition-all duration-300 sm:h-24 lg:h-28"
                      />
                    ) : (
                      <div className="flex h-12 items-center justify-center rounded-lg bg-muted px-4 sm:h-14 lg:h-16">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          {partner.name}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Centered layout for few logos */
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    title={partner.name}
                    className="h-16 w-auto object-contain transition-all duration-300 sm:h-20 lg:h-24"
                  />
                ) : (
                  <div className="flex h-12 items-center justify-center rounded-lg bg-muted px-4 sm:h-14 lg:h-16">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {partner.name}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OurPartners;
