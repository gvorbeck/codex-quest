import { Table } from "@/components/ui/display";
import { Typography } from "@/components/ui/design-system";
import RollableButton from "@/components/ui/dice/RollableButton";
import type { TableColumn } from "@/components/ui/display";

interface CombatantWithInitiative extends Record<string, unknown> {
  name: string;
  ac: number;
  initiative: number;
  isPlayer?: boolean;
  avatar?: string;
  _sortId?: number;
}

interface InitiativeTableProps {
  combatants: CombatantWithInitiative[];
  currentTurn: number;
  isCombatActive: boolean;
  onRerollInitiative: (index: number) => void;
  onSetCurrentTurn: (index: number) => void;
}

export default function InitiativeTable({
  combatants,
  currentTurn,
  isCombatActive,
  onRerollInitiative,
  onSetCurrentTurn,
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
            className={`flex items-center gap-3 p-2 rounded transition-colors ${
              isCurrentTurn ? "bg-amber-900/30 border border-amber-500/50" : ""
            }`}
          >
            {c.avatar && typeof c.avatar === "string" && (
              <img
                src={c.avatar}
                alt={`${c.name} avatar`}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <Typography variant="body" color="zinc" className="font-medium">
                {c.name}
                {c.isPlayer && (
                  <span className="ml-2 text-xs text-amber-400 font-semibold">
                    PLAYER
                  </span>
                )}
                {isCurrentTurn && (
                  <span className="ml-2 text-xs text-lime-400 font-semibold">
                    ACTIVE
                  </span>
                )}
              </Typography>
              <Typography variant="bodySmall" color="secondary">
                AC {c.ac}
              </Typography>
            </div>
          </div>
        );
      },
      sortable: false,
    },
    {
      key: "initiative",
      header: "Initiative",
      cell: (combatant: Record<string, unknown>) => {
        const c = combatant as CombatantWithInitiative;
        return (
          <Typography variant="body" color="zinc" className="font-mono text-lg">
            {c.initiative}
          </Typography>
        );
      },
      sortable: true,
      align: "center" as const,
      width: "120px",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (combatant: Record<string, unknown>) => {
        const c = combatant as CombatantWithInitiative;
        const index = combatants.findIndex(
          (cb) => cb.name === c.name && cb.initiative === c.initiative
        );
        return (
          <div className="flex gap-2">
            <RollableButton
              label="Reroll"
              value="🎲"
              onClick={() => onRerollInitiative(index)}
              tooltip={`Re-roll initiative for ${c.name}`}
              size="sm"
            />
          </div>
        );
      },
      align: "right" as const,
      width: "100px",
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
      caption="Combat initiative order - click on a combatant to set their turn"
      getRowKey={(combatant: Record<string, unknown>, index: number) =>
        `${(combatant as CombatantWithInitiative).name}-${
          (combatant as CombatantWithInitiative).initiative
        }-${index}`
      }
    />
  );
}
