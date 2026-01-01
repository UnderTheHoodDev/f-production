"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";

const PriceCard = () => {
  const providedServices = [
    "Gói chụp ảnh sự kiện này chỉ được áp dụng khi khách hàng khách hàng sử dụng gói quay phim sự kiện",
    "Địa điểm chỉ áp dụng tại thành phố Hà Nội",
    "Địa điểm chỉ áp dụng tại thành phố Hà Nội",
    "Địa điểm chỉ áp dụng tại thành phố Hà Nội",
    "Địa điểm chỉ áp dụng tại thành phố Hà Nội",
    "Địa điểm chỉ áp dụng tại thành phố Hà Nội",
    "Địa điểm chỉ áp dụng tại thành phố Hà Nội",
  ];
  return (
    <div className="flex flex-col gap-5 relative px-4 py-6 border border-background max-w-[400px] rounded-2xl shadow-lg">
      <span className="w-max text-center absolute top-[-24px] translate-x-[-50%] left-1/2 z-10 bg-background-secondary px-4 py-3 text-foreground rounded-full font-medium text-lg">
        Gói chụp sự kiện cơ bản 1
      </span>
      <div className="flex gap-2 justify-center items-center border-b border-background-secondary py-4">
        <span className="font-semibold text-background-secondary text-4xl">
          999.999
        </span>
        <span className="underline text-background-secondary text-2xl">đ</span>
      </div>
      <div className="flex flex-col gap-4">
        {providedServices.map((service, index) => (
          <div key={index} className="flex items-start gap-3">
            <CircleCheck className="size-6 text-[#15A136]" />
            <span className="text-black text-sm flex-1">{service}</span>
          </div>
        ))}
      </div>
      <Button className="bg-background-secondary text-white hover:bg-background-secondary/80 py-6 text-lg">
        Tư vấn miễn phí
      </Button>
    </div>
  );
};

export default PriceCard;
