import { CharData, Spell } from "@/data/definitions";
import React from "react";
import SpellOptionsList from "../SpellOptionsList/SpellOptionsList";
import { getSpellsAtLevel } from "@/support/spellSupport";

interface SpellOptionsContainerProps {
  spellBudget: number[];
  magicClass: string;
  character: CharData;
  selectedSpells: Spell[][];
  setSelectedSpells: (selectedSpells: Spell[][]) => void;
}

const SpellOptionsContainer: React.FC<
  SpellOptionsContainerProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  spellBudget,
  magicClass,
  character,
  selectedSpells,
  setSelectedSpells,
}) => {
  return (
    <div className={className}>
      {spellBudget.map((max, index) => {
        const spellLevel = index + 1;
        const spellsAtLevel = getSpellsAtLevel(character).filter(
          (spell) => spell.level[magicClass.toLowerCase()] === spellLevel,
        );
        return (
          max > 0 && (
            <SpellOptionsList
              spellLevel={spellLevel}
              spellsAtLevel={spellsAtLevel}
              selectedSpells={selectedSpells}
              setSelectedSpells={setSelectedSpells}
              max={max}
              key={index}
            />
          )
        );
      })}
    </div>
  );
};

export default SpellOptionsContainer;
