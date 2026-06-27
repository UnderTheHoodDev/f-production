import * as React from "react";

const URL_RE = /(https?:\/\/[^\s]+)/g;

/** Render a line with **bold** lead-ins and clickable URLs (orange). */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = i % 2 === 1;
        const segs = part.split(URL_RE);
        return segs.map((seg, j) => {
          if (/^https?:\/\//.test(seg)) {
            return (
              <a
                key={`${i}-${j}`}
                href={seg}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-orange-600 underline"
              >
                {seg}
              </a>
            );
          }
          if (!seg) return null;
          return bold ? (
            <strong key={`${i}-${j}`} className="font-semibold text-slate-900">
              {seg}
            </strong>
          ) : (
            <React.Fragment key={`${i}-${j}`}>{seg}</React.Fragment>
          );
        });
      })}
    </>
  );
}
