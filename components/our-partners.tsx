'use client';

import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

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
  const trackRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  // Nội dung vừa khung -> canh giữa, không chạy. Ngược lại -> chạy vô tận.
  const [fits, setFits] = useState(true);
  // Số lần lặp lại danh sách logo để Embla đủ điều kiện loop (xem measure()).
  const [copies, setCopies] = useState(1);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [
      AutoScroll({
        speed: 1,
        startDelay: 0,
        stopOnInteraction: false,
      }),
    ]
  );

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

  /**
   * Embla tự tắt `loop` nếu tổng bề ngang các slide trừ đi slide rộng nhất vẫn
   * chưa phủ hết khung nhìn - lúc đó auto-scroll chạy tới logo cuối rồi đứng im.
   * Đo bằng kích thước thật (không đoán theo số logo) rồi nhân bản danh sách
   * cho tới khi dư điều kiện đó.
   */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (!track || !viewport || partners.length === 0) return;

    const firstCopy = Array.from(track.children).slice(
      0,
      partners.length
    ) as HTMLElement[];
    const widths = firstCopy.map(
      (slide) => slide.getBoundingClientRect().width
    );
    const oneCopy = widths.reduce((total, width) => total + width, 0);
    const viewSize = viewport.getBoundingClientRect().width;
    if (!oneCopy || !viewSize) return;

    const overflows = oneCopy > viewSize;
    setFits(!overflows);
    setCopies(
      overflows ? Math.ceil((viewSize + Math.max(...widths)) / oneCopy) + 1 : 1
    );
  }, [partners.length]);

  // Ảnh logo không có kích thước cố định nên phải đo lại khi ảnh tải xong,
  // nếu không Embla đo nhầm lúc slide còn rỗng và tắt loop vĩnh viễn.
  const handleLogoLoad = useCallback(() => {
    measure();
    emblaApi?.reInit();
  }, [measure, emblaApi]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    const autoScroll = emblaApi.plugins().autoScroll;
    if (!autoScroll) return;
    if (fits) autoScroll.stop();
    else autoScroll.play();
  }, [emblaApi, fits, copies, partners.length]);

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
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div
            ref={trackRef}
            className={cn('flex items-center', fits && 'justify-center')}
          >
            {Array.from({ length: copies }).flatMap((_, copy) =>
              partners.map((partner) => (
                <div
                  key={`${partner.id}-${copy}`}
                  aria-hidden={copy > 0}
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
                        onLoad={handleLogoLoad}
                        className="h-20 w-auto object-contain transition-all duration-300 sm:h-24 lg:h-28"
                      />
                    ) : (
                      <div className="bg-muted flex h-12 items-center justify-center rounded-lg px-4 sm:h-14 lg:h-16">
                        <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                          {partner.name}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OurPartners;
