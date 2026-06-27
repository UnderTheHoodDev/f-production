"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatVND } from "@/lib/quotes/format";
import type { QuoteStatus } from "@/lib/quotes/types";
import { QuoteStatusBadge } from "./quote-status-badge";

export type QuoteListItem = {
  id: string;
  quoteNumber: string;
  token: string;
  recipientName: string;
  status: QuoteStatus;
  total: number;
  issueDate: string | null;
  customerFeedback: string | null;
  respondedAt: string | null;
  createdAt: string;
};

type Props = {
  quotes: QuoteListItem[];
  onDelete: (id: string) => void;
};

export function QuotesTable({ quotes, onDelete }: Props) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const copyLink = React.useCallback((token: string) => {
    const url = `${window.location.origin}/q/${token}`;
    navigator.clipboard?.writeText(url).then(
      () => alert(`Đã sao chép link: ${url}`),
      () => window.prompt("Sao chép link báo giá:", url)
    );
  }, []);

  const columns = React.useMemo<ColumnDef<QuoteListItem>[]>(
    () => [
      {
        accessorKey: "quoteNumber",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số báo giá
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("quoteNumber")}</span>
        ),
      },
      {
        accessorKey: "recipientName",
        header: "Khách hàng",
        cell: ({ row }) => <span>{row.getValue("recipientName")}</span>,
      },
      {
        accessorKey: "total",
        header: () => <div className="text-right">Tổng tiền</div>,
        cell: ({ row }) => (
          <div className="text-right font-medium">{formatVND(row.getValue("total"))}</div>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Trạng thái</div>,
        cell: ({ row }) => (
          <div className="flex flex-col items-center gap-1">
            <QuoteStatusBadge status={row.getValue("status")} />
            {row.original.customerFeedback ? (
              <span className="max-w-[160px] truncate text-xs text-muted-foreground">
                {row.original.customerFeedback}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "issueDate",
        header: () => <div className="text-center">Ngày lập</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm">
            {formatDate(row.getValue("issueDate"))}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-right">Thao tác</div>,
        cell: ({ row }) => {
          const q = row.original;
          return (
            <div className="text-right">
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
                  <DropdownMenuItem onClick={() => router.push(`/admin/quotes/${q.id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyLink(q.token)}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Sao chép link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.open(`/api/admin/quotes/${q.id}/pdf`, "_blank")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Tải PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.open(`/api/admin/quotes/${q.id}/xlsx`, "_blank")}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Tải Excel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      if (confirm(`Xóa báo giá "${q.quoteNumber}"?`)) onDelete(q.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [router, copyLink, onDelete]
  );

  const table = useReactTable({
    data: quotes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Lọc theo khách hàng..."
          value={(table.getColumn("recipientName")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("recipientName")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Chưa có báo giá nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Tổng: {table.getFilteredRowModel().rows.length} báo giá
        </div>
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
  );
}
