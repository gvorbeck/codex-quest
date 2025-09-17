import { Button } from "@/components/ui/core/primitives";
import { Typography, Card, Badge } from "@/components/ui/core/display";
import { Icon } from "@/components/ui/core/display";
import type { CombatantWithInitiative } from "@/types";

interface CombatantCardProps {
  combatant: CombatantWithInitiative;
  index: number;
  variant: "combat" | "available";
  onAction?: (action: string, index: number) => void;
  isActive?: boolean;
}

export default function CombatantCard({
  combatant,
  index,
  variant,
  onAction,
  isActive = false,
}: CombatantCardProps) {
  return (
    <Card
      size="compact"
      hover
      className={isActive ? "border-amber-500 bg-amber-900/20" : undefined}
      role="listitem"
      aria-label={`${combatant.name}, ${
        combatant.isPlayer ? "Player" : "Monster"
      }, AC ${combatant.ac}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {combatant.avatar && typeof combatant.avatar === "string" && (
            <img
              src={combatant.avatar}
              alt={`${combatant.name} avatar`}
              className="w-6 h-6 rounded-full flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Typography variant="body" color="zinc">
                {combatant.name}
              </Typography>
              {combatant.isPlayer && (
                <Badge variant="secondary" size="sm">
                  PLAYER
                </Badge>
              )}
            </div>
            <Typography variant="bodySmall" color="secondary">
              AC {combatant.ac}
            </Typography>
          </div>
        </div>
        {variant === "combat" ? (
          <Button
            onClick={() => onAction?.("remove", index)}
            variant="destructive"
            size="sm"
            aria-label={`Remove ${combatant.name} from combat`}
          >
            <Icon name="trash" size="sm" />
          </Button>
        ) : (
          <Button
            onClick={() => onAction?.("add", index)}
            variant="primary"
            size="sm"
            aria-label={`Add ${combatant.name} to combat`}
          >
            Add to Combat
          </Button>
        )}
      </div>
    </Card>
  );
}
