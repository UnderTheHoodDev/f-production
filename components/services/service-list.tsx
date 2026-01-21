'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

import { services } from '@/lib/services-data';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const ServiceList = () => {
  return (
    <div className="layout-padding flex flex-col items-center justify-center gap-3 py-6 md:gap-4 md:py-8 2xl:gap-8 2xl:py-12">
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-background-secondary text-2xl font-bold sm:text-3xl lg:text-4xl"
      >
        Dịch vụ
      </motion.span>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 lg:grid-cols-4 xl:gap-6 xl:max-w-[1280px]"
      >
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link key={service.slug} href={`/dich-vu/${service.slug}`}>
              <motion.div
                variants={cardVariants as any}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
                className="group bg-background-secondary flex h-full min-h-64 cursor-pointer flex-col items-center gap-3 rounded-2xl px-4 py-6 md:px-6 md:py-8"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="bg-foreground group-hover:bg-primary flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20"
                >
                  <Icon className="text-background size-7 sm:size-8 md:size-9 lg:size-10" />
                </motion.div>
                <span className="text-foreground group-hover:text-primary text-center text-lg font-bold transition-colors duration-300 md:text-[19px] lg:text-2xl">
                  {service.label}
                </span>
                <p className="text-foreground text-center text-sm md:text-[15px] lg:mt-2 lg:text-base">
                  {service.description}
                </p>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ServiceList;

