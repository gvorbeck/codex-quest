import { forwardRef } from "react";
import { logger } from "@/utils/logger";

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
  | "user"
  | "photo"
  | "upload"
  | "eye"
  | "badge-check"
  | "clock"
  | "briefcase"
  | "heart"
  | "lightning"
  | "clipboard"
  | "language"
  | "map-pin"
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
  user: {
    viewBox: "0 0 20 20",
    paths: ["M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"],
    fill: true,
  },
  photo: {
    viewBox: "0 0 20 20",
    paths: [
      "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z",
    ],
    fill: true,
  },
  upload: {
    viewBox: "0 0 20 20",
    paths: [
      "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z",
    ],
    fill: true,
  },
  eye: {
    viewBox: "0 0 20 20",
    paths: [
      "M10 12a2 2 0 100-4 2 2 0 000 4z",
      "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
    ],
    fill: true,
  },
  "badge-check": {
    viewBox: "0 0 20 20",
    paths: [
      "M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    ],
    fill: true,
  },
  clock: {
    viewBox: "0 0 20 20",
    paths: [
      "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
    ],
    fill: true,
  },
  briefcase: {
    viewBox: "0 0 20 20",
    paths: [
      "M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z",
      "M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z",
    ],
    fill: true,
  },
  heart: {
    viewBox: "0 0 20 20",
    paths: [
      "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z",
    ],
    fill: true,
  },
  lightning: {
    viewBox: "0 0 20 20",
    paths: [
      "M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z",
    ],
    fill: true,
  },
  clipboard: {
    viewBox: "0 0 20 20",
    paths: [
      "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z",
      "M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z",
    ],
    fill: true,
  },
  language: {
    viewBox: "0 0 20 20",
    paths: [
      "M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z",
    ],
    fill: true,
  },
  "map-pin": {
    viewBox: "0 0 20 20",
    paths: [
      "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",
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
      logger.warn(`Icon "${name}" not found`);
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
