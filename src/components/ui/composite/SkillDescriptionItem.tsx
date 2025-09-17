import type { ReactNode } from "react";
import { Typography } from "@/components/ui/core/display";
import { DESIGN_TOKENS } from "@/constants";
import { cn } from "@/utils";
import StatusDot from "./StatusDot";

type SkillDescriptionItemVariant = "simple" | "decorated";
type SkillDescriptionItemColor = "amber" | "lime" | "blue";
type SkillDescriptionItemSemantic = "div" | "dl";

// Extract color styles to prevent recreation on every render
const COLOR_STYLES = {
  amber: {
    bullet: "bg-amber-400",
    bulletHover: "group-hover/card:bg-amber-300",
    text: "text-amber-400 group-hover/card:text-amber-300",
  },
  lime: {
    bullet: "bg-lime-400",
    bulletHover: "group-hover/card:bg-lime-300",
    text: "text-lime-400 group-hover/card:text-lime-300",
  },
  blue: {
    bullet: "bg-blue-400",
    bulletHover: "group-hover/card:bg-blue-300",
    text: "text-blue-300 group-hover/card:text-blue-200",
  },
} as const;

// Extract color constants for consistent theming
const STYLE_CONSTANTS = {
  decoratedDescription: DESIGN_TOKENS.colors.text.primary,
  simpleTitle: "text-blue-300", // Keep existing blue for simple variant
  simpleDescription: DESIGN_TOKENS.colors.text.muted,
  transition: "transition-colors duration-200",
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
  className = "",
}: SkillDescriptionItemProps) {
  // Add prop validation with fallback
  const currentColorStyle = COLOR_STYLES[color] ?? COLOR_STYLES.amber;

  // Hoist all className computations
  const containerClassName = cn("space-y-1", className);
  const titleContainerClassName = "flex items-center gap-2 mb-3";
  const statusDotClassName = cn(
    STYLE_CONSTANTS.transition,
    currentColorStyle.bulletHover
  );
  const titleClassName = cn(STYLE_CONSTANTS.transition, currentColorStyle.text);
  const decoratedDescClassName = cn(
    STYLE_CONSTANTS.decoratedDescription,
    "text-sm leading-relaxed"
  );
  const simpleDescClassName = cn(STYLE_CONSTANTS.simpleDescription, "pl-2");

  if (variant === "decorated") {
    if (semantic === "dl") {
      return (
        <dl className={containerClassName}>
          <dt className={titleContainerClassName}>
            <StatusDot
              color={currentColorStyle.bullet}
              className={statusDotClassName}
              ariaLabel="Skill or description item"
            />
            <Typography
              variant="bodySmall"
              weight="semibold"
              className={titleClassName}
            >
              {title}
            </Typography>
          </dt>
          <dd className={decoratedDescClassName}>{description}</dd>
        </dl>
      );
    }

    return (
      <div className={containerClassName}>
        <div className={titleContainerClassName}>
          <StatusDot
            color={currentColorStyle.bullet}
            className={statusDotClassName}
            ariaLabel="Skill or description item"
          />
          <Typography
            variant="bodySmall"
            weight="semibold"
            className={titleClassName}
          >
            {title}
          </Typography>
        </div>
        <div className={decoratedDescClassName}>{description}</div>
      </div>
    );
  }

  // Simple variant (default)
  if (semantic === "dl") {
    return (
      <dl className={containerClassName}>
        <dt>
          <Typography
            variant="body"
            weight="medium"
            className={STYLE_CONSTANTS.simpleTitle}
          >
            {title}:
          </Typography>
        </dt>
        <dd>
          <Typography variant="body" className={simpleDescClassName}>
            {description}
          </Typography>
        </dd>
      </dl>
    );
  }

  return (
    <div className={containerClassName}>
      <Typography
        variant="body"
        weight="medium"
        className={STYLE_CONSTANTS.simpleTitle}
      >
        {title}:
      </Typography>
      <Typography variant="body" className={simpleDescClassName}>
        {description}
      </Typography>
    </div>
  );
}

export type {
  SkillDescriptionItemVariant,
  SkillDescriptionItemColor,
  SkillDescriptionItemSemantic,
};
