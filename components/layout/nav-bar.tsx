'use client';

import { clsx } from 'clsx';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';

const NavBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigationLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Giới thiệu', path: '/gioi-thieu' },
    { label: 'Dịch vụ', path: '/dich-vu' },
    { label: 'Liên hệ', path: '/lien-he' },
    { label: 'Bảng giá', path: '/bang-gia' },
  ];

  return (
    <nav className="bg-background-secondary layout-padding fixed top-0 z-50 flex h-16 w-full items-center justify-between shadow-lg">
      <Link
        href="/"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0"
      >
        <Image src="/logo.png" alt="Logo" width={48} height={48} />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden h-full items-center gap-8 md:flex md:gap-10">
        {navigationLinks.map((link) => {
          const isActive = pathname === link.path;

          return (
            <Link
              key={link.label}
              href={link.path}
              className={clsx(
                isActive
                  ? 'text-primary after:w-full after:-translate-x-1/2'
                  : 'after:w-0 after:-translate-x-1/2 hover:after:w-full',
                'text-foreground hover:text-primary relative flex h-full items-center justify-center text-sm transition-colors duration-300 md:text-base md:text-sm lg:text-base',
                "after:bg-primary font-medium after:absolute after:bottom-0 after:left-1/2 after:h-0.75 after:transition-all after:duration-300 after:ease-out after:content-['']"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2 md:hidden">
          <Menu className="size-6 text-white" />
          <span className="sr-only">Menu</span>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader></SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.label}
                  href={link.path}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    isActive ? 'text-primary' : 'text-foreground',
                    'hover:text-primary py-2 text-base font-medium transition-colors duration-300'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default NavBar;
