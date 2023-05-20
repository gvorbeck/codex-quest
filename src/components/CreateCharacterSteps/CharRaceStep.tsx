import { Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd";

const raceChoices = ["Dwarf", "Elf", "Halfling", "Human"];

type CharRaceStepProps = {
  abilities: {
    strength: number;
    intelligence: number;
    wisdom: number;
    dexterity: number;
    constitution: number;
    charisma: number;
  };
  race: string;
  setRace: (race: string) => void;
  setPlayerClass: (playerClass: string) => void;
  setComboClass: (comboClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
};

export default function CharRaceStep({
  abilities,
  race,
  setRace,
  setPlayerClass,
  setComboClass,
  setCheckedClasses,
}: CharRaceStepProps) {
  const onChange = (e: RadioChangeEvent) => {
    setRace(e.target.value);
    setPlayerClass("");
    setComboClass(false);
    setCheckedClasses([]);
  };

  return (
    <Radio.Group onChange={onChange} value={race}>
      <Space direction="vertical">
        {raceChoices.map((race) => (
          <Radio
            key={race}
            value={race}
            disabled={
              (race === "Dwarf" &&
                (abilities.constitution < 9 || abilities.charisma > 17)) ||
              (race === "Elf" &&
                (abilities.intelligence < 9 || abilities.constitution > 17)) ||
              (race === "Halfling" &&
                (abilities.dexterity < 9 || abilities.strength > 17))
            }
          >
            {race}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
}