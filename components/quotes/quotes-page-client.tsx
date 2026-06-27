"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuotesTable, type QuoteListItem } from "./quotes-table";

export function QuotesPageClient({
  initialQuotes,
}: {
  initialQuotes: QuoteListItem[];
}) {
  const router = useRouter();
  const [quotes, setQuotes] = React.useState<QuoteListItem[]>(initialQuotes);

  React.useEffect(() => {
    setQuotes(initialQuotes);
  }, [initialQuotes]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        router.refresh();
      } else {
        alert(result.message || "Không thể xóa báo giá.");
      }
    } catch (err) {
      console.error("Delete quote failed", err);
      alert("Không thể xóa báo giá.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý báo giá</h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý báo giá gửi cho khách hàng
          </p>
        </div>
        <Button onClick={() => router.push("/admin/quotes/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo báo giá
        </Button>
      </div>

      <QuotesTable quotes={quotes} onDelete={handleDelete} />
    </div>
  );
}
