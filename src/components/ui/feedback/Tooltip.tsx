import React, { useState, useRef, useId, useLayoutEffect, useCallback, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { 
  createTooltipPositioner,
  type TooltipPosition,
  type PositioningOptions 
} from "@/utils/tooltipUtils";

interface TooltipProps {
  /** The content to show in the tooltip */
  content: string;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Additional CSS classes for the tooltip */
  className?: string;
  /** Preferred position relative to trigger element */
  preferredPosition?: 'above' | 'below' | undefined;
  /** Custom positioning options */
  positioningOptions?: Partial<PositioningOptions> | undefined;
  /** Whether to disable the tooltip */
  disabled?: boolean;
}

/**
 * Tooltip component with smart positioning and accessibility features
 * Automatically adjusts position to stay within viewport boundaries
 * Supports keyboard navigation and screen readers
 */
const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  className = "",
  preferredPosition = 'above',
  positioningOptions,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const [isBelow, setIsBelow] = useState(false);
  const [arrowOffset, setArrowOffset] = useState(0);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Create memoized positioner with options
  const positioner = useMemo(() => createTooltipPositioner({
    preferredPosition,
    ...positioningOptions
  }), [preferredPosition, positioningOptions]);

  /**
   * Updates tooltip position using extracted positioning utilities
   * Includes error handling and fallback positioning
   */
  const updatePosition = useCallback(() => {
    if (!isVisible || disabled) return;
    
    try {
      if (!triggerRef.current || !tooltipRef.current) {
        console.warn('Tooltip: Missing DOM references for positioning');
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      const result = positioner(triggerRect, tooltipRect);
      
      setPosition(result.position);
      setIsBelow(result.isBelow);
      setArrowOffset(result.arrowOffset);
      
    } catch (error) {
      console.error('Tooltip positioning error:', error);
      // Fallback to simple center positioning
      setPosition({ 
        top: window.innerHeight / 2, 
        left: window.innerWidth / 2 
      });
      setIsBelow(false);
      setArrowOffset(0);
    }
  }, [isVisible, disabled, positioner]);

  // Memoized event handlers to reduce re-renders
  const showTooltipHandlers = useMemo(() => ({
    onMouseEnter: () => {
      if (!disabled) {
        setIsVisible(true);
      }
    },
    onFocus: () => {
      if (!disabled) {
        setIsVisible(true);
      }
    },
  }), [disabled]);

  const hideTooltipHandlers = useMemo(() => ({
    onMouseLeave: () => {
      setIsVisible(false);
    },
    onBlur: () => {
      setIsVisible(false);
    },
  }), []);

  // Update position when tooltip becomes visible or content changes
  useLayoutEffect(() => {
    if (isVisible && !disabled) {
      // Small delay to ensure tooltip is fully rendered with correct dimensions
      const timeoutId = setTimeout(updatePosition, 0);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isVisible, content, updatePosition, disabled]);

  // Handle viewport resize for responsive positioning
  useLayoutEffect(() => {
    if (!isVisible || disabled) return undefined;

    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isVisible, updatePosition, disabled]);

  // Handle escape key for better keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isVisible]);

  // Don't render tooltip if disabled or content is empty
  if (disabled || !content.trim()) {
    return <>{children}</>;
  }

  const tooltipPortal = isVisible ? createPortal(
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      className={`fixed z-[9999] px-3 py-2 text-sm text-zinc-100 bg-zinc-700 border border-zinc-600 rounded-lg shadow-lg pointer-events-none whitespace-nowrap transform -translate-x-1/2 transition-opacity duration-200 ${className}`}
      style={{
        top: position.top,
        left: position.left,
      }}
      aria-hidden={!isVisible}
    >
      {content}
      {/* Arrow */}
      {isBelow ? (
        // Arrow pointing up (tooltip is below trigger)
        <div 
          className="absolute bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-zinc-600"
          style={{
            left: `calc(50% + ${arrowOffset}px)`,
            transform: 'translateX(-50%)'
          }}
          aria-hidden="true"
        />
      ) : (
        // Arrow pointing down (tooltip is above trigger)
        <div 
          className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-600"
          style={{
            left: `calc(50% + ${arrowOffset}px)`,
            transform: 'translateX(-50%)'
          }}
          aria-hidden="true"
        />
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        {...showTooltipHandlers}
        {...hideTooltipHandlers}
        aria-describedby={isVisible ? tooltipId : undefined}
        tabIndex={0} // Make focusable for keyboard navigation
      >
        {children}
      </div>
      {tooltipPortal}
    </div>
  );
};

export default Tooltip;