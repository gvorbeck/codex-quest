import { Table, SimpleRoller } from "@/components/ui/display";
import { Typography, Badge } from "@/components/ui/design-system";
import { NumberInput } from "@/components/ui/inputs";
import type { TableColumn } from "@/components/ui/display";
import { formatModifier } from "@/utils/characterCalculations";

import type { CombatantWithInitiative } from "@/utils/combatUtils";

interface InitiativeTableProps {
  combatants: CombatantWithInitiative[];
  currentTurn: number;
  isCombatActive: boolean;
  onUpdateInitiative: (
    combatant: CombatantWithInitiative,
    newInitiative: number
  ) => void;
  onSetCurrentTurn: (index: number) => void;
  onUpdateHp?: (combatant: CombatantWithInitiative, newHp: number) => void;
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

        const dexModifier = c.dexModifier;
        const initiativeFormula =
          dexModifier === 0 ? "1d6" : `1d6${formatModifier(dexModifier)}`;

        return (
          <SimpleRoller
            key={`${c.name}-stable`}
            formula={initiativeFormula}
            initialValue={c.initiative}
            minValue={1 + Math.min(0, dexModifier)}
            maxValue={6 + Math.max(0, dexModifier)}
            onChange={(value) => {
              if (value !== undefined) {
                onUpdateInitiative(c, value);
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

        const { current: currentHp, max: maxHp } = c.hp;

        return (
          <div className="flex flex-col items-center gap-0.5">
            <NumberInput
              value={currentHp}
              onChange={(value) => {
                if (onUpdateHp && value !== undefined) {
                  onUpdateHp(c, value);
                }
              }}
              minValue={0}
              maxValue={maxHp}
              aria-label={`Current HP for ${c.name}`}
              className="w-14 text-center text-sm h-8"
            />
            <Typography
              variant="caption"
              color="muted"
              className="text-xs leading-none"
            >
              /{maxHp}
            </Typography>
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
