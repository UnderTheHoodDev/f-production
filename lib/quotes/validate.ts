// Parse & normalize the builder payload before it touches the DB. Coerces money
// to non-negative integers, trims strings, guarantees stable ids, and validates
// required fields. Totals are computed separately (calc.ts) — never trusted here.

import { randomUUID } from "crypto";

import type {
  QuoteBlock,
  QuoteContent,
  QuoteItem,
  QuoteSection,
  QuoteStatus,
} from "./types";

const STATUSES: QuoteStatus[] = ["DRAFT", "SENT", "VIEWED", "RESPONDED"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type NormalizedQuote = {
  recipientName: string;
  status: QuoteStatus | undefined;
  discount: number;
  taxRate: number;
  issueDate: string;
  validUntil: string | null;
  representativeKey: string | null;
  content: QuoteContent;
};

export type ParseResult =
  | { ok: true; value: NormalizedQuote }
  | { ok: false; error: string };

const str = (v: unknown, max = 2000): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const posInt = (v: unknown): number => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const nonNegInt = (v: unknown): number => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

function normItem(raw: unknown): QuoteItem {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(o.id, 64) || randomUUID(),
    name: str(o.name, 300),
    unit: str(o.unit, 60),
    qty: posInt(o.qty) || 1,
    sessions: o.sessions == null || o.sessions === "" ? null : nonNegInt(o.sessions),
    unitPrice: nonNegInt(o.unitPrice),
    amount: nonNegInt(o.amount),
  };
}

function normSection(raw: unknown): QuoteSection {
  const o = (raw ?? {}) as Record<string, unknown>;
  const items = Array.isArray(o.items) ? o.items.map(normItem) : [];
  return {
    id: str(o.id, 64) || randomUUID(),
    title: str(o.title, 300),
    items: items.length ? items : [normItem({})],
  };
}

function normBlock(raw: unknown): QuoteBlock {
  const o = (raw ?? {}) as Record<string, unknown>;
  const lines = Array.isArray(o.lines)
    ? o.lines.map((l) => str(l, 1000)).filter((l) => l.length > 0)
    : [];
  return {
    id: str(o.id, 64) || randomUUID(),
    title: str(o.title, 200),
    lines,
  };
}

export function parseQuoteInput(body: unknown): ParseResult {
  const b = (body ?? {}) as Record<string, unknown>;
  const rawContent = (b.content ?? {}) as Record<string, unknown>;

  const company = (rawContent.company ?? {}) as Record<string, unknown>;
  const recipient = (rawContent.recipient ?? {}) as Record<string, unknown>;
  const representative = (rawContent.representative ?? {}) as Record<string, unknown>;
  const feedback = (rawContent.feedback ?? {}) as Record<string, unknown>;

  const recipientName = str(recipient.name, 300);
  if (!recipientName) {
    return { ok: false, error: "Tên người nhận (Kính gửi) là bắt buộc." };
  }

  const sections = Array.isArray(rawContent.sections)
    ? rawContent.sections.map(normSection)
    : [];
  if (sections.length === 0) {
    return { ok: false, error: "Báo giá cần ít nhất 1 hạng mục." };
  }

  const options = Array.isArray(feedback.options)
    ? feedback.options.map((o) => str(o, 200)).filter((o) => o.length > 0)
    : [];

  const content: QuoteContent = {
    company: {
      name: str(company.name, 200),
      taxCode: str(company.taxCode, 60),
      address: str(company.address, 400),
      email: str(company.email, 200),
      hotline: str(company.hotline, 60),
      logoUrl: str(company.logoUrl, 500) || undefined,
    },
    recipient: {
      salutation: str(recipient.salutation, 60) || "Kính gửi",
      name: recipientName,
      intro: str(recipient.intro, 1000),
    },
    sections,
    blocks: Array.isArray(rawContent.blocks)
      ? rawContent.blocks.map(normBlock).filter((blk) => blk.title || blk.lines.length)
      : [],
    representative: {
      name: str(representative.name, 200),
      title: str(representative.title, 200),
    },
    feedback: {
      prompt: str(feedback.prompt, 500),
      options,
    },
  };

  const issueDateRaw = str(b.issueDate, 10);
  const issueDate = DATE_RE.test(issueDateRaw)
    ? issueDateRaw
    : new Date().toISOString().slice(0, 10);

  const validUntilRaw = str(b.validUntil, 10);
  const validUntil = DATE_RE.test(validUntilRaw) ? validUntilRaw : null;

  const statusRaw = str(b.status, 20) as QuoteStatus;
  const status = STATUSES.includes(statusRaw) ? statusRaw : undefined;

  return {
    ok: true,
    value: {
      recipientName,
      status,
      discount: nonNegInt(b.discount),
      taxRate: Math.min(Math.max(Number(b.taxRate) || 0, 0), 100),
      issueDate,
      validUntil,
      representativeKey: str(b.representativeKey, 500) || null,
      content,
    },
  };
}
