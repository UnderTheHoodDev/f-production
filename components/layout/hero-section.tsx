'use client';

import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="layout-padding flex h-140 w-full items-center bg-[#9B9B9B] sm:h-150 md:h-160 lg:min-h-screen">
      <div className="flex flex-col gap-6 pb-0 sm:pb-4 lg:pb-8">
        <div className="mt-4 flex gap-2 sm:gap-3 lg:gap-5">
          <Link
            href="/dich-vu"
            className="text-foreground border-foreground rounded-4xl border-2 px-3 py-2 text-base/8 font-medium md:px-5 md:text-lg"
          >
            Dịch vụ & Sản phẩm
          </Link>
          <Link
            href="/lien-he"
            className="bg-background text-foreground rounded-4xl px-3 py-2 text-base/9 font-medium md:px-5 md:text-lg/8"
          >
            Đặt lịch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
