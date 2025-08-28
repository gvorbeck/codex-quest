import { Select } from "@/components/ui/inputs";
import Card from "@/components/ui/design-system/Card";
import Typography from "@/components/ui/design-system/Typography";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { LEVEL_UP_CONSTANTS } from "@/constants/levelUp";
import type { SpellGainInfo } from "@/hooks/useSpellSelection";
import type { Spell } from "@/types/character";

interface SpellSelectionSectionProps {
  spellGainInfo: SpellGainInfo;
  organizedSpells: Array<{
    spellLevel: number;
    count: number;
    spells: Spell[];
  }>;
  selectedSpells: Record<string, string>;
  selectedSpellCount: number;
  isLoadingSpells: boolean;
  error: string | null;
  nextLevel: number;
  onSpellSelection: (selectionKey: string, spellName: string) => void;
  onClearError: () => void;
}

export default function SpellSelectionSection({
  spellGainInfo,
  organizedSpells,
  selectedSpells,
  selectedSpellCount,
  isLoadingSpells,
  error,
  nextLevel,
  onSpellSelection,
  onClearError,
}: SpellSelectionSectionProps) {
  if (error) {
    return (
      <Card variant="standard" size="default">
        <Typography variant="sectionHeading" color="accent" className="mb-4">
          Error Loading Spells
        </Typography>
        <Typography variant="body" color="primary" className="mb-4">
          {error}
        </Typography>
        <button
          onClick={onClearError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </Card>
    );
  }

  return (
    <Card variant="info" size="default">
      <Typography variant="sectionHeading" color="amber" className="mb-4">
        ✨ New Spells Available!
      </Typography>
      <Typography variant="body" color="primary" className="mb-4">
        You gain {spellGainInfo.totalSpellsGained} new spell
        {spellGainInfo.totalSpellsGained > 1 ? "s" : ""} at level {nextLevel}!
      </Typography>

      {isLoadingSpells ? (
        <LoadingSpinner message="Loading available spells..." />
      ) : (
        <div className="space-y-6">
          {organizedSpells.map((levelGroup) => (
            <SpellLevelGroup
              key={levelGroup.spellLevel}
              levelGroup={levelGroup}
              selectedSpells={selectedSpells}
              onSpellSelection={onSpellSelection}
            />
          ))}

          {selectedSpellCount < spellGainInfo.totalSpellsGained && (
            <Typography variant="caption" color="amber" className="block mt-2">
              Please select all {spellGainInfo.totalSpellsGained} spell
              {spellGainInfo.totalSpellsGained > 1 ? "s" : ""} to continue.
            </Typography>
          )}
        </div>
      )}
    </Card>
  );
}

interface SpellLevelGroupProps {
  levelGroup: {
    spellLevel: number;
    count: number;
    spells: Spell[];
  };
  selectedSpells: Record<string, string>;
  onSpellSelection: (selectionKey: string, spellName: string) => void;
}

function SpellLevelGroup({
  levelGroup,
  selectedSpells,
  onSpellSelection,
}: SpellLevelGroupProps) {
  return (
    <div className="space-y-4">
      <Typography
        variant="subHeading"
        color="amber"
        className="border-b border-amber-700/30 pb-2"
      >
        Level {levelGroup.spellLevel} Spells ({levelGroup.count} to select)
      </Typography>

      {Array.from({ length: levelGroup.count }).map((_, index) => {
        const selectionKey = `level-${levelGroup.spellLevel}-spell-${index}`;
        const currentSelection = selectedSpells[selectionKey] || "";

        const spellOptions = levelGroup.spells
          .filter((spell) => {
            const isAlreadySelected = Object.entries(selectedSpells).some(
              ([key, value]) => key !== selectionKey && value === spell.name
            );
            return !isAlreadySelected || currentSelection === spell.name;
          })
          .map((spell) => ({
            value: spell.name,
            label: spell.name,
          }));

        return (
          <div key={selectionKey}>
            <Select
              label={
                levelGroup.count > 1
                  ? `Level ${levelGroup.spellLevel} Spell ${index + 1}`
                  : `Level ${levelGroup.spellLevel} Spell`
              }
              value={currentSelection}
              onValueChange={(value) => onSpellSelection(selectionKey, value)}
              options={spellOptions}
              placeholder="Choose a spell"
              size="sm"
              required
              aria-describedby={`spell-${selectionKey}-description`}
              aria-label={`Select spell ${index + 1} of ${
                levelGroup.count
              } for level ${levelGroup.spellLevel}`}
            />

            {/* Show spell details when selected */}
            {currentSelection && (
              <SpellDetails
                spell={levelGroup.spells.find(
                  (s) => s.name === currentSelection
                )}
                selectionKey={selectionKey}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface SpellDetailsProps {
  spell: Spell | undefined;
  selectionKey: string;
}

function SpellDetails({ spell, selectionKey }: SpellDetailsProps) {
  if (!spell) return null;

  return (
    <Card
      variant="nested"
      size="compact"
      className="mt-2"
      id={`spell-${selectionKey}-description`}
    >
      <div>
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
          <Typography variant="caption" color="secondary">
            <strong>Range:</strong> {spell.range}
          </Typography>
          <Typography variant="caption" color="secondary">
            <strong>Duration:</strong> {spell.duration}
          </Typography>
        </div>
        <Typography variant="caption" color="secondary" className="text-xs">
          {spell.description.length > LEVEL_UP_CONSTANTS.SPELL_DESCRIPTION_LIMIT
            ? `${spell.description.substring(
                0,
                LEVEL_UP_CONSTANTS.SPELL_DESCRIPTION_LIMIT
              )}...`
            : spell.description}
        </Typography>
      </div>
    </Card>
  );
}
