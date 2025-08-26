import React, { useState, useRef, useId, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface TooltipProps {
  /** The content to show in the tooltip */
  content: string;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Additional CSS classes for the tooltip */
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isBelow, setIsBelow] = useState(false);
  const [arrowOffset, setArrowOffset] = useState(0);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 200; // Approximate tooltip width
      const tooltipHeight = 40; // Approximate tooltip height
      const padding = 8; // Minimum distance from screen edge
      
      let top = rect.top - tooltipHeight - 4; // 4px gap above trigger
      let left = rect.left + rect.width / 2; // Center horizontally
      const triggerCenter = rect.left + rect.width / 2; // Store original center position
      
      // Check horizontal bounds and adjust
      let adjustedLeft = left;
      if (left - tooltipWidth / 2 < padding) {
        // Too far left, align to left edge with padding
        adjustedLeft = padding + tooltipWidth / 2;
      } else if (left + tooltipWidth / 2 > window.innerWidth - padding) {
        // Too far right, align to right edge with padding
        adjustedLeft = window.innerWidth - padding - tooltipWidth / 2;
      }
      
      // Calculate arrow offset from center of tooltip to point at trigger
      const arrowOffsetFromCenter = triggerCenter - adjustedLeft;
      setArrowOffset(arrowOffsetFromCenter);
      
      // Check vertical bounds and adjust
      if (top < padding) {
        // Not enough space above, position below instead
        top = rect.bottom + 4;
        setIsBelow(true);
      } else {
        setIsBelow(false);
      }
      
      setPosition({ top, left: adjustedLeft });
    }
  };

  const showTooltip = () => {
    updatePosition();
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  // Update position when tooltip becomes visible
  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    showTooltip();
  };

  const handleBlur = () => {
    hideTooltip();
  };

  const tooltipPortal = isVisible ? createPortal(
    <div
      id={tooltipId}
      role="tooltip"
      className={`fixed z-[9999] px-3 py-2 text-sm text-zinc-100 bg-zinc-700 border border-zinc-600 rounded-lg shadow-lg pointer-events-none whitespace-nowrap transform -translate-x-1/2 ${className}`}
      style={{
        top: position.top,
        left: position.left,
      }}
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
        ></div>
      ) : (
        // Arrow pointing down (tooltip is above trigger)
        <div 
          className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-600"
          style={{
            left: `calc(50% + ${arrowOffset}px)`,
            transform: 'translateX(-50%)'
          }}
        ></div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      {tooltipPortal}
    </div>
  );
};

export default Tooltip;