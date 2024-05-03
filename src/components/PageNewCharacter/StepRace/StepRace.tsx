import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";
import { CharData, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { RaceSetup } from "@/data/races/definitions";
import { isStandardRace } from "@/support/raceSupport";
import { Flex, Input, InputRef, Select, SelectProps } from "antd";
import React from "react";
import RaceClassDescription from "../RaceClassDescription/RaceClassDescription";
import SupplementalContentSwitch from "../SupplementalContentSwitch/SupplementalContentSwitch";

interface StepRaceProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const StepRace: React.FC<
  StepRaceProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const [supplementalSwitch, setSupplementalSwitch] = React.useState(
    !isStandardRace(character.race, true) && character.race !== "",
  );
  const [showCustomInput, setShowCustomInput] = React.useState(
    !isStandardRace(character.race) && character.race !== "",
  );
  const inputRef = React.useRef<InputRef>(null);

  function raceIsDisabled(choice: RaceSetup) {
    return (
      (choice.minimumAbilityRequirements &&
        Object.entries(choice.minimumAbilityRequirements).some(
          ([ability, requirement]) =>
            +character.abilities?.scores[
              ability as keyof typeof character.abilities.scores
            ] < (requirement as number), // Cast requirement to number
        )) ||
      (choice.maximumAbilityRequirements &&
        Object.entries(choice.maximumAbilityRequirements).some(
          ([ability, requirement]) =>
            +character.abilities?.scores[
              ability as keyof typeof character.abilities.scores
            ] > (requirement as number), // Cast requirement to number
        ))
    );
  }

  function getRaceSelectOptions(
    useSupplemental?: boolean,
  ): SelectProps["options"] {
    const options = [];
    for (const [raceName, raceDetails] of Object.entries(races)) {
      if (
        (useSupplemental || raceDetails.isBase) &&
        !raceIsDisabled(raceDetails)
      ) {
        options.push({ value: raceName, label: raceName });
      }
    }
    return options;
  }

  function getRaceSelectValue() {
    let value;
    if (character.race.length !== 0) {
      if (isStandardRace(character.race)) {
        value = character.race;
      } else {
        value = "Custom";
      }
    }
    return value;
  }

  function handleRaceSelectChange(value: string) {
    if (value === "Custom") {
      setShowCustomInput(true);
      setTimeout(() => inputRef.current?.focus(), 5);
    } else {
      setShowCustomInput(false);
      setCharacter((prevCharacter) => ({
        ...prevCharacter,
        race: value,
        class: [],
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: [],
        gold: 0,
        spells: [],
      }));
    }
  }

  function handleRaceInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      race: value,
      class: [],
      hp: { dice: "", points: 0, max: 0, desc: "" },
      equipment: [],
      gold: 0,
      spells: [],
    }));
  }

  function handleSupplementalSwitchChange() {
    setSupplementalSwitch((prevSupplementalSwitch) => !prevSupplementalSwitch);
  }

  return (
    <Flex gap={16} vertical className={className}>
      <SupplementalContentSwitch
        supplementalSwitch={supplementalSwitch}
        onChange={handleSupplementalSwitchChange}
      />
      <Select
        options={getRaceSelectOptions(supplementalSwitch)}
        value={getRaceSelectValue()}
        onChange={handleRaceSelectChange}
        placeholder="Select a race"
      />
      {showCustomInput && (
        <div>
          <HomebrewWarning homebrew="race" />
          <Input
            ref={inputRef}
            value={isStandardRace(character.race) ? "" : character.race}
            onChange={handleRaceInputChange}
          />
        </div>
      )}
      {isStandardRace(character.race) && (
        <RaceClassDescription
          subject={character.race}
          description={
            races[character.race as RaceNames].details.description ?? ""
          }
          image={"races/" + character.race.toLowerCase()}
        />
      )}
    </Flex>
  );
};

export default StepRace;
