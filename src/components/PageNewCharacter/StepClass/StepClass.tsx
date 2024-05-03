import { CharData, ClassNames, RaceNames } from "@/data/definitions";
import React from "react";
import SupplementalContentSwitch from "../SupplementalContentSwitch/SupplementalContentSwitch";
import { getClassType, isStandardClass } from "@/support/classSupport";
import { Flex, Input, InputRef, Select, SelectProps } from "antd";
import { races } from "@/data/races";
import { classes } from "@/data/classes";
import { ClassSetup } from "@/data/classes/definitions";
import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";

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
    }));
  }
  function handlePrimaryClassSelectChange(value: string) {
    setPrimaryClass(value);
    if (value === "Custom") {
      setCharacter((prevCharacter) => ({
        ...prevCharacter,
        class: [],
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: [],
        gold: 0,
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
      class: [value],
      hp: { dice: "", points: 0, max: 0, desc: "" },
      equipment: [],
      gold: 0,
    }));
  }

  return (
    <Flex gap={16} vertical className={className}>
      <Flex gap={8} vertical>
        <SupplementalContentSwitch
          supplementalSwitch={supplementalSwitch}
          onChange={handleSupplementalSwitchChange}
        />
        {characterRace.allowedCombinationClasses?.length && (
          <SupplementalContentSwitch
            label="Use Combination Class"
            supplementalSwitch={combinationClass}
            onChange={handleCombinationClassSwitchChange}
          />
        )}
      </Flex>
      <Flex gap={8} vertical>
        <Select
          options={
            combinationClass
              ? getComboClassSelectOptions(0)
              : getClassSelectOptions(supplementalSwitch)
          }
          placeholder="Select a class"
          value={primaryClass}
          onChange={handlePrimaryClassSelectChange}
        />
        {combinationClass && (
          <Select
            options={getComboClassSelectOptions(1)}
            placeholder="Select a class"
            value={secondaryClass}
            onChange={handleSecondaryClassSelectChange}
          />
        )}
      </Flex>
      {(classType[0] === "custom" || primaryClass === "Custom") && (
        <div>
          <HomebrewWarning homebrew="class" />
          <Input
            ref={inputRef}
            value={
              isStandardClass(character.class) ? undefined : character.class[0]
            }
            onChange={handleClassInputChange}
            placeholder="Custom Class Name"
          />
          <div>CUSTOM CLASS SPELL SELECTION</div>
        </div>
      )}
      {!!character.class.length && classType[0] !== "custom" && (
        <div>
          {character.class.some(
            (className) => classes[className as ClassNames].spellBudget?.length,
          ) && <div>SPELL SELECTION</div>}
          <div>CLASS DESCRIPTION</div>
          {classType[0] === "combination" && (
            <div>COMBINATION CLASS DESCRIPTION</div>
          )}
        </div>
      )}
    </Flex>
  );
  // // STATE
  // const [standardClass, setStandardClass] = React.useState<string | undefined>(
  //   getClassType(character.class) === "standard"
  //     ? classSplit(character.class)[0]
  //     : undefined,
  // );
  // const [classArr, setClassArr] = React.useState<string[]>(
  //   classSplit(character.class) || [],
  // );
  // const [supplementalContent, setSupplementalContent] = React.useState<boolean>(
  //   classSplit(character.class).some(
  //     (className) => !baseClasses.includes(className as ClassNames),
  //   ),
  // );
  // const [hasMagicCharacterClass, setHasMagicCharacterClass] =
  //   React.useState<boolean>(
  //     classSplit(character.class).some(
  //       (className) =>
  //         classes[className as ClassNames]?.spellBudget?.[character.level - 1],
  //     ),
  //   );
  // const [magicCharacterClass, setMagicCharacterClass] =
  //   React.useState<string>();
  // const [startingSpells, setStartingSpells] = React.useState<Spell[]>([
  //   character.spells?.filter((spell) => spell.name !== "Read Magic")[0] || [],
  // ]);
  // const [customClass, setCustomClass] = React.useState<string | undefined>(
  //   getClassType(character.class) === "custom" ? character.class[0] : undefined,
  // );
  // const [combinationClass, setCombinationClass] = React.useState<boolean>(
  //   classSplit(character.class).length === 2 ? true : false,
  // );
  // const [combinationClassOptions, setCombinationClassOptions] = React.useState<
  //   [SelectProps["options"], SelectProps["options"]] | []
  // >([]);
  // const [firstCombinationClass, setFirstCombinationClass] = React.useState<
  //   string | undefined
  // >(
  //   classSplit(character.class).length === 2
  //     ? (classSplit(character.class)[0] as ClassNames)
  //     : undefined,
  // );
  // const [secondCombinationClass, setSecondCombinationClass] = React.useState<
  //   string | undefined
  // >(
  //   classSplit(character.class).length === 2
  //     ? (classSplit(character.class)[1] as ClassNames)
  //     : undefined,
  // );
  // // VARS
  // const { getRaceClassImage } = useImages();
  // const classImage = (className: ClassNames) =>
  //   getRaceClassImage(toSlugCase(className));
  // // HANDLERS
  // const onStandardClassChange = (value: string) => {
  //   setStandardClass(value);
  //   setClassArr([value]);
  // };
  // const onSupplementalContentChange = (checked: boolean) => {
  //   setSupplementalContent(checked);
  //   setCombinationClass(false);
  //   setClassArr([]);
  //   setStandardClass(undefined);
  //   setStartingSpells([]);
  //   setCustomClass(undefined);
  // };
  // const onCustomClassChange = (value: ChangeEvent<HTMLInputElement>) => {
  //   setCustomClass(value.target.value);
  // };
  // const onCombinationClassChange = (checked: boolean) => {
  //   setCombinationClass(checked);
  //   setClassArr([]);
  //   setCustomClass(undefined);
  //   setSupplementalContent(false);
  //   setStandardClass(undefined);
  //   setStartingSpells([]);
  //   setFirstCombinationClass(undefined);
  //   setSecondCombinationClass(undefined);
  //   if (checked) {
  //     setCombinationClassOptions(
  //       getComboClasses(
  //         races[character.race as RaceNames]?.allowedCombinationClasses ?? [],
  //       ),
  //     );
  //   }
  // };
  // // FUNCTIONS
  // const getComboClasses = (
  //   comboList: ClassNames[],
  // ): [SelectProps["options"], SelectProps["options"]] => {
  //   return comboList.reduce<[SelectProps["options"], SelectProps["options"]]>(
  //     (
  //       [firstCombo, secondCombo]: [
  //         SelectProps["options"],
  //         SelectProps["options"],
  //       ],
  //       item,
  //     ) => {
  //       const option = { label: item, value: item };
  //       if (item === ClassNames.MAGICUSER) {
  //         firstCombo!.push(option);
  //       } else {
  //         secondCombo!.push(option);
  //       }
  //       return [firstCombo, secondCombo];
  //     },
  //     [[], []],
  //   );
  // };

  // // EFFECTS
  // React.useEffect(() => {
  //   setStartingSpells([]);
  //   setCustomClass(undefined);
  //   if (standardClass) {
  //     setClassArr([standardClass]);
  //   } else {
  //     setClassArr([]);
  //   }
  // }, [standardClass]);

  // const getFinalClass = () => {
  //   if (standardClass && standardClass !== "Custom") {
  //     return [standardClass];
  //   }
  //   if (combinationClass && firstCombinationClass && secondCombinationClass) {
  //     return [firstCombinationClass, secondCombinationClass];
  //   }
  //   if (classArr[0] === "Custom" && customClass) {
  //     return [customClass];
  //   }
  //   if (getClassType(character.class) === "custom") {
  //     return classSplit(character.class);
  //   }
  //   return [];
  // };

  // React.useEffect(() => {
  //   if ((combinationClass && classArr.length === 2) || !combinationClass) {
  //     setCharacter({
  //       ...character,
  //       class: getFinalClass(),
  //       spells: startingSpells,
  //       hp: { dice: "", points: 0, desc: "", max: 0 },
  //       equipment: [],
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [classArr, customClass, startingSpells]);

  // React.useEffect(() => {
  //   if (hasMagicCharacterClass) {
  //     setMagicCharacterClass(
  //       classArr.find(
  //         (className) => classes[className as ClassNames]?.spellBudget,
  //       ),
  //     );
  //   } else {
  //     setMagicCharacterClass(undefined);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [hasMagicCharacterClass]);

  // React.useEffect(() => {
  //   if (classArr.length) {
  //     setHasMagicCharacterClass(
  //       classArr.some((className) =>
  //         classes[className as ClassNames]?.spellBudget?.[
  //           character.level - 1
  //         ].some((spellBudget) => spellBudget > 0),
  //       ),
  //     );
  //   } else {
  //     setHasMagicCharacterClass(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [classArr]);

  // React.useEffect(() => {
  //   if (firstCombinationClass && secondCombinationClass) {
  //     setClassArr([firstCombinationClass, secondCombinationClass]);
  //   }
  // }, [firstCombinationClass, secondCombinationClass]);

  // return (
  //   <Flex gap={16} vertical className={className}>
  //     {/* switches for class options */}
  //     <ClassSettings
  //       character={character}
  //       supplementalContent={supplementalContent}
  //       onCombinationClassChange={onCombinationClassChange}
  //       onSupplementalContentChange={onSupplementalContentChange}
  //       combinationClass={combinationClass}
  //     />
  //     {!combinationClass ? (
  //       // standard class dropdown
  //       <Select
  //         options={
  //           supplementalContent
  //             ? getClassSelectOptions(character, false)
  //             : getClassSelectOptions(character)
  //         }
  //         value={
  //           standardClass === undefined &&
  //           getClassType(character.class) === "custom"
  //             ? "Custom"
  //             : standardClass
  //         }
  //         onChange={onStandardClassChange}
  //         placeholder="Select a class"
  //       />
  //     ) : (
  //       // two combination class dropdowns
  //       <CombinationClassSelect
  //         combinationClassOptions={combinationClassOptions}
  //         setFirstCombinationClass={setFirstCombinationClass}
  //         setSecondCombinationClass={setSecondCombinationClass}
  //         firstCombinationClass={firstCombinationClass}
  //         secondCombinationClass={secondCombinationClass}
  //       />
  //     )}
  //     {(getClassType(character.class) === "custom" ||
  //       classArr[0] === "Custom") &&
  //       !combinationClass && (
  //         <>
  //           <HomebrewWarning homebrew="class" />
  //           <Input
  //             value={customClass ?? character.class}
  //             onChange={(e) => onCustomClassChange(e)}
  //           />
  //           <Suspense fallback={<div>Loading...</div>}>
  //             <AllSpellsSelection />
  //           </Suspense>
  //         </>
  //       )}
  //     {hasMagicCharacterClass && (
  //       // Spell dropdown and spell description
  //       <SpellSelect
  //         startingSpells={startingSpells}
  //         setStartingSpells={setStartingSpells}
  //         magicCharacterClass={magicCharacterClass}
  //         character={character}
  //         classArr={classArr}
  //       />
  //     )}
  //     {!!classArr.length &&
  //       classArr[0] !== "Custom" &&
  //       classArr.map((className) => (
  //         // Description of selected classes
  //         <RaceClassDescription
  //           subject={className}
  //           image={classImage(className as ClassNames)}
  //           key={className}
  //         />
  //       ))}
  //   </Flex>
  // );
};

export default StepClass;
