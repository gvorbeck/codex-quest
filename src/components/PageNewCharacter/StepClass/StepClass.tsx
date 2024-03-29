import { Flex, Input, Select, SelectProps } from "antd";
import React, { ChangeEvent, Suspense } from "react";
import {
  baseClasses,
  classSplit,
  getClassSelectOptions,
  getClassType,
} from "@/support/classSupport";
import { CharData, ClassNames, RaceNames, Spell } from "@/data/definitions";
import { classes } from "@/data/classes";
import { useImages } from "@/hooks/useImages";
import { toSlugCase } from "@/support/stringSupport";
import RaceClassDescription from "./RaceClassDescription/RaceClassDescription";
import { races } from "@/data/races";
import SpellSelect from "./SpellSelect/SpellSelect";
import CombinationClassSelect from "./CombinationClassSelect/CombinationClassSelect";
import ClassSettings from "./ClassSettings/ClassSettings";
import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";

// Lazy loading this because it's a big component and it's not needed unless the user selects a custom class.
const AllSpellsSelection = React.lazy(
  () => import("./AllSpellsSelection/AllSpellsSelection"),
);

interface StepClassProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const StepClass: React.FC<
  StepClassProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  // STATE
  const [standardClass, setStandardClass] = React.useState<string | undefined>(
    getClassType(character.class) === "standard"
      ? classSplit(character.class)[0]
      : undefined,
  );
  const [classArr, setClassArr] = React.useState<string[]>(
    classSplit(character.class) || [],
  );
  const [supplementalContent, setSupplementalContent] = React.useState<boolean>(
    classSplit(character.class).some(
      (className) => !baseClasses.includes(className as ClassNames),
    ),
  );
  const [hasMagicCharacterClass, setHasMagicCharacterClass] =
    React.useState<boolean>(
      classSplit(character.class).some(
        (className) =>
          classes[className as ClassNames]?.spellBudget?.[character.level - 1],
      ),
    );
  const [magicCharacterClass, setMagicCharacterClass] =
    React.useState<string>();
  const [startingSpells, setStartingSpells] = React.useState<Spell[]>([
    character.spells?.filter((spell) => spell.name !== "Read Magic")[0] || [],
  ]);
  const [customClass, setCustomClass] = React.useState<string | undefined>(
    getClassType(character.class) === "custom" ? character.class[0] : undefined,
  );
  const [combinationClass, setCombinationClass] = React.useState<boolean>(
    classSplit(character.class).length === 2 ? true : false,
  );
  const [combinationClassOptions, setCombinationClassOptions] = React.useState<
    [SelectProps["options"], SelectProps["options"]] | []
  >([]);
  const [firstCombinationClass, setFirstCombinationClass] = React.useState<
    string | undefined
  >(
    classSplit(character.class).length === 2
      ? (classSplit(character.class)[0] as ClassNames)
      : undefined,
  );
  const [secondCombinationClass, setSecondCombinationClass] = React.useState<
    string | undefined
  >(
    classSplit(character.class).length === 2
      ? (classSplit(character.class)[1] as ClassNames)
      : undefined,
  );
  // VARS
  const { getRaceClassImage } = useImages();
  const classImage = (className: ClassNames) =>
    getRaceClassImage(toSlugCase(className));
  // HANDLERS
  const onStandardClassChange = (value: string) => {
    setStandardClass(value);
    setClassArr([value]);
  };
  const onSupplementalContentChange = (checked: boolean) => {
    setSupplementalContent(checked);
    setCombinationClass(false);
    setClassArr([]);
    setStandardClass(undefined);
    setStartingSpells([]);
    setCustomClass(undefined);
  };
  const onCustomClassChange = (value: ChangeEvent<HTMLInputElement>) => {
    setCustomClass(value.target.value);
  };
  const onCombinationClassChange = (checked: boolean) => {
    setCombinationClass(checked);
    setClassArr([]);
    setCustomClass(undefined);
    setSupplementalContent(false);
    setStandardClass(undefined);
    setStartingSpells([]);
    setFirstCombinationClass(undefined);
    setSecondCombinationClass(undefined);
    if (checked) {
      setCombinationClassOptions(
        getComboClasses(
          races[character.race as RaceNames]?.allowedCombinationClasses ?? [],
        ),
      );
    }
  };
  // FUNCTIONS
  const getComboClasses = (
    comboList: ClassNames[],
  ): [SelectProps["options"], SelectProps["options"]] => {
    return comboList.reduce<[SelectProps["options"], SelectProps["options"]]>(
      (
        [firstCombo, secondCombo]: [
          SelectProps["options"],
          SelectProps["options"],
        ],
        item,
      ) => {
        const option = { label: item, value: item };
        if (item === ClassNames.MAGICUSER) {
          firstCombo!.push(option);
        } else {
          secondCombo!.push(option);
        }
        return [firstCombo, secondCombo];
      },
      [[], []],
    );
  };

  // EFFECTS
  React.useEffect(() => {
    setStartingSpells([]);
    setCustomClass(undefined);
    if (standardClass) {
      setClassArr([standardClass]);
    } else {
      setClassArr([]);
    }
  }, [standardClass]);

  const getFinalClass = () => {
    if (standardClass && standardClass !== "Custom") {
      return [standardClass];
    }
    if (combinationClass && firstCombinationClass && secondCombinationClass) {
      return [firstCombinationClass, secondCombinationClass];
    }
    if (classArr[0] === "Custom" && customClass) {
      return [customClass];
    }
    if (getClassType(character.class) === "custom") {
      return classSplit(character.class);
    }
    return [];
  };

  React.useEffect(() => {
    if ((combinationClass && classArr.length === 2) || !combinationClass) {
      setCharacter({
        ...character,
        class: getFinalClass(),
        spells: startingSpells,
        hp: { dice: "", points: 0, desc: "", max: 0 },
        equipment: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classArr, customClass, startingSpells]);

  React.useEffect(() => {
    if (hasMagicCharacterClass) {
      setMagicCharacterClass(
        classArr.find(
          (className) => classes[className as ClassNames]?.spellBudget,
        ),
      );
    } else {
      setMagicCharacterClass(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMagicCharacterClass]);

  React.useEffect(() => {
    if (classArr.length) {
      setHasMagicCharacterClass(
        classArr.some((className) =>
          classes[className as ClassNames]?.spellBudget?.[
            character.level - 1
          ].some((spellBudget) => spellBudget > 0),
        ),
      );
    } else {
      setHasMagicCharacterClass(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classArr]);

  React.useEffect(() => {
    if (firstCombinationClass && secondCombinationClass) {
      setClassArr([firstCombinationClass, secondCombinationClass]);
    }
  }, [firstCombinationClass, secondCombinationClass]);

  return (
    <Flex gap={16} vertical className={className}>
      {/* switches for class options */}
      <ClassSettings
        character={character}
        supplementalContent={supplementalContent}
        onCombinationClassChange={onCombinationClassChange}
        onSupplementalContentChange={onSupplementalContentChange}
        combinationClass={combinationClass}
      />
      {!combinationClass ? (
        // standard class dropdown
        <Select
          options={
            supplementalContent
              ? getClassSelectOptions(character, false)
              : getClassSelectOptions(character)
          }
          value={
            standardClass === undefined &&
            getClassType(character.class) === "custom"
              ? "Custom"
              : standardClass
          }
          onChange={onStandardClassChange}
          placeholder="Select a class"
        />
      ) : (
        // two combination class dropdowns
        <CombinationClassSelect
          combinationClassOptions={combinationClassOptions}
          setFirstCombinationClass={setFirstCombinationClass}
          setSecondCombinationClass={setSecondCombinationClass}
          firstCombinationClass={firstCombinationClass}
          secondCombinationClass={secondCombinationClass}
        />
      )}
      {(getClassType(character.class) === "custom" ||
        classArr[0] === "Custom") &&
        !combinationClass && (
          <>
            <HomebrewWarning homebrew="class" />
            <Input
              value={customClass ?? character.class}
              onChange={(e) => onCustomClassChange(e)}
            />
            <Suspense fallback={<div>Loading...</div>}>
              <AllSpellsSelection />
            </Suspense>
          </>
        )}
      {hasMagicCharacterClass && (
        // Spell dropdown and spell description
        <SpellSelect
          startingSpells={startingSpells}
          setStartingSpells={setStartingSpells}
          magicCharacterClass={magicCharacterClass}
          character={character}
          classArr={classArr}
        />
      )}
      {!!classArr.length &&
        classArr[0] !== "Custom" &&
        classArr.map((className) => (
          // Description of selected classes
          <RaceClassDescription
            subject={className}
            image={classImage(className as ClassNames)}
            key={className}
          />
        ))}
    </Flex>
  );
};

export default StepClass;
