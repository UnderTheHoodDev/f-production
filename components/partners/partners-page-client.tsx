"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PartnersTable, type Partner } from "@/components/partners/partners-table"
import { PartnerFormDialog } from "@/components/partners/partner-form-dialog"

type PartnersPageClientProps = {
    initialPartners: Partner[]
}

export function PartnersPageClient({ initialPartners }: PartnersPageClientProps) {
    const router = useRouter()
    const [partners, setPartners] = React.useState<Partner[]>(initialPartners)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingPartner, setEditingPartner] = React.useState<Partner | null>(null)

    // Sync with server data
    React.useEffect(() => {
        const handleRefresh = () => {
            fetch("/api/admin/partners")
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setPartners(data.partners)
                    }
                })
                .catch(console.error)
        }

        window.addEventListener("partner-updated", handleRefresh)
        return () => {
            window.removeEventListener("partner-updated", handleRefresh)
        }
    }, [])

    const handleCreate = () => {
        setEditingPartner(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/partners/${id}`, {
                method: "DELETE",
            })

            const result = await response.json()

            if (result.success) {
                router.refresh()
                setPartners((prev) => prev.filter((p) => p.id !== id))
            } else {
                alert(result.message || "Không thể xóa đối tác.")
            }
        } catch (error) {
            console.error("Error deleting partner:", error)
            alert("Không thể xóa đối tác.")
        }
    }

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setEditingPartner(null)
            // Refresh data when closing dialog
            fetch("/api/admin/partners")
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setPartners(data.partners)
                    }
                })
                .catch(console.error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Quản lý đối tác</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý danh sách đối tác và logo
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm đối tác
                </Button>
            </div>

            <PartnersTable
                partners={partners}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <PartnerFormDialog
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                partner={editingPartner}
            />
        </div>
    )
}
