import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const footerLinks = [
    {
      label: "Về chúng tôi",
      links: [
        { title: "Trang chủ", url: "/" },
        { title: "Giới thiệu", url: "/gioi-thieu" },
        { title: "Liên hệ", url: "/lien-he" },
        { title: "Hướng dẫn thanh toán", url: "#" },
        { title: "Chính sách bảo mật", url: "#" },
      ],
    },
    {
      label: "Dịch vụ",
      links: [
        { title: "Livestream sự kiện", url: "#" },
        { title: "Chụp ảnh sự kiện", url: "#" },
        { title: "Quay phim sự kiện", url: "#" },
        { title: "TVC - Phim doanh nghiệp", url: "#" },
        { title: "Chụp ảnh Profile chuyên nghiệp", url: "#" },
        { title: "Quay phim, chụp ảnh Team Building", url: "#" },
        { title: "Quay phim Podcast", url: "#" },
      ],
    },
    {
      label: "Liên hệ",
      contents: [
        { type: Phone, content: "0123 456 789" },
        { type: Mail, content: "fproduction.work@gmail.com" },
      ],
    },
  ];

  const otherContactLinks = [
    { icon: Facebook, url: "https://facebook.com" },
    { icon: Instagram, url: "https://instagram.com" },
    { icon: Youtube, url: "https://youtube.com" },
  ];

  return (
    <footer className="w-full bg-background-secondary px-10 pb-2 pt-6 flex gap-10 flex-col">
      <div className="flex justify-between items-center">
        <Image
          src="/logo-name.png"
          alt="F Production Logo"
          width={240}
          height={240}
        />
        <div className="flex gap-20 py-3">
          {footerLinks.map((section) => {
            if (section.label === "Liên hệ") {
              return (
                <div key={section.label} className="flex flex-col gap-3">
                  <span className="text-primary font-medium text-xl">
                    {section.label}
                  </span>
                  <div className="flex flex-col gap-2">
                    {section.contents?.map((content, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-foreground text-sm"
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
              <div key={section.label} className="flex flex-col gap-3">
                <span className="text-primary font-medium text-xl">
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
      <div className="flex items-center justify-between border-t border-primary py-3">
        <span className="text-foreground text-sm">
          © Copyright 2025 <span className="text-primary">F.Production </span>
        </span>
        <div className="flex items-center gap-4">
          {otherContactLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              className="bg-foreground flex items-center justify-center p-2 rounded-full"
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
