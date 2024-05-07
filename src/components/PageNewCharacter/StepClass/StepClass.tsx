import { CharData, ClassNames, RaceNames } from "@/data/definitions";
import React from "react";
import SupplementalContentSwitch from "../SupplementalContentSwitch/SupplementalContentSwitch";
import { getClassType, isStandardClass } from "@/support/classSupport";
import { Flex, Input, InputRef, Select, SelectProps, Spin } from "antd";
import { races } from "@/data/races";
import { classes } from "@/data/classes";
import { ClassSetup } from "@/data/classes/definitions";
import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";
import SpellSelect from "./SpellSelect/SpellSelect";
import RaceClassDescription from "../RaceClassDescription/RaceClassDescription";
import { toSlugCase } from "@/support/stringSupport";

// Lazy loading this because it's a big component and it's not needed unless the user selects a custom class.
const AllSpellsSelection = React.lazy(
  () => import("./AllSpellsSelection/AllSpellsSelection"),
);

interface StepClassProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const StepClass: React.FC<
  StepClassProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const classType = getClassType(character.class);
  const [supplementalSwitch, setSupplementalSwitch] = React.useState(
    classType[0] === "custom" || classType[1] === "supplemental",
  );
  const [combinationClass, setCombinationClass] = React.useState(
    classType[0] === "combination",
  );
  const [primaryClass, setPrimaryClass] = React.useState<string | undefined>(
    classType[0] === "custom" ? "Custom" : character.class[0],
  );
  const [secondaryClass, setSecondaryClass] = React.useState<
    string | undefined
  >(character.class[1]);

  const inputRef = React.useRef<InputRef>(null);

  const characterRace = races[character.race as RaceNames];

  const spin = <Spin size="large" className="w-full h-full py-4" />;

  function classIsDisabled(choice: ClassSetup) {
    return (
      choice.minimumAbilityRequirements &&
      Object.entries(choice.minimumAbilityRequirements).some(
        ([ability, requirement]) =>
          +character.abilities?.scores[
            ability as keyof typeof character.abilities.scores
          ] < (requirement as number), // Cast requirement to number
      )
    );
  }

  function getClassSelectOptions(
    useSupplemental?: boolean,
  ): SelectProps["options"] {
    const options = [];

    for (const [className, classDetails] of Object.entries(classes)) {
      const isAllowedByRace =
        !characterRace ||
        characterRace.allowedStandardClasses.includes(className as ClassNames);

      if (
        (useSupplemental || classDetails.isBase) &&
        !classIsDisabled(classDetails) &&
        isAllowedByRace
      ) {
        options.push({ value: className, label: className });
      }
    }
    return options;
  }

  function getComboClassSelectOptions(select: 0 | 1): SelectProps["options"] {
    if (select === 0) {
      return [{ value: ClassNames.MAGICUSER, label: ClassNames.MAGICUSER }];
    } else {
      const options = [];
      const combinations = [...characterRace.allowedCombinationClasses!].filter(
        (option) => option !== ClassNames.MAGICUSER,
      );
      for (const className of combinations) {
        options.push({ value: className, label: className });
      }
      return options;
    }
  }

  function handleSupplementalSwitchChange() {
    setSupplementalSwitch((prevSupplementalSwitch) => !prevSupplementalSwitch);
  }

  function handleCombinationClassSwitchChange() {
    setPrimaryClass(undefined);
    setSecondaryClass(undefined);
    setCombinationClass((prevCombinationClass) => !prevCombinationClass);
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      class: [],
      hp: { dice: "", points: 0, max: 0, desc: "" },
      equipment: [],
      gold: 0,
      spells: [],
      specials: {
        ...prevCharacter.specials,
        class: [],
      },
      restrictions: {
        ...prevCharacter.restrictions,
        class: [],
      },
    }));
  }
  function handlePrimaryClassSelectChange(value: string) {
    setPrimaryClass(value);

    if (value === "Custom") {
      setTimeout(() => inputRef.current?.focus(), 5);
      setCharacter((prevCharacter) => ({
        ...prevCharacter,
        class: [],
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: [],
        gold: 0,
        spells: [],
        specials: {
          ...prevCharacter.specials,
          class: [],
        },
        restrictions: {
          ...prevCharacter.restrictions,
          class: [],
        },
      }));
      return;
    }

    setCharacter((prevCharacter) => {
      const classArray = [...prevCharacter.class];
      const newClassArray =
        classArray[1] && combinationClass ? [value, classArray[1]] : [value];

      return {
        ...prevCharacter,
        class: newClassArray,
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: [],
        gold: 0,
        spells: [],
      };
    });
  }

  function handleSecondaryClassSelectChange(value: string) {
    setSecondaryClass(value);

    setCharacter((prevCharacter) => {
      const classArray = [...prevCharacter.class];
      const newClassArray = classArray[0] ? [classArray[0], value] : [value];

      return {
        ...prevCharacter,
        class: newClassArray,
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: [],
        gold: 0,
      };
    });
  }

  function handleClassInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      class: value !== "" ? [value] : [],
      hp: { dice: "", points: 0, max: 0, desc: "" },
      equipment: [],
      gold: 0,
    }));
  }

  const showComboClassSwitch = characterRace.allowedCombinationClasses
    ?.length ? (
    <SupplementalContentSwitch
      label="Use Combination Class"
      supplementalSwitch={combinationClass}
      onChange={handleCombinationClassSwitchChange}
    />
  ) : null;

  const selectOptionsSource = combinationClass
    ? getComboClassSelectOptions(0)
    : getClassSelectOptions(supplementalSwitch);

  const comboClassSelect = combinationClass ? (
    <Select
      options={getComboClassSelectOptions(1)}
      placeholder="Select a class"
      value={secondaryClass}
      onChange={handleSecondaryClassSelectChange}
    />
  ) : null;

  const customClassForm =
    classType[0] === "custom" || primaryClass === "Custom" ? (
      <Flex gap={8} vertical>
        <HomebrewWarning homebrew="class" />
        <Input
          ref={inputRef}
          value={
            isStandardClass(character.class) ? undefined : character.class[0]
          }
          onChange={handleClassInputChange}
          placeholder="Custom Class Name"
        />
        <React.Suspense fallback={spin}>
          <AllSpellsSelection
            character={character}
            setCharacter={setCharacter}
          />
        </React.Suspense>
      </Flex>
    ) : null;

  const classSelectionDescriptions = !!character.class.length &&
    classType[0] !== "custom" && (
      <Flex gap={8} vertical>
        {character.class.some((className) => {
          const classInfo = classes[className as ClassNames];
          return classInfo?.spellBudget && classInfo.spellBudget[0][0] > 0;
        }) && <SpellSelect character={character} setCharacter={setCharacter} />}
        <RaceClassDescription
          subject={character.class[0]}
          description={
            classes[character.class[0] as ClassNames]?.details?.description ||
            ""
          }
          image={`classes/${toSlugCase(character.class[0])}`}
        />
        {classType[0] === "combination" && character.class[1] && (
          <RaceClassDescription
            subject={character.class[1]}
            description={
              classes[character.class[1] as ClassNames]?.details?.description ||
              ""
            }
            image={`classes/${toSlugCase(character.class[1])}`}
          />
        )}
      </Flex>
    );

  return (
    <Flex gap={16} vertical className={className}>
      <Flex gap={8} vertical>
        <SupplementalContentSwitch
          supplementalSwitch={supplementalSwitch}
          onChange={handleSupplementalSwitchChange}
        />
        {showComboClassSwitch}
      </Flex>
      <Flex gap={8} vertical>
        <Select
          options={selectOptionsSource}
          placeholder="Select a class"
          value={primaryClass}
          onChange={handlePrimaryClassSelectChange}
        />
        {comboClassSelect}
      </Flex>
      {customClassForm}
      {classSelectionDescriptions}
    </Flex>
  );
};

export default StepClass;
