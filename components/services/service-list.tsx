"use client";

import { Music2 } from "lucide-react";

const ServiceList = () => {
  const services = [
    {
      name: "Sản xuất TVC Quảng cáo",
      description:
        "Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc",
    },
    {
      name: "Sản xuất TVC Quảng cáo",
      description:
        "Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc",
    },
    {
      name: "Sản xuất TVC Quảng cáo",
      description:
        "Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc",
    },
    {
      name: "Sản xuất TVC Quảng cáo",
      description:
        "Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc",
    },
    {
      name: "Sản xuất TVC Quảng cáo",
      description:
        "Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc",
    },
    {
      name: "Sản xuất TVC Quảng cáo",
      description:
        "Xây dựng kịch bản từ Brief, phát triển ý tưởng và sản phẩm và sản xuất TVC chuyên nghiệp, giúp thương hiệu truyền tải thông điệp rõ ràng và cảm xúc",
    },
  ];

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-12">
      <span className="font-bold text-4xl text-background-secondary ">
        Dịch vụ tại F Production
      </span>
      <div className="flex flex-wrap gap-5 justify-center max-w-[1200px]">
        {services.map((service) => (
          <div
            key={service.name}
            className="group flex flex-col bg-background-secondary px-4 py-6 w-90 min-h-80 cursor-pointer rounded-2xl items-center gap-3"
          >
            <div className="flex items-center justify-center rounded-full bg-foreground w-20 h-20 group-hover:bg-primary transition-colors duration-300">
              <Music2 className="size-10 text-background" />
            </div>
            <span className="text-foreground text-2xl font-bold group-hover:text-primary transition-colors duration-300">
              {service.name}
            </span>
            <p className="text-foreground text-base text-center mt-2">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
