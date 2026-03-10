'use client';
import { motion } from 'motion/react';
import Link from 'next/link';

import { useIsMobile } from '@/hooks/use-mobile';
import { getPublicUrl } from '@/lib/s3';

const HeroSection = () => {
  const isMobile = useIsMobile();
  const videoSrc = isMobile
    ? getPublicUrl('videos/header_mobile.mp4')
    : getPublicUrl('videos/header.mp4');

  return (
    <>
      <div className="relative mt-16 h-140 w-full sm:mt-0 sm:h-150 md:h-160 lg:min-h-screen">
        <video
          muted
          autoPlay
          loop
          playsInline
          key={videoSrc}
          className="absolute h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="layout-padding xsm:bottom-15 absolute z-0 flex w-full -translate-y-1/4 flex-col gap-6 sm:bottom-1/10 md:top-1/5 md:bottom-1/5 md:translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex w-full justify-center gap-4 md:justify-start"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            >
              <Link
                href="#dich-vu"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('dich-vu')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-foreground border-foreground hover:text-background hover:bg-foreground focus-visible:ring-foreground/40 cursor-pointer rounded-4xl border-2 px-3 py-2 text-base/8 font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none md:px-5 md:text-lg"
              >
                Dịch vụ & Sản phẩm
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            >
              <Link
                href="/lien-he"
                className="border-primary bg-primary text-background hover:bg-primary/90 focus-visible:ring-primary/40 rounded-4xl border-2 px-3 py-2 text-base/8 font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none md:px-5 md:text-lg"
              >
                Đặt lịch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
