import { Switch } from "@/components/ui/inputs";

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
        <h4 className="text-base font-semibold text-zinc-100 mb-1">
          {title}
        </h4>
        <p className="text-sm text-zinc-400">
          {description}
        </p>
      </div>
      <Switch
        label={switchLabel}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}