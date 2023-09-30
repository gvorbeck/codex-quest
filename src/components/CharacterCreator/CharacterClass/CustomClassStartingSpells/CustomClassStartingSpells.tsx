import { Checkbox, Typography } from "antd";
import { CustomClassStartingSpellsProps } from "./definitions";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import spellsData from "../../../../data/spells.json";
import { Spell } from "../../../../data/definitions";

export default function CustomClassStartingSpells({
  characterData,
  setCharacterData,
}: CustomClassStartingSpellsProps) {
  const handleCheckboxChange = (e: CheckboxChangeEvent, spell: Spell) => {
    if (e.target.checked) {
      setCharacterData({
        ...characterData,
        spells: [...characterData.spells, spell],
      });
    } else {
      setCharacterData({
        ...characterData,
        spells: characterData.spells.filter(
          (prevSpell: Spell) => prevSpell.name !== spell.name
        ),
      });
    }
  };

  return (
    <>
      <Typography.Title level={4}>Choose your starting spells</Typography.Title>
      <div className="mt-4 gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {spellsData.map((spell) => (
          <Checkbox
            key={spell.name}
            onChange={(e) => handleCheckboxChange(e, spell)}
            checked={characterData.spells.some(
              (prevSpell: Spell) => prevSpell.name === spell.name
            )}
            className="text-shipGray"
          >
            {spell.name}
          </Checkbox>
        ))}
      </div>
    </>
  );
}
