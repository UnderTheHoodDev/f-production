"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Phone,
    MapPin,
    MessageSquare,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Circle,
    MessageCircle,
    Mail,
    MailCheck,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Contact = {
    id: string;
    referenceId: string;
    fullName: string;
    phone: string;
    address: string | null;
    content: string | null;
    status: string;
    note: string | null;
    emailSent: boolean;
    createdAt: string;
    updatedAt: string;
};

type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
};

const STATUS_CONFIG = {
    NEW: { label: "Mới", color: "bg-blue-100 text-blue-700", icon: Circle },
    CONTACTED: { label: "Đã liên hệ", color: "bg-yellow-100 text-yellow-700", icon: MessageCircle },
    COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

export function ContactsClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [updating, setUpdating] = useState(false);
    const [noteValue, setNoteValue] = useState("");

    const currentStatus = searchParams.get("status") || "";
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", currentPage.toString());
            if (currentStatus) params.set("status", currentStatus);

            const response = await fetch(`/api/admin/contacts?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setContacts(data.contacts);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, currentStatus]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const createUrl = (params: Record<string, string | undefined>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        return `${pathname}?${newParams.toString()}`;
    };

    const handleStatusFilter = (value: string) => {
        router.push(createUrl({ status: value === "ALL" ? undefined : value, page: "1" }));
    };

    const handlePageChange = (newPage: number) => {
        router.push(createUrl({ page: newPage.toString() }));
    };

    const handleUpdateContact = async (newStatus?: string) => {
        if (!selectedContact) return;
        setUpdating(true);

        try {
            const response = await fetch("/api/admin/contacts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedContact.id,
                    status: newStatus,
                    note: noteValue,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setContacts((prev) =>
                    prev.map((c) =>
                        c.id === selectedContact.id ? { ...c, ...data.contact } : c
                    )
                );
                setSelectedContact(null);
            }
        } catch (error) {
            console.error("Failed to update contact:", error);
        } finally {
            setUpdating(false);
        }
    };

    const openContactDetail = (contact: Contact) => {
        setSelectedContact(contact);
        setNoteValue(contact.note || "");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Select value={currentStatus || "ALL"} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tất cả trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                            <SelectItem value="NEW">Mới</SelectItem>
                            <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
                            <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                    {pagination ? `${pagination.total} liên hệ` : "Đang tải..."}
                </p>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : contacts.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <Phone className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">Chưa có yêu cầu liên hệ nào</p>
                </div>
            ) : (
                <div className="rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">Khách hàng</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Liên hệ</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Nội dung</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {contacts.map((contact) => {
                                const statusConfig = STATUS_CONFIG[contact.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.NEW;
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <tr
                                        key={contact.id}
                                        onClick={() => openContactDetail(contact)}
                                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{contact.fullName}</p>
                                                    <p className="text-xs text-muted-foreground">{contact.referenceId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <a
                                                    href={`tel:${contact.phone}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-primary hover:underline"
                                                >
                                                    {contact.phone}
                                                </a>
                                            </div>
                                            {contact.address && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">{contact.address}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 max-w-[200px]">
                                            {contact.content ? (
                                                <p className="text-sm text-muted-foreground line-clamp-2">{contact.content}</p>
                                            ) : (
                                                <span className="text-sm text-muted-foreground/50 italic">Không có</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${statusConfig.color} gap-1`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {statusConfig.label}
                                                </Badge>
                                                {contact.emailSent && (
                                                    <span title="Email đã gửi">
                                                        <MailCheck className="h-4 w-4 text-green-500" />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasMore}
                    >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Contact Detail Dialog */}
            <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {selectedContact?.fullName}
                        </DialogTitle>
                        <DialogDescription>{selectedContact?.referenceId}</DialogDescription>
                    </DialogHeader>

                    {selectedContact && (
                        <div className="space-y-4">
                            {/* Contact Info */}
                            <div className="grid gap-3">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Số điện thoại</p>
                                        <a href={`tel:${selectedContact.phone}`} className="font-medium text-primary hover:underline">
                                            {selectedContact.phone}
                                        </a>
                                    </div>
                                </div>

                                {selectedContact.address && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Địa chỉ</p>
                                            <p className="font-medium">{selectedContact.address}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedContact.content && (
                                    <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                                        <MessageSquare className="h-5 w-5 text-primary shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Nội dung</p>
                                            <p className="text-sm whitespace-pre-wrap">{selectedContact.content}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Thời gian gửi</p>
                                        <p className="font-medium">{formatDate(selectedContact.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email thông báo</p>
                                        <p className="font-medium">
                                            {selectedContact.emailSent ? (
                                                <span className="text-green-600 flex items-center gap-1">
                                                    <MailCheck className="h-4 w-4" /> Đã gửi
                                                </span>
                                            ) : (
                                                <span className="text-yellow-600">Chưa gửi</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="text-sm font-medium">Ghi chú nội bộ</label>
                                <Textarea
                                    value={noteValue}
                                    onChange={(e) => setNoteValue(e.target.value)}
                                    placeholder="Thêm ghi chú..."
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>

                            {/* Status Actions */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex gap-2">
                                    {selectedContact.status !== "CONTACTED" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUpdateContact("CONTACTED")}
                                            disabled={updating}
                                        >
                                            <MessageCircle className="h-4 w-4 mr-1" />
                                            Đã liên hệ
                                        </Button>
                                    )}
                                    {selectedContact.status !== "COMPLETED" && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleUpdateContact("COMPLETED")}
                                            disabled={updating}
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                            Hoàn thành
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateContact()}
                                    disabled={updating}
                                >
                                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu ghi chú"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
