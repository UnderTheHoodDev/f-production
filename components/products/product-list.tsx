'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import ProductFilterSection from '@/components/products/product-filter-section';
import ProductItem from '@/components/products/product-item';
import ProductView from '@/components/products/product-view';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const ProductList = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('TVC');
  const [activeProductView, setActiveProductView] = useState<boolean>(false);
  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);
  const [numberProductPerPage, setNumberProductPerPage] = useState<number>(6);

  const handleFilterType = (type: string) => {
    // TODO: Handle filter type
    setSelectedFilter(type);
  };

  // TODO: Replace with actual products ( Call API )
  const products = [
    { type: 'video' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
  ];

  const handleActiveProductView = (index: number) => {
    setActiveProductIndex(index);
    setActiveProductView(true);
  };

  const handleLoadMoreProduct = () => {
    setNumberProductPerPage((prev) => prev + 6);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 md:gap-4 md:py-8 2xl:gap-8 2xl:py-12">
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-background-secondary xsm:text-3xl text-2xl font-bold lg:text-4xl"
      >
        Sản phẩm
      </motion.span>
      <div className="layout-padding flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-4 md:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <ProductFilterSection
              selectedFilter={selectedFilter}
              handleFilterType={handleFilterType}
            />
          </motion.div>
          <motion.div
            key={selectedFilter}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2 md:gap-3 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {products.slice(0, numberProductPerPage).map((product, index) => (
                <motion.div
                  key={`${selectedFilter}-${index}`}
                  variants={itemVariants as any}
                  layout
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25, ease: 'easeOut' },
                  }}
                >
                  <ProductItem
                    type={product.type as 'image' | 'video'}
                    handleActiveProductView={() =>
                      handleActiveProductView(index)
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        {products.length > numberProductPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-foreground bg-background-secondary hover:text-primary cursor-pointer rounded-4xl px-5 py-2 text-base font-medium transition-colors duration-300 sm:text-lg lg:text-xl"
            onClick={handleLoadMoreProduct}
          >
            Xem thêm
          </motion.div>
        )}
      </div>
      {activeProductView && (
        <ProductView
          products={products as any}
          initialIndex={activeProductIndex}
          setActiveProductView={setActiveProductView}
        />
      )}
    </div>
  );
};

export default ProductList;
