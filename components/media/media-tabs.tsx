"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MediaTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = pathname.includes("/images") ? "images" : "videos";

  return (
    <Tabs value={currentTab} onValueChange={(value) => router.push(`/admin/media/${value}`)}>
      <TabsList>
        <TabsTrigger value="images">Ảnh</TabsTrigger>
        <TabsTrigger value="videos">Video</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

