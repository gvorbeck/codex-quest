/**
 * Utility functions for tooltip positioning and calculations
 * Extracted from Tooltip component for better maintainability and reusability
 */

// Memoization cache for expensive calculations
const positionCache = new Map<string, TooltipPositionResult>();
const CACHE_SIZE_LIMIT = 100;

export interface TooltipPosition {
  top: number;
  left: number;
}

export interface PositioningOptions {
  /** Minimum distance from screen edge */
  padding: number;
  /** Gap between tooltip and trigger element */
  gap: number;
  /** Preferred position relative to trigger */
  preferredPosition: 'above' | 'below';
}

export interface TooltipPositionResult {
  position: TooltipPosition;
  isBelow: boolean;
  arrowOffset: number;
}

/**
 * Gets responsive padding based on viewport width
 * Provides more padding on mobile devices for better touch interaction
 * 
 * @returns Padding value in pixels
 */
export const getResponsivePadding = (): number => {
  return window.innerWidth < 640 ? 16 : 8; // More padding on mobile
};

/**
 * Calculates the arrow offset to point at the trigger element center
 * Clamps the offset to keep the arrow within reasonable bounds of the tooltip
 * 
 * @param triggerCenterX - X coordinate of trigger element center
 * @param tooltipLeft - X coordinate of tooltip left position
 * @param tooltipWidth - Width of the tooltip element
 * @returns Arrow offset from tooltip center in pixels
 */
export const calculateArrowOffset = (
  triggerCenterX: number,
  tooltipLeft: number,
  tooltipWidth: number
): number => {
  const arrowOffsetFromCenter = triggerCenterX - tooltipLeft;
  const halfTooltipWidth = tooltipWidth / 2;
  const maxArrowOffset = halfTooltipWidth - 12; // 12px from edge
  
  return Math.max(-maxArrowOffset, Math.min(maxArrowOffset, arrowOffsetFromCenter));
};

/**
 * Determines if tooltip should be positioned below the trigger element
 * Considers available space above and below the trigger
 * 
 * @param triggerRect - Bounding rectangle of trigger element
 * @param tooltipHeight - Height of tooltip element
 * @param options - Positioning options
 * @returns True if tooltip should be positioned below
 */
export const shouldPositionBelow = (
  triggerRect: DOMRect,
  tooltipHeight: number,
  options: PositioningOptions
): boolean => {
  const spaceAbove = triggerRect.top - options.padding - options.gap;
  const spaceBelow = window.innerHeight - triggerRect.bottom - options.padding - options.gap;
  
  // If preferred position is below and there's enough space, use below
  if (options.preferredPosition === 'below' && spaceBelow >= tooltipHeight) {
    return true;
  }
  
  // If preferred position is above and there's enough space, use above
  if (options.preferredPosition === 'above' && spaceAbove >= tooltipHeight) {
    return false;
  }
  
  // Choose position with more available space
  return spaceBelow >= spaceAbove;
};

/**
 * Calculates vertical position of tooltip
 * 
 * @param triggerRect - Bounding rectangle of trigger element
 * @param tooltipHeight - Height of tooltip element
 * @param isBelow - Whether tooltip should be positioned below trigger
 * @param options - Positioning options
 * @returns Vertical position in pixels
 */
export const calculateVerticalPosition = (
  triggerRect: DOMRect,
  tooltipHeight: number,
  isBelow: boolean,
  options: PositioningOptions
): number => {
  if (isBelow) {
    return triggerRect.bottom + options.gap;
  }
  
  return triggerRect.top - tooltipHeight - options.gap;
};

/**
 * Calculates horizontal position of tooltip with boundary checking
 * Ensures tooltip stays within viewport with proper padding
 * 
 * @param triggerRect - Bounding rectangle of trigger element
 * @param tooltipWidth - Width of tooltip element
 * @param options - Positioning options
 * @returns Horizontal position in pixels
 */
export const calculateHorizontalPosition = (
  triggerRect: DOMRect,
  tooltipWidth: number,
  options: PositioningOptions
): number => {
  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const halfTooltipWidth = tooltipWidth / 2;
  let tooltipLeft = triggerCenterX;
  
  // Check if tooltip would go off the left edge
  if (tooltipLeft - halfTooltipWidth < options.padding) {
    tooltipLeft = options.padding + halfTooltipWidth;
  }
  // Check if tooltip would go off the right edge
  else if (tooltipLeft + halfTooltipWidth > window.innerWidth - options.padding) {
    tooltipLeft = window.innerWidth - options.padding - halfTooltipWidth;
  }
  
  return tooltipLeft;
};

/**
 * Creates a cache key for memoization
 */
function createCacheKey(triggerRect: DOMRect, tooltipRect: DOMRect, options: PositioningOptions): string {
  return `${triggerRect.left},${triggerRect.top},${triggerRect.width},${triggerRect.height}|${tooltipRect.width},${tooltipRect.height}|${options.padding},${options.gap},${options.preferredPosition}`;
}

/**
 * Manages cache size to prevent memory leaks
 */
function manageCacheSize(): void {
  if (positionCache.size > CACHE_SIZE_LIMIT) {
    const firstKey = positionCache.keys().next().value as string;
    if (firstKey) {
      positionCache.delete(firstKey);
    }
  }
}

/**
 * Main function to calculate optimal tooltip position
 * Handles viewport boundaries, collision detection, and arrow positioning
 * Uses memoization for performance optimization
 *
 * @param triggerRect - Bounding rectangle of trigger element
 * @param tooltipRect - Bounding rectangle of tooltip element
 * @param options - Positioning options
 * @returns Complete positioning result with coordinates and metadata
 */
export const calculateTooltipPosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  options: PositioningOptions = {
    padding: getResponsivePadding(),
    gap: 4,
    preferredPosition: 'above'
  }
): TooltipPositionResult => {
  // Check cache first
  const cacheKey = createCacheKey(triggerRect, tooltipRect, options);
  if (positionCache.has(cacheKey)) {
    return positionCache.get(cacheKey)!;
  }

  const tooltipWidth = tooltipRect.width || 200; // Fallback width
  const tooltipHeight = tooltipRect.height || 40; // Fallback height

  // Determine vertical positioning
  const isBelow = shouldPositionBelow(triggerRect, tooltipHeight, options);

  // Calculate positions
  const top = calculateVerticalPosition(triggerRect, tooltipHeight, isBelow, options);
  const left = calculateHorizontalPosition(triggerRect, tooltipWidth, options);

  // Calculate arrow offset
  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const arrowOffset = calculateArrowOffset(triggerCenterX, left, tooltipWidth);

  const result: TooltipPositionResult = {
    position: { top, left },
    isBelow,
    arrowOffset
  };

  // Cache the result
  manageCacheSize();
  positionCache.set(cacheKey, result);

  return result;
};

/**
 * Creates a tooltip positioner with preset options
 * Useful for consistent positioning across components
 * 
 * @param defaultOptions - Default positioning options
 * @returns Function to calculate positions with the given defaults
 */
export const createTooltipPositioner = (defaultOptions: Partial<PositioningOptions> = {}) => {
  const options: PositioningOptions = {
    padding: getResponsivePadding(),
    gap: 4,
    preferredPosition: 'above',
    ...defaultOptions
  };
  
  return (triggerRect: DOMRect, tooltipRect: DOMRect, overrides?: Partial<PositioningOptions>) => {
    const finalOptions = { ...options, ...overrides };
    return calculateTooltipPosition(triggerRect, tooltipRect, finalOptions);
  };
};