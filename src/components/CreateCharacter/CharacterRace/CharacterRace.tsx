import { Input, Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { CharacterRaceProps } from "./definitions";
import { raceDetails } from "../../../data/raceDetails";
import { ChangeEvent, useState, useEffect, MouseEvent } from "react";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import DOMPurify from "dompurify";
import { RaceNames } from "../../definitions";
import { isStandardRace } from "../../../support/helpers";
import DescriptionBubble from "../DescriptionBubble/DescriptionBubble";

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
    // If the current race is not in the RaceNames enum and it's not an empty string, it's a custom race
    if (
      !Object.values(RaceNames).includes(characterData.race as RaceNames) &&
      characterData.race !== ""
    ) {
      setShowCustomRaceInput(true);
      setCustomRaceInput(characterData.race);
    }
  }, []);

  const onChange = (e: RadioChangeEvent) => {
    if (e.target.value === "Custom") setShowCustomRaceInput(true);
    else setShowCustomRaceInput(false);
    const race = e.target.value.toString() as keyof typeof raceDetails;
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
    const cleanInput = DOMPurify.sanitize(event.target.value);
    setCustomRaceInput(cleanInput);
    setCharacterData({ ...characterData, race: cleanInput });
  };

  const handleClickCustomRaceInput = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-[auto_auto] items-start">
        <Radio.Group
          onChange={onChange}
          value={
            isStandardRace(characterData.race) ? characterData.race : undefined
          }
          className="grid gap-2"
        >
          {Object.values(RaceNames).map((race) => {
            if (race === RaceNames.CUSTOM) return null; // Optionally exclude custom race
            return (
              <Radio
                key={race}
                value={race}
                className="ps-2 pe-2 md:ps-4 md:pe-4"
                disabled={
                  (race === RaceNames.DWARF &&
                    (+characterData.abilities.scores.constitution < 9 ||
                      +characterData.abilities.scores.charisma > 17)) ||
                  (race === RaceNames.ELF &&
                    (+characterData.abilities.scores.intelligence < 9 ||
                      +characterData.abilities.scores.constitution > 17)) ||
                  (race === RaceNames.HALFLING &&
                    (+characterData.abilities.scores.dexterity < 9 ||
                      +characterData.abilities.scores.strength > 17)) ||
                  (race === RaceNames.GNOME &&
                    (+characterData.abilities.scores.constitution < 9 ||
                      +characterData.abilities.scores.strength > 17))
                }
              >
                {race}
              </Radio>
            );
          })}
        </Radio.Group>
        {characterData.race &&
          Object.values(RaceNames).includes(characterData.race as RaceNames) &&
          characterData.race !== RaceNames.CUSTOM && (
            <DescriptionBubble
              description={raceDetails[characterData.race].description}
            />
          )}
      </div>
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
