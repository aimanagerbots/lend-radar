"use client";

import { useState, Fragment } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ExpandedState,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  expandedContent?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 25,
  expandedContent,
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: expandedContent ? getExpandedRowModel() : undefined,
    initialState: { pagination: { pageSize } },
  });

  const currentPage = table.getState().pagination.pageIndex;
  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, data.length);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-zinc-800 bg-zinc-900/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500",
                      header.column.getCanSort() && "cursor-pointer select-none hover:text-zinc-300"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-zinc-600">
                          {header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <Fragment key={row.id}>
                <tr
                  className={cn(
                    "animate-fade-in-up border-b border-zinc-800/50 transition-colors duration-100",
                    i % 2 === 0 ? "bg-transparent" : "bg-zinc-900/20",
                    "hover:bg-zinc-800/30",
                    expandedContent && "cursor-pointer"
                  )}
                  onClick={() => expandedContent && row.toggleExpanded()}
                  style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {expandedContent && row.getIsExpanded() && (
                  <tr>
                    <td colSpan={columns.length} className="bg-zinc-900/40 px-6 py-4">
                      {expandedContent(row.original)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-xs text-zinc-500">
          Showing {start}-{end} of {data.length}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-md border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-800 disabled:opacity-30"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-md border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-800 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
