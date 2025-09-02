import { useMemo } from "react";
import { SectionWrapper } from "@/components/ui/layout";
import { SIZE_STYLES } from "@/constants/designTokens";
import RollableButton from "@/components/ui/dice/RollableButton";
import { useDiceRoll } from "@/hooks/useDiceRoll";
import { InfoTooltip } from "@/components/ui/feedback";
import { TextHeader } from "@/components/ui/display";
import { calculateModifier } from "@/utils/characterCalculations";
import type { Character } from "@/types/character";

// Constants
const MIN_SAVING_THROW = 1;

// BFRPG Saving Throw Tables by Class and Level
// Format: [Death Ray/Poison, Magic Wands, Paralysis/Petrify, Dragon Breath, Spells]
type SavingThrowEntry = {
  minLevel: number;
  saves: [number, number, number, number, number];
};

type SavingThrowTable = {
  [className: string]: SavingThrowEntry[];
};

/**
 * Base saving throw tables for all BFRPG classes
 * Tables are ordered from highest to lowest level for efficient lookup
 */
const SAVING_THROW_TABLES: SavingThrowTable = {
  cleric: [
    { minLevel: 20, saves: [5, 6, 9, 11, 10] },
    { minLevel: 18, saves: [6, 7, 9, 11, 10] },
    { minLevel: 16, saves: [6, 7, 10, 12, 11] },
    { minLevel: 14, saves: [7, 8, 10, 12, 11] },
    { minLevel: 12, saves: [7, 8, 11, 13, 12] },
    { minLevel: 10, saves: [8, 9, 11, 13, 12] },
    { minLevel: 8, saves: [8, 9, 12, 14, 13] },
    { minLevel: 6, saves: [9, 10, 12, 14, 13] },
    { minLevel: 4, saves: [9, 10, 13, 15, 14] },
    { minLevel: 2, saves: [10, 11, 13, 15, 14] },
    { minLevel: 1, saves: [11, 12, 14, 16, 15] },
  ],
  druid: [
    { minLevel: 20, saves: [5, 6, 9, 11, 10] },
    { minLevel: 18, saves: [6, 7, 9, 11, 10] },
    { minLevel: 16, saves: [6, 7, 10, 12, 11] },
    { minLevel: 14, saves: [7, 8, 10, 12, 11] },
    { minLevel: 12, saves: [7, 8, 11, 13, 12] },
    { minLevel: 10, saves: [8, 9, 11, 13, 12] },
    { minLevel: 8, saves: [8, 9, 12, 14, 13] },
    { minLevel: 6, saves: [9, 10, 12, 14, 13] },
    { minLevel: 4, saves: [9, 10, 13, 15, 14] },
    { minLevel: 2, saves: [10, 11, 13, 15, 14] },
    { minLevel: 1, saves: [11, 12, 14, 16, 15] },
  ],
  "magic-user": [
    { minLevel: 20, saves: [8, 6, 5, 11, 8] },
    { minLevel: 18, saves: [9, 7, 6, 11, 9] },
    { minLevel: 16, saves: [9, 8, 7, 12, 9] },
    { minLevel: 14, saves: [10, 9, 8, 12, 10] },
    { minLevel: 12, saves: [10, 10, 9, 13, 11] },
    { minLevel: 10, saves: [11, 10, 9, 13, 11] },
    { minLevel: 8, saves: [11, 11, 10, 14, 12] },
    { minLevel: 6, saves: [12, 12, 11, 14, 13] },
    { minLevel: 4, saves: [12, 13, 12, 15, 13] },
    { minLevel: 2, saves: [13, 14, 13, 15, 14] },
    { minLevel: 1, saves: [13, 14, 13, 16, 15] },
  ],
  illusionist: [
    { minLevel: 20, saves: [8, 6, 5, 11, 8] },
    { minLevel: 18, saves: [9, 7, 6, 11, 9] },
    { minLevel: 16, saves: [9, 8, 7, 12, 9] },
    { minLevel: 14, saves: [10, 9, 8, 12, 10] },
    { minLevel: 12, saves: [10, 10, 9, 13, 11] },
    { minLevel: 10, saves: [11, 10, 9, 13, 11] },
    { minLevel: 8, saves: [11, 11, 10, 14, 12] },
    { minLevel: 6, saves: [12, 12, 11, 14, 13] },
    { minLevel: 4, saves: [12, 13, 12, 15, 13] },
    { minLevel: 2, saves: [13, 14, 13, 15, 14] },
    { minLevel: 1, saves: [13, 14, 13, 16, 15] },
  ],
  necromancer: [
    { minLevel: 20, saves: [8, 6, 5, 11, 8] },
    { minLevel: 18, saves: [9, 7, 6, 11, 9] },
    { minLevel: 16, saves: [9, 8, 7, 12, 9] },
    { minLevel: 14, saves: [10, 9, 8, 12, 10] },
    { minLevel: 12, saves: [10, 10, 9, 13, 11] },
    { minLevel: 10, saves: [11, 10, 9, 13, 11] },
    { minLevel: 8, saves: [11, 11, 10, 14, 12] },
    { minLevel: 6, saves: [12, 12, 11, 14, 13] },
    { minLevel: 4, saves: [12, 13, 12, 15, 13] },
    { minLevel: 2, saves: [13, 14, 13, 15, 14] },
    { minLevel: 1, saves: [13, 14, 13, 16, 15] },
  ],
  spellcrafter: [
    { minLevel: 20, saves: [8, 6, 5, 11, 8] },
    { minLevel: 18, saves: [9, 7, 6, 11, 9] },
    { minLevel: 16, saves: [9, 8, 7, 12, 9] },
    { minLevel: 14, saves: [10, 9, 8, 12, 10] },
    { minLevel: 12, saves: [10, 10, 9, 13, 11] },
    { minLevel: 10, saves: [11, 10, 9, 13, 11] },
    { minLevel: 8, saves: [11, 11, 10, 14, 12] },
    { minLevel: 6, saves: [12, 12, 11, 14, 13] },
    { minLevel: 4, saves: [12, 13, 12, 15, 13] },
    { minLevel: 2, saves: [13, 14, 13, 15, 14] },
    { minLevel: 1, saves: [13, 14, 13, 16, 15] },
  ],
  fighter: [
    { minLevel: 20, saves: [5, 6, 8, 9, 10] },
    { minLevel: 18, saves: [6, 7, 8, 10, 11] },
    { minLevel: 16, saves: [7, 7, 9, 10, 11] },
    { minLevel: 14, saves: [7, 8, 10, 11, 12] },
    { minLevel: 12, saves: [8, 9, 10, 12, 13] },
    { minLevel: 10, saves: [9, 9, 11, 12, 13] },
    { minLevel: 8, saves: [9, 10, 12, 13, 14] },
    { minLevel: 6, saves: [10, 11, 12, 14, 15] },
    { minLevel: 4, saves: [11, 12, 13, 14, 15] },
    { minLevel: 2, saves: [11, 12, 14, 15, 16] },
    { minLevel: 1, saves: [12, 13, 14, 15, 17] },
  ],
  barbarian: [
    { minLevel: 20, saves: [5, 6, 8, 9, 10] },
    { minLevel: 18, saves: [6, 7, 8, 10, 11] },
    { minLevel: 16, saves: [7, 7, 9, 10, 11] },
    { minLevel: 14, saves: [7, 8, 10, 11, 12] },
    { minLevel: 12, saves: [8, 9, 10, 12, 13] },
    { minLevel: 10, saves: [9, 9, 11, 12, 13] },
    { minLevel: 8, saves: [9, 10, 12, 13, 14] },
    { minLevel: 6, saves: [10, 11, 12, 14, 15] },
    { minLevel: 4, saves: [11, 12, 13, 14, 15] },
    { minLevel: 2, saves: [11, 12, 14, 15, 16] },
    { minLevel: 1, saves: [12, 13, 14, 15, 17] },
  ],
  ranger: [
    { minLevel: 20, saves: [5, 6, 8, 9, 10] },
    { minLevel: 18, saves: [6, 7, 8, 10, 11] },
    { minLevel: 16, saves: [7, 7, 9, 10, 11] },
    { minLevel: 14, saves: [7, 8, 10, 11, 12] },
    { minLevel: 12, saves: [8, 9, 10, 12, 13] },
    { minLevel: 10, saves: [9, 9, 11, 12, 13] },
    { minLevel: 8, saves: [9, 10, 12, 13, 14] },
    { minLevel: 6, saves: [10, 11, 12, 14, 15] },
    { minLevel: 4, saves: [11, 12, 13, 14, 15] },
    { minLevel: 2, saves: [11, 12, 14, 15, 16] },
    { minLevel: 1, saves: [12, 13, 14, 15, 17] },
  ],
  paladin: [
    { minLevel: 20, saves: [5, 6, 8, 9, 10] },
    { minLevel: 18, saves: [6, 7, 8, 10, 11] },
    { minLevel: 16, saves: [7, 7, 9, 10, 11] },
    { minLevel: 14, saves: [7, 8, 10, 11, 12] },
    { minLevel: 12, saves: [8, 9, 10, 12, 13] },
    { minLevel: 10, saves: [9, 9, 11, 12, 13] },
    { minLevel: 8, saves: [9, 10, 12, 13, 14] },
    { minLevel: 6, saves: [10, 11, 12, 14, 15] },
    { minLevel: 4, saves: [11, 12, 13, 14, 15] },
    { minLevel: 2, saves: [11, 12, 14, 15, 16] },
    { minLevel: 1, saves: [12, 13, 14, 15, 17] },
  ],
  thief: [
    { minLevel: 20, saves: [6, 8, 8, 6, 8] },
    { minLevel: 18, saves: [7, 9, 8, 7, 9] },
    { minLevel: 16, saves: [7, 9, 9, 8, 9] },
    { minLevel: 14, saves: [8, 10, 9, 9, 10] },
    { minLevel: 12, saves: [9, 10, 10, 10, 11] },
    { minLevel: 10, saves: [9, 12, 10, 11, 11] },
    { minLevel: 8, saves: [10, 12, 11, 12, 12] },
    { minLevel: 6, saves: [11, 13, 11, 13, 13] },
    { minLevel: 4, saves: [11, 13, 12, 14, 13] },
    { minLevel: 2, saves: [12, 14, 12, 15, 14] },
    { minLevel: 1, saves: [13, 14, 13, 16, 15] },
  ],
  assassin: [
    { minLevel: 20, saves: [6, 8, 8, 6, 8] },
    { minLevel: 18, saves: [7, 9, 8, 7, 9] },
    { minLevel: 16, saves: [7, 9, 9, 8, 9] },
    { minLevel: 14, saves: [8, 10, 9, 9, 10] },
    { minLevel: 12, saves: [9, 10, 10, 10, 11] },
    { minLevel: 10, saves: [9, 12, 10, 11, 11] },
    { minLevel: 8, saves: [10, 12, 11, 12, 12] },
    { minLevel: 6, saves: [11, 13, 11, 13, 13] },
    { minLevel: 4, saves: [11, 13, 12, 14, 13] },
    { minLevel: 2, saves: [12, 14, 12, 15, 14] },
    { minLevel: 1, saves: [13, 14, 13, 16, 15] },
  ],
  scout: [
    { minLevel: 20, saves: [6, 8, 8, 6, 8] },
    { minLevel: 18, saves: [7, 9, 8, 7, 9] },
    { minLevel: 16, saves: [7, 9, 9, 8, 9] },
    { minLevel: 14, saves: [8, 10, 9, 9, 10] },
    { minLevel: 12, saves: [9, 10, 10, 10, 11] },
    { minLevel: 10, saves: [9, 12, 10, 11, 11] },
    { minLevel: 8, saves: [10, 12, 11, 12, 12] },
    { minLevel: 6, saves: [11, 13, 11, 13, 13] },
    { minLevel: 4, saves: [11, 13, 12, 14, 13] },
    { minLevel: 2, saves: [12, 14, 12, 15, 14] },
    { minLevel: 1, saves: [13, 14, 13, 16, 15] },
  ],
};

