import { forwardRef } from "react";
import type { ReactNode } from "react";

export interface DescriptionItem {
  label: ReactNode;
  children: ReactNode;
  span?: 1 | 2 | 3;
}

interface DetailsProps {
  items: DescriptionItem[];
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

// Design tokens
const DESIGN_TOKENS = {
  colors: {
    bg: {
      primary: "bg-zinc-800",
      accent: "bg-gradient-to-br from-zinc-800 to-zinc-900",
      label: "bg-zinc-750/40",
      header: "bg-gradient-to-r from-zinc-700/50 to-zinc-750/30",
    },
    text: {
      primary: "text-zinc-100",
      secondary: "text-zinc-400",
      muted: "text-zinc-300",
      accent: "text-amber-400",
    },
    border: {
      primary: "border-zinc-600",
      secondary: "border-zinc-700/60",
      accent: "border-amber-500/20",
    },
  },
  effects: {
    shadow: "shadow-[0_4px_0_0_#3f3f46,0_0_20px_rgba(0,0,0,0.3)]",
    shadowSm: "shadow-[0_2px_0_0_#52525b,0_0_10px_rgba(0,0,0,0.2)]",
    transition: "transition-all duration-200",
    rounded: "rounded-xl",
    roundedSm: "rounded-lg",
  },
} as const;

const Details = forwardRef<HTMLDivElement, DetailsProps>(
  (
    { items, size = "md", layout = "vertical", title, extra, className = "" },
    ref
  ) => {
    const sizeStyles = {
      sm: {
        header: "px-4 py-3",
        container: "p-4",
        itemSpacing: "gap-3",
        labelText: "text-xs font-semibold tracking-wide uppercase",
        contentText: "text-sm font-medium",
      },
      md: {
        header: "px-5 py-4",
        container: "p-4",
        itemSpacing: "gap-4",
        labelText: "text-sm font-semibold tracking-wide uppercase",
        contentText: "text-base font-medium",
      },
      lg: {
        header: "px-6 py-5",
        container: "p-6",
        itemSpacing: "gap-6",
        labelText: "text-base font-semibold tracking-wide uppercase",
        contentText: "text-lg font-medium",
      },
    };

    const currentSize = sizeStyles[size];

    const containerClasses = [
      DESIGN_TOKENS.colors.bg.accent,
      DESIGN_TOKENS.effects.rounded,
      "overflow-hidden relative",
      "border-2",
      DESIGN_TOKENS.colors.border.primary,
      DESIGN_TOKENS.effects.shadow,
      DESIGN_TOKENS.effects.transition,
      "hover:shadow-[0_6px_0_0_#3f3f46,0_0_25px_rgba(0,0,0,0.4)]",
      "group",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const headerClasses = [
      "flex items-center justify-between",
      `border-b-2 ${DESIGN_TOKENS.colors.border.secondary}`,
      currentSize.header,
      DESIGN_TOKENS.colors.bg.header,
      "backdrop-blur-sm",
    ].join(" ");

    if (layout === "horizontal") {
      return (
        <div ref={ref} className={containerClasses}>
          {/* Header */}
          {(title || extra) && (
            <div className={headerClasses}>
              {title && (
                <div
                  className={`font-bold ${DESIGN_TOKENS.colors.text.primary} flex items-center gap-2`}
                >
                  <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
                  {title}
                </div>
              )}
              {extra && (
                <div className={DESIGN_TOKENS.colors.text.muted}>{extra}</div>
              )}
            </div>
          )}

          {/* Horizontal Layout */}
          <div
            className={`${currentSize.container} flex flex-wrap ${currentSize.itemSpacing}`}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className={`
                  relative group/card flex-1 min-w-0
                  bg-gradient-to-b from-zinc-800/50 to-zinc-900/70
                  ${DESIGN_TOKENS.effects.roundedSm} px-4 py-4.5
                  border border-zinc-600/60 
                  ${DESIGN_TOKENS.effects.transition}
                  hover:border-amber-400/70 hover:bg-gradient-to-b hover:from-zinc-750/60 hover:to-zinc-800/80
                  hover:shadow-lg hover:shadow-amber-400/5 hover:scale-[1.01]
                `}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                <div className="text-center space-y-2.5">
                  <div
                    className={`${DESIGN_TOKENS.colors.text.accent} ${currentSize.labelText}
                      group-hover/card:text-amber-300 transition-colors duration-200 font-bold`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`${DESIGN_TOKENS.colors.text.primary} ${currentSize.contentText} 
                      group-hover/card:text-zinc-50 transition-colors duration-200 font-semibold`}
                  >
                    {item.children}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Vertical Layout (default)
    return (
      <div ref={ref} className={containerClasses}>
        {/* Header */}
        {(title || extra) && (
          <div className={headerClasses}>
            {title && (
              <div
                className={`font-bold ${DESIGN_TOKENS.colors.text.primary} flex items-center gap-2`}
              >
                <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
                {title}
              </div>
            )}
            {extra && (
              <div className={DESIGN_TOKENS.colors.text.muted}>{extra}</div>
            )}
          </div>
        )}

        {/* Items */}
        <div className={`${currentSize.container} space-y-3`}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between py-3 px-4 gap-4
                ${DESIGN_TOKENS.effects.roundedSm}
                bg-zinc-750/20 border ${DESIGN_TOKENS.colors.border.secondary}
                ${DESIGN_TOKENS.effects.transition}
                hover:bg-zinc-700/30 hover:border-amber-400/20
                group/item
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full group-hover/item:bg-amber-400 transition-colors duration-200"></div>
                <span
                  className={`${DESIGN_TOKENS.colors.text.accent} ${currentSize.labelText}`}
                >
                  {item.label}
                </span>
              </div>
              <div
                className={`${DESIGN_TOKENS.colors.text.primary} ${currentSize.contentText} text-right`}
              >
                {item.children}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Details.displayName = "Details";

export default Details;
