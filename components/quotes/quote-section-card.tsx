"use client";

import * as React from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVND } from "@/lib/quotes/format";
import { sectionSubtotal } from "@/lib/quotes/calc";
import type { QuoteItem, QuoteSection } from "@/lib/quotes/types";
import type { BuilderAction } from "./builder-reducer";

const num = (v: string): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function ItemRow({
  sectionId,
  item,
  dispatch,
  canRemove,
}: {
  sectionId: string;
  item: QuoteItem;
  dispatch: React.Dispatch<BuilderAction>;
  canRemove: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const edit = (patch: Partial<QuoteItem>) =>
    dispatch({ type: "EDIT_ITEM", sectionId, itemId: item.id, patch });

  return (
    <div
      ref={setNodeRef}
      data-dragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="grid grid-cols-2 items-end gap-2 rounded-md border bg-card p-2 data-[dragging=true]:opacity-80 md:grid-cols-12"
    >
      <div className="col-span-2 flex items-center gap-1 md:col-span-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
          <span className="sr-only">Kéo để sắp xếp</span>
        </Button>
        <Input
          aria-label="Hạng mục"
          placeholder="Hạng mục"
          value={item.name}
          onChange={(e) => edit({ name: e.target.value })}
        />
      </div>
      <div className="md:col-span-1">
        <Input
          aria-label="Đơn vị tính"
          placeholder="ĐVT"
          value={item.unit}
          onChange={(e) => edit({ unit: e.target.value })}
        />
      </div>
      <div className="md:col-span-1">
        <Input
          aria-label="Số lượng"
          type="number"
          min={0}
          value={item.qty}
          onChange={(e) => edit({ qty: num(e.target.value) })}
        />
      </div>
      <div className="md:col-span-1">
        <Input
          aria-label="Số buổi"
          type="number"
          min={0}
          value={item.sessions ?? ""}
          onChange={(e) =>
            edit({ sessions: e.target.value === "" ? null : num(e.target.value) })
          }
        />
      </div>
      <div className="md:col-span-2">
        <Input
          aria-label="Đơn giá"
          type="number"
          min={0}
          value={item.unitPrice}
          onChange={(e) => edit({ unitPrice: num(e.target.value) })}
        />
      </div>
      <div className="md:col-span-2">
        <Input
          aria-label="Thành tiền"
          type="number"
          min={0}
          value={item.amount}
          onChange={(e) => edit({ amount: num(e.target.value) })}
        />
      </div>
      <div className="flex justify-end md:col-span-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          disabled={!canRemove}
          onClick={() =>
            dispatch({ type: "REMOVE_ITEM", sectionId, itemId: item.id })
          }
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Xóa dòng</span>
        </Button>
      </div>
    </div>
  );
}

export function QuoteSectionCard({
  section,
  dispatch,
  canRemove,
}: {
  section: QuoteSection;
  dispatch: React.Dispatch<BuilderAction>;
  canRemove: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const itemIds = React.useMemo(() => section.items.map((i) => i.id), [section.items]);

  function handleItemDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(active.id as string);
      const newIndex = itemIds.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch({
          type: "REORDER_ITEMS",
          sectionId: section.id,
          items: arrayMove(section.items, oldIndex, newIndex),
        });
      }
    }
  }

  return (
    <div
      ref={setNodeRef}
      data-dragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="space-y-3 rounded-lg border bg-muted/30 p-3 data-[dragging=true]:opacity-80"
    >
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
          <span className="sr-only">Kéo để sắp xếp nhóm</span>
        </Button>
        <Input
          aria-label="Tên nhóm hạng mục"
          placeholder="Tên nhóm (vd: Ngày 03.07 (09h00 - 21h00))"
          value={section.title}
          onChange={(e) =>
            dispatch({ type: "RENAME_SECTION", sectionId: section.id, title: e.target.value })
          }
          className="font-medium"
        />
        <span className="hidden whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 sm:inline">
          {formatVND(sectionSubtotal(section))}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-destructive hover:text-destructive"
          disabled={!canRemove}
          onClick={() => dispatch({ type: "REMOVE_SECTION", sectionId: section.id })}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Xóa nhóm</span>
        </Button>
      </div>

      {/* Column headers (md+) so it's clear what each input is */}
      <div className="hidden grid-cols-12 gap-2 px-2 text-xs font-medium text-muted-foreground md:grid">
        <div className="col-span-4 pl-9">Hạng mục</div>
        <div className="col-span-1">ĐVT</div>
        <div className="col-span-1">Số lượng</div>
        <div className="col-span-1">Số buổi</div>
        <div className="col-span-2">Đơn giá</div>
        <div className="col-span-2">Thành tiền</div>
        <div className="col-span-1" />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleItemDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {section.items.map((item) => (
              <ItemRow
                key={item.id}
                sectionId={section.id}
                item={item}
                dispatch={dispatch}
                canRemove={section.items.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => dispatch({ type: "ADD_ITEM", sectionId: section.id })}
      >
        <Plus className="mr-1 size-4" />
        Thêm dòng
      </Button>
    </div>
  );
}
