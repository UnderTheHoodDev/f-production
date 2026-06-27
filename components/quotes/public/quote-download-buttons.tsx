import { Download, FileSpreadsheet } from "lucide-react";

export function QuoteDownloadButtons({ token }: { token: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 pb-4 sm:flex-row">
      <a
        href={`/api/q/${token}/pdf`}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
      >
        <Download className="size-4" />
        Tải báo giá PDF
      </a>
      <a
        href={`/api/q/${token}/xlsx`}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        <FileSpreadsheet className="size-4" />
        Tải báo giá Excel
      </a>
    </div>
  );
}
