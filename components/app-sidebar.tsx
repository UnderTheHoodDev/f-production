"use client";

import Image from "next/image";
import * as React from "react";
import {
  CalendarClock,
  Handshake,
  Images,
  LayoutDashboard,
  PhoneCall,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import logo from "@/public/logo.png";

const data = {
  user: {
    name: "F.Production",
    email: "Accompany your development",
    avatar: logo.src,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Ảnh/Video",
      url: "#",
      icon: Images,
    },
    {
      title: "Sự kiện",
      url: "#",
      icon: CalendarClock,
    },
    {
      title: "Dịch vụ",
      url: "#",
      icon: Handshake,
    },
    {
      title: "Liên hệ",
      url: "#",
      icon: PhoneCall,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const handleDashboardClick = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/debug/images");
      const result = await response.json();
      console.log("Prisma Image records:", result?.images ?? result);
    } catch (error) {
      console.error("Không thể lấy danh sách ảnh từ Prisma.", error);
    }
  }, []);

  const navItems = React.useMemo(
    () =>
      data.navMain.map((item) =>
        item.title === "Dashboard" ? { ...item, onClick: handleDashboardClick } : item
      ),
    [handleDashboardClick]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <a href="#">
                <Image
                  src={logo}
                  alt="F.Production logo"
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                  priority
                />
                <span className="text-base font-semibold">F.Production</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
