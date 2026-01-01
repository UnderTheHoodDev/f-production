"use client";

import ProductItem from "@/components/products/product-item";

const ServiceShow = () => {
  const products = [
    { type: "video" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
    { type: "image" },
  ];

  return (
    <div className="p-10 flex flex-col gap-6">
      {/* ===== ROW 1 ===== */}
      <div className="flex gap-6 relative">
        {/* LEFT TIMELINE */}
        <div className="relative flex flex-col items-center">
          {/* line xuống dưới */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1.5px] h-[calc(100%-38px)] bg-[#DADADA]  translate-y-[-10px]" />

          {/* dot */}
          <div className="flex items-center justify-center rounded-full border-2 border-primary h-16 w-16 bg-white z-10 translate-y-[-10px]">
            <div className="bg-primary h-12 w-12 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col gap-6">
          <span className="font-medium text-primary text-4xl translate-y-[-3px]">
            Lorem ipsum dolor sit amet
          </span>

          <div className="grid grid-cols-3 gap-4">
            {products.map((product, index) => (
              <ProductItem
                key={index}
                type={product.type as "image" | "video"}
                handleActiveProductView={() => {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="flex gap-6 translate-x-1">
        {/* LEFT TIMELINE */}
        <div className="relative flex flex-col items-center w-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-[calc(100%+16px)] bg-[#DADADA]  translate-y-[-10px]" />

          <div className="flex items-center justify-center rounded-full border-2 border-[#DADADA] h-14 w-14 bg-white  translate-y-[-10px]">
            <div className="bg-[#DADADA] h-10 w-10 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col gap-6">
          <span className="font-medium text-[#AFAFAF] text-3xl translate-y-[-3px]">
            Lorem ipsum dolor sit amet
          </span>

          <div className="grid grid-cols-3 gap-4">
            {products.map((product, index) => (
              <ProductItem
                key={index}
                type={product.type as "image" | "video"}
                handleActiveProductView={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceShow;
