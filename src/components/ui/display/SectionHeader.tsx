import type { ReactNode } from "react";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants/designTokens";
import { cn } from "@/constants/styles";

interface SectionHeaderProps {
  title: ReactNode;
  extra?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}


export default function SectionHeader({ 
  title, 
  extra, 
  size = "md", 
  className = "" 
}: SectionHeaderProps) {
  const currentSize = SIZE_STYLES[size];

  const headerClasses = cn(
    "flex items-center justify-between",
    `border-b-2 ${DESIGN_TOKENS.colors.border.secondary}`,
    currentSize.header,
    DESIGN_TOKENS.colors.bg.header,
    "backdrop-blur-sm",
    "rounded-t-xl",
    className,
  );

  return (
    <div className={headerClasses}>
      {title && (
        <div
          className={`font-bold ${DESIGN_TOKENS.colors.text.primary} flex items-start gap-2`}
        >
          <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm mt-1.5"></div>
          {title}
        </div>
      )}
      {extra && (
        <div className={DESIGN_TOKENS.colors.text.muted}>{extra}</div>
      )}
    </div>
  );
}