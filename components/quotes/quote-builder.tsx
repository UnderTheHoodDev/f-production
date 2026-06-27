"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createDefaultContent } from "@/lib/constants/company";
import type { QuoteDTO, QuoteInput, QuoteStatus } from "@/lib/quotes/types";
import { builderReducer, type BuilderState } from "./builder-reducer";
import { QuoteBlocksEditor } from "./quote-blocks-editor";
import { QuoteFeedbackEditor } from "./quote-feedback-editor";
import { QuoteMetaFields } from "./quote-meta-fields";
import { QuoteSectionCard } from "./quote-section-card";
import { QuoteSummaryPanel } from "./quote-summary-panel";

function initFromQuote(quote: QuoteDTO | null): BuilderState {
  if (!quote) {
    const today = new Date().toISOString().slice(0, 10);
    return {
      content: createDefaultContent(),
      discount: 0,
      taxRate: 8,
      issueDate: today,
      validUntil: "",
      representativeKey: null,
      representativeUrl: null,
    };
  }
  return {
    content: quote.content,
    discount: quote.discount,
    taxRate: quote.taxRate,
    issueDate: quote.issueDate,
    validUntil: quote.validUntil ?? "",
    representativeKey: quote.representativeKey,
    representativeUrl: quote.representativeUrl,
  };
}

export function QuoteBuilder({ quote }: { quote?: QuoteDTO | null }) {
  const router = useRouter();
  const isEdit = Boolean(quote);
  const [state, dispatch] = React.useReducer(
    builderReducer,
    quote ?? null,
    initFromQuote
  );
  const [saving, setSaving] = React.useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const sectionIds = React.useMemo(
    () => state.content.sections.map((s) => s.id),
    [state.content.sections]
  );

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = sectionIds.indexOf(active.id as string);
      const newIndex = sectionIds.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch({
          type: "REORDER_SECTIONS",
          sections: arrayMove(state.content.sections, oldIndex, newIndex),
        });
      }
    }
  }

  async function submit(status: QuoteStatus) {
    if (!state.content.recipient.name.trim()) {
      alert("Vui lòng nhập tên người nhận.");
      return;
    }
    setSaving(true);
    try {
      const payload: QuoteInput = {
        recipientName: state.content.recipient.name,
        status,
        discount: state.discount,
        taxRate: state.taxRate,
        issueDate: state.issueDate,
        validUntil: state.validUntil || null,
        content: state.content,
        representativeKey: state.representativeKey,
      };

      const url = isEdit ? `/api/admin/quotes/${quote!.id}` : "/api/admin/quotes";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) {
        alert(result.message || "Không thể lưu báo giá.");
        return;
      }
      router.push("/admin/quotes");
      router.refresh();
    } catch (err) {
      console.error("Save quote failed", err);
      alert("Không thể lưu báo giá.");
    } finally {
      setSaving(false);
    }
  }

  const existingStatus = quote?.status ?? "DRAFT";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            {isEdit ? `Sửa báo giá ${quote!.quoteNumber}` : "Tạo báo giá mới"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Điền thông tin, hạng mục và thông tin bổ sung cho báo giá.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/quotes")} disabled={saving}>
            Hủy
          </Button>
          {isEdit ? (
            <>
              <Button onClick={() => submit(existingStatus)} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              {existingStatus === "DRAFT" ? (
                <Button variant="secondary" onClick={() => submit("SENT")} disabled={saving}>
                  Xuất bản
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => submit("DRAFT")} disabled={saving}>
                Lưu nháp
              </Button>
              <Button onClick={() => submit("SENT")} disabled={saving}>
                {saving ? "Đang lưu..." : "Tạo & xuất bản"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold">Thông tin chung</h2>
            <QuoteMetaFields state={state} dispatch={dispatch} />
          </section>

          <section className="space-y-4 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Hạng mục báo giá</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "ADD_SECTION" })}
              >
                <Plus className="mr-1 size-4" />
                Thêm nhóm
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {state.content.sections.map((section) => (
                    <QuoteSectionCard
                      key={section.id}
                      section={section}
                      dispatch={dispatch}
                      canRemove={state.content.sections.length > 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>

          <section className="space-y-4 rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold">Thông tin bổ sung</h2>
            <QuoteBlocksEditor blocks={state.content.blocks} dispatch={dispatch} />
          </section>

          <section className="space-y-4 rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold">Phản hồi của khách</h2>
            <QuoteFeedbackEditor feedback={state.content.feedback} dispatch={dispatch} />
          </section>
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <QuoteSummaryPanel state={state} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}
