import { forwardRef } from "react";

/**
 * Centralized icon component that replaces inline SVGs throughout the app.
 *
 * Features:
 * - Consistent sizing with semantic size props (xs, sm, md, lg, xl)
 * - Built-in accessibility support with proper ARIA attributes
 * - Automatic stroke/fill detection based on icon type
 * - Bundle optimization through shared icon paths
 * - Type-safe icon name validation
 *
 * Usage:
 * ```tsx
 * <Icon name="settings" size="md" className="text-blue-500" />
 * <Icon name="close" size="sm" aria-label="Close modal" />
 * ```
 */

export type IconName =
  | "close"
  | "menu"
  | "chevron-down"
  | "info"
  | "info-question"
  | "check"
  | "check-circle"
  | "exclamation-triangle"
  | "exclamation-circle"
  | "x-circle"
  | "coin"
  | "weight"
  | "damage"
  | "shield"
  | "settings"
  | "edit"
  | "dice"
  | "chevron-right"
  | "chevron-left"
  | "plus"
  | "minus"
  | "star"
  | "trash";

interface IconProps {
  name: IconName;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  title?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const;

const iconPaths: Record<
  IconName,
  { viewBox: string; paths: string[]; fill?: boolean; stroke?: boolean }
> = {
  close: {
    viewBox: "0 0 24 24",
    paths: ["M6 18L18 6M6 6l12 12"],
    stroke: true,
  },
  menu: {
    viewBox: "0 0 24 24",
    paths: ["M4 6h16M4 12h16M4 18h16"],
    stroke: true,
  },
  "chevron-down": {
    viewBox: "0 0 24 24",
    paths: ["M19 9l-7 7-7-7"],
    stroke: true,
  },
  "chevron-right": {
    viewBox: "0 0 24 24",
    paths: ["M9 18l6-6-6-6"],
    stroke: true,
  },
  "chevron-left": {
    viewBox: "0 0 24 24",
    paths: ["M15 18l-6-6 6-6"],
    stroke: true,
  },
  info: {
    viewBox: "0 0 20 20",
    paths: [
      "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
    ],
    fill: true,
  },
  "info-question": {
    viewBox: "0 0 20 20",
    paths: [
      "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z",
    ],
    fill: true,
  },
  check: {
    viewBox: "0 0 20 20",
    paths: [
      "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
    ],
    fill: true,
  },
  "check-circle": {
    viewBox: "0 0 20 20",
    paths: [
      "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    ],
    fill: true,
  },
  "exclamation-triangle": {
    viewBox: "0 0 20 20",
    paths: [
      "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
    ],
    fill: true,
  },
  "exclamation-circle": {
    viewBox: "0 0 20 20",
    paths: [
      "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
    ],
    fill: true,
  },
  "x-circle": {
    viewBox: "0 0 20 20",
    paths: [
      "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
    ],
    fill: true,
  },
  coin: {
    viewBox: "0 0 20 20",
    paths: [
      "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z",
    ],
    fill: true,
  },
  weight: {
    viewBox: "0 0 24 24",
    paths: [
      "M12 3C10.9 3 10 3.9 10 5v1H8c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2V5c0-1.1-.9-2-2-2zm0 2c.6 0 1 .4 1 1v1h-2V6c0-.6.4-1 1-1z",
    ],
    fill: true,
  },
  damage: {
    viewBox: "0 0 24 24",
    paths: [
      "M12 2l2 4 4-1-2 4 4 2-4 2 2 4-4-1-2 4-2-4-4 1 2-4-4-2 4-2-2-4 4 1z",
    ],
    fill: true,
  },
  shield: {
    viewBox: "0 0 24 24",
    paths: ["M12 1L3 5v6c0 8 9 12 9 12s9-4 9-12V5l-9-4z"],
    fill: true,
  },
  settings: {
    viewBox: "0 0 24 24",
    paths: [
      "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    ],
    stroke: true,
  },
  edit: {
    viewBox: "0 0 24 24",
    paths: [
      "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
    ],
    stroke: true,
  },
  dice: {
    viewBox: "0 0 24 24",
    paths: [
      "M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h14v14H5V5zm3 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z",
    ],
    fill: true,
  },
  plus: {
    viewBox: "0 0 24 24",
    paths: ["M12 6v6m0 0v6m0-6h6m-6 0H6"],
    stroke: true,
  },
  minus: {
    viewBox: "0 0 24 24",
    paths: ["M6 12h12"],
    stroke: true,
  },
  star: {
    viewBox: "0 0 20 20",
    paths: [
      "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
    ],
    fill: true,
  },
  trash: {
    viewBox: "0 0 24 24",
    paths: [
      "M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6",
    ],
    stroke: true,
  },
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      className = "",
      size = "sm",
      title,
      "aria-label": ariaLabel,
      "aria-hidden": ariaHidden,
      ...props
    },
    ref
  ) => {
    const iconData = iconPaths[name];

    if (!iconData) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }

    const sizeClass = sizeClasses[size];
    const isDecorative = !title && !ariaLabel;

    // Build class names
    const classes = [sizeClass, className].filter(Boolean).join(" ");

    return (
      <svg
        ref={ref}
        className={classes}
        fill={iconData.fill ? "currentColor" : "none"}
        stroke={iconData.stroke ? "currentColor" : "none"}
        strokeWidth={iconData.stroke ? 2 : undefined}
        strokeLinecap={iconData.stroke ? "round" : undefined}
        strokeLinejoin={iconData.stroke ? "round" : undefined}
        viewBox={iconData.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={isDecorative ? "true" : ariaHidden}
        aria-label={ariaLabel}
        role={title || ariaLabel ? "img" : undefined}
        {...props}
      >
        {title && <title>{title}</title>}
        {iconData.paths.map((path, index) => (
          <path
            key={index}
            d={path}
            fillRule={iconData.fill ? "evenodd" : undefined}
            clipRule={iconData.fill ? "evenodd" : undefined}
          />
        ))}
      </svg>
    );
  }
);

Icon.displayName = "Icon";

export default Icon;
