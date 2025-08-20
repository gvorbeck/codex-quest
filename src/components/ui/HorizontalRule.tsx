import { memo } from "react";

interface HorizontalRuleProps {
  className?: string;
}

function HorizontalRuleComponent({ className = "" }: HorizontalRuleProps) {
  return (
    <div className={`py-8 ${className}`}>
      <div className="h-3 bg-amber-400 rounded-full shadow-[0_4px_0_0_#d97706] w-full" />
    </div>
  );
}

export const HorizontalRule = memo(HorizontalRuleComponent);
export default HorizontalRule;
