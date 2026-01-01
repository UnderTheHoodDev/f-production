"use client";

import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="bg-[#9B9B9B] min-h-screen flex items-center px-10 w-full">
      <div className="flex flex-col gap-6 pb-20">
        <div className="flex gap-5 mt-4">
          <Link
            href="/dich-vu"
            className="text-foreground border-2 border-foreground text-lg font-medium rounded-4xl px-5 py-2"
          >
            Dịch vụ & Sản phẩm
          </Link>
          <Link
            href="#"
            className="bg-background px-5 py-2 text-foreground font-medium rounded-4xl text-lg"
          >
            Đặt lịch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
