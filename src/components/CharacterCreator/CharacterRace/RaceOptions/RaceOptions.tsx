import { isStandardRace } from "../../../../support/helpers";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import { races } from "../../../../data/races";
import {
  CharacterData,
  RaceNames,
  SetCharacterData,
} from "../../../../data/definitions";
import classNames from "classnames";

type RaceOptionsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  setComboClass: (comboClass: boolean) => void;
  setShowCustomRaceInput: (showCustomRaceInput: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
  customRaceInput: string;
};

export default function RaceOptions({
  characterData,
  setCharacterData,
  setComboClass,
  setShowCustomRaceInput,
  setCheckedClasses,
  customRaceInput,
}: RaceOptionsProps) {
  const onChange = (e: RadioChangeEvent) => {
    if (e.target.value === "Custom") setShowCustomRaceInput(true);
    else setShowCustomRaceInput(false);
    const selectedRace = e.target.value.toString() as keyof typeof RaceNames;
    setComboClass(false);
    setCheckedClasses([]);
    setCharacterData({
      ...characterData,
      race: e.target.value !== "Custom" ? selectedRace : customRaceInput,
      class: [],
      hp: { dice: "", points: 0, max: 0, desc: "" },
      equipment: [],
    });
  };
  const baseRaces = [
    RaceNames.DWARF,
    RaceNames.ELF,
    RaceNames.HALFLING,
    RaceNames.HUMAN,
  ];

  return (
    <Radio.Group
      onChange={onChange}
      value={
        isStandardRace(characterData.race) ? characterData.race : undefined
      }
      className="grid gap-2"
    >
      {Object.keys(races)
        .sort((a, b) =>
          races[a as keyof typeof races].name >
          races[b as keyof typeof races].name
            ? 1
            : -1
        )
        .map((raceKey) => {
          const choice = races[raceKey as keyof typeof races];
          if (!choice) return null; // Skip rendering if race is undefined
          const radioClassNames = classNames(
            "ps-2",
            "pe-2",
            "md:ps-4",
            "md:pe-4",
            "text-shipGray",
            { "font-bold": baseRaces.includes(choice.name as RaceNames) }
          );

          const isDisabled =
            (choice.minimumAbilityRequirements &&
              Object.entries(choice.minimumAbilityRequirements).some(
                ([ability, requirement]) =>
                  +characterData.abilities.scores[
                    ability as keyof typeof characterData.abilities.scores
                  ] < (requirement as number) // Cast requirement to number
              )) ||
            (choice.maximumAbilityRequirements &&
              Object.entries(choice.maximumAbilityRequirements).some(
                ([ability, requirement]) =>
                  +characterData.abilities.scores[
                    ability as keyof typeof characterData.abilities.scores
                  ] > (requirement as number) // Cast requirement to number
              ));

          return (
            <Radio
              key={choice.name}
              value={choice.name} // Set value to race.name
              className={radioClassNames}
              disabled={isDisabled}
            >
              {choice.name}
            </Radio>
          );
        })}
    </Radio.Group>
  );
}
