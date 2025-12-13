"use client";

import { useState } from "react";

import ProductFilterSection from "@/components/products/product-filter-section";

const ProductList = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("TẤT CẢ");

  const handleFilterType = (type: string) => {
    // TODO: Handle filter type
    setSelectedFilter(type);
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-12">
      <span className="font-bold text-4xl text-background-secondary ">
        Sản phẩm của F Production
      </span>
      <div className="flex flex-col gap-5">
        <div className="flex gap-8">
          <ProductFilterSection
            selectedFilter={selectedFilter}
            handleFilterType={handleFilterType}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
