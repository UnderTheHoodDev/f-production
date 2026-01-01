"use client";

import { useState } from "react";

import ProductFilterSection from "@/components/products/product-filter-section";
import ProductItem from "@/components/products/product-item";
import ProductView from "@/components/products/product-view";

const ProductList = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("TẤT CẢ");
  const [activeProductView, setActiveProductView] = useState<boolean>(false);
  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);
  const [numberProductPerPage, setNumberProductPerPage] = useState<number>(6);

  const handleFilterType = (type: string) => {
    // TODO: Handle filter type
    setSelectedFilter(type);
  };

  // TODO: Replace with actual products ( Call API )
  const products = [
    { type: "video" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
  ];

  const handleActiveProductView = (index: number) => {
    setActiveProductIndex(index);
    setActiveProductView(true);
  };

  const handleLoadMoreProduct = () => {
    setNumberProductPerPage((prev) => prev + 6);
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-12">
      <span className="font-bold text-4xl text-background-secondary ">
        Sản phẩm
      </span>
      <div className="w-full flex flex-col gap-5 px-10 items-center">
        <div className="w-full flex flex-col items-center gap-8">
          <ProductFilterSection
            selectedFilter={selectedFilter}
            handleFilterType={handleFilterType}
          />
          <div className="grid grid-cols-3 gap-4">
            {products.slice(0, numberProductPerPage).map((product, index) => (
              <ProductItem
                key={index}
                type={product.type as "image" | "video"}
                handleActiveProductView={() => handleActiveProductView(index)}
              />
            ))}
          </div>
        </div>
        {products.length > numberProductPerPage && (
          <div
            className="rounded-4xl cursor-pointer text-foreground py-2 px-5 text-xl font-medium bg-background-secondary hover:text-primary transition-colors duration-300"
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
