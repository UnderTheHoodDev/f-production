import { formatDate, formatVND } from "@/lib/quotes/format";
import type { QuoteDoc } from "@/lib/quotes/view-model";
import { RichText } from "./rich-text";

export function QuoteDocument({
  doc,
  expired,
}: {
  doc: QuoteDoc;
  expired?: boolean;
}) {
  const { company, recipient, sections, blocks, totals, representative } = doc;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <header className="flex flex-col gap-4 bg-slate-50 px-6 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <div>
          {company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logoUrl}
              alt={company.name}
              className="mb-3 h-16 w-auto object-contain"
            />
          ) : null}
          <h1 className="text-2xl font-bold text-slate-800">Báo giá dịch vụ</h1>
        </div>
        <div className="text-sm sm:text-right">
          <p className="font-bold text-slate-800">{company.name}</p>
          {company.taxCode ? (
            <p className="text-xs text-slate-500">MST: {company.taxCode}</p>
          ) : null}
          {company.address ? (
            <p className="text-xs text-slate-500">Địa chỉ: {company.address}</p>
          ) : null}
          <p className="text-xs text-slate-500">
            {[
              company.email && `Email: ${company.email}`,
              company.hotline && `Hotline: ${company.hotline}`,
            ]
              .filter(Boolean)
              .join(" | ")}
          </p>
          <p className="mt-1 font-bold text-slate-800">#{doc.quoteNumber}</p>
        </div>
      </header>

      <div className="px-6 py-6 sm:px-10">
        {expired ? (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
            Báo giá đã hết hiệu lực.
          </div>
        ) : null}

        {/* Recipient */}
        <p className="text-base font-bold text-slate-800">
          {recipient.salutation}: {recipient.name}
        </p>
        {recipient.intro ? (
          <p className="mt-1 text-slate-600">{recipient.intro}</p>
        ) : null}

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-2 text-left font-semibold">Hạng mục</th>
                <th className="px-2 py-2 text-center font-semibold">ĐVT</th>
                <th className="px-2 py-2 text-center font-semibold">Số lượng</th>
                <th className="px-2 py-2 text-center font-semibold">Số buổi</th>
                <th className="px-2 py-2 text-right font-semibold">Đơn giá</th>
                <th className="py-2 pl-2 text-right font-semibold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, si) => (
                <SectionRows key={si} section={section} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Cộng tiền dịch vụ</span>
              <span className="font-medium text-slate-800">
                {formatVND(totals.subtotal)}
              </span>
            </div>
            {totals.discount > 0 ? (
              <div className="flex justify-between">
                <span className="text-slate-600">Giảm giá</span>
                <span className="font-medium text-slate-800">
                  -{formatVND(totals.discount)}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-slate-600">Thuế GTGT {Number(totals.taxRate)}%</span>
              <span className="font-medium text-slate-800">
                {formatVND(totals.taxAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="font-bold text-slate-800">Tổng thanh toán</span>
              <span className="text-lg font-bold text-teal-800">
                {formatVND(totals.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Info blocks */}
        {blocks.length > 0 ? (
          <div className="mt-8 space-y-4 rounded-lg bg-slate-50 p-5">
            {blocks.map((block) => (
              <div key={block.id}>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">
                  {block.title}
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {block.lines.map((line, li) => (
                    <li key={li} className="flex gap-2">
                      <span className="text-slate-400">•</span>
                      <span>
                        <RichText text={line} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {/* Signature footer */}
        <div className="mt-10 flex flex-col items-end text-right">
          {doc.issueDate ? (
            <p className="text-sm text-slate-600">Ngày lập: {formatDate(doc.issueDate)}</p>
          ) : null}
          {doc.representativeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doc.representativeUrl}
              alt="Chữ ký"
              className="mt-2 h-16 w-auto object-contain"
            />
          ) : null}
          {representative.name ? (
            <p className="mt-1 font-bold text-slate-800">{representative.name}</p>
          ) : null}
          {representative.title ? (
            <p className="text-xs text-slate-500">{representative.title}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SectionRows({ section }: { section: QuoteDoc["sections"][number] }) {
  return (
    <>
      <tr className="bg-slate-50">
        <td colSpan={6} className="px-1 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase text-slate-700">
              {section.title}
            </span>
            <span className="whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              {formatVND(section.subtotal)}
            </span>
          </div>
        </td>
      </tr>
      {section.items.map((item) => (
        <tr key={item.id} className="border-b border-slate-100 last:border-0">
          <td className="py-3 pr-2 pl-4 text-slate-700">{item.name}</td>
          <td className="px-2 py-3 text-center text-slate-700">{item.unit}</td>
          <td className="px-2 py-3 text-center text-slate-700">{item.qty}</td>
          <td className="px-2 py-3 text-center text-slate-700">{item.sessions ?? ""}</td>
          <td className="px-2 py-3 text-right text-slate-700">
            {formatVND(item.unitPrice)}
          </td>
          <td className="py-3 pl-2 text-right font-medium text-slate-800">
            {formatVND(item.amount)}
          </td>
        </tr>
      ))}
    </>
  );
}
