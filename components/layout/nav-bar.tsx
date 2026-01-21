'use client';

import { clsx } from 'clsx';
import { ChevronDown, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from 'motion/react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { services } from '@/lib/services-data';

const NavBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  // Transform scroll position to navbar properties
  const navHeight = useTransform(scrollY, [0, 50], [64, 56]);
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(9, 64, 59, 1)', 'rgba(9, 64, 59, 0.95)']
  );
  const navBlur = useTransform(scrollY, [0, 50], [0, 12]);
  const navShadow = useTransform(
    scrollY,
    [0, 50],
    [
      '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ]
  );

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  const navigationLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Giới thiệu', path: '/gioi-thieu' },
    { label: 'Liên hệ', path: '/lien-he' },
    { label: 'Bảng giá', path: '/bang-gia' },
  ];

  const isServiceActive = pathname?.startsWith('/dich-vu');

  return (
    <motion.nav
      style={{
        height: navHeight,
        backgroundColor: navBackground,
        backdropFilter: useTransform(navBlur, (v) => `blur(${v}px)`),
        boxShadow: navShadow,
      }}
      className="layout-padding fixed top-0 z-50 flex w-full items-center justify-between"
    >
      <Link
        href="/"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0"
      >
        <Image src="/logo.png" alt="Logo" width={48} height={48} />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden h-full items-center gap-8 md:flex md:gap-10">
        {/* Trang chủ & Giới thiệu */}
        {navigationLinks.slice(0, 2).map((link) => {
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

        {/* Dịch vụ Dropdown */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={clsx(
                  isServiceActive
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary',
                  'relative flex h-full items-center justify-center'
                )}
              >
                Dịch vụ
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] gap-1 p-3">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const isActive = pathname === `/dich-vu/${service.slug}`;
                    return (
                      <li key={service.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/dich-vu/${service.slug}`}
                            className={clsx(
                              'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                              isActive
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-accent text-foreground hover:text-primary'
                            )}
                          >
                            <div
                              className={clsx(
                                'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                                isActive
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-surface-alt text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                              )}
                            >
                              <Icon className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium leading-tight">
                                {service.label}
                              </span>
                              <span className="text-muted-foreground line-clamp-1 text-xs">
                                {service.description}
                              </span>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Liên hệ & Bảng giá */}
        {navigationLinks.slice(2).map((link) => {
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
          <div className="flex flex-col gap-2 px-4">
            {/* Trang chủ & Giới thiệu */}
            {navigationLinks.slice(0, 2).map((link) => {
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

            {/* Dịch vụ Collapsible */}
            <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
                <span
                  className={clsx(
                    isServiceActive ? 'text-primary' : 'text-foreground',
                    'hover:text-primary text-base font-medium transition-colors duration-300'
                  )}
                >
                  Dịch vụ
                </span>
                <ChevronDown
                  className={clsx(
                    'text-muted-foreground size-4 transition-transform duration-200',
                    servicesOpen && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-1 py-2 pl-4">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const isActive = pathname === `/dich-vu/${service.slug}`;
                    return (
                      <Link
                        key={service.slug}
                        href={`/dich-vu/${service.slug}`}
                        onClick={() => setOpen(false)}
                        className={clsx(
                          'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-accent hover:text-primary'
                        )}
                      >
                        <Icon className="size-4" />
                        <span className="text-sm">{service.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Liên hệ & Bảng giá */}
            {navigationLinks.slice(2).map((link) => {
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
    </motion.nav>
  );
};

export default NavBar;
