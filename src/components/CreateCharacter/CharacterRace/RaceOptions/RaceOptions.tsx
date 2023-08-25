import { RaceOptionsProps } from "./definitions";
import { isStandardRace } from "../../../../support/helpers";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import { RaceNamesTwo, races } from "../../../../data/races";

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
          const race = races[raceKey as keyof typeof races];
          if (!race) return null; // Skip rendering if race is undefined

          const isDisabled =
            (race.minimumAbilityRequirements &&
              Object.entries(race.minimumAbilityRequirements).some(
                ([ability, requirement]) =>
                  +characterData.abilities.scores[
                    ability as keyof typeof characterData.abilities.scores
                  ] < (requirement as number) // Cast requirement to number
              )) ||
            (race.maximumAbilityRequirements &&
              Object.entries(race.maximumAbilityRequirements).some(
                ([ability, requirement]) =>
                  +characterData.abilities.scores[
                    ability as keyof typeof characterData.abilities.scores
                  ] > (requirement as number) // Cast requirement to number
              ));

          return (
            <Radio
              key={race.name}
              value={race.name} // Set value to race.name
              className="ps-2 pe-2 md:ps-4 md:pe-4"
              disabled={isDisabled}
            >
              {race.name}
            </Radio>
          );
        })}
    </Radio.Group>
  );
}
