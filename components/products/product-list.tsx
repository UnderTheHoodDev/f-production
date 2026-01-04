'use client';

import { useState } from 'react';

import ProductFilterSection from '@/components/products/product-filter-section';
import ProductItem from '@/components/products/product-item';
import ProductView from '@/components/products/product-view';

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
      <span className="text-background-secondary xsm:text-3xl text-2xl font-bold lg:text-4xl">
        Sản phẩm
      </span>
      <div className="layout-padding flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-4 md:gap-8">
          <ProductFilterSection
            selectedFilter={selectedFilter}
            handleFilterType={handleFilterType}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2 md:gap-3 xl:grid-cols-3">
            {products.slice(0, numberProductPerPage).map((product, index) => (
              <ProductItem
                key={index}
                type={product.type as 'image' | 'video'}
                handleActiveProductView={() => handleActiveProductView(index)}
              />
            ))}
          </div>
        </div>
        {products.length > numberProductPerPage && (
          <div
            className="text-foreground bg-background-secondary hover:text-primary cursor-pointer rounded-4xl px-5 py-2 text-base font-medium transition-colors duration-300 sm:text-lg lg:text-xl"
            onClick={handleLoadMoreProduct}
          >
            Xem thêm
          </div>
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
