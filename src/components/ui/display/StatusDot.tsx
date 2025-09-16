import { cn } from "@/utils";

type StatusType =
  | "active"
  | "inactive"
  | "warning"
  | "error"
  | "success"
  | "custom";

const STATUS_COLORS = {
  active: "bg-amber-500",
  inactive: "bg-zinc-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  success: "bg-lime-500",
  custom: "bg-amber-400", // fallback
} as const;

const STATUS_SIZES = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
} as const;

interface StatusDotProps {
  /** Semantic status type */
  status?: StatusType;
  /** Custom color (use when status is 'custom' or for legacy support) */
  color?: string;
  /** Size variant */
  size?: keyof typeof STATUS_SIZES | string;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

export default function StatusDot({
  status = "active",
  color,
  size = "sm",
  className = "",
  ariaLabel,
}: StatusDotProps) {
  const colorClass = color || STATUS_COLORS[status];
  const sizeClass =
    size in STATUS_SIZES
      ? STATUS_SIZES[size as keyof typeof STATUS_SIZES]
      : size;

  const dotClassName = cn(
    sizeClass,
    colorClass,
    "rounded-full shadow-sm",
    className
  );

  return <div className={dotClassName} role="status" aria-label={ariaLabel} />;
}

export type { StatusType };
