import { forwardRef } from "react";
import type { ReactNode } from "react";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants";
import { Typography } from "@/components/ui/design-system";
import { cn } from "@/utils";

export interface DescriptionItem {
  label: ReactNode;
  children: ReactNode;
  span?: 1 | 2 | 3;
}

interface DetailsProps {
  items: DescriptionItem[];
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical" | "cards";
  className?: string;
}

const Details = forwardRef<HTMLDivElement, DetailsProps>(
  ({ items, size = "md", layout = "vertical", className = "" }, ref) => {
    const currentSize = SIZE_STYLES[size];

    // Hoist class computations
    const horizontalContainerClass = cn(
      "flex flex-wrap",
      currentSize.itemSpacing,
      className
    );

    const horizontalCardClass = cn(
      "relative group/card flex-1 min-w-0",
      DESIGN_TOKENS.colors.bg.card.base,
      DESIGN_TOKENS.effects.roundedSm,
      "px-4 py-4.5 border border-zinc-600/60",
      DESIGN_TOKENS.effects.transition,
      DESIGN_TOKENS.colors.bg.card.hover,
      DESIGN_TOKENS.effects.cardHover
    );

    const horizontalLabelClass = cn(
      DESIGN_TOKENS.colors.text.accent,
      currentSize.labelText,
      "group-hover/card:text-amber-300 transition-colors duration-200 font-bold"
    );

    const horizontalContentClass = cn(
      DESIGN_TOKENS.colors.text.primary,
      currentSize.contentText,
      "group-hover/card:text-zinc-50 transition-colors duration-200 font-semibold"
    );

    if (layout === "horizontal") {
      return (
        <div ref={ref} className={horizontalContainerClass}>
          {items.map((item, index) => (
            <div key={index} className={horizontalCardClass}>
              {/* Top accent line */}
              <div className={DESIGN_TOKENS.effects.cardAccent} />

              <div className="space-y-2.5">
                <div className={horizontalLabelClass}>{item.label}</div>
                <div className={horizontalContentClass}>{item.children}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Hoist cards layout classes
    const cardsContainerClass = cn("space-y-4", className);

    const cardsCardClass = cn(
      DESIGN_TOKENS.effects.roundedSm,
      "p-4",
      DESIGN_TOKENS.colors.bg.card.simple,
      "border",
      DESIGN_TOKENS.colors.border.secondary,
      DESIGN_TOKENS.effects.transition,
      DESIGN_TOKENS.colors.bg.card.simpleHover,
      "hover:border-amber-400/30 group/card"
    );

    const cardsDotClass =
      "w-2 h-2 bg-amber-400 rounded-full shadow-sm group-hover/card:bg-amber-300 transition-colors duration-200";

    const cardsContentClass = cn(
      DESIGN_TOKENS.colors.text.primary,
      currentSize.contentText,
      "leading-relaxed"
    );

    // Cards Layout - each item gets its own card
    if (layout === "cards") {
      return (
        <div ref={ref} className={cardsContainerClass}>
          {items.map((item, index) => (
            <div key={index} className={cardsCardClass}>
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cardsDotClass} />
                <Typography
                  variant="bodySmall"
                  color="amber"
                  weight="semibold"
                  className="group-hover/card:text-amber-300 transition-colors duration-200"
                >
                  {item.label}
                </Typography>
              </div>

              {/* Card Content */}
              <div className={cardsContentClass}>{item.children}</div>
            </div>
          ))}
        </div>
      );
    }

    // Hoist vertical layout classes
    const verticalContainerClass = cn("space-y-3", className);

    const verticalItemClass = cn(
      "flex items-center justify-between py-3 px-4 gap-4",
      DESIGN_TOKENS.effects.roundedSm,
      DESIGN_TOKENS.colors.bg.card.vertical,
      "border",
      DESIGN_TOKENS.colors.border.secondary,
      DESIGN_TOKENS.effects.transition,
      DESIGN_TOKENS.colors.bg.card.verticalHover,
      "hover:border-amber-400/20 group/item"
    );

    const verticalDotClass =
      "w-1.5 h-1.5 bg-zinc-500 rounded-full shadow-sm group-hover/item:bg-amber-400 transition-colors duration-200";

    const verticalLabelClass = cn(
      DESIGN_TOKENS.colors.text.accent,
      currentSize.labelText
    );

    const verticalContentClass = cn(
      DESIGN_TOKENS.colors.text.primary,
      currentSize.contentText
    );

    // Vertical Layout (default)
    return (
      <div ref={ref} className={verticalContainerClass}>
        {items.map((item, index) => (
          <div key={index} className={verticalItemClass}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={verticalDotClass} />
              <span className={verticalLabelClass}>{item.label}</span>
            </div>
            <div className={verticalContentClass}>{item.children}</div>
          </div>
        ))}
      </div>
    );
  }
);

Details.displayName = "Details";

export default Details;
