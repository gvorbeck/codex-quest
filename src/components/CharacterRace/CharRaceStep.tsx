import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { CharacterRaceProps } from "./definitions";
import { raceDetails } from "../../data/raceDetails";

const raceChoices = ["Dwarf", "Elf", "Halfling", "Human"];

export default function CharacterRace({
  characterData,
  setCharacterData,
  setComboClass,
  setCheckedClasses,
}: CharacterRaceProps) {
  const onChange = (e: RadioChangeEvent) => {
    const race = e.target.value
      .toString()
      .toLowerCase() as keyof typeof raceDetails;
    setComboClass(false);
    setCheckedClasses([]);
    setCharacterData({
      ...characterData,
      race: e.target.value,
      class: "",
      hp: { dice: "", points: 0, max: 0, desc: "" },
      restrictions: {
        race: [...raceDetails[race].restrictions],
        class: [],
      },
      equipment: [],
      specials: {
        race: [...raceDetails[race].specials],
        class: [],
      },
    });
  };

  return (
    <Radio.Group
      onChange={onChange}
      value={characterData.race}
      buttonStyle="solid"
    >
      {raceChoices.map((race) => (
        <Radio.Button
          key={race}
          value={race}
          className="ps-2 pe-2 md:ps-4 md:pe-4"
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
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
