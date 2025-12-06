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
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Event = {
  id: string;
  title: string;
};

type ServiceEventTableProps = {
  serviceId: string;
  events: Event[];
  eventOrder: string[];
  allEvents: Event[];
  onOrderChange: (serviceId: string, newOrder: string[]) => void;
};

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="text-muted-foreground size-4" />
      <span className="sr-only">Kéo để sắp xếp</span>
    </Button>
  );
}

function DraggableRow({
  row,
  onDelete,
}: {
  row: { id: string; title: string };
  onDelete: (id: string) => void;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <TableCell className="w-12">
        <DragHandle id={row.id} />
      </TableCell>
      <TableCell className="font-medium">{row.title}</TableCell>
      <TableCell className="w-12 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(row.id)}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Xóa sự kiện</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ServiceEventTable({
  serviceId,
  events,
  eventOrder,
  allEvents,
  onOrderChange,
}: ServiceEventTableProps) {
  const [localEventOrder, setLocalEventOrder] = React.useState(eventOrder);
  const [selectedEventId, setSelectedEventId] = React.useState<string>("");

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Map eventOrder to actual event objects
  const orderedEvents = React.useMemo(() => {
    return localEventOrder
      .map((id) => events.find((e) => e.id === id))
      .filter((e): e is Event => e !== undefined);
  }, [localEventOrder, events]);

  // Get available events (not already in the service)
  const availableEvents = React.useMemo(() => {
    return allEvents.filter((e) => !localEventOrder.includes(e.id));
  }, [allEvents, localEventOrder]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => localEventOrder || [],
    [localEventOrder]
  );

  React.useEffect(() => {
    setLocalEventOrder(eventOrder);
  }, [eventOrder]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id as string);
      const newIndex = dataIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(localEventOrder, oldIndex, newIndex);
        setLocalEventOrder(newOrder);
        onOrderChange(serviceId, newOrder);
      }
    }
  }

  function handleAddEvent() {
    if (!selectedEventId) return;

    const newOrder = [...localEventOrder, selectedEventId];
    setLocalEventOrder(newOrder);
    onOrderChange(serviceId, newOrder);
    setSelectedEventId("");
  }

  function handleDeleteEvent(eventId: string) {
    const newOrder = localEventOrder.filter((id) => id !== eventId);
    setLocalEventOrder(newOrder);
    onOrderChange(serviceId, newOrder);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn sự kiện để thêm" />
          </SelectTrigger>
          <SelectContent>
            {availableEvents.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Không còn sự kiện nào
              </div>
            ) : (
              availableEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAddEvent}
          disabled={!selectedEventId}
          size="sm"
          variant="outline"
        >
          <Plus className="size-4" />
          Thêm
        </Button>
      </div>

      {orderedEvents.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Chưa có sự kiện nào. Hãy thêm sự kiện từ dropdown phía trên.
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Tên sự kiện</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedEvents.map((event) => (
                    <DraggableRow
                      key={event.id}
                      row={event}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      )}
    </div>
  );
}

