'use client';

import { Music2 } from 'lucide-react';
import { motion } from 'motion/react';

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
  const services = [
    {
      name: 'Sản xuất TVC Quảng cáo',
      description:
        'Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc',
    },
    {
      name: 'Sản xuất TVC Quảng cáo',
      description:
        'Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc',
    },
    {
      name: 'Sản xuất TVC Quảng cáo',
      description:
        'Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc',
    },
    {
      name: 'Sản xuất TVC Quảng cáo',
      description:
        'Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc',
    },
    {
      name: 'Sản xuất TVC Quảng cáo',
      description:
        'Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc',
    },
    {
      name: 'Sản xuất TVC Quảng cáo',
      description:
        'Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc',
    },
  ];

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
        variants={staggerContainer}
        className="flex flex-wrap justify-center gap-2 md:gap-4 xl:max-w-300 xl:gap-6"
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={cardVariants as any}
            whileHover={{
              y: -8,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            className="group bg-background-secondary flex min-h-64 max-w-80 cursor-pointer flex-col items-center gap-3 rounded-2xl px-4 py-6 sm:h-60 sm:w-[calc(50%-4px)] md:h-72 md:px-4 lg:h-80 lg:max-w-90"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="bg-foreground group-hover:bg-primary flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20"
            >
              <Music2 className="text-background size-7 sm:size-8 md:size-9 lg:size-10" />
            </motion.div>
            <span className="text-foreground group-hover:text-primary text-center text-lg font-bold transition-colors duration-300 md:text-[19px] lg:text-2xl">
              {service.name}
            </span>
            <p className="text-foreground text-center text-sm md:text-[15px] lg:mt-2 lg:text-base">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ServiceList;
