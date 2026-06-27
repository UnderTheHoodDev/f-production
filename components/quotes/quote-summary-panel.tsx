"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { computeTotals } from "@/lib/quotes/calc";
import { formatVND } from "@/lib/quotes/format";
import type { BuilderState, BuilderAction } from "./builder-reducer";

const num = (v: string): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function QuoteSummaryPanel({
  state,
  dispatch,
}: {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}) {
  const totals = React.useMemo(
    () =>
      computeTotals({
        content: state.content,
        discount: state.discount,
        taxRate: state.taxRate,
      }),
    [state.content, state.discount, state.taxRate]
  );

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Cộng tiền dịch vụ</span>
        <span data-testid="summary-subtotal" className="font-medium">
          {formatVND(totals.subtotal)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field>
          <FieldLabel htmlFor="discount">Giảm giá (đ)</FieldLabel>
          <Input
            id="discount"
            type="number"
            min={0}
            value={state.discount}
            onChange={(e) =>
              dispatch({ type: "SET_META", field: "discount", value: num(e.target.value) })
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="taxRate">Thuế GTGT (%)</FieldLabel>
          <Input
            id="taxRate"
            type="number"
            min={0}
            max={100}
            value={state.taxRate}
            onChange={(e) =>
              dispatch({ type: "SET_META", field: "taxRate", value: num(e.target.value) })
            }
          />
        </Field>
      </div>

      {totals.discount > 0 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Giảm giá</span>
          <span className="font-medium">-{formatVND(totals.discount)}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Thuế GTGT {totals.taxRate}%</span>
        <span data-testid="summary-tax" className="font-medium">
          {formatVND(totals.taxAmount)}
        </span>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <span className="font-semibold">Tổng thanh toán</span>
        <span data-testid="summary-total" className="text-lg font-bold text-primary">
          {formatVND(totals.total)}
        </span>
      </div>
    </div>
  );
}
