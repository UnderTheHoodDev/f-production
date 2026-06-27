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
import { Textarea } from "@/components/ui/textarea";
import type { QuoteBlock } from "@/lib/quotes/types";
import type { BuilderAction } from "./builder-reducer";

function BlockRow({
  block,
  dispatch,
}: {
  block: QuoteBlock;
  dispatch: React.Dispatch<BuilderAction>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      data-dragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="space-y-2 rounded-md border bg-card p-3 data-[dragging=true]:opacity-80"
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
          <span className="sr-only">Kéo để sắp xếp</span>
        </Button>
        <Input
          aria-label="Tiêu đề khối"
          placeholder="Tiêu đề (vd: ĐIỀU KHOẢN & ĐIỀU KIỆN)"
          value={block.title}
          onChange={(e) =>
            dispatch({ type: "EDIT_BLOCK", blockId: block.id, patch: { title: e.target.value } })
          }
          className="font-medium"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-destructive hover:text-destructive"
          onClick={() => dispatch({ type: "REMOVE_BLOCK", blockId: block.id })}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Xóa khối</span>
        </Button>
      </div>
      <Textarea
        aria-label="Nội dung khối"
        placeholder="Mỗi dòng là 1 gạch đầu dòng. Dùng **chữ đậm:** để in đậm đầu dòng."
        rows={3}
        value={block.lines.join("\n")}
        onChange={(e) =>
          dispatch({
            type: "EDIT_BLOCK",
            blockId: block.id,
            patch: { lines: e.target.value.split("\n") },
          })
        }
      />
    </div>
  );
}

export function QuoteBlocksEditor({
  blocks,
  dispatch,
}: {
  blocks: QuoteBlock[];
  dispatch: React.Dispatch<BuilderAction>;
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const ids = React.useMemo(() => blocks.map((b) => b.id), [blocks]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch({ type: "REORDER_BLOCKS", blocks: arrayMove(blocks, oldIndex, newIndex) });
      }
    }
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {blocks.map((block) => (
              <BlockRow key={block.id} block={block} dispatch={dispatch} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => dispatch({ type: "ADD_BLOCK" })}
      >
        <Plus className="mr-1 size-4" />
        Thêm khối thông tin
      </Button>
    </div>
  );
}
