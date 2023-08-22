import { Input, Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { CharacterRaceProps } from "./definitions";
import { ChangeEvent, useState, useEffect, MouseEvent } from "react";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import DOMPurify from "dompurify";
import { isStandardRace } from "../../../support/helpers";
import DescriptionBubble from "../DescriptionBubble/DescriptionBubble";
import { RaceNamesTwo, races } from "../../../data/races";

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
    // If the current race is not in the RaceNames enum and it's not an empty string, it's a custom race.
    if (
      !Object.values(RaceNamesTwo).includes(
        characterData.race as RaceNamesTwo
      ) &&
      characterData.race !== ""
    ) {
      setShowCustomRaceInput(true);
      setCustomRaceInput(characterData.race);
    }
  }, []);

  const onChange = (e: RadioChangeEvent) => {
    if (e.target.value === "Custom") setShowCustomRaceInput(true);
    else setShowCustomRaceInput(false);
    const selectedRace = e.target.value.toString() as keyof typeof RaceNamesTwo;
    setComboClass(false);
    setCheckedClasses([]);
    setCharacterData({
      ...characterData,
      race: e.target.value !== "Custom" ? selectedRace : customRaceInput,
      class: "",
      hp: { dice: "", points: 0, max: 0, desc: "" },
      equipment: [],
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

  const raceDescription =
    races[characterData.race as keyof typeof races]?.details?.description || "";

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
          {Object.values(RaceNamesTwo).map((race) => {
            return (
              <Radio
                key={race}
                value={race}
                className="ps-2 pe-2 md:ps-4 md:pe-4"
                disabled={
                  (races[race].minimumAbilityRequirements &&
                    Object.entries(
                      races[race].minimumAbilityRequirements!
                    ).some(
                      ([ability, requirement]) =>
                        +characterData.abilities.scores[
                          ability as keyof typeof characterData.abilities.scores
                        ] < requirement
                    )) ||
                  (races[race].maximumAbilityRequirements &&
                    Object.entries(
                      races[race].maximumAbilityRequirements!
                    ).some(
                      ([ability, requirement]) =>
                        +characterData.abilities.scores[
                          ability as keyof typeof characterData.abilities.scores
                        ] > requirement
                    ))
                }
              >
                {race}
              </Radio>
            );
          })}
        </Radio.Group>
        {characterData.race &&
          Object.values(RaceNamesTwo).includes(
            characterData.race as RaceNamesTwo
          ) &&
          characterData.race !== RaceNamesTwo.CUSTOM && (
            <DescriptionBubble description={raceDescription} />
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
