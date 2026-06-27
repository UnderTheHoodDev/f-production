// Shared types for the Quote (Báo giá) feature.
// `content` is stored as a JSON column on the Quote model; these types describe
// its shape (no DB-level enforcement). Money values inside content are plain
// integer `number` (VND). See lib/quotes/calc.ts for the authoritative totals.

export type QuoteStatus = "DRAFT" | "SENT" | "VIEWED" | "RESPONDED";

export type QuoteCompany = {
  name: string;
  taxCode: string; // MST
  address: string;
  email: string;
  hotline: string;
  logoUrl?: string;
};

export type QuoteRecipient = {
  salutation: string; // "Kính gửi"
  name: string;
  intro: string;
};

export type QuoteItem = {
  id: string; // client-generated (crypto.randomUUID) for stable dnd keys
  name: string; // HẠNG MỤC
  unit: string; // ĐƠN VỊ TÍNH
  qty: number; // SỐ LƯỢNG
  sessions: number | null; // SỐ BUỔI
  unitPrice: number; // ĐƠN GIÁ
  amount: number; // THÀNH TIỀN — source of truth, override-capable (0đ case)
  isAmountOverridden?: boolean; // builder hint only
};

export type QuoteSection = {
  id: string;
  title: string; // e.g. "Ngày 03.07 (09h00 - 21h00)"
  items: QuoteItem[];
};

export type QuoteBlock = {
  id: string;
  title: string; // e.g. "ĐIỀU KHOẢN & ĐIỀU KIỆN"
  lines: string[]; // each line may contain a "**Nhãn:** nội dung" bold lead-in
};

export type QuoteRepresentative = {
  name: string;
  title: string; // e.g. "Account Manager"
};

export type QuoteFeedbackConfig = {
  prompt: string;
  options: string[];
};

export type QuoteContent = {
  company: QuoteCompany;
  recipient: QuoteRecipient;
  sections: QuoteSection[];
  blocks: QuoteBlock[];
  representative: QuoteRepresentative;
  feedback: QuoteFeedbackConfig;
};

// Serialized form sent to client components / JSON responses (Decimals -> number,
// Dates -> ISO strings, representative S3 key resolved to a public URL).
export type QuoteDTO = {
  id: string;
  quoteNumber: string;
  token: string;
  recipientName: string;
  status: QuoteStatus;
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  issueDate: string; // YYYY-MM-DD
  validUntil: string | null; // YYYY-MM-DD
  content: QuoteContent;
  customerFeedback: string | null;
  feedbackComment: string | null;
  respondedAt: string | null;
  viewedAt: string | null;
  representativeKey: string | null;
  representativeUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// Payload the admin builder sends to create/update a quote.
export type QuoteInput = {
  recipientName: string;
  status?: QuoteStatus;
  discount: number;
  taxRate: number;
  issueDate: string; // YYYY-MM-DD
  validUntil: string | null;
  content: QuoteContent;
  representativeKey: string | null;
};
