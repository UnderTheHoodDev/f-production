import { Facebook, Instagram, Mail, Phone, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const footerLinks = [
    {
      label: 'Về chúng tôi',
      links: [
        { title: 'Trang chủ', url: '/' },
        { title: 'Giới thiệu', url: '/gioi-thieu' },
        { title: 'Liên hệ', url: '/lien-he' },
        { title: 'Hướng dẫn thanh toán', url: '#' },
        { title: 'Chính sách bảo mật', url: '#' },
      ],
    },
    {
      label: 'Dịch vụ',
      links: [
        { title: 'Livestream sự kiện', url: '#' },
        { title: 'Chụp ảnh sự kiện', url: '#' },
        { title: 'Quay phim sự kiện', url: '#' },
        { title: 'TVC - Phim doanh nghiệp', url: '#' },
        { title: 'Chụp ảnh Profile chuyên nghiệp', url: '#' },
        { title: 'Quay phim, chụp ảnh Team Building', url: '#' },
        { title: 'Quay phim Podcast', url: '#' },
      ],
    },
    {
      label: 'Liên hệ',
      contents: [
        { type: Phone, content: '0123 456 789' },
        { type: Mail, content: 'fproduction.work@gmail.com' },
      ],
    },
  ];

  const otherContactLinks = [
    { icon: Facebook, url: 'https://facebook.com' },
    { icon: Instagram, url: 'https://instagram.com' },
    { icon: Youtube, url: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-background-secondary layout-padding flex w-full flex-col gap-6 pt-2 pb-2 md:gap-8 md:pt-6">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <Image
          src="/logo-name.png"
          alt="F Production Logo"
          className="h-48 w-48 md:h-52 md:w-52 xl:h-60 xl:w-60"
          width={240}
          height={240}
        />
        <div className="flex w-full flex-wrap gap-6 lg:justify-end lg:gap-8 xl:gap-12 2xl:gap-16">
          {footerLinks.map((section) => {
            if (section.label === 'Liên hệ') {
              return (
                <div
                  key={section.label}
                  className="flex w-full flex-col gap-2 sm:gap-3 md:w-[calc(33%-8px)] lg:w-fit"
                >
                  <span className="text-primary text-lg font-medium md:text-xl">
                    {section.label}
                  </span>
                  <div className="flex flex-col gap-2">
                    {section.contents?.map((content, index) => (
                      <div
                        key={index}
                        className="text-foreground flex items-center gap-2 text-sm"
                      >
                        <content.type className="size-4" />
                        <span>{content.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={section.label}
                className="xsm:w-[calc(50%-12px)] flex w-full flex-col gap-2 sm:w-[calc(50%-12px)] sm:gap-3 md:w-[calc(33.33%-20px)] lg:w-fit"
              >
                <span className="text-primary text-base font-medium md:text-xl">
                  {section.label}
                </span>
                <div className="flex flex-col gap-2 text-sm">
                  {section.links?.map((link) => (
                    <Link
                      key={link.title}
                      href={link.url}
                      className="text-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-primary flex flex-col items-center justify-between gap-3 border-t py-3 sm:flex-row">
        <span className="text-foreground text-sm">
          © Copyright 2025 <span className="text-primary">F.Production </span>
        </span>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {otherContactLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              className="bg-foreground flex items-center justify-center rounded-full p-2"
            >
              <link.icon className="text-background size-5" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
