import { AppSidebar } from "@/components/app-sidebar";
import { ImagesGallery } from "@/components/media/images-gallery";
import { ImageUploader } from "@/components/media/image-uploader";
import { MediaTabs } from "@/components/media/media-tabs";
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

export default async function ImagesPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      events: {
        select: {
          id: true,
          title: true,
        },
      },
    },
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/media">Media</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Ảnh</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <div>
            <div className="mb-6">
              <MediaTabs />
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">
                  Quản lý ảnh studio
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Xem và quản lý tất cả ảnh liên quan đến studio. Upload ảnh mới
                  để thêm vào thư viện.
                </p>
              </div>
              <ImageUploader />
            </div>
            <ImagesGallery items={images} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

