import { Card, Typography, Badge } from "@/components/ui/design-system";
import { Button } from "@/components/ui/inputs";
import { Icon } from "@/components/ui";
import type { Cantrip } from "@/types/character";
import type { SpellTypeInfo } from "@/utils/cantrips";

interface CantripCardProps {
  cantrip: Cantrip;
  spellTypeInfo: SpellTypeInfo;
  onRemove?: (cantripName: string) => void;
  showRemove?: boolean;
  className?: string;
}

export default function CantripCard({
  cantrip,
  spellTypeInfo,
  onRemove,
  showRemove = true,
  className = "",
}: CantripCardProps) {
  return (
    <Card 
      className={`p-4 ${className}`}
      variant="standard"
      role="article"
      aria-labelledby={`cantrip-${cantrip.name.replace(/\s+/g, '-').toLowerCase()}-title`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Icon
              name="lightning"
              size="md"
              className="text-blue-400"
              aria-hidden={true}
            />
            <Typography 
              variant="subHeading" 
              className="text-zinc-100"
              id={`cantrip-${cantrip.name.replace(/\s+/g, '-').toLowerCase()}-title`}
            >
              {cantrip.name}
            </Typography>
            <Badge 
              variant="status"
              aria-label={`This is a ${spellTypeInfo.singular}`}
            >
              {spellTypeInfo.capitalizedSingular}
            </Badge>
          </div>
          <Typography
            variant="caption"
            className="text-zinc-400 text-sm"
            aria-describedby={`cantrip-${cantrip.name.replace(/\s+/g, '-').toLowerCase()}-title`}
          >
            {cantrip.description}
          </Typography>
        </div>
        {showRemove && onRemove && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(cantrip.name)}
            className="text-zinc-400 hover:text-red-400"
            aria-label={`Remove ${cantrip.name} ${spellTypeInfo.singular}`}
          >
            <Icon name="trash" size="sm" aria-hidden={true} />
          </Button>
        )}
      </div>
    </Card>
  );
}