import { AppSidebar } from "@/components/app-sidebar"
import { AdminHeaderActions } from "@/components/admin-header"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { prisma } from "@/lib/prisma"
import { getPublicUrl } from "@/lib/s3"
import { PartnersPageClient } from "@/components/partners/partners-page-client"

export default async function PartnersPage() {
    const partners = await prisma.partner.findMany({
        orderBy: { order: "asc" },
    })

    // Map logoKey to logoUrl using CloudFront/S3
    const partnersWithUrls = partners.map((p) => ({
        ...p,
        logoUrl: p.logoKey ? getPublicUrl(p.logoKey) : undefined,
    }))

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
                                    <BreadcrumbLink href="/admin/dashboard">
                                        Admin
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Đối tác</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <AdminHeaderActions />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <PartnersPageClient initialPartners={partnersWithUrls} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
