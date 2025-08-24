import { useMemo } from "react";

interface StatusThreshold {
  /** Minimum percentage for this status (0-100) */
  min: number;
  /** Maximum percentage for this status (0-100) */
  max: number;
  /** Color class for text */
  textColor: string;
  /** Color class for progress bar */
  barColor: string;
  /** Status label */
  label: string;
}

interface StatusIndicatorProps {
  /** Current value */
  current: number;
  /** Maximum value */
  max: number;
  /** Custom status thresholds (defaults to health-based thresholds) */
  thresholds?: StatusThreshold[];
  /** Whether to show the progress bar */
  showBar?: boolean;
  /** Whether to show the status label */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Default health-based thresholds
const DEFAULT_HEALTH_THRESHOLDS: StatusThreshold[] = [
  {
    min: 101,
    max: Infinity,
    textColor: "text-cyan-400",
    barColor: "bg-cyan-500",
    label: "Temporary HP",
  },
  {
    min: 75,
    max: 101,
    textColor: "text-lime-400",
    barColor: "bg-lime-500",
    label: "Healthy",
  },
  {
    min: 50,
    max: 75,
    textColor: "text-yellow-400",
    barColor: "bg-yellow-500",
    label: "Lightly Wounded",
  },
  {
    min: 25,
    max: 50,
    textColor: "text-orange-400",
    barColor: "bg-orange-500",
    label: "Moderately Wounded",
  },
  {
    min: 1,
    max: 25,
    textColor: "text-red-400",
    barColor: "bg-red-500",
    label: "Heavily Wounded",
  },
  {
    min: 0.1,
    max: 1,
    textColor: "text-red-400",
    barColor: "bg-red-500",
    label: "Critically Wounded",
  },
  {
    min: 0,
    max: 0.1,
    textColor: "text-gray-400",
    barColor: "bg-gray-500",
    label: "Unconscious/Dead",
  },
];

function StatusIndicator({
  current,
  max,
  thresholds = DEFAULT_HEALTH_THRESHOLDS,
  showBar = true,
  showLabel = true,
  className = "",
}: StatusIndicatorProps) {
  const { percentage, status } = useMemo((): {
    percentage: number;
    status: StatusThreshold;
  } => {
    const safeThresholds =
      thresholds.length > 0 ? thresholds : DEFAULT_HEALTH_THRESHOLDS;
    const defaultStatus = safeThresholds[safeThresholds.length - 1];

    // Ensure we have a valid default status
    if (!defaultStatus) {
      throw new Error("No valid status thresholds provided");
    }

    if (max === 0) return { percentage: 0, status: defaultStatus };

    const pct = Math.max(0, (current / max) * 100);

    // Special case for values above max (temporary HP)
    if (current > max) {
      const tempStatus = safeThresholds.find((t) => t.min > 100);
      if (tempStatus) {
        return { percentage: 100, status: tempStatus };
      }
    }

    // Find the appropriate status threshold
    const currentStatus = safeThresholds.find(
      (threshold) => pct >= threshold.min && pct < threshold.max
    );

    // Fallback to the last threshold if none found
    const finalStatus = currentStatus || defaultStatus;

    return { percentage: Math.min(100, pct), status: finalStatus };
  }, [current, max, thresholds]);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress Bar */}
      {showBar && (
        <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
          <div
            className={`
              h-full transition-all duration-300 rounded-full
              ${status.barColor}
            `}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Status Label */}
      {showLabel && (
        <div className="text-center">
          <span className={`text-xs font-medium ${status.textColor}`}>
            {status.label}
          </span>
        </div>
      )}
    </div>
  );
}

export default StatusIndicator;
export type { StatusThreshold };
