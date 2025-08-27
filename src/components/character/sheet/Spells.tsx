import { useMemo } from "react";
import type { Character, Spell, Cantrip } from "@/types/character";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Accordion } from "@/components/ui/layout";
import { Badge, Card, Typography } from "@/components/ui/design-system";
import { allClasses } from "@/data/classes";

interface SpellsProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface SpellWithLevel extends Spell {
  spellLevel: number;
  uniqueKey: string; // Unique identifier for accordion grouping
  [key: string]: unknown;
}

interface CantripWithLevel extends Cantrip {
  spellLevel: 0; // Cantrips are always level 0
  uniqueKey: string;
  [key: string]: unknown;
}

type DisplayableSpell = SpellWithLevel | CantripWithLevel;

const READ_MAGIC_SPELL: Spell = {
  name: "Read Magic",
  range: "0 (personal)",
  level: {
    spellcrafter: 1,
    paladin: null,
    cleric: null,
    "magic-user": 1,
    druid: null,
    illusionist: 1,
    necromancer: 1,
  },
  duration: "2 turns",
  description:
    "This spell allows the caster to read magical inscriptions on objects (books, scrolls, weapons, etc.) which would otherwise be unintelligible. Reading a scroll of magic spells in this fashion does not invoke its magic, but allows the caster to see what spell it contains and (if the caster is able to cast spells of the level required) to cast it at a later time. The GM will determine what can be read and what cannot.",
};

function hasReadMagicAbility(character: Character): boolean {
  return character.class.some((classId) => {
    const classData = allClasses.find((c) => c.id === classId);
    if (!classData?.specialAbilities) return false;

    return classData.specialAbilities.some(
      (ability) => ability.name === "Read Magic"
    );
  });
}

function getSpellLevel(spell: Spell, characterClasses: string[]): number {
  for (const classId of characterClasses) {
    const mappedClassId =
      classId === "magic-user"
        ? "magic-user"
        : (classId as keyof typeof spell.level);
    const level = spell.level[mappedClassId];
    if (level !== null) {
      return level;
    }
  }
  return 0;
}

function canCastSpells(character: Character): boolean {
  return character.class.some((classId) => {
    const classData = allClasses.find((c) => c.id === classId);
    return classData?.spellcasting !== undefined;
  });
}

function getCharacterCantrips(character: Character): CantripWithLevel[] {
  // Return only the cantrips that the character knows
  return (character.cantrips || []).map((cantrip, index) => ({
    ...cantrip,
    spellLevel: 0 as const,
    uniqueKey: `cantrip-${cantrip.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-${index}`,
  }));
}

