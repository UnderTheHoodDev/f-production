"use client";

import Link from "next/link";
import type { ComponentType, MouseEventHandler } from "react";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url?: string;
  icon?: ComponentType<Record<string, unknown>>;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const buttonContent = (
            <>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </>
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.url && item.url !== "#" ? (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={item.onClick}
                    asChild
                  >
                    <Link href={item.url}>{buttonContent}</Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={item.onClick}
                  >
                    {buttonContent}
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
