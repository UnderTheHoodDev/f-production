import { QuoteAdminShell } from "@/components/quotes/quote-admin-shell";
import { QuoteBuilder } from "@/components/quotes/quote-builder";

export default function NewQuotePage() {
  return (
    <QuoteAdminShell breadcrumb="Tạo mới" parentHref="/admin/quotes" parentLabel="Báo giá">
      <QuoteBuilder />
    </QuoteAdminShell>
  );
}
