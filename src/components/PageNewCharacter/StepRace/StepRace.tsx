import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";
import { CharData, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { RaceSetup } from "@/data/races/definitions";
import { isStandardRace } from "@/support/raceSupport";
import {
  Flex,
  Input,
  InputRef,
  Select,
  SelectProps,
  Switch,
  Typography,
} from "antd";
import React from "react";
import RaceClassDescription from "../RaceClassDescription/RaceClassDescription";

interface StepRaceProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const StepRace: React.FC<
  StepRaceProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const [supplementalSwitch, setSupplmentalSwitch] = React.useState(
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

  function handleSupplementalSwitchChange() {
    setSupplmentalSwitch((prevSupplementalSwitch) => !prevSupplementalSwitch);
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
    }));
  }

  return (
    <Flex gap={16} vertical className={className}>
      <Flex gap={16}>
        <Typography.Text>Enable Supplemental Content</Typography.Text>
        <Switch
          checked={supplementalSwitch}
          onChange={handleSupplementalSwitchChange}
        />
      </Flex>
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
// import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";
// import { CharData, RaceNames } from "@/data/definitions";
// import { useDeviceType } from "@/hooks/useDeviceType";
// import { getRaceSelectOptions, isStandardRace } from "@/support/raceSupport";
// import { Flex, Input, Select, Switch, Typography } from "antd";
// import classNames from "classnames";
// import React, { ChangeEvent } from "react";
// import RaceClassDescription from "../StepClass/RaceClassDescription/RaceClassDescription";
// import { useImages } from "@/hooks/useImages";
// import { toSlugCase } from "@/support/stringSupport";

// interface StepRaceProps {
//   character: CharData;
//   setCharacter: (character: CharData) => void;
// }

// const StepRace: React.FC<
//   StepRaceProps & React.ComponentPropsWithRef<"div">
// > = ({ className, character, setCharacter }) => {
//   // STATE
//   const [supplementalContent, setSupplementalContent] = React.useState<boolean>(
//     character.race ? !isStandardRace(character.race, true) : false,
//   );
//   const [race, setRace] = React.useState<string | undefined>(
//     character.race as string | undefined,
//   );
//   // if the character has a non-custom race
//   const [standardRace, setStandardRace] = React.useState<string | undefined>(
//     !!character.race && isStandardRace(character.race)
//       ? character.race
//       : undefined,
//   );
//   //
//   const [customRace, setCustomRace] = React.useState<string | undefined>(
//     !!character.race && !isStandardRace(character.race)
//       ? character.race
//       : undefined,
//   );
//   // HOOKS
//   const { isMobile } = useDeviceType();
//   // VARS
//   const { getRaceClassImage } = useImages();
//   const innerFlexClassNames = classNames({ "justify-between": isMobile });
//   const raceImage = (className: RaceNames) =>
//     getRaceClassImage(toSlugCase(className));
//   // METHODS
//   const onSupplementalContentChange = (checked: boolean) => {
//     setSupplementalContent(checked);
//     setRace(undefined);
//     setStandardRace(undefined);
//     setCustomRace(undefined);
//   };
//   const onStandardRaceChange = (value: string) => {
//     setCustomRace(undefined);
//     setStandardRace(value);
//     setRace(value);
//   };
//   const onCustomRaceChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target;
//     setCustomRace(value);
//     setRace(value);
//   };
//   // EFFECTS
//   React.useEffect(() => {
//     // setCharacter({}) // race and class, dice, equipment, spells, hp, etc
//     if (race)
//       setCharacter({
//         ...character,
//         race,
//         class: [],
//         spells: [],
//         hp: { dice: "", points: 0, desc: "", max: 0 },
//         equipment: [],
//       });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [race]);
//   return (
//     <Flex gap={16} vertical className={className}>
//       <Flex gap={8} className={innerFlexClassNames}>
//         <Typography.Text>Enable Supplemental Content</Typography.Text>
//         <Switch
//           checked={supplementalContent}
//           onChange={onSupplementalContentChange}
//         />
//       </Flex>
//       <Select
//         options={
//           supplementalContent
//             ? getRaceSelectOptions(character, false)
//             : getRaceSelectOptions(character)
//         }
//         value={
//           standardRace === undefined && isStandardRace(character.race)
//             ? "Custom"
//             : standardRace
//         }
//         onChange={onStandardRaceChange}
//         placeholder="Select a race"
//       />
//       {customRace || standardRace === "Custom" ? (
//         <>
//           <HomebrewWarning homebrew="race" />
//           <Input
//             value={customRace ?? character.race}
//             onChange={(e) => onCustomRaceChange(e)}
//           />
//         </>
//       ) : (
//         standardRace && (
//           <RaceClassDescription
//             subject={race ?? ""}
//             image={raceImage(race as RaceNames)}
//           />
//         )
//       )}
//     </Flex>
//   );
// };

// export default StepRace;
