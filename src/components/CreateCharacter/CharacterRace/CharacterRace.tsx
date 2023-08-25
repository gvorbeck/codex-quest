import { Input } from "antd";
import { CharacterRaceProps } from "./definitions";
import { ChangeEvent, useState, useEffect, MouseEvent } from "react";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import DOMPurify from "dompurify";
import DescriptionBubble from "../DescriptionBubble/DescriptionBubble";
import { RaceNamesTwo, races } from "../../../data/races";
import RaceOptions from "./RaceOptions/RaceOptions";

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
        <RaceOptions
          characterData={characterData}
          setCharacterData={setCharacterData}
          setComboClass={setComboClass}
          setShowCustomRaceInput={setShowCustomRaceInput}
          setCheckedClasses={setCheckedClasses}
          customRaceInput={customRaceInput}
        />
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
