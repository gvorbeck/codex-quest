import { Switch } from "@/components/ui/inputs";
import { Typography } from "@/components/ui/design-system";

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
    <div className={`flex items-center justify-between ${className}`}>
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
