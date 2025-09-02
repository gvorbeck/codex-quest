import { Table, SimpleRoller } from "@/components/ui/display";
import { Typography, Badge } from "@/components/ui/design-system";
import { NumberInput } from "@/components/ui/inputs";
import type { TableColumn } from "@/components/ui/display";
import {
  calculateModifier,
  formatModifier,
} from "@/utils/characterCalculations";

interface CombatantWithInitiative extends Record<string, unknown> {
  name: string;
  ac: number;
  initiative: number;
  isPlayer?: boolean;
  avatar?: string;
  _sortId?: number;
  dexterity?: number | undefined; // DEX score for initiative calculation
  abilities?:
    | {
        dexterity?:
          | {
              value: number;
              modifier: number;
            }
          | undefined;
      }
    | undefined;
  currentHp?: number | undefined;
  maxHp?: number | undefined;
  hp?: { current?: number; max?: number } | number | undefined;
}

interface InitiativeTableProps {
  combatants: CombatantWithInitiative[];
  currentTurn: number;
  isCombatActive: boolean;
  onUpdateInitiative: (index: number, newInitiative: number) => void;
  onSetCurrentTurn: (index: number) => void;
  onUpdateHp?: (index: number, newHp: number) => void;
}

export default function InitiativeTable({
  combatants,
  currentTurn,
  isCombatActive,
  onUpdateInitiative,
  onSetCurrentTurn,
  onUpdateHp,
}: InitiativeTableProps) {
  const combatColumns: TableColumn[] = [
    {
      key: "name",
      header: "Combatant",
      cell: (combatant: Record<string, unknown>) => {
        const c = combatant as CombatantWithInitiative;
        const index = combatants.findIndex(
          (cb) => cb.name === c.name && cb.initiative === c.initiative
        );
        const isCurrentTurn = isCombatActive && index === currentTurn;

        return (
          <div
            className={`flex items-center gap-2 p-1 rounded transition-colors ${
              isCurrentTurn ? "bg-amber-900/30 border border-amber-500/50" : ""
            }`}
          >
            {c.avatar && typeof c.avatar === "string" && (
              <img
                src={c.avatar}
                alt={`${c.name} avatar`}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <Typography
                variant="bodySmall"
                color="zinc"
                className="font-medium truncate block text-sm leading-tight"
                title={c.name}
              >
                {c.name}
              </Typography>
              <div className="flex items-center gap-1 mt-0.5">
                <Typography
                  variant="caption"
                  color="secondary"
                  className="text-xs"
                >
                  AC {c.ac}
                </Typography>
                {c.isPlayer && (
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="text-xs px-1 py-0 h-4"
                  >
                    PLAYER
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      },
      sortable: false,
      width: "40%",
    },
    {
      key: "initiative",
      header: "Initiative ↓",
      cell: (combatant: Record<string, unknown>) => {
        const c = combatant as CombatantWithInitiative;
        const index = combatants.findIndex(
          (cb) => cb.name === c.name && cb.initiative === c.initiative
        );

        // Get DEX modifier - try multiple ways to access it
        let dexModifier = 0;
        if (c.abilities?.dexterity?.modifier !== undefined) {
          dexModifier = c.abilities.dexterity.modifier;
        } else if (c.abilities?.dexterity?.value !== undefined) {
          dexModifier = calculateModifier(c.abilities.dexterity.value);
        } else if (c.dexterity !== undefined) {
          dexModifier = calculateModifier(c.dexterity);
        }

        const initiativeFormula =
          dexModifier === 0 ? "1d6" : `1d6${formatModifier(dexModifier)}`;

        return (
          <SimpleRoller
            formula={initiativeFormula}
            initialValue={c.initiative}
            minValue={1 + Math.min(0, dexModifier)}
            maxValue={6 + Math.max(0, dexModifier)}
            onChange={(value) => {
              if (value !== undefined && value !== c.initiative) {
                onUpdateInitiative(index, value);
              }
            }}
            label={`Initiative for ${c.name}`}
            containerProps={{
              className: "max-w-xs",
            }}
          />
        );
      },
      sortable: false,
      align: "center" as const,
      width: "35%",
    },
    {
      key: "hp",
      header: "HP",
      cell: (combatant: Record<string, unknown>) => {
        const c = combatant as CombatantWithInitiative;
        const index = combatants.findIndex(
          (cb) => cb.name === c.name && cb.initiative === c.initiative
        );

        // Get current HP from various possible formats
        let currentHp = 0;
        let maxHp = 0;

        if (c.currentHp !== undefined) {
          currentHp = c.currentHp;
        } else if (typeof c.hp === "object" && c.hp?.current !== undefined) {
          currentHp = c.hp.current;
        } else if (typeof c.hp === "number") {
          currentHp = c.hp;
        }

        if (c.maxHp !== undefined) {
          maxHp = c.maxHp;
        } else if (typeof c.hp === "object" && c.hp?.max !== undefined) {
          maxHp = c.hp.max;
        } else if (typeof c.hp === "number") {
          maxHp = c.hp;
        }

        return (
          <div className="flex flex-col items-center gap-0.5">
            <NumberInput
              value={currentHp}
              onChange={(value) => {
                if (onUpdateHp && value !== undefined) {
                  onUpdateHp(index, value);
                }
              }}
              minValue={0}
              maxValue={maxHp || 999}
              aria-label={`Current HP for ${c.name}`}
              className="w-14 text-center text-sm h-8"
            />
            {maxHp > 0 && (
              <Typography
                variant="caption"
                color="muted"
                className="text-xs leading-none"
              >
                /{maxHp}
              </Typography>
            )}
          </div>
        );
      },
      align: "center" as const,
      width: "25%",
    },
  ];

  return (
    <Table
      columns={combatColumns}
      data={combatants}
      sort={{ key: "initiative", direction: "desc" }}
      onRowClick={(_combatant, index) => {
        onSetCurrentTurn(index);
      }}
      hoverable
      getRowKey={(combatant: Record<string, unknown>, index: number) =>
        `${(combatant as CombatantWithInitiative).name}-${
          (combatant as CombatantWithInitiative).initiative
        }-${index}`
      }
    />
  );
}
