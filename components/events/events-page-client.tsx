"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EventsTable, type Event } from "@/components/events/events-table"
import { EventFormDrawer } from "@/components/events/event-form-drawer"

type EventsPageClientProps = {
  initialEvents: Event[]
}

export function EventsPageClient({ initialEvents }: EventsPageClientProps) {
  const router = useRouter()
  const [events, setEvents] = React.useState<Event[]>(initialEvents)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null)

  // Sync với server data khi router refresh
  React.useEffect(() => {
    const handleRefresh = () => {
      fetch("/api/admin/events")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEvents(data.events)
          }
        })
        .catch(console.error)
    }

    // Listen cho custom event từ drawer
    window.addEventListener("event-updated", handleRefresh)
    
    // Cleanup
    return () => {
      window.removeEventListener("event-updated", handleRefresh)
    }
  }, [])

  const handleCreate = () => {
    setEditingEvent(null)
    setIsDrawerOpen(true)
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setIsDrawerOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        router.refresh()
        setEvents((prev) => prev.filter((e) => e.id !== id))
      } else {
        alert(result.message || "Không thể xóa sự kiện.")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Không thể xóa sự kiện.")
    }
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setEditingEvent(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý sự kiện</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các sự kiện chụp ảnh và studio
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo sự kiện mới
        </Button>
      </div>

      <EventsTable
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EventFormDrawer
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open)
          if (!open) {
            setEditingEvent(null)
            // Refresh data khi đóng drawer
            fetch("/api/admin/events")
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  setEvents(data.events)
                }
              })
              .catch(console.error)
          }
        }}
        event={editingEvent}
      />
    </div>
  )
}

