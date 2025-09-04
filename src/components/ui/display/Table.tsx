import { forwardRef, useCallback } from "react";
import type {
  ReactNode,
  HTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import { cn } from "@/constants/styles";
import { DESIGN_TOKENS } from "@/constants/designTokens";
import { SkeletonTableRow } from "@/components/ui/feedback";

// Constants
const HEADER_ROW_OFFSET = 2; // Header row is index 1, data rows start at 2
const SORT_ICON_SIZE = 4; // Size for sort indicator triangles
const SORT_ICON_HEIGHT = 5; // Height for sort indicator triangles

// Table Column Definition
export interface TableColumn<T = Record<string, unknown>> {
  /** Unique identifier for the column */
  key: string;
  /** Column header text */
  header: ReactNode;
  /** Function to render cell content, receives row data */
  cell?: (data: T) => ReactNode;
  /** Column width (CSS width value) */
  width?: string;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Whether column is sortable */
  sortable?: boolean;
  /** Accessibility label for the column */
  ariaLabel?: string;
}

// Table Props
interface TableProps<T = Record<string, unknown>>
  extends Omit<HTMLAttributes<HTMLTableElement>, "children"> {
  /** Array of column definitions */
  columns: TableColumn<T>[];
  /** Array of data objects to display */
  data: T[];
  /** Table caption for accessibility */
  caption?: string;
  /** Whether to show table borders */
  bordered?: boolean;
  /** Whether to use striped rows */
  striped?: boolean;
  /** Whether to highlight rows on hover */
  hoverable?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Sort configuration */
  sort?: {
    key: string;
    direction: "asc" | "desc";
  };
  /** Sort change handler */
  onSort?: (key: string, direction: "asc" | "desc") => void;
  /** Row click handler */
  onRowClick?: (data: T, index: number) => void;
  /** Custom row key extractor */
  getRowKey?: (data: T, index: number) => string;
}

// Table Header Cell Props
interface TableHeaderProps
  extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  sortable?: boolean;
  sorted?: "asc" | "desc" | null;
  onSort?: () => void;
  align?: "left" | "center" | "right";
}

// Table Cell Props
interface TableCellProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
  align?: "left" | "center" | "right";
}

// Helper function for better type safety
const getCellContent = <T extends Record<string, unknown>>(
  row: T,
  column: TableColumn<T>
): ReactNode => {
  if (column.cell) {
    return column.cell(row);
  }

  const value = row[column.key as keyof T];
  return value as ReactNode;
};

// Size styles
const sizeStyles = {
  sm: {
    table: "text-sm",
    header: "px-3 py-2",
    cell: "px-3 py-2",
  },
  md: {
    table: "text-base",
    header: "px-4 py-3",
    cell: "px-4 py-3",
  },
  lg: {
    table: "text-lg",
    header: "px-6 py-4",
    cell: "px-6 py-4",
  },
} as const;

