import React, { useState, useRef, useId } from "react";
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
  const tooltipId = useId();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

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

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-3 py-2 text-sm text-zinc-100 bg-zinc-700 border border-zinc-600 rounded-lg shadow-lg pointer-events-none whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-2 ${className}`}
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-600"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;