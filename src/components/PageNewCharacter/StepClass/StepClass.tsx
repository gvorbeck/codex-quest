import { Flex, Input, Select, Switch, Typography } from "antd";
import React from "react";
// import RaceClassSelector from "../RaceClassSelector/RaceClassSelector";
// import { CharData, ClassNames, DiceTypes, RaceNames } from "@/data/definitions";
// import { classes } from "@/data/classes";
// import SpellOptions from "./SpellOptions/SpellOptions";
// import ComboClassOptions from "./ComboClassOptions/ComboClassOptions";
// import RaceClassDescription from "../RaceClassDescription/RaceClassDescription";
// import spellsData from "@/data/spells.json";
// import Options from "./Options/Options";
import {
  baseClasses,
  classSplit,
  getClassSelectOptions,
  getClassType,
  // isStandardClass,
} from "@/support/classSupport";
import { CharData, ClassNames } from "@/data/definitions";
import { classes } from "@/data/classes";
// import { set } from "firebase/database";
// import { useStepClass } from "./useStepClass";
// import { races } from "@/data/races";
// import { set } from "firebase/database";

interface StepClassProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  comboClass: boolean;
  comboClassSwitch: boolean;
  setComboClassSwitch: (comboClassSwitch: boolean) => void;
}

const StepClass: React.FC<
  StepClassProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  setCharacter,
  comboClass, // whether or not a character is able to use a combo class
  comboClassSwitch,
  setComboClassSwitch,
}) => {
  const defaultStandardClassSelectValue = "Choose a class";
  const defaultCustomClassInputPlaceholder = "Enter a custom class";
  const findCharacterStandardClass = (character: CharData) => {
    if (
      character.class.length &&
      getClassType(character.class) === "standard"
    ) {
      return classSplit(character.class)[0] as ClassNames;
    }
    return undefined;
  };
  const findCharacterIsMagical = (character: CharData) => {
    const classType = getClassType(character.class);
    if (classType === "custom" || classType === "combination") {
      return true;
    } else {
      const classArr = classSplit(character.class) ?? [];
      if (
        classes[classArr[0] as ClassNames]?.spellBudget?.[
          character.level - 1
        ].some((number) => number > 0)
      ) {
        return true;
      }
    }
    return false;
  };
  const onSupplementalContentSwitchChange = (checked: boolean) => {
    setSupplementalContentSwitch(checked);
  };
  const onCombinationClassSwitchChange = (checked: boolean) => {
    setComboClassSwitch(checked);
  };
  const onStandardClassSelectChange = (value: string) => {
    setStandardClassSelector(value as ClassNames);
  };
  const onCustomClassInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomClassInput(e.target.value);
  };
  const [customClassInput, setCustomClassInput] = React.useState<string>();
  const [isMagicCharacter, setIsMagicCharacter] = React.useState<boolean>(
    findCharacterIsMagical(character),
  );
  // If a character has a class, and it is 'standard' (and therefore not custom), then it is the value here.
  const [standardClassSelector, setStandardClassSelector] = React.useState<
    string | undefined
  >(findCharacterStandardClass(character));
  // If a user has a class, it is 'standard', and is not part of the base classes, then it is using supplemental content.
  const [supplementalContentSwitch, setSupplementalContentSwitch] =
    React.useState<boolean>(
      getClassType(character.class) === "standard" &&
        !baseClasses.includes(character.class[0] as ClassNames),
    );
  // If a user has selected the 'custom' option from the standard class select
  const [usingCustomClass, setUsingCustomClass] = React.useState<boolean>(
    getClassType(character.class) === "custom",
  );

  React.useEffect(() => {
    console.log("combination class switch changed", comboClassSwitch);
    setStandardClassSelector(defaultStandardClassSelectValue);
    setUsingCustomClass(false);
    setCustomClassInput(undefined);
  }, [comboClassSwitch]);

  React.useEffect(() => {
    console.log(
      "supplemental content switch changed",
      supplementalContentSwitch,
    );
    setStandardClassSelector(defaultStandardClassSelectValue);
  }, [supplementalContentSwitch]);

  React.useEffect(() => {
    console.log("standard class selector changed", standardClassSelector);
    if (standardClassSelector === "Custom") {
      setUsingCustomClass(true);
    } else {
      setUsingCustomClass(false);
    }
  }, [standardClassSelector]);

  return (
    <Flex gap={16} vertical className={className}>
      <Flex gap={16}>
        <Flex gap={8}>
          <Typography.Text>Enable SupplementalContent</Typography.Text>
          <Switch
            checked={supplementalContentSwitch}
            onChange={onSupplementalContentSwitchChange}
          />
        </Flex>
        {comboClass && (
          <Flex gap={8}>
            <Typography.Text>Use Combination Class</Typography.Text>
            <Switch
              checked={comboClassSwitch}
              onChange={onCombinationClassSwitchChange}
            />
          </Flex>
        )}
      </Flex>
      <Flex gap={16} vertical>
        {!comboClassSwitch ? (
          <Select
            className="w-full"
            defaultValue={defaultStandardClassSelectValue}
            onChange={onStandardClassSelectChange}
            options={getClassSelectOptions(
              character,
              !supplementalContentSwitch,
            )}
            value={standardClassSelector}
          />
        ) : (
          <div>
            <div>first class select</div>
            <div>second class select</div>
          </div>
        )}
        {usingCustomClass && (
          <Input
            placeholder={defaultCustomClassInputPlaceholder}
            value={customClassInput}
            onChange={onCustomClassInputChange}
          />
        )}
        {isMagicCharacter && <div>spell select/description</div>}
        {/* {hasClassSelections && <div>class selections</div>} */}
      </Flex>
    </Flex>
  );

  // const handleCustomClassInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setCustomClassInput(e.target.value);
  //   setCharacter({ ...character, class: [e.target.value] });
  // };
  // const handleSelectChange = (value: string) => {
  //   setClassSelector(value);
  // };

  // React.useEffect(() => {
  //   setStartingSpells([]);
  //   if (classSelector !== "custom" && classSelector !== "") {
  //     let newHitDie = classes[classSelector as ClassNames]?.hitDice;
  //     const raceSetup = races[character.race as RaceNames];
  //     if (raceSetup?.incrementHitDie || raceSetup?.decrementHitDie) {
  //       newHitDie = adjustHitDice(newHitDie, raceSetup);
  //     }
  //     setCharacter({
  //       ...character,
  //       class: [classSelector],
  //       spells: [],
  //       hp: {
  //         ...character.hp,
  //         dice: newHitDie,
  //       },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [classSelector]);

  // React.useEffect(() => {
  //   let newHP = "0";
  //   if (character.class.length > 1) {
  //     if (character.class.includes(ClassNames.FIGHTER)) newHP = DiceTypes.D6;
  //     if (character.class.includes(ClassNames.THIEF)) newHP = DiceTypes.D4;
  //   } else {
  //     newHP = classes[character.class[0] as ClassNames]?.hitDice;
  //   }
  //   const raceSetup = races[character.race as RaceNames];
  //   if (raceSetup?.incrementHitDie || raceSetup?.decrementHitDie) {
  //     newHP = adjustHitDice(newHP, raceSetup);
  //   }

  //   setCharacter({
  //     ...character,
  //     hp: { ...character.hp, dice: newHP },
  //   });
  //   if (firstClass && !secondClass) {
  //     comboClassSwitch
  //       ? setCharacter({ ...character, class: [firstClass] })
  //       : setCharacter({ ...character, class: [] });
  //   }
  //   if (secondClass && !firstClass)
  //     setCharacter({ ...character, class: [secondClass] });
  //   if (secondClass && firstClass)
  //     setCharacter({ ...character, class: [firstClass, secondClass] });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [secondClass]);

  // React.useEffect(() => {
  //   const newSpells = spellsData.filter(
  //     (spell) =>
  //       startingSpells.includes(spell.name) || spell.name === "Read Magic",
  //   );
  //   setCharacter({
  //     ...character,
  //     spells: newSpells,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [startingSpells]);

  // React.useEffect(() => {
  //   console.info(comboClassSwitch);
  //   if (!comboClassSwitch) {
  //     // uncommenting this code removes your class selection upon returning to this step.
  //     // setClassSelector("");
  //     // setSecondClass(undefined);
  //     // setCharacter({
  //     //   ...character,
  //     //   class: [],
  //     //   spells: [],
  //     // });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [comboClassSwitch]);

  // React.useEffect(() => {
  //   const options = getClassSelectOptions(
  //     character,
  //     !supplementalContentSwitch,
  //   );
  //   setClassSelectOptions(options);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [supplementalContentSwitch, character]);

  // return (
  //   <Flex vertical gap={16} className={className}>
  //     <Options
  //       comboClass={comboClass}
  //       comboClassSwitch={comboClassSwitch}
  //       setComboClassSwitch={setComboClassSwitch}
  //       setSupplementalContentSwitch={setSupplementalContentSwitch}
  //       supplementalContentSwitch={supplementalContentSwitch}
  //     />
  //     {comboClass && comboClassSwitch ? (
  //       <ComboClassOptions
  //         character={character}
  //         setCharacter={setCharacter}
  //         firstClass={firstClass}
  //         secondClass={secondClass}
  //         setSecondClass={setSecondClass}
  //       />
  //     ) : (
  //       <RaceClassSelector
  //         customInput={customClassInput}
  //         handleCustomInputChange={handleCustomClassInputChange}
  //         handleSelectChange={handleSelectChange}
  //         selectOptions={classSelectOptions}
  //         selector={classSelector}
  //         type="class"
  //       />
  //     )}
  //     {character.class
  //       .filter(
  //         (className) =>
  //           !!classes[className as ClassNames]?.spellBudget?.[0][0],
  //       )
  //       .map((className) => (
  //         <SpellOptions
  //           key={className}
  //           character={character}
  //           characterClass={className}
  //           startingSpells={startingSpells}
  //           setStartingSpells={setStartingSpells}
  //         />
  //       ))}
  //     {!character.class.includes("Custom") &&
  //       !!character.class.length &&
  //       character.class.map(
  //         (className) =>
  //           classes[className as ClassNames] && (
  //             <RaceClassDescription
  //               key={className}
  //               name={className}
  //               description={`${classes[className as ClassNames]?.details
  //                 ?.description}`}
  //             />
  //           ),
  //       )}
  //   </Flex>
  // );
};

export default StepClass;
