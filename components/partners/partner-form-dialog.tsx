"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

type PartnerFormData = {
    name: string
    logoKey: string | null
    logoPreview: string | null
}

type PartnerFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    partner?: {
        id: string
        name: string
        logoKey: string | null
        logoUrl?: string
    } | null
}

export function PartnerFormDialog({
    open,
    onOpenChange,
    partner,
}: PartnerFormDialogProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const [formData, setFormData] = React.useState<PartnerFormData>({
        name: "",
        logoKey: null,
        logoPreview: null,
    })

    React.useEffect(() => {
        if (partner) {
            setFormData({
                name: partner.name || "",
                logoKey: partner.logoKey || null,
                logoPreview: partner.logoUrl || null,
            })
        } else {
            setFormData({
                name: "",
                logoKey: null,
                logoPreview: null,
            })
        }
    }, [partner, open])

    const handleFileUpload = async (file: File) => {
        if (!file) return

        setIsUploading(true)
        try {
            // 1. Get presigned URL
            const presignedRes = await fetch("/api/admin/partners/presigned-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    fileSize: file.size,
                }),
            })

            const presignedData = await presignedRes.json()
            if (!presignedData.success) {
                throw new Error(presignedData.message || "Không thể tạo URL upload.")
            }

            // 2. Upload to S3
            await fetch(presignedData.presignedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            })

            // 3. Create preview and set key
            const previewUrl = URL.createObjectURL(file)
            setFormData((prev) => ({
                ...prev,
                logoKey: presignedData.s3Key,
                logoPreview: previewUrl,
            }))
        } catch (error) {
            console.error("Upload failed:", error)
            alert("Không thể upload ảnh. Vui lòng thử lại.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveLogo = () => {
        setFormData((prev) => ({
            ...prev,
            logoKey: null,
            logoPreview: null,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const url = partner
                ? `/api/admin/partners/${partner.id}`
                : "/api/admin/partners"
            const method = partner ? "PATCH" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    logoKey: formData.logoKey,
                }),
            })

            const result = await response.json()

            if (result.success) {
                onOpenChange(false)
                router.refresh()
                window.dispatchEvent(new CustomEvent("partner-updated"))
            } else {
                alert(result.message || "Có lỗi xảy ra.")
            }
        } catch (error) {
            console.error("Error saving partner:", error)
            alert("Không thể lưu đối tác.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {partner ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
                        </DialogTitle>
                        <DialogDescription>
                            {partner
                                ? "Cập nhật thông tin đối tác."
                                : "Nhập tên và logo cho đối tác mới."}
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="space-y-4 py-4">
                        <Field>
                            <FieldLabel htmlFor="name">
                                Tên đối tác <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Ví dụ: Công ty ABC"
                                required
                                disabled={isSubmitting}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Logo</FieldLabel>
                            <div className="space-y-3">
                                {formData.logoPreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.logoPreview}
                                            alt="Logo preview"
                                            className="h-24 w-24 rounded-lg border object-contain bg-white p-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        ) : (
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleFileUpload(file)
                                        e.target.value = ""
                                    }}
                                    disabled={isUploading || isSubmitting}
                                />
                                {!formData.logoPreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading || isSubmitting}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang upload...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Chọn ảnh
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {isSubmitting
                                ? "Đang lưu..."
                                : partner
                                    ? "Cập nhật"
                                    : "Thêm đối tác"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
