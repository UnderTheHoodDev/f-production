import { AppSidebar } from "@/components/app-sidebar";
import { MediaGallery } from "@/components/media/media-gallery";
import { MediaUploader } from "@/components/media/media-uploader";
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
import { ThemeToggle } from "@/components/theme-toggle";

export default async function MediaPage() {
  const mediaItems = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });

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
                  <BreadcrumbPage>Ảnh / Video</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <section className="rounded-[32px] border border-black/5 bg-white/80 p-8 shadow-black/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-muted">
                  Media
                </p>
                <h1 className="text-3xl font-semibold text-foreground">
                  Upload nhanh lên Cloudinary
                </h1>
                <p className="text-sm text-muted-foreground">
                  Dùng widget phía bên phải để test upload ảnh/video và lưu record vào
                  bảng `Image`.
                </p>
              </div>
              <MediaUploader />
            </div>
          </section>
          <section className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-inner shadow-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                Thư viện gần đây
              </h2>
              <p className="text-sm text-muted-foreground">
                Tổng số: {mediaItems.length}
              </p>
            </div>
            <MediaGallery items={mediaItems} />
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

