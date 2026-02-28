"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

// ─── Type Interfaces ────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: string[];
  filters?: DataTableFilter[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
  itemLabel?: string;
}

// ─── Sort State ──────────────────────────────────────────────────────────────

type SortDirection = "asc" | "desc" | null;

interface SortState {
  key: string | null;
  direction: SortDirection;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Safely reads a deeply nested value from an object using dot-notation path.
 * e.g. getNestedValue(row, "submittedBy.name") → row.submittedBy.name
 */
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => {
    return current != null ? current[key] : undefined;
  }, obj);
}

/**
 * Converts a value to a lower-case string for search comparison.
 */
function toSearchString(value: any): string {
  if (value == null) return "";
  return String(value).toLowerCase();
}

// ─── Page Size Options ───────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SortIconProps {
  columnKey: string;
  sortState: SortState;
}

function SortIcon({ columnKey, sortState }: SortIconProps) {
  if (sortState.key !== columnKey) {
    return <ArrowUpDown className="ml-1.5 inline-block size-3.5 text-muted-foreground/60" />;
  }
  if (sortState.direction === "asc") {
    return <ChevronUp className="ml-1.5 inline-block size-3.5 text-foreground" />;
  }
  if (sortState.direction === "desc") {
    return <ChevronDown className="ml-1.5 inline-block size-3.5 text-foreground" />;
  }
  return <ArrowUpDown className="ml-1.5 inline-block size-3.5 text-muted-foreground/60" />;
}

interface SkeletonRowsProps {
  columns: number;
  rows?: number;
}

function SkeletonRows({ columns, rows = 8 }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <Skeleton className="h-4 w-full max-w-[180px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  onRowClick,
  pageSize: initialPageSize = 10,
  emptyMessage = "No results found.",
  loading = false,
  itemLabel = "items",
}: DataTableProps<T>) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortState, setSortState] = React.useState<SortState>({ key: null, direction: null });
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.key, "all"]))
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(initialPageSize);

  // Reset to page 1 whenever search, sort, or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortState, filterValues, pageSize]);

  // ── Filter Logic ───────────────────────────────────────────────────────────
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Apply text search
    if (searchQuery.trim() !== "" && searchKeys.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const value = getNestedValue(row, key);
          return toSearchString(value).includes(query);
        })
      );
    }

    // Apply dropdown filters
    for (const filter of filters) {
      const selectedValue = filterValues[filter.key];
      if (selectedValue && selectedValue !== "all") {
        result = result.filter((row) => {
          const value = getNestedValue(row, filter.key);
          return toSearchString(value) === selectedValue.toLowerCase();
        });
      }
    }

    return result;
  }, [data, searchQuery, searchKeys, filterValues, filters]);

  // ── Sort Logic ─────────────────────────────────────────────────────────────
  const sortedData = React.useMemo(() => {
    if (!sortState.key || !sortState.direction) return filteredData;

    const key = sortState.key;
    const direction = sortState.direction;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, key);
      const bValue = getNestedValue(b, key);

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === "asc" ? 1 : -1;
      if (bValue == null) return direction === "asc" ? -1 : 1;

      // Numeric comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Date comparison
      const aDate = Date.parse(String(aValue));
      const bDate = Date.parse(String(bValue));
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      // String comparison
      const aStr = toSearchString(aValue);
      const bStr = toSearchString(bValue);
      if (aStr < bStr) return direction === "asc" ? -1 : 1;
      if (aStr > bStr) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortState]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedData = sortedData.slice(startIndex, endIndex);

  // Generate page number list (max 5 visible pages with ellipsis handled simply)
  const pageNumbers = React.useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [];
    pages.push(1);
    if (safePage > 3) pages.push("ellipsis");
    const rangeStart = Math.max(2, safePage - 1);
    const rangeEnd = Math.min(totalPages - 1, safePage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }, [totalPages, safePage]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleSort(columnKey: string) {
    setSortState((prev) => {
      if (prev.key !== columnKey) {
        return { key: columnKey, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key: columnKey, direction: "desc" };
      }
      // Third click: reset sort
      return { key: null, direction: null };
    });
  }

  function handleFilterChange(filterKey: string, value: string) {
    setFilterValues((prev) => ({ ...prev, [filterKey]: value }));
  }

  function handleSearchClear() {
    setSearchQuery("");
  }

  function handlePageSizeChange(value: string) {
    setPageSize(Number(value));
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8 h-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleSearchClear}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filterValues[filter.key] ?? "all"}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                <SelectTrigger className="h-9 w-auto min-w-[140px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{filter.label}: All</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-md border bg-background w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "select-none text-xs font-semibold uppercase tracking-wide text-muted-foreground py-3",
                    column.sortable && "cursor-pointer hover:text-foreground transition-colors",
                    column.className
                  )}
                  style={column.width ? { width: column.width, minWidth: column.width } : undefined}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {column.header}
                    {column.sortable && (
                      <SortIcon columnKey={column.key} sortState={sortState} />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <SkeletonRows columns={columns.length} rows={pageSize > 10 ? 10 : pageSize} />
            ) : pagedData.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b last:border-0",
                    onRowClick && "cursor-pointer hover:bg-muted/50"
                  )}
                >
                  {columns.map((column) => {
                    const rawValue = getNestedValue(row, column.key);
                    const cellContent = column.render
                      ? column.render(rawValue, row)
                      : rawValue != null
                      ? String(rawValue)
                      : "—";

                    return (
                      <TableCell
                        key={column.key}
                        className={cn("py-3 text-sm", column.className)}
                        style={
                          column.width ? { width: column.width, minWidth: column.width } : undefined
                        }
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Item count */}
        <p className="text-sm text-muted-foreground shrink-0">
          {loading ? (
            <Skeleton className="h-4 w-24 inline-block" />
          ) : (
            <>
              {totalItems} {itemLabel}
            </>
          )}
        </p>

        {/* Page navigation + page size */}
        <div className="flex items-center gap-2">
          {/* Previous page */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1 || loading}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, idx) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 text-center text-sm text-muted-foreground select-none"
                >
                  …
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === safePage ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  aria-label={`Page ${page}`}
                  aria-current={page === safePage ? "page" : undefined}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages || loading}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>

          {/* Page size selector */}
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-auto min-w-[90px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
