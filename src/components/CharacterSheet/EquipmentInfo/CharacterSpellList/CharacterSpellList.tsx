import { Button, Descriptions } from "antd";
import { useState } from "react";
import { marked } from "marked";
import { Spell, CharacterData } from "../../../../data/definitions";

type CharacterSpellListProps = {
  spells: CharacterData["spells"];
};

export default function CharacterSpellList({
  spells,
}: CharacterSpellListProps) {
  const [selectedSpell, setSelectedSpell] = useState<number | null>(null);
  const spellItems = spells.map((spell: Spell, index: number) => {
    const spellDescription = (
      <div>
        <Button
          type="primary"
          onClick={() =>
            setSelectedSpell(selectedSpell === index ? null : index)
          }
        >
          {selectedSpell === index ? "Hide Description" : "Show Description"}
        </Button>
        {selectedSpell === index && (
          <div
            dangerouslySetInnerHTML={{ __html: marked(spell.description) }}
          />
        )}
      </div>
    );
    return [
      { key: "1", label: "Name", children: <strong>{spell.name}</strong> },
      { key: "2", label: "Range", children: spell.range },
      { key: "3", label: "Duration", children: spell.duration },
      { key: "4", label: "Description", children: spellDescription },
    ];
  });
  return (
    <div className="[&>div+div]:mt-4">
      {spellItems.map((spellItem: any, index: number) => {
        return (
          <Descriptions
            key={index}
            title={spellItem.label}
            items={spellItem}
            size="small"
            bordered
          />
        );
      })}
    </div>
  );
}