export default function Spells({
  character,
  className = "",
  size = "md",
}: SpellsProps) {
  const { knownSpells, cantrips } = useMemo(() => {
    if (!canCastSpells(character)) {
      return { knownSpells: [], cantrips: [] };
    }

    const characterSpells = character.spells || [];
    const hasReadMagic = hasReadMagicAbility(character);

    const allSpells: SpellWithLevel[] = [];

    // Add Read Magic if the character's class has it as a special ability
    if (hasReadMagic && !characterSpells.some((s) => s.name === "Read Magic")) {
      const readMagicLevel = getSpellLevel(READ_MAGIC_SPELL, character.class);
      if (readMagicLevel > 0) {
        allSpells.push({
          ...READ_MAGIC_SPELL,
          spellLevel: readMagicLevel,
          uniqueKey: `read-magic-auto`,
        });
      }
    }

    // Add character's known spells
    characterSpells.forEach((spell, index) => {
      const spellLevel = getSpellLevel(spell, character.class);
      if (spellLevel > 0) {
        allSpells.push({
          ...spell,
          spellLevel,
          uniqueKey: `${spell.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${index}`,
        });
      }
    });

    // Get the character's known cantrips
    const characterCantrips = getCharacterCantrips(character);

    // Separate spells and cantrips
    const spells = allSpells.filter((spell) => spell.spellLevel > 0);

    return { knownSpells: spells, cantrips: characterCantrips };
  }, [character]);

  const renderSpell = (spell: DisplayableSpell) => (
    <div
      className="space-y-4"
      role="article"
      aria-labelledby={`spell-${spell.uniqueKey}-name`}
    >
      {/* Hidden spell name for screen readers */}
      <h4 id={`spell-${spell.uniqueKey}-name`} className="sr-only">
        {spell.name} -{" "}
        {spell.spellLevel === 0 ? "Cantrip" : `Level ${spell.spellLevel} Spell`}
      </h4>

      {/* Spell Details */}
      <div
        className={`grid grid-cols-1 gap-3 ${
          "range" in spell && "duration" in spell
            ? "sm:grid-cols-3"
            : "sm:grid-cols-1"
        }`}
        role="group"
        aria-labelledby={`spell-${spell.uniqueKey}-name`}
      >
        <Card variant="nested" className="p-3!">
          <Typography
            variant="subHeading"
            className="text-zinc-300 mb-1"
            id={`spell-${spell.uniqueKey}-level-label`}
          >
            Level
          </Typography>
          <div className="flex items-center">
            <Badge
              variant="status"
              className="text-xs"
              role="text"
              aria-labelledby={`spell-${spell.uniqueKey}-level-label`}
            >
              {spell.spellLevel === 0 ? "Cantrip" : `Level ${spell.spellLevel}`}
            </Badge>
          </div>
        </Card>
        {"range" in spell && "duration" in spell && (
          <>
            <Card variant="nested" className="p-3!">
              <Typography
                variant="subHeading"
                className="text-zinc-300 mb-1"
                id={`spell-${spell.uniqueKey}-range-label`}
              >
                Range
              </Typography>
              <Typography
                variant="caption"
                className="text-zinc-400"
                aria-labelledby={`spell-${spell.uniqueKey}-range-label`}
              >
                {"range" in spell ? String(spell.range) : ""}
              </Typography>
            </Card>
            <Card variant="nested" className="p-3!">
              <Typography
                variant="subHeading"
                className="text-zinc-300 mb-1"
                id={`spell-${spell.uniqueKey}-duration-label`}
              >
                Duration
              </Typography>
              <Typography
                variant="caption"
                className="text-zinc-400"
                aria-labelledby={`spell-${spell.uniqueKey}-duration-label`}
              >
                {"duration" in spell ? String(spell.duration) : ""}
              </Typography>
            </Card>
          </>
        )}
      </div>

      {/* Spell Description */}
      <Card variant="nested" className="p-3">
        <Typography
          variant="subHeading"
          className="text-zinc-300 mb-2"
          id={`spell-${spell.uniqueKey}-description-label`}
        >
          Description
        </Typography>
        <Typography
          variant="description"
          className="text-zinc-400"
          aria-labelledby={`spell-${spell.uniqueKey}-description-label`}
          role="text"
        >
          {spell.description}
        </Typography>
      </Card>
    </div>
  );

  // Don't render if character can't cast spells
  if (!canCastSpells(character)) {
    return null;
  }

  const hasAnySpells = knownSpells.length > 0 || cantrips.length > 0;

  return (
    <CharacterSheetSectionWrapper
      title="Spells & Cantrips"
      size={size}
      className={className}
    >
      <div className="p-6">
        {hasAnySpells ? (
          <div className="space-y-6">
            {/* Known Spells */}
            {knownSpells.length > 0 && (
              <section aria-labelledby="known-spells-heading">
                <Typography
                  variant="sectionHeading"
                  id="known-spells-heading"
                  className="text-zinc-100 flex items-center gap-2"
                  as="h3"
                >
                  <span
                    className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"
                    aria-hidden="true"
                  />
                  Spells
                  <span
                    className="text-sm font-normal text-zinc-400"
                    aria-label={`${knownSpells.length} spells known`}
                  >
                    ({knownSpells.length})
                  </span>
                </Typography>
                <Accordion
                  items={knownSpells}
                  sortBy="name"
                  labelProperty="name"
                  showSearch={false}
                  renderItem={renderSpell}
                  className="mb-6"
                  showCounts={false}
                />
              </section>
            )}

            {/* Cantrips */}
            {cantrips.length > 0 && (
              <section aria-labelledby="cantrips-heading">
                <Typography
                  variant="sectionHeading"
                  id="cantrips-heading"
                  className="text-zinc-100 flex items-center gap-2"
                  as="h3"
                >
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"
                    aria-hidden="true"
                  />
                  Cantrips
                  <span
                    className="text-sm font-normal text-zinc-400"
                    aria-label={`${cantrips.length} cantrips known`}
                  >
                    ({cantrips.length})
                  </span>
                </Typography>

                <Accordion
                  items={cantrips}
                  sortBy="name"
                  labelProperty="name"
                  showSearch={false}
                  renderItem={renderSpell}
                  showCounts={false}
                />
              </section>
            )}
          </div>
        ) : (
          <div className="status-message" role="status" aria-live="polite">
            <div className="text-zinc-400 space-y-2">
              <Typography variant="body" className="text-lg">
                No spells known
              </Typography>
              <Typography variant="caption" className="text-sm">
                This character doesn't know any spells yet.
              </Typography>
            </div>
          </div>
        )}
      </div>
    </CharacterSheetSectionWrapper>
  );
}
