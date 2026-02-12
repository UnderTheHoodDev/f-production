"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
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

export type Partner = {
    id: string
    name: string
    logoKey: string | null
    logoUrl?: string
    order: number
    createdAt: Date
    updatedAt: Date
}

type PartnersTableProps = {
    partners: Partner[]
    onEdit: (partner: Partner) => void
    onDelete: (id: string) => void
}

export function PartnersTable({ partners, onEdit, onDelete }: PartnersTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const getColumnHeadClass = (columnId: string) => {
        if (columnId === "logoUrl") return "w-[110px] text-center"
        if (columnId === "createdAt") return "w-[180px] text-center"
        if (columnId === "actions") return "w-[90px] text-right"
        return "text-left"
    }
    const getColumnCellClass = (columnId: string) => {
        if (columnId === "logoUrl") return "text-center"
        if (columnId === "createdAt") return "text-center"
        if (columnId === "actions") return "text-right"
        return "text-left"
    }

    const columns: ColumnDef<Partner>[] = React.useMemo(
        () => [
            {
                accessorKey: "logoUrl",
                header: () => <div className="text-center">Logo</div>,
                cell: ({ row }) => {
                    const logoUrl = row.getValue<string | undefined>("logoUrl")
                    return (
                        <div className="flex items-center justify-center">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={row.original.name}
                                    className="h-10 w-10 rounded-md object-contain border bg-white"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                    N/A
                                </div>
                            )}
                        </div>
                    )
                },
                enableSorting: false,
            },
            {
                accessorKey: "name",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Tên đối tác
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("name")}</div>
                ),
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="mx-auto h-auto p-0"
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
                header: () => <div className="text-right">Thao tác</div>,
                cell: ({ row }) => {
                    const partner = row.original
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
                                    <span className="sr-only">Mở menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onEdit(partner)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (
                                            confirm(
                                                `Bạn có chắc chắn muốn xóa đối tác "${partner.name}"?`
                                            )
                                        ) {
                                            onDelete(partner.id)
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
        data: partners,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Lọc theo tên..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
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
                                        <TableHead
                                            key={header.id}
                                            className={getColumnHeadClass(header.column.id)}
                                        >
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
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={getColumnCellClass(cell.column.id)}
                                        >
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
                                    Chưa có đối tác nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    Tổng: {table.getFilteredRowModel().rows.length} đối tác
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
