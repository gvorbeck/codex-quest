import { Input, Radio, Typography } from "antd";
import type { RadioChangeEvent } from "antd";
import { CharacterRaceProps } from "./definitions";
import { raceDetails } from "../../data/raceDetails";
import { ChangeEvent, useState } from "react";

const raceChoices = ["Dwarf", "Elf", "Halfling", "Human", "Custom"];

export default function CharacterRace({
  characterData,
  setCharacterData,
  setComboClass,
  setCheckedClasses,
}: CharacterRaceProps) {
  const [customRaceInput, setCustomRaceInput] = useState("");
  const [showCustomRaceInput, setShowCustomRaceInput] = useState(false);
  const onChange = (e: RadioChangeEvent) => {
    if (e.target.value === "Custom") setShowCustomRaceInput(true);
    else setShowCustomRaceInput(false);

    const race = e.target.value
      .toString()
      .toLowerCase() as keyof typeof raceDetails;
    setComboClass(false);
    setCheckedClasses([]);
    setCharacterData({
      ...characterData,
      race: e.target.value !== "Custom" ? e.target.value : customRaceInput,
      class: "",
      hp: { dice: "", points: 0, max: 0, desc: "" },
      restrictions: {
        race:
          e.target.value === "Custom"
            ? []
            : [...raceDetails[race].restrictions],
        class: [],
      },
      equipment: [],
      specials: {
        race:
          e.target.value === "Custom" ? [] : [...raceDetails[race].specials],
        class: [],
      },
    });
  };

  const handleChangeCustomRaceInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCustomRaceInput(event.target.value);
    setCharacterData({ ...characterData, race: event.target.value });
  };

  return (
    <>
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
      {showCustomRaceInput && (
        <>
          <Input
            className="my-4"
            value={customRaceInput}
            onChange={handleChangeCustomRaceInput}
          />
          <Typography.Text type="warning" italic>
            Work closely with your GM when creating a custom Race
          </Typography.Text>
        </>
      )}
    </>
  );
}
