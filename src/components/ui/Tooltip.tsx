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
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      const newPosition = {
        top: rect.top - 40, // 40px above the trigger (viewport-relative)
        left: rect.left + rect.width / 2, // Center horizontally (viewport-relative)
      };
      
      setPosition(newPosition);
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
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-600"></div>
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