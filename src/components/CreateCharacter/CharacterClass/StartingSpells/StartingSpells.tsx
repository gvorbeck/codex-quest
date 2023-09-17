import { Button, Radio, RadioChangeEvent, Typography } from "antd";
import { StartingSpellsProps } from "./definitions";
import { InfoCircleOutlined } from "@ant-design/icons";
import { marked } from "marked";
import spellsJson from "../../../../data/spells.json";
import { classes } from "../../../../data/classes";
import { ClassNamesTwo } from "../../../../data/definitions";

const readMagicSpell = spellsJson.filter(
  (spell) => spell.name === "Read Magic"
);

const getClassLevelOneSpells = (characterClassArray: string[]) => {
  if (!characterClassArray) return [];
  return characterClassArray.flatMap((className) => {
    if (classes[className as ClassNamesTwo]?.spellBudget?.[0][0]) {
      return spellsJson
        .filter(
          (spell) =>
            spell.level![
              className.toLowerCase() as keyof typeof spell.level
            ] === 1 && spell.name !== "Read Magic"
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    return null;
  });
};

export default function StartingSpells({
  characterData,
  setCharacterData,
  selectedSpell,
  setSelectedSpell,
  setModalName,
  setModalDescription,
  setIsModalOpen,
}: StartingSpellsProps) {
  const onSpellRadioChange = (e: RadioChangeEvent) => {
    const foundSpell = spellsJson.find(
      (spell) => spell.name === e.target.value
    );
    if (foundSpell) {
      setSelectedSpell(foundSpell);
      setCharacterData({
        ...characterData,
        spells: [...readMagicSpell, foundSpell],
      });
    }
  };

  const showModal = (name: string, text: string) => {
    setModalName(name);
    setModalDescription(text);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-4">
      <Typography.Title level={4} className="text-shipGray">
        Choose your starting spell
      </Typography.Title>
      <Typography.Text type="secondary" className="mb-4 block">
        <em>{characterData.class.join(" ")}s</em> begin with{" "}
        <strong>Read Magic</strong> and can choose a second spell to start.
      </Typography.Text>
      <Radio.Group
        onChange={onSpellRadioChange}
        value={selectedSpell ? selectedSpell.name : null}
        className="mt-4 gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      >
        {getClassLevelOneSpells(characterData.class)?.map((spell) => {
          return (
            spell && (
              <Radio
                key={spell.name}
                value={spell.name}
                className="flex-[1_1_45%] text-shipGray"
              >
                {spell.name}
                <Button
                  type="link"
                  shape="circle"
                  size="small"
                  icon={<InfoCircleOutlined />}
                  onClick={() =>
                    showModal(spell.name, spell && marked(spell.description))
                  }
                  aria-label={`${spell.name} description`}
                  title={`${spell.name} description`}
                />
              </Radio>
            )
          );
        })}
      </Radio.Group>
    </div>
  );
}
