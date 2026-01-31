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
import { getPublicUrl } from "@/lib/s3";


const ITEMS_PER_PAGE = 24;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt((params.page as string) || "1", 10));
  const sortBy = (params.sortBy as string) || "createdAt";
  const sortOrder = (params.sortOrder as string) || "desc";
  const search = (params.search as string) || "";

  // Validate sort options
  const validSortFields = ["createdAt", "updatedAt"];
  const validSortOrders = ["asc", "desc"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "desc";

  // Build where clause for search
  const whereClause: {
    title?: { contains: string; mode: "insensitive" };
  } = {};

  if (search.trim()) {
    whereClause.title = { contains: search.trim(), mode: "insensitive" };
  }

  // Get total count with search
  const total = await prisma.image.count({ where: whereClause });
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Get paginated images with search
  const rawImages = await prisma.image.findMany({
    where: whereClause,
    orderBy: { [finalSortBy]: finalSortOrder as "asc" | "desc" },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    include: {
      events: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  // Transform images to include computed url from s3Key
  const images = rawImages.map((image) => ({
    ...image,
    url: getPublicUrl(image.s3Key as string),
  }));

  const pagination = {
    page,
    limit: ITEMS_PER_PAGE,
    total,
    totalPages,
    hasMore: page < totalPages,
    hasPrev: page > 1,
  };

  const filters = {
    search,
  };

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
            <ImagesGallery
              items={images as any}
              pagination={pagination}
              currentSort={{ sortBy: finalSortBy, sortOrder: finalSortOrder }}
              filters={filters}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
