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
};

export default function CharRaceStep({
  abilities,
  race,
  setRace,
}: CharRaceStepProps) {
  // const [value, setValue] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setRace(e.target.value);
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
