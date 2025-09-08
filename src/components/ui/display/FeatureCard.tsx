import { Icon, type IconName } from "@/components/ui/display";

interface FeatureCardProps {
  icon: IconName;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  className = "" 
}: FeatureCardProps) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl bg-primary-800/30 border border-border/30 ${className}`}>
      <Icon
        name={icon}
        size="lg"
        className="text-highlight-400 mt-1 flex-shrink-0"
      />
      <div>
        <h4 className="font-semibold text-text-primary mb-2">
          {title}
        </h4>
        <p className="text-text-secondary text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}