"use client";

import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  const navigationLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Giới thiệu", path: "/gioi-thieu" },
    { label: "Dịch vụ", path: "/dich-vu" },
    { label: "Liên hệ", path: "/lien-he" },
  ];

  return (
    <nav className="flex items-center justify-between bg-background-secondary px-10 h-16 fixed top-0 w-full">
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={48} height={48} />
      </Link>
      <div className="flex gap-10 items-center h-full">
        {navigationLinks.map((link) => {
          const isActive = pathname === link.path;

          return (
            <Link
              key={link.label}
              href={link.path}
              className={clsx(
                isActive
                  ? "text-primary after:w-full after:-translate-x-1/2"
                  : "after:w-0 hover:after:w-full after:-translate-x-1/2",
                "font-medium text-foreground hover:text-primary text-[16px] h-full flex justify-center items-center relative transition-colors duration-300",
                "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-0.75 after:bg-primary after:transition-all after:duration-300 after:ease-out"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
