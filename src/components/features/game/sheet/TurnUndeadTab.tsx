import { memo, useMemo } from "react";
import { Card, Typography } from "@/components/ui/core/display";
import {
  LoadingState,
  Callout,
  ErrorBoundary,
} from "@/components/ui/core/feedback";
import Table from "@/components/ui/composite/Table";
import type { TableColumn } from "@/components/ui/composite/Table";
import { TURN_UNDEAD_TABLE, formatTurnUndeadResult } from "@/data/turnUndead";
import type { Game } from "@/types";
import { usePlayerCharacters } from "@/hooks";

interface TurnUndeadTabProps {
  game: Game;
  className?: string;
}

interface TurnUndeadRow extends Record<string, string | number> {
  undeadType: string;
  hitDice: string;
}

interface ClericInParty {
  name: string;
  level: number;
}

// Helper function to generate consistent cleric column keys
const getClericKey = (clericName: string): string => `cleric_${clericName}`;

// Helper to format display value for table cells
const formatDisplayValue = (value: string | number): string => {
  if (value === "No") return "—";
  if (value === "T" || value === "D") return String(value);
  return `${value}+`;
};

// Helper to get color class based on value
const getColorClass = (value: string | number): string => {
  if (value === "D") return "text-green-400 font-semibold";
  if (value === "T") return "text-blue-400 font-semibold";
  if (value === "No") return "text-red-400/60";
  return "text-zinc-300";
};

// Extracted components to avoid inline component definitions
const UndeadTypeCell = ({ undeadType }: { undeadType: string }) => (
  <span className="font-medium text-zinc-100">{undeadType}</span>
);

const HitDiceCell = ({ hitDice }: { hitDice: string }) => (
  <span className="text-zinc-400 text-xs">{hitDice}</span>
);

const ClericHeader = ({ name, level }: { name: string; level: number }) => (
  <div className="flex flex-col w-full text-center">
    <span className="text-xs">{name}</span>
    <span className="text-[10px] text-amber-300/70 font-normal">
      (Lvl {level})
    </span>
  </div>
);

const TurnUndeadCell = ({ value }: { value: string | number }) => {
  const displayValue = formatDisplayValue(value);
  const colorClass = getColorClass(value);

  return (
    <span className={colorClass} title={formatTurnUndeadResult(value)}>
      {displayValue}
    </span>
  );
};

// Cell renderer functions to avoid inline arrow functions in column definitions
const renderUndeadTypeCell = (row: TurnUndeadRow) => (
  <UndeadTypeCell undeadType={row.undeadType} />
);

const renderHitDiceCell = (row: TurnUndeadRow) => (
  <HitDiceCell hitDice={row.hitDice} />
);

const renderClericCell =
  (clericKey: `cleric_${string}`) => (row: TurnUndeadRow) => {
    const value = row[clericKey] ?? "No";
    return <TurnUndeadCell value={value} />;
  };

const TurnUndeadTabContent = memo(({ game, className }: TurnUndeadTabProps) => {
  const { playerCharacters, loading, error } = usePlayerCharacters(game);

  // Find all clerics and their levels
  const clericsInParty = useMemo((): ClericInParty[] => {
    return playerCharacters
      .filter((char) => char.hasTurnUndead === true)
      .map((char) => ({
        name: char.name,
        level: char.level ?? 1,
      }));
  }, [playerCharacters]);

  // Build table data with cleric columns
  const tableData = useMemo(() => {
    return TURN_UNDEAD_TABLE.map((entry) => {
      const row: TurnUndeadRow = {
        undeadType: entry.undeadType,
        hitDice: entry.hitDice,
      };

      // Add a column for each cleric
      clericsInParty.forEach((cleric) => {
        const result = entry.levelRequirements[cleric.level] ?? "No";
        row[getClericKey(cleric.name) as `cleric_${string}`] = result;
      });

      return row;
    });
  }, [clericsInParty]);

  // Build table columns dynamically based on clerics in party
  const columns = useMemo((): TableColumn<TurnUndeadRow>[] => {
    const baseColumns: TableColumn<TurnUndeadRow>[] = [
      {
        key: "undeadType",
        header: "Undead Type",
        width: "150px",
        align: "left",
        ariaLabel: "Type of undead creature",
        cell: renderUndeadTypeCell,
      },
      {
        key: "hitDice",
        header: "Hit Dice",
        width: "120px",
        align: "left",
        ariaLabel: "Hit dice of undead creature",
        cell: renderHitDiceCell,
      },
    ];

    const clericColumns: TableColumn<TurnUndeadRow>[] = clericsInParty.map(
      (cleric) => ({
        key: getClericKey(cleric.name),
        header: <ClericHeader name={cleric.name} level={cleric.level} />,
        align: "center" as const,
        ariaLabel: `Turn Undead roll for ${cleric.name} level ${cleric.level}`,
        cell: renderClericCell(getClericKey(cleric.name) as `cleric_${string}`),
      }),
    );

    return [...baseColumns, ...clericColumns];
  }, [clericsInParty]);

  if (loading) {
    return <LoadingState message="Loading Turn Undead data..." />;
  }

  if (error) {
    return (
      <Callout
        variant="error"
        title="Unable to Load Character Data"
        className={className}
      >
        {error}. Please try refreshing the page.
      </Callout>
    );
  }

  if (clericsInParty.length === 0) {
    return (
      <Callout
        variant="info"
        title="No Turn Undead Characters"
        className={className}
      >
        The Turn Undead table appears when the party includes a Cleric, Paladin,
        or other class with this ability.
      </Callout>
    );
  }

  return (
    <section className={className} aria-label="Turn Undead reference table">
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-zinc-700">
          <Typography variant="h4" weight="semibold">
            Turn Undead Table
          </Typography>
          <Typography variant="caption" color="muted" className="mt-1 block">
            Roll 1d20. Numbers show minimum roll needed to turn. T = Auto Turn,
            D = Auto Destroy
          </Typography>
        </div>

        <div className="p-4">
          <Table
            columns={columns as TableColumn<Record<string, unknown>>[]}
            data={tableData as Record<string, unknown>[]}
            size="sm"
            striped
            hoverable
            caption="Turn Undead requirements showing minimum d20 roll needed for each undead type and cleric level"
            getRowKey={(row) => (row as TurnUndeadRow).undeadType}
          />
        </div>

        <div className="px-4 pb-4 space-y-2">
          <div className="text-xs text-zinc-400" role="note">
            <Typography variant="caption" color="muted" weight="semibold">
              Legend:
            </Typography>
            <ul className="mt-1 space-y-1 ml-4 list-disc">
              <li>
                <span className="text-zinc-300">Number (e.g., 13+)</span> -
                Minimum d20 roll needed to turn
              </li>
              <li>
                <span className="text-blue-400 font-semibold">T</span> - Auto
                Turn (undead automatically turned, no roll needed)
              </li>
              <li>
                <span className="text-green-400 font-semibold">D</span> - Auto
                Destroy (undead automatically destroyed)
              </li>
              <li>
                <span className="text-red-400/60">—</span> - Cannot Turn
                (character cannot affect these undead)
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
});

TurnUndeadTabContent.displayName = "TurnUndeadTabContent";

// Export with ErrorBoundary wrapper
export const TurnUndeadTab = (props: TurnUndeadTabProps) => (
  <ErrorBoundary>
    <TurnUndeadTabContent {...props} />
  </ErrorBoundary>
);

TurnUndeadTab.displayName = "TurnUndeadTab";
