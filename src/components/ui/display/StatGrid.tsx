import type { ReactNode } from "react";
import { Card } from "@/components/ui/design-system";

interface StatItem {
  label: string;
  value: string | number;
  modifier?: string | number;
  icon?: ReactNode;
}

interface StatGridProps {
  stats: StatItem[];
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  variant?: "ability" | "equipment" | "summary";
  className?: string;
}

export function StatGrid({
  stats,
  columns = { base: 2, sm: 3, md: 6 },
  variant = "ability",
  className = "",
}: StatGridProps) {
  const getGridClasses = () => {
    const baseClass = `grid gap-3`;
    const colClasses = [
      columns.base && `grid-cols-${columns.base}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`,
      columns.lg && `lg:grid-cols-${columns.lg}`,
    ].filter(Boolean).join(" ");
    
    return `${baseClass} ${colClasses}`;
  };

  const getStatItemClasses = () => {
    switch (variant) {
      case "ability":
        return "text-center";
      case "equipment":
        return "";
      case "summary":
        return "text-center";
      default:
        return "text-center";
    }
  };

  const getCardVariant = () => {
    switch (variant) {
      case "ability":
      case "equipment":
        return "success";
      case "summary":
        return null; // No card for summary variant
      default:
        return "standard";
    }
  };

  const getTextColors = () => {
    switch (variant) {
      case "ability":
        return {
          label: "text-lime-300",
          value: "text-lime-100",
          modifier: "text-lime-300",
        };
      case "equipment":
        return {
          label: "text-lime-400",
          value: "text-lime-50",
          modifier: "text-lime-300",
        };
      case "summary":
        return {
          label: "text-amber-200",
          value: "text-amber-100",
          modifier: "text-amber-300",
        };
      default:
        return {
          label: "text-zinc-300",
          value: "text-zinc-100",
          modifier: "text-zinc-400",
        };
    }
  };

  const colors = getTextColors();

  const cardVariant = getCardVariant();

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {stats.map((stat, index) => {
        const content = (
          <>
            {stat.icon && variant === "equipment" && (
              <div className="flex items-center gap-2 mb-1">
                {stat.icon}
                <div className={`text-xs uppercase tracking-wider font-medium ${colors.label}`}>
                  {stat.label}
                </div>
              </div>
            )}
            {!stat.icon && (
              <div className={`text-xs uppercase tracking-wider font-medium mb-1 ${colors.label}`}>
                {variant === "ability" ? stat.label.slice(0, 3) : stat.label}
              </div>
            )}
            <div className={`text-lg font-bold ${colors.value}`}>
              {(typeof stat.value === "number" && stat.value > 0) || typeof stat.value === "string" ? stat.value : "—"}
            </div>
            {stat.modifier !== undefined && (
              <div className={`text-xs ${colors.modifier}`}>
                {typeof stat.modifier === "number" && stat.modifier >= 0 ? "+" : ""}
                {stat.modifier}
              </div>
            )}
          </>
        );

        return cardVariant ? (
          <Card key={`${stat.label}-${index}`} variant={cardVariant} size="compact" className={getStatItemClasses()}>
            {content}
          </Card>
        ) : (
          <div key={`${stat.label}-${index}`} className={getStatItemClasses()}>
            {content}
          </div>
        );
      })}
    </div>
  );
}