import { Suspense } from "react";
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
import { ContactsClient } from "@/components/contacts/contacts-client";
import { Loader2 } from "lucide-react";

function ContactsLoading() {
    return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
}

export default function ContactsPage() {
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
                                    <BreadcrumbPage>Liên hệ</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">
                            Quản lý liên hệ
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Xem và quản lý các yêu cầu liên hệ từ khách hàng
                        </p>
                    </div>
                    <Suspense fallback={<ContactsLoading />}>
                        <ContactsClient />
                    </Suspense>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
