import React from "react";
import spells from "@/data/spells.json";
import { CharData, Spell } from "@/data/definitions";
import {
  Card,
  Descriptions,
  Flex,
  Image,
  Select,
  SelectProps,
  Typography,
} from "antd";
import { marked } from "marked";
import { toSlugCase } from "@/support/stringSupport";
import { useDeviceType } from "@/hooks/useDeviceType";
import classNames from "classnames";
import { useImages } from "@/hooks/useImages";
import { getSpellsAtLevel } from "@/support/spellSupport";

interface SpellOptionsProps {
  character: CharData;
  characterClass: string | undefined;
  startingSpells: string[];
  setStartingSpells: (startingSpells: string[]) => void;
}

const SpellDescription: React.FC<{ spell: Spell }> = ({ spell }) => (
  <div>
    <Descriptions
      items={[
        { key: "1", label: "Range", children: spell.range },
        { key: "2", label: "Duration", children: spell.duration },
      ]}
    />
    <div dangerouslySetInnerHTML={{ __html: marked(spell.description) }} />
  </div>
);

const SpellOptions: React.FC<
  SpellOptionsProps & React.ComponentPropsWithRef<"div">
> = ({ character, characterClass, startingSpells, setStartingSpells }) => {
  const { isMobile } = useDeviceType();
  const { getSpellImage } = useImages();
  const selectedSpell =
    spells.find((spell: Spell) => spell.name === startingSpells[0]) ||
    ({ description: "", duration: "", range: "" } as Spell);
  const levelOneSpells = getSpellsAtLevel(character);
  const spellImage = getSpellImage(toSlugCase(startingSpells[0] || ""));
  const descriptionClassNames = classNames({ "flex-col": isMobile });
  const selectOptions: SelectProps["options"] = levelOneSpells
    .map((spell: Spell) => ({ value: spell.name, label: spell.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const handleStartingSpellChange = (value: string) => {
    setStartingSpells([value]);
  };
  return (
    <Card
      title={
        <span className="font-enchant text-3xl tracking-wide">
          Choose a spell
        </span>
      }
    >
      <Flex vertical gap={16}>
        <Typography.Text className="[&_p]:m-0">
          <div
            dangerouslySetInnerHTML={{
              __html: marked(
                `Characters with the **${characterClass}** class start with **Read Magic** and one other spell:`,
              ),
            }}
          />
        </Typography.Text>
        <Select
          options={selectOptions}
          value={startingSpells[0]}
          onChange={handleStartingSpellChange}
          placeholder="Select a starting spell"
        />
        {!!startingSpells.length && (
          <Card
            title={
              <span className="font-enchant text-3xl tracking-wide">
                {startingSpells[0]}
              </span>
            }
            className="shadow-md"
          >
            <Flex
              gap={16}
              align="flex-start"
              vertical={isMobile}
              className={descriptionClassNames}
            >
              <Image src={spellImage} className="w-40" preview={false} />
              <SpellDescription spell={selectedSpell} />
            </Flex>
          </Card>
        )}
      </Flex>
    </Card>
  );
};

export default SpellOptions;
