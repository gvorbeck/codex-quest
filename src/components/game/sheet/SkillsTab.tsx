import { memo } from "react";
import { Card, Typography } from "@/components/ui/design-system";
import { LoadingState } from "@/components/ui/feedback";
import type { TableColumn } from "@/components/ui/display/Table";
import {
  CLASSES_WITH_SKILLS,
  SKILL_DESCRIPTIONS,
  ALL_SKILLS,
} from "@/constants";
import type { ClassSkillData, Game, SkillTableRow } from "@/types";
import {
  usePlayerCharacters,
  useSkillDataByClass,
  useSkillColumns,
} from "@/hooks";

interface SkillsTabProps {
  game: Game;
  className?: string;
}

interface SkillClassTableProps {
  classData: ClassSkillData;
  columns: TableColumn<SkillTableRow>[];
}

interface EnhancedSkillTableProps {
  columns: TableColumn<SkillTableRow>[];
  data: SkillTableRow[];
  caption: string;
}

/**
 * Enhanced table with player row highlighting and accessibility features
 */
const EnhancedSkillTable = memo(
  ({ columns, data, caption }: EnhancedSkillTableProps) => {
    return (
      <div className="overflow-x-auto rounded">
        <table
          className="w-full border-collapse text-sm bg-zinc-900"
          role="table"
          aria-label={caption}
        >
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr role="row">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="font-semibold tracking-wide uppercase border-b-2 bg-zinc-700 text-amber-400 border-amber-500/50 px-3 py-2 text-left"
                  style={column.width ? { width: column.width } : undefined}
                  role="columnheader"
                  scope="col"
                  aria-label={
                    column.ariaLabel ||
                    (typeof column.header === "string"
                      ? column.header
                      : undefined)
                  }
                >
                  {typeof column.header === "string" &&
                  column.key in ALL_SKILLS &&
                  SKILL_DESCRIPTIONS[
                    column.key as keyof typeof SKILL_DESCRIPTIONS
                  ] ? (
                    <span
                      className="cursor-help border-b border-dotted border-amber-400/50"
                      title={
                        SKILL_DESCRIPTIONS[
                          column.key as keyof typeof SKILL_DESCRIPTIONS
                        ]
                      }
                    >
                      {column.header}
                    </span>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                role="row"
                className={`
                border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors
                ${
                  row.isPlayer
                    ? "bg-amber-900/20 border-amber-500/30 hover:bg-amber-900/30"
                    : index % 2 === 1
                    ? "bg-zinc-800/30"
                    : ""
                }
              `}
                aria-label={
                  row.isPlayer
                    ? `${row.characterName} at level ${row.level}`
                    : `Level ${row.level} progression`
                }
                data-player={row.isPlayer}
              >
                {columns.map((column) => {
                  const cellContent = column.cell
                    ? column.cell(row)
                    : row[column.key as keyof SkillTableRow];

                  return (
                    <td
                      key={`${row.id}-${column.key}`}
                      className={`px-3 py-2 text-zinc-300 ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                      role="cell"
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

EnhancedSkillTable.displayName = "EnhancedSkillTable";

/**
 * Wrapper component that properly calls the hook
 */
const SkillClassTableWrapper = memo(
  ({ classData }: { classData: ClassSkillData }) => {
    const columns = useSkillColumns(classData);

    return <SkillClassTable classData={classData} columns={columns} />;
  }
);

SkillClassTableWrapper.displayName = "SkillClassTableWrapper";

/**
 * Individual skill class table with enhanced accessibility and performance
 */
const SkillClassTable = memo(({ classData, columns }: SkillClassTableProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
        <Typography
          variant="h4"
          weight="semibold"
          id={`${classData.classId}-heading`}
        >
          {classData.displayName}
        </Typography>
      </div>

      <div className="p-4">
        <EnhancedSkillTable
          columns={columns}
          data={classData.skills}
          caption={`${classData.displayName} skill progression by level`}
        />
      </div>

      {classData.skills.some((skill) => skill.isPlayer) && (
        <div className="px-4 pb-4">
          <div
            className="flex items-center gap-2 text-xs text-zinc-400"
            role="note"
          >
            <div
              className="w-3 h-3 bg-amber-900/20 border border-amber-500/30 rounded"
              aria-hidden="true"
            ></div>
            <span>Player character rows are highlighted</span>
          </div>
        </div>
      )}
    </Card>
  );
});

SkillClassTable.displayName = "SkillClassTable";

export const SkillsTab = memo(({ game, className }: SkillsTabProps) => {
  // Use custom hooks for data management
  const { playerCharacters, loading, error } = usePlayerCharacters(game);
  const skillDataByClass = useSkillDataByClass(playerCharacters, game);

  if (loading) {
    return <LoadingState message="Loading skill data..." />;
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <Typography variant="body" color="secondary">
            {error}
          </Typography>
          <Typography variant="caption" color="muted" className="mt-2 block">
            Unable to load player character data. Please try refreshing the
            page.
          </Typography>
        </div>
      </Card>
    );
  }

  if (skillDataByClass.length === 0) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <Typography variant="body" color="secondary">
            No players with skill-based classes found in this game.
          </Typography>
          <Typography variant="caption" color="muted" className="mt-2 block">
            Classes with skills:{" "}
            {Object.values(CLASSES_WITH_SKILLS)
              .map((c) => c.displayName)
              .join(", ")}
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={className}
      role="region"
      aria-label="Skill progression tables"
    >
      <div className="space-y-6">
        {skillDataByClass.map((classData) => (
          <SkillClassTableWrapper
            key={classData.classId}
            classData={classData}
          />
        ))}
      </div>
    </div>
  );
});

SkillsTab.displayName = "SkillsTab";
