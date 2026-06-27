// Shared VND / date formatting so the web view, PDF and Excel never drift.

const vndGroup = new Intl.NumberFormat("vi-VN");

/** Group digits with "." and append "đ", e.g. 45900000 -> "45.900.000đ". */
export function formatVND(n: number): string {
  return `${vndGroup.format(Math.round(Number(n) || 0))}đ`;
}

/** Grouped number without the currency suffix, e.g. 45900000 -> "45.900.000". */
export function formatNumber(n: number): string {
  return vndGroup.format(Math.round(Number(n) || 0));
}

/** Format a YYYY-MM-DD (or ISO) string as dd/MM/yyyy in ICT. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  // Accept "YYYY-MM-DD" directly to avoid timezone drift.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(d);
}

/** Format a Date/ISO timestamp as dd/MM/yyyy HH:mm in ICT (for admin display). */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(d);
}
