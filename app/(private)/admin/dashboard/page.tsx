import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";
import { ImageIcon, VideoIcon, CalendarIcon, BriefcaseIcon, PhoneCall, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const [imageCount, videoCount, eventCount, serviceCount, contactCount, newContactCount] = await Promise.all([
    prisma.image.count(),
    prisma.video.count(),
    prisma.event.count(),
    prisma.service.count(),
    prisma.contact.count(),
    prisma.contact.count({ where: { status: "NEW" } }),
  ]);

  // Fetch landing counts
  const [landingImageCount, landingVideoCount] = await Promise.all([
    prisma.image.count({ where: { showOnLanding: true } }),
    prisma.video.count({ where: { showOnLanding: true } }),
  ]);

  // Fetch recent images
  const recentImages = await prisma.image.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      events: {
        select: { title: true },
        take: 1,
      },
    },
  });

  const stats = [
    {
      title: "Tổng ảnh",
      value: imageCount,
      subtext: `${landingImageCount} hiển thị trang chủ`,
      icon: ImageIcon,
      href: "/admin/media/images",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Tổng video",
      value: videoCount,
      subtext: `${landingVideoCount} hiển thị trang chủ`,
      icon: VideoIcon,
      href: "/admin/media/videos",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Sự kiện",
      value: eventCount,
      subtext: "Sự kiện đã tạo",
      icon: CalendarIcon,
      href: "/admin/events",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Dịch vụ",
      value: serviceCount,
      subtext: "Dịch vụ đang hoạt động",
      icon: BriefcaseIcon,
      href: "/admin/services",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Liên hệ",
      value: contactCount,
      subtext: newContactCount > 0 ? `${newContactCount} yêu cầu mới` : "Không có yêu cầu mới",
      icon: PhoneCall,
      href: "/admin/contacts",
      color: newContactCount > 0 ? "text-red-500" : "text-gray-500",
      bgColor: newContactCount > 0 ? "bg-red-500/10" : "bg-gray-500/10",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tổng quan về nội dung studio
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Link
                key={stat.title}
                href={stat.href}
                className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtext}
                    </p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/50 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          {/* Recent Images */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Ảnh mới nhất</h2>
                <p className="text-sm text-muted-foreground">
                  8 ảnh được upload gần đây
                </p>
              </div>
              <Link
                href="/admin/media/images"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Xem tất cả
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentImages.length > 0 ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
                {recentImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={getPublicUrl(image.s3Key as string)}
                      alt={image.title || "Studio image"}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {image.title && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white line-clamp-1">
                          {image.title}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có ảnh nào</p>
                <Link
                  href="/admin/media/images"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Upload ảnh đầu tiên
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/admin/media/images"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="rounded-lg bg-blue-500/10 p-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Quản lý ảnh</p>
                <p className="text-xs text-muted-foreground">Upload và chỉnh sửa</p>
              </div>
            </Link>
            <Link
              href="/admin/media/videos"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="rounded-lg bg-purple-500/10 p-2">
                <VideoIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Quản lý video</p>
                <p className="text-xs text-muted-foreground">Thêm video YouTube</p>
              </div>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="rounded-lg bg-orange-500/10 p-2">
                <CalendarIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium">Quản lý sự kiện</p>
                <p className="text-xs text-muted-foreground">Tạo và chỉnh sửa</p>
              </div>
            </Link>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
