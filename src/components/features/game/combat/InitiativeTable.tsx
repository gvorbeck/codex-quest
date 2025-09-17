import { Table } from "@/components/ui/composite";
import { Typography, Badge } from "@/components/ui/core/display";
import { NumberInput, Button } from "@/components/ui/core/primitives";
import { Icon } from "@/components/ui/core/display";
import type { TableColumn } from "@/components/ui/composite";
import type { CombatantWithInitiative } from "@/types";

interface InitiativeTableProps {
  combatants: CombatantWithInitiative[];
  currentTurn: number;
  isCombatActive: boolean;
  loading?: boolean;
  onUpdateInitiative: (
    combatant: CombatantWithInitiative,
    newInitiative: number
  ) => void;
  onSetCurrentTurn: (index: number) => void;
  onUpdateHp?: (combatant: CombatantWithInitiative, newHp: number) => void;
  onDeleteCombatant?: (
    combatant: CombatantWithInitiative,
    index: number
  ) => void;
  onRollInitiativeForMonsters?: () => void;
  showHp?: boolean;
}

export default function InitiativeTable({
  combatants,
  currentTurn,
  isCombatActive,
  loading = false,
  onUpdateInitiative,
  onSetCurrentTurn,
  onUpdateHp,
  onDeleteCombatant,
  onRollInitiativeForMonsters,
  showHp = true,
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
            className={`flex items-center gap-2 p-1 rounded transition-colors max-w-[250px] ${
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

        return (
          <NumberInput
            value={c.initiative || 0}
            onChange={(value) => {
              if (value !== undefined) {
                onUpdateInitiative(c, value);
              }
            }}
            minValue={1}
            maxValue={c.isPlayer ? 6 : 10}
            aria-label={`Initiative for ${c.name}`}
            className="w-20 text-center"
          />
        );
      },
      sortable: false,
      align: "center" as const,
      width: "35%",
    },
  ];

  // Conditionally add HP column if showHp is true
  if (showHp) {
    combatColumns.push({
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
          </div>
        );
      },
      align: "center" as const,
      width: onDeleteCombatant ? "20%" : "25%",
    });
  }

  // Add delete column if onDeleteCombatant is provided
  if (onDeleteCombatant) {
    combatColumns.push({
      key: "actions",
      header: "",
      cell: (combatant: Record<string, unknown>) => {
        const c = combatant as CombatantWithInitiative;
        const index = combatants.findIndex(
          (cb) => cb.name === c.name && cb.initiative === c.initiative
        );

        return (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCombatant(c, index);
            }}
            variant="destructive"
            size="sm"
            aria-label={`Remove ${c.name} from combat`}
            className="p-2 min-w-0"
          >
            <Icon name="trash" size="sm" />
          </Button>
        );
      },
      sortable: false,
      align: "center" as const,
      width: "5%",
    });

    // Adjust column widths when delete column is present
    if (showHp) {
      // With HP column: Combatant | Initiative | HP | Delete
      if (combatColumns[0]) combatColumns[0].width = "35%";
      if (combatColumns[1]) combatColumns[1].width = "30%";
      if (combatColumns[2]) combatColumns[2].width = "20%"; // HP column (adjusted)
    } else {
      // Without HP column: Combatant | Initiative | Delete
      // Give more space to the initiative column so SimpleRoller doesn't get squeezed
      if (combatColumns[0]) combatColumns[0].width = "40%";
      if (combatColumns[1]) combatColumns[1].width = "50%"; // Initiative column (larger, needs more space for SimpleRoller)
    }
  }

  // Check if there are monsters with initiative 0 during combat
  const hasUnrolledMonsters =
    isCombatActive && combatants.some((c) => !c.isPlayer && c.initiative === 0);

  return (
    <div>
      {hasUnrolledMonsters && onRollInitiativeForMonsters && (
        <div className="mb-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRollInitiativeForMonsters();
            }}
            variant="secondary"
            size="sm"
          >
            Roll Initiative for Monsters
          </Button>
        </div>
      )}

      <Table
        columns={combatColumns}
        data={combatants}
        loading={loading}
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
    </div>
  );
}
