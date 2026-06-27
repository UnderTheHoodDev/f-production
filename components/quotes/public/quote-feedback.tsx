"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function QuoteFeedback({
  token,
  prompt,
  options,
  initial,
  disabled,
}: {
  token: string;
  prompt: string;
  options: string[];
  initial: string | null;
  disabled?: boolean;
}) {
  const [selected, setSelected] = React.useState<string | null>(initial);
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(Boolean(initial));
  const [error, setError] = React.useState<string | null>(null);

  if (!prompt || options.length === 0) return null;

  async function submit(option: string, note: string) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/q/${token}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option, comment: note }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.message || "Không thể gửi phản hồi.");
        return;
      }
      setSelected(option);
      setDone(true);
    } catch {
      setError("Không thể gửi phản hồi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-center text-lg font-bold text-orange-600">{prompt}</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled || submitting}
              onClick={() => submit(option, comment)}
              data-active={active}
              className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors data-[active=true]:border-orange-500 data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {active ? <Check className="size-4 shrink-0" /> : null}
              {option}
            </button>
          );
        })}
      </div>

      {error ? <p className="mt-3 text-center text-sm text-red-600">{error}</p> : null}

      {done ? (
        <div className="mt-5 space-y-3">
          <p className="text-center text-sm font-medium text-teal-700">
            Cảm ơn phản hồi của bạn!
          </p>
          {!disabled ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Thêm ghi chú cho chúng tôi (không bắt buộc)..."
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={submitting || !selected}
                  onClick={() => selected && submit(selected, comment)}
                >
                  {submitting ? (
                    <Loader2 className="mr-1 size-4 animate-spin" />
                  ) : null}
                  Gửi ghi chú
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
