import { Badge } from "@/components/ui/badge";
import type { QuoteStatus } from "@/lib/quotes/types";

const MAP: Record<QuoteStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Nháp", variant: "outline" },
  SENT: { label: "Đã gửi", variant: "secondary" },
  VIEWED: { label: "Đã xem", variant: "secondary" },
  RESPONDED: { label: "Đã phản hồi", variant: "default" },
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const cfg = MAP[status] ?? MAP.DRAFT;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
