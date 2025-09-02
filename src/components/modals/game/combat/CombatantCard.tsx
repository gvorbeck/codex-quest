import { Button } from "@/components/ui/inputs";
import { Typography } from "@/components/ui/design-system";
import { Icon } from "@/components/ui/display";

interface CombatantWithInitiative {
  name: string;
  ac: number;
  initiative: number;
  isPlayer?: boolean;
  avatar?: string;
}

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
    <div
      className={`p-3 rounded-lg border transition-all duration-200 ${
        isActive
          ? "border-amber-500 bg-amber-900/20"
          : "border-zinc-600 bg-zinc-800/30 hover:border-zinc-500"
      }`}
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
              className="w-6 h-6 rounded-full"
            />
          )}
          <div>
            <Typography variant="body" color="zinc">
              {combatant.name}
              {combatant.isPlayer && (
                <span className="ml-2 text-xs text-amber-400 font-semibold">
                  PLAYER
                </span>
              )}
            </Typography>
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
    </div>
  );
}