// Table Header Cell Component
const TableHeader = forwardRef<HTMLTableHeaderCellElement, TableHeaderProps>(
  (
    {
      children,
      className,
      sortable = false,
      sorted = null,
      onSort,
      align = "left",
      ...props
    },
    ref
  ) => {
    const alignmentClass = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[align];

    const headerClasses = cn(
      "font-semibold tracking-wide uppercase border-b-2",
      DESIGN_TOKENS.colors.bg.header,
      DESIGN_TOKENS.colors.text.accent,
      DESIGN_TOKENS.colors.border.accent,
      alignmentClass,
      sortable && "cursor-pointer select-none hover:bg-zinc-600/50",
      sortable && DESIGN_TOKENS.effects.transition,
      className
    );

    const ascIconClasses = cn(
      `w-0 h-0 border-l-[${SORT_ICON_SIZE}px] border-r-[${SORT_ICON_SIZE}px] border-b-[${SORT_ICON_HEIGHT}px]`,
      "border-l-transparent border-r-transparent",
      sorted === "asc" ? "border-b-amber-400" : "border-b-zinc-500"
    );

    const descIconClasses = cn(
      `w-0 h-0 border-l-[${SORT_ICON_SIZE}px] border-r-[${SORT_ICON_SIZE}px] border-t-[${SORT_ICON_HEIGHT}px] mt-0.5`,
      "border-l-transparent border-r-transparent",
      sorted === "desc" ? "border-t-amber-400" : "border-t-zinc-500"
    );

    return (
      <th
        ref={ref}
        className={headerClasses}
        onClick={sortable ? onSort : undefined}
        role={sortable ? "button" : undefined}
        tabIndex={sortable ? 0 : undefined}
        aria-sort={
          sorted === "asc"
            ? "ascending"
            : sorted === "desc"
            ? "descending"
            : sortable
            ? "none"
            : undefined
        }
        onKeyDown={
          sortable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort?.();
                }
              }
            : undefined
        }
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && (
            <span className="flex flex-col">
              <span className={ascIconClasses} aria-hidden />
              <span className={descIconClasses} aria-hidden />
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHeader.displayName = "TableHeader";

// Table Cell Component
const TableCell = forwardRef<HTMLTableDataCellElement, TableCellProps>(
  ({ children, className, align = "left", ...props }, ref) => {
    const alignmentClass = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[align];

    const cellClasses = cn(
      "border-b",
      DESIGN_TOKENS.colors.border.secondary,
      DESIGN_TOKENS.colors.text.primary,
      alignmentClass,
      className
    );

    return (
      <td ref={ref} className={cellClasses} {...props}>
        {children}
      </td>
    );
  }
);

TableCell.displayName = "TableCell";

// Main Table Component
const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      columns,
      data,
      caption,
      bordered = false,
      striped = false,
      hoverable = true,
      size = "md",
      loading = false,
      emptyMessage = "No data available",
      sort,
      onSort,
      onRowClick,
      getRowKey,
      className,
      ...props
    },
    ref
  ) => {
    const currentSize = sizeStyles[size];

    const handleSort = useCallback(
      (columnKey: string) => {
        if (!onSort) return;

        const newDirection =
          sort?.key === columnKey && sort?.direction === "asc" ? "desc" : "asc";

        onSort(columnKey, newDirection);
      },
      [onSort, sort]
    );

    const getDefaultRowKey = useCallback(
      (rowData: Record<string, unknown>, index: number): string => {
        if (getRowKey) return getRowKey(rowData as never, index);
        return (
          (rowData["id"] as string | number | undefined)?.toString() ??
          index.toString()
        );
      },
      [getRowKey]
    );

    if (loading) {
      return (
        <div className={cn("overflow-x-auto", DESIGN_TOKENS.effects.rounded)}>
          <table
            ref={ref}
            className={cn(
              "w-full border-collapse",
              currentSize.table,
              DESIGN_TOKENS.colors.bg.primary,
              bordered && `border-2 ${DESIGN_TOKENS.colors.border.primary}`,
              className
            )}
            {...props}
          >
            {caption && (
              <caption
                className={cn(
                  "caption-top mb-4 text-left font-semibold",
                  DESIGN_TOKENS.colors.text.accent
                )}
              >
                {caption} - Loading
              </caption>
            )}

            <thead>
              <tr>
                {columns.map((column) => (
                  <TableHeader
                    key={column.key}
                    className={currentSize.header}
                    style={column.width ? { width: column.width } : undefined}
                    align={column.align ?? "left"}
                    sortable={false}
                    sorted={null}
                    onSort={() => {}}
                    aria-label={column.ariaLabel}
                  >
                    {column.header}
                  </TableHeader>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Show skeleton rows while loading */}
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={`${index}-${column.key}`}
                      className={currentSize.cell}
                      align={column.align ?? "left"}
                    >
                      <SkeletonTableRow
                        size="sm"
                        width={colIndex === 0 ? "60%" : "40%"}
                        label="Loading table data..."
                      />
                    </TableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div
          className={cn(
            DESIGN_TOKENS.colors.bg.primary,
            DESIGN_TOKENS.effects.rounded,
            "p-8 text-center"
          )}
          role="status"
          aria-live="polite"
        >
          <span className={DESIGN_TOKENS.colors.text.secondary}>
            {emptyMessage}
          </span>
        </div>
      );
    }

    return (
      <div className={cn("overflow-x-auto", DESIGN_TOKENS.effects.rounded)}>
        <table
          ref={ref}
          className={cn(
            "w-full border-collapse",
            currentSize.table,
            DESIGN_TOKENS.colors.bg.primary,
            bordered && `border-2 ${DESIGN_TOKENS.colors.border.primary}`,
            className
          )}
          {...props}
        >
          {caption && (
            <caption
              className={cn(
                "caption-top mb-4 text-left font-semibold",
                DESIGN_TOKENS.colors.text.accent
              )}
            >
              {caption}
            </caption>
          )}

          <thead>
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  className={currentSize.header}
                  style={column.width ? { width: column.width } : undefined}
                  align={column.align ?? "left"}
                  sortable={column.sortable ?? false}
                  sorted={sort?.key === column.key ? sort.direction : null}
                  onSort={() => handleSort(column.key)}
                  aria-label={column.ariaLabel}
                >
                  {column.header}
                </TableHeader>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => {
              const rowKey = getDefaultRowKey(row, index);
              const isClickable = !!onRowClick;

              return (
                <tr
                  key={rowKey}
                  className={cn(
                    striped &&
                      index % 2 === 1 &&
                      DESIGN_TOKENS.colors.bg.stripe,
                    hoverable && DESIGN_TOKENS.colors.bg.hover,
                    isClickable && "cursor-pointer",
                    isClickable && DESIGN_TOKENS.effects.transition
                  )}
                  onClick={
                    isClickable ? () => onRowClick(row, index) : undefined
                  }
                  onKeyDown={
                    isClickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRowClick?.(row, index);
                          }
                        }
                      : undefined
                  }
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  aria-rowindex={index + HEADER_ROW_OFFSET}
                >
                  {columns.map((column) => {
                    const cellContent = getCellContent(row, column);

                    return (
                      <TableCell
                        key={`${rowKey}-${column.key}`}
                        className={currentSize.cell}
                        align={column.align ?? "left"}
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";

export default Table;
export { TableHeader, TableCell };
export type { TableProps, TableHeaderProps, TableCellProps };
