"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"

type EventFormData = {
  title: string
  place: string
  client: string
  description: string
  startDate: Date | undefined
  endDate: Date | undefined
}

type EventFormDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: {
    id: string
    title: string
    place: string | null
    client: string | null
    description: string | null
    startDate: Date | null
    endDate: Date | null
  } | null
}

export function EventFormDrawer({
  open,
  onOpenChange,
  event,
}: EventFormDrawerProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showStartCalendar, setShowStartCalendar] = React.useState(false)
  const [showEndCalendar, setShowEndCalendar] = React.useState(false)
  const startCalendarRef = React.useRef<HTMLDivElement>(null)
  const endCalendarRef = React.useRef<HTMLDivElement>(null)

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startCalendarRef.current &&
        !startCalendarRef.current.contains(event.target as Node)
      ) {
        setShowStartCalendar(false)
      }
      if (
        endCalendarRef.current &&
        !endCalendarRef.current.contains(event.target as Node)
      ) {
        setShowEndCalendar(false)
      }
    }

    if (showStartCalendar || showEndCalendar) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showStartCalendar, showEndCalendar])
  const [formData, setFormData] = React.useState<EventFormData>({
    title: "",
    place: "",
    client: "",
    description: "",
    startDate: undefined,
    endDate: undefined,
  })

  React.useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        place: event.place || "",
        client: event.client || "",
        description: event.description || "",
        startDate: event.startDate ? new Date(event.startDate) : undefined,
        endDate: event.endDate ? new Date(event.endDate) : undefined,
      })
    } else {
      setFormData({
        title: "",
        place: "",
        client: "",
        description: "",
        startDate: undefined,
        endDate: undefined,
      })
    }
  }, [event, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = event
        ? `/api/admin/events/${event.id}`
        : "/api/admin/events"
      const method = event ? "PUT" : "POST"

      const payload = {
        ...formData,
        startDate: formData.startDate
          ? formData.startDate.toISOString()
          : "",
        endDate: formData.endDate ? formData.endDate.toISOString() : "",
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        onOpenChange(false)
        // Revalidate và refresh để lấy data mới nhất
        router.refresh()
        // Trigger callback để parent component update state
        if (result.event) {
          // Dispatch custom event để EventsPageClient có thể listen
          window.dispatchEvent(new CustomEvent("event-updated", { detail: result.event }))
        }
      } else {
        alert(result.message || "Có lỗi xảy ra.")
      }
    } catch (error) {
      console.error("Error saving event:", error)
      alert("Không thể lưu sự kiện.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto px-6">
        <SheetHeader className="px-0">
          <SheetTitle>{event ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</SheetTitle>
          <SheetDescription>
            {event
              ? "Cập nhật thông tin sự kiện."
              : "Điền thông tin để tạo sự kiện mới."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6">
          <FieldGroup className="space-y-1 px-0">
            <Field>
              <FieldLabel htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ví dụ: Chụp ảnh sản phẩm mùa hè"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="client">Khách hàng</FieldLabel>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                placeholder="Tên khách hàng"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="place">Địa điểm</FieldLabel>
              <Input
                id="place"
                value={formData.place}
                onChange={(e) =>
                  setFormData({ ...formData, place: e.target.value })
                }
                placeholder="Địa điểm tổ chức"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="startDate">Ngày bắt đầu</FieldLabel>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowStartCalendar(!showStartCalendar)
                      setShowEndCalendar(false)
                    }}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "dd/MM/yyyy", { locale: vi })
                    ) : (
                      <span className="text-muted-foreground">Chọn ngày</span>
                    )}
                  </Button>
                  {showStartCalendar && (
                    <div
                      ref={startCalendarRef}
                      className="absolute z-10 mt-1 bg-background border rounded-md shadow-lg"
                    >
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => {
                          setFormData({ ...formData, startDate: date })
                          setShowStartCalendar(false)
                        }}
                        captionLayout="dropdown"
                        className="rounded-md border shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="endDate">Ngày kết thúc</FieldLabel>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEndCalendar(!showEndCalendar)
                      setShowStartCalendar(false)
                    }}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "dd/MM/yyyy", { locale: vi })
                    ) : (
                      <span className="text-muted-foreground">Chọn ngày</span>
                    )}
                  </Button>
                  {showEndCalendar && (
                    <div
                      ref={endCalendarRef}
                      className="absolute z-10 mt-1 bg-background border rounded-md shadow-lg"
                    >
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => {
                          setFormData({ ...formData, endDate: date })
                          setShowEndCalendar(false)
                        }}
                        captionLayout="dropdown"
                        className="rounded-md border shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="description">Mô tả</FieldLabel>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về sự kiện..."
                rows={4}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </Field>
          </FieldGroup>

          <SheetFooter className="mt-8 px-0 justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : event ? "Cập nhật" : "Tạo mới"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
