"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Event = {
  id: string
  title: string
  place: string | null
  client: string | null
  description: string | null
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
}

type EventsTableProps = {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
}

export function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<Event>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          const isAllSelected = table.getIsAllPageRowsSelected()
          const isSomeSelected = table.getIsSomePageRowsSelected()
          return (
            <Checkbox
              checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          )
        },
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Tiêu đề
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("title")}</div>
        ),
      },
      {
        accessorKey: "client",
        header: "Khách hàng",
        cell: ({ row }) => (
          <div>{row.getValue("client") || <span className="text-muted-foreground">—</span>}</div>
        ),
      },
      {
        accessorKey: "place",
        header: "Địa điểm",
        cell: ({ row }) => (
          <div>{row.getValue("place") || <span className="text-muted-foreground">—</span>}</div>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Ngày bắt đầu",
        cell: ({ row }) => {
          const date = row.getValue<Date | null>("startDate")
          return (
            <div>
              {date
                ? new Date(date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : <span className="text-muted-foreground">—</span>}
            </div>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Ngày tạo
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const date = row.getValue<Date>("createdAt")
          return (
            <div className="text-sm">
              {new Date(date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const event = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(event)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (
                      confirm(
                        `Bạn có chắc chắn muốn xóa sự kiện "${event.title}"?`
                      )
                    ) {
                      onDelete(event.id)
                    }
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onEdit, onDelete]
  )

  const table = useReactTable({
    data: events,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Lọc theo tiêu đề..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} trong{" "}
          {table.getFilteredRowModel().rows.length} dòng được chọn.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}

