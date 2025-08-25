import { Tooltip } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/display/Icon";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export default function InfoTooltip({ content, className = "" }: InfoTooltipProps) {
  return (
    <Tooltip content={content}>
      <Icon
        name="info-question"
        size="sm"
        className={`text-zinc-500 hover:text-zinc-300 cursor-help ${className}`}
        aria-hidden={true}
      />
    </Tooltip>
  );
}