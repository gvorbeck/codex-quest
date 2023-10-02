import { Typography } from "antd";
import { getSpecialAbilityRaceOverrides } from "../../../../support/helpers";
import { marked } from "marked";
import { ClassNames, RaceNames } from "../../../../data/definitions";

type SpecialAbilitiesFootnotesProps = {
  characterRace: RaceNames;
  characterClass: ClassNames;
};

export default function SpecialAbilitiesFootnotes({
  characterRace,
  characterClass,
}: SpecialAbilitiesFootnotesProps) {
  const raceOverrides = getSpecialAbilityRaceOverrides(characterRace);
  let matchingOverrides: [string, string][] | [] = [];
  raceOverrides.map((raceOverride: any) => {
    if (raceOverride[0] === characterClass) {
      matchingOverrides = Object.entries(raceOverride[1]);
    }
  });
  return matchingOverrides.map((override: [string, string]) => (
    <div className="mt-2 italic" key={override[1]}>
      <Typography.Text className="text-shipGray block">
        <div
          dangerouslySetInnerHTML={{
            __html: marked(`* **${override[0]}**: ${override[1]}`),
          }}
        />
      </Typography.Text>
    </div>
  ));
}
