import { Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd";
import { CharRaceStepProps } from "../types";

const raceChoices = ["Dwarf", "Elf", "Halfling", "Human"];

export default function CharRaceStep({
  characterData,
  setCharacterData,
  setComboClass,
  setCheckedClasses,
}: CharRaceStepProps) {
  const onChange = (e: RadioChangeEvent) => {
    setComboClass(false);
    setCheckedClasses([]);
    setCharacterData({
      ...characterData,
      race: e.target.value,
      class: "",
      hp: { dice: "", points: 0, max: 0 },
    });
  };

  return (
    <Radio.Group onChange={onChange} value={characterData.race}>
      <Space direction="vertical">
        {raceChoices.map((race) => (
          <Radio
            key={race}
            value={race}
            disabled={
              (race === "Dwarf" &&
                (+characterData.abilities.scores.constitution < 9 ||
                  +characterData.abilities.scores.charisma > 17)) ||
              (race === "Elf" &&
                (+characterData.abilities.scores.intelligence < 9 ||
                  +characterData.abilities.scores.constitution > 17)) ||
              (race === "Halfling" &&
                (+characterData.abilities.scores.dexterity < 9 ||
                  +characterData.abilities.scores.strength > 17))
            }
          >
            {race}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
}