// Default saving throws for unknown classes (uses Fighter table level 1)
const DEFAULT_SAVING_THROWS: [number, number, number, number, number] = [12, 13, 14, 15, 17];

// Saving throw help text for tooltips
const SAVING_THROW_HELP = {
  title: "Rolling Saving Throws:",
  rules: [
    "• Roll 1d20 and meet or exceed the target number",
    "• Natural 20 always succeeds",
    "• Natural 1 always fails",
    "• Poison saves use CON modifier",
    "• Illusion spells use INT modifier",
    "• Charm spells use WIS modifier",
    "• Other saves use no ability modifier",
  ],
};

interface SavingThrowsProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function SavingThrows({ character, className = "", size = "md" }: SavingThrowsProps) {
  const currentSize = SIZE_STYLES[size];
  const { rollSavingThrow } = useDiceRoll();

  const savingThrows = useMemo(() => {
    /**
     * Gets base saving throws for a character class and level
     * Uses table-driven lookup for better maintainability
     * @param level - Character level (1+)
     * @param characterClass - Character class name
     * @returns Array of 5 saving throw values
     */
    const getBaseSavingThrows = (level: number, characterClass: string): [number, number, number, number, number] => {
      const classLower = characterClass.toLowerCase();
      const classTable = SAVING_THROW_TABLES[classLower] || SAVING_THROW_TABLES['fighter'];
      
      // Find the first entry where character level meets minimum requirement
      const entry = classTable?.find(tableEntry => level >= tableEntry.minLevel);
      
      return entry?.saves || DEFAULT_SAVING_THROWS;
    };

    /**
     * Gets racial saving throw bonuses based on BFRPG rules
     * Bonuses are subtracted from target number (lower is better)
     * @returns Array of 5 racial bonus values
     */
    const getRacialSavingThrowBonuses = (): [number, number, number, number, number] => {
      // Initialize bonuses array [Death Ray/Poison, Magic Wands, Paralysis/Petrify, Dragon Breath, Spells]
      const bonuses: [number, number, number, number, number] = [0, 0, 0, 0, 0];
      
      // Apply bonuses based on race (these are subtracted from the target number as lower is better)
      switch (character.race) {
        case "dwarf":
          bonuses[0] = 4; // Death Ray or Poison
          bonuses[1] = 4; // Magic Wands
          bonuses[2] = 4; // Paralysis or Petrify
          bonuses[3] = 3; // Dragon Breath
          bonuses[4] = 4; // Spells
          break;
        case "elf":
          bonuses[1] = 2; // Magic Wands
          bonuses[2] = 1; // Paralysis or Petrify
          bonuses[4] = 2; // Spells
          break;
        case "halfling":
          bonuses[0] = 4; // Death Ray or Poison
          bonuses[1] = 4; // Magic Wands
          bonuses[2] = 4; // Paralysis or Petrify
          bonuses[3] = 3; // Dragon Breath
          bonuses[4] = 4; // Spells
          break;
        case "human":
        default:
          // Humans have no racial bonuses
          break;
      }
      
      return bonuses;
    };

    // Get the primary class (first in array for multi-class characters)
    const primaryClass = character.class?.[0] || "";
    
    // Calculate base saving throws
    const baseSavingThrows = getBaseSavingThrows(character.level || 1, primaryClass);
    
    // Get racial bonuses
    const racialBonuses = getRacialSavingThrowBonuses();
    
    // Apply bonuses to base values (lower is better in BFRPG, minimum of 1)
    const finalSavingThrows = baseSavingThrows.map((base, index) => 
      Math.max(MIN_SAVING_THROW, base - (racialBonuses[index] || 0))
    );

    return {
      deathRayOrPoison: finalSavingThrows[0] || 12,
      magicWands: finalSavingThrows[1] || 13,
      paralysisOrPetrify: finalSavingThrows[2] || 14,
      dragonBreath: finalSavingThrows[3] || 15,
      spells: finalSavingThrows[4] || 16,
      racialBonuses,
    };
  }, [character.level, character.class, character.race]);

