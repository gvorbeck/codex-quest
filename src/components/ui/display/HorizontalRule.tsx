import { memo } from "react";

interface HorizontalRuleProps {
  className?: string;
}

function HorizontalRuleComponent({ className = "" }: HorizontalRuleProps) {
  return (
    <div className={`py-8 ${className}`}>
      <div className="h-3 bg-stone-100 rounded-full shadow-[0_4px_0_0_#57534e] w-full" />
    </div>
  );
}

export const HorizontalRule = memo(HorizontalRuleComponent);
export default HorizontalRule;
