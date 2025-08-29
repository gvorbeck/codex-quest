import type { ReactNode } from "react";
import { Typography } from "@/components/ui/design-system";

type SkillDescriptionItemVariant = "simple" | "decorated";
type SkillDescriptionItemColor = "amber" | "lime" | "blue";
type SkillDescriptionItemSemantic = "div" | "dl";

// Extract color styles to prevent recreation on every render
const COLOR_STYLES = {
  amber: {
    bullet: "bg-amber-400 group-hover/card:bg-amber-300",
    text: "text-amber-400 group-hover/card:text-amber-300",
  },
  lime: {
    bullet: "bg-lime-400 group-hover/card:bg-lime-300", 
    text: "text-lime-400 group-hover/card:text-lime-300",
  },
  blue: {
    bullet: "bg-blue-400 group-hover/card:bg-blue-300",
    text: "text-blue-300 group-hover/card:text-blue-200",
  },
} as const;

interface SkillDescriptionItemProps {
  title: string;
  description: string | ReactNode;
  variant?: SkillDescriptionItemVariant;
  color?: SkillDescriptionItemColor;
  semantic?: SkillDescriptionItemSemantic;
  className?: string;
}

/**
 * Reusable component for displaying skill/ability descriptions
 * with consistent styling and typography
 * 
 * @param variant - "simple" for basic styling, "decorated" for enhanced styling with bullet point
 * @param semantic - "div" for generic container, "dl" for description list semantics
 */
export default function SkillDescriptionItem({ 
  title, 
  description, 
  variant = "simple",
  color = "amber",
  semantic = "div",
  className = "" 
}: SkillDescriptionItemProps) {
  // Add prop validation with fallback
  const currentColorStyle = COLOR_STYLES[color] ?? COLOR_STYLES.amber;
  if (variant === "decorated") {
    const DecoratedContainer = semantic === "dl" ? "dl" : "div";
    const TitleElement = semantic === "dl" ? "dt" : "div";
    const DescElement = semantic === "dl" ? "dd" : "div";
    
    return (
      <DecoratedContainer className={`space-y-1 ${className}`}>
        <TitleElement className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentColorStyle.bullet}`}></div>
          <Typography
            variant="bodySmall"
            weight="semibold"
            className={`transition-colors duration-200 ${currentColorStyle.text}`}
          >
            {title}
          </Typography>
        </TitleElement>
        <DescElement className="text-zinc-100 text-sm leading-relaxed">
          {description}
        </DescElement>
      </DecoratedContainer>
    );
  }

  // Simple variant (default)
  if (semantic === "dl") {
    return (
      <dl className={`space-y-1 ${className}`}>
        <dt>
          <Typography 
            variant="body" 
            weight="medium" 
            className="text-blue-300"
          >
            {title}:
          </Typography>
        </dt>
        <dd>
          <Typography 
            variant="body" 
            className="text-zinc-300 pl-2"
          >
            {description}
          </Typography>
        </dd>
      </dl>
    );
  }
  
  return (
    <div className={`space-y-1 ${className}`}>
      <Typography 
        variant="body" 
        weight="medium" 
        className="text-blue-300"
      >
        {title}:
      </Typography>
      <Typography 
        variant="body" 
        className="text-zinc-300 pl-2"
      >
        {description}
      </Typography>
    </div>
  );
}

export type { SkillDescriptionItemVariant, SkillDescriptionItemColor, SkillDescriptionItemSemantic };