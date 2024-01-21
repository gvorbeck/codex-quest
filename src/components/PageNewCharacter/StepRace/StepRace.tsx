import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";
import { CharData, RaceNames } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { getRaceSelectOptions, isStandardRace } from "@/support/raceSupport";
import { Flex, Input, Select, Switch, Typography } from "antd";
import classNames from "classnames";
import React, { ChangeEvent } from "react";
import WRaceClassDescription from "../StepClass/WRaceClassDescription/WRaceClassDescription";
import { useImages } from "@/hooks/useImages";
import { toSlugCase } from "@/support/stringSupport";

interface StepRaceProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const StepRace: React.FC<
  StepRaceProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  // STATE
  const [supplementalContent, setSupplementalContent] = React.useState<boolean>(
    character.race ? !isStandardRace(character.race, true) : false,
  );
  const [race, setRace] = React.useState<string | undefined>(
    character.race as string | undefined,
  );
  // if the character has a non-custom race
  const [standardRace, setStandardRace] = React.useState<string | undefined>(
    !!character.race && isStandardRace(character.race)
      ? character.race
      : undefined,
  );
  //
  const [customRace, setCustomRace] = React.useState<string | undefined>(
    !!character.race && !isStandardRace(character.race)
      ? character.race
      : undefined,
  );
  // HOOKS
  const { isMobile } = useDeviceType();
  // VARS
  const { getRaceClassImage } = useImages();
  const innerFlexClassNames = classNames({ "justify-between": isMobile });
  const raceImage = (className: RaceNames) =>
    getRaceClassImage(toSlugCase(className));
  // METHODS
  const onSupplementalContentChange = (checked: boolean) => {
    setSupplementalContent(checked);
    setRace(undefined);
    setStandardRace(undefined);
    setCustomRace(undefined);
  };
  const onStandardRaceChange = (value: string) => {
    setCustomRace(undefined);
    setStandardRace(value);
    setRace(value);
  };
  const onCustomRaceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCustomRace(value);
    setRace(value);
  };
  // EFFECTS
  React.useEffect(() => {
    // setCharacter({}) // race and class, dice, equipment, spells, hp, etc
    if (race)
      setCharacter({
        ...character,
        race,
        class: [],
        spells: [],
        hp: { dice: "", points: 0, desc: "", max: 0 },
        equipment: [],
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [race]);
  return (
    <Flex gap={16} vertical className={className}>
      <Flex gap={8} className={innerFlexClassNames}>
        <Typography.Text>Enable Supplemental Content</Typography.Text>
        <Switch
          checked={supplementalContent}
          onChange={onSupplementalContentChange}
        />
      </Flex>
      <Select
        options={
          supplementalContent
            ? getRaceSelectOptions(character, false)
            : getRaceSelectOptions(character)
        }
        value={
          standardRace === undefined && isStandardRace(character.race)
            ? "Custom"
            : standardRace
        }
        onChange={onStandardRaceChange}
        placeholder="Select a race"
      />
      {customRace || standardRace === "Custom" ? (
        <>
          <HomebrewWarning homebrew="race" />
          <Input
            value={customRace ?? character.race}
            onChange={(e) => onCustomRaceChange(e)}
          />
        </>
      ) : (
        standardRace && (
          <WRaceClassDescription
            subject={race ?? ""}
            image={raceImage(race as RaceNames)}
          />
        )
      )}
    </Flex>
  );
};

export default StepRace;
