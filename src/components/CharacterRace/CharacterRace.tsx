import { Input, Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { CharacterRaceProps } from "./definitions";
import { raceDetails, raceChoices } from "../../data/raceDetails";
import { ChangeEvent, useState, useEffect, MouseEvent } from "react";
import HomebrewWarning from "../HomebrewWarning/HomebrewWarning";

export default function CharacterRace({
  characterData,
  setCharacterData,
  setComboClass,
  setCheckedClasses,
}: CharacterRaceProps) {
  const [customRaceInput, setCustomRaceInput] = useState(
    characterData.race || ""
  );
  const [showCustomRaceInput, setShowCustomRaceInput] = useState(false);

  useEffect(() => {
    // If the current race is not in the raceChoices and it's not an empty string, it's a custom race
    if (
      !raceChoices.includes(characterData.race) &&
      characterData.race !== ""
    ) {
      setShowCustomRaceInput(true);
      setCustomRaceInput(characterData.race);
    }
  }, []);

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

  const handleClickCustomRaceInput = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  return (
    <>
      <Radio.Group
        onChange={onChange}
        // Check if the current race is included in the raceChoices, if not and it's not an empty string set it as "Custom"
        value={
          raceChoices.includes(characterData.race) || characterData.race === ""
            ? characterData.race
            : "Custom"
        }
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
            defaultValue={characterData.race}
            placeholder="Custom Race"
            onClick={handleClickCustomRaceInput}
          />
          <HomebrewWarning homebrew="Race" />
        </>
      )}
    </>
  );
}