  const conModifier = calculateModifier(character.abilities?.constitution?.value || 10);
  const wisModifier = calculateModifier(character.abilities?.wisdom?.value || 10);

  const savingThrowItems = [
    {
      label: "Death Ray or Poison",
      target: savingThrows.deathRayOrPoison,
      modifier: conModifier,
      usesModifier: true,
    },
    {
      label: "Magic Wands",
      target: savingThrows.magicWands,
      modifier: 0,
      usesModifier: false,
    },
    {
      label: "Paralysis or Petrify",
      target: savingThrows.paralysisOrPetrify,
      modifier: 0,
      usesModifier: false,
    },
    {
      label: "Dragon Breath",
      target: savingThrows.dragonBreath,
      modifier: 0,
      usesModifier: false,
    },
    {
      label: "Spells",
      target: savingThrows.spells,
      modifier: wisModifier,
      usesModifier: true,
    },
  ];

  const tooltipContent = (
    <div className="whitespace-normal max-w-xs">
      <TextHeader variant="h6" size="sm" underlined={false} className="mb-1">
        {SAVING_THROW_HELP.title}
      </TextHeader>
      <div className="space-y-1 text-xs">
        {SAVING_THROW_HELP.rules.map((rule, index) => (
          <div key={index}>{rule}</div>
        ))}
      </div>
    </div>
  );

  return (
    <SectionWrapper 
      title={
        <div className="flex items-center gap-2">
          <span>Saving Throws</span>
          <InfoTooltip 
            content={tooltipContent}
            ariaLabel="Saving throw rules"
            preferredPosition="above"
          />
        </div>
      } 
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <div className="space-y-3">
          {savingThrowItems.map((item, index) => (
            <RollableButton
              key={index}
              label={item.label}
              value={`${item.target}+`}
              onClick={() => rollSavingThrow(item.label, item.target, item.usesModifier ? item.modifier : undefined)}
              tooltip={`Click to roll ${item.label.toLowerCase()} save (need ${item.target}+ on d20)${item.usesModifier ? ` with ${item.modifier >= 0 ? '+' : ''}${item.modifier} modifier` : ''}`}
              size={size}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}