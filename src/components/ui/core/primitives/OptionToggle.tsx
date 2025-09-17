import { Switch } from "@/components/ui/core/primitives";
import { Typography } from "@/components/ui/core/display";

interface OptionToggleProps {
  title: string;
  description: string;
  switchLabel: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function OptionToggle({
  title,
  description,
  switchLabel,
  checked,
  onCheckedChange,
  className = "",
}: OptionToggleProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div>
        <Typography variant="baseSectionHeading" color="zinc">
          {title}
        </Typography>
        <Typography variant="helper" color="muted">
          {description}
        </Typography>
      </div>
      <Switch
        label={switchLabel}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
