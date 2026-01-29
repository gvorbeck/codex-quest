import { forwardRef, useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { cn } from "@/utils";

type ImageVariant = "logo" | "avatar" | "standard";
type ImageSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size"> {
  src: string;
  alt: string;
  variant?: ImageVariant;
  size?: ImageSize;
  fallback?: string | React.ReactElement;
  onError?: (error: React.SyntheticEvent<HTMLImageElement>) => void;
}

// Size styles constant - extracted to module level for performance
const SIZE_STYLES: Record<ImageSize, string> = {
  xs: "w-6 h-6",
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

// Helper to get variant styles
const getVariantStyles = (size?: ImageSize): Record<ImageVariant, string> => ({
  logo: "",
  avatar: cn(
    "rounded-full object-cover border-2 border-zinc-600",
    size ? SIZE_STYLES[size] : ""
  ),
  standard: "object-cover",
});

/**
 * Image component with consistent loading, error handling, and styling patterns.
 *
 * @example
 * // Logo image with eager loading
 * <Image variant="logo" src="/logo.png" alt="App logo" />
 *
 * @example
 * // Avatar with fallback initials
 * <Image variant="avatar" size="md" src={url} alt="User" fallback="JD" />
 *
 * @example
 * // Standard image with lazy loading
 * <Image src={url} alt="Description" loading="lazy" />
 */
const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      variant = "standard",
      size,
      fallback,
      onError,
      className,
      loading,
      ...props
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false);

    // Handle image load errors
    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      onError?.(e);
    };

    // Variant-specific default loading strategy
    const defaultLoading = variant === "logo" ? "eager" : "lazy";
    const imageLoading = loading ?? defaultLoading;

    // Get variant styles
    const variantStyles = getVariantStyles(size);
    const imageClasses = cn(variantStyles[variant], className);

    // Show fallback if error occurred and fallback is provided
    if (hasError && fallback) {
      // If fallback is a string (e.g., initials), render as text
      if (typeof fallback === "string") {
        const fallbackClasses = cn(
          "flex items-center justify-center bg-zinc-700 border-2 border-zinc-600 flex-shrink-0",
          variant === "avatar" && "rounded-full",
          size ? SIZE_STYLES[size] : "",
          className
        );

        return (
          <div className={fallbackClasses} aria-label={alt}>
            <span className="text-zinc-300 font-bold" aria-hidden="true">
              {fallback}
            </span>
          </div>
        );
      }

      // If fallback is a React node, render it directly
      return <>{fallback}</>;
    }

    // Hide image if error and no fallback
    if (hasError) {
      return null;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={imageLoading}
        onError={handleError}
        className={imageClasses}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export default Image;
