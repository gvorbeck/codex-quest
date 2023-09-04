import { Button, Radio, RadioChangeEvent, Typography } from "antd";
import { StartingSpellsProps } from "./definitions";
import { InfoCircleOutlined } from "@ant-design/icons";
import { marked } from "marked";
import spellsData from "../../../../data/spells.json";

const readMagic = spellsData.filter((spell) => spell.name === "Read Magic");

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
    const foundSpell = spellsData.find(
      (spell) => spell.name === e.target.value
    );
    if (foundSpell) {
      setSelectedSpell(foundSpell);
      setCharacterData({
        ...characterData,
        spells: [...readMagic, foundSpell],
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
        {characterData.class}s begin with <strong>Read Magic</strong> and can
        choose a second spell to start.
      </Typography.Text>
      <Radio.Group
        onChange={onSpellRadioChange}
        value={selectedSpell ? selectedSpell.name : null}
        className="mt-4 gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      >
        {spellsData
          .filter((spell) => {
            const characterClasses = characterData.class
              .toLowerCase()
              .split(" ");
            return (
              characterClasses.some(
                (characterClass) =>
                  (spell.level as Record<string, number | null>)[
                    characterClass
                  ] === 1
              ) && spell.name !== "Read Magic"
            );
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((spell) => {
            const description = marked(spell.description);
            return (
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
                  onClick={() => showModal(spell.name, description)}
                  aria-label={`${spell.name} description`}
                  title={`${spell.name} description`}
                />
              </Radio>
            );
          })}
      </Radio.Group>
    </div>
  );
}
