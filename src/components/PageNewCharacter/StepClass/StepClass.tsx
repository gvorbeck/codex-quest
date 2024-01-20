import {
  Card,
  Flex,
  Input,
  Select,
  SelectProps,
  Switch,
  Typography,
} from "antd";
import React, { ChangeEvent } from "react";
import {
  baseClasses,
  classSplit,
  getClassSelectOptions,
  getClassType,
} from "@/support/classSupport";
import { CharData, ClassNames, RaceNames, Spell } from "@/data/definitions";
import { classes } from "@/data/classes";
import { useMarkdown } from "@/hooks/useMarkdown";
import { getSpellFromName, getSpellsAtLevel } from "@/support/spellSupport";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useImages } from "@/hooks/useImages";
import { toSlugCase } from "@/support/stringSupport";
import WRaceClassDescription from "./WRaceClassDescription/WRaceClassDescription";
import { races } from "@/data/races";
import WSpellCard from "./WSpellCard/WSpellCard";

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
  const { isMobile } = useDeviceType();
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
  const classDescription = useMarkdown(
    `Characters with the **${magicCharacterClass}** class start with **Read Magic** and one other spell:`,
  );
  const levelOneSpells = getSpellsAtLevel(classArr, character.level);
  const spellSelectOptions: SelectProps["options"] = levelOneSpells
    .map((spell: Spell) => ({ value: spell.name, label: spell.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
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
  const onStartingSpellChange = (value: string) => {
    const readMagicSpell = getSpellFromName("Read Magic");
    const selectedSpell = getSpellFromName(value);
    const spells = [readMagicSpell, selectedSpell].filter(Boolean) as Spell[];
    setStartingSpells(spells);
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
  const onFirstCombinationClassSelectChange = (value: string) =>
    setFirstCombinationClass(value);
  const onSecondCombinationClassSelectChange = (value: string) =>
    setSecondCombinationClass(value);
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
    console.log("glomp", classArr[0] === "Custom", standardClass);
    if (standardClass && standardClass !== "Custom") {
      return [standardClass];
    }
    if (combinationClass && firstCombinationClass && secondCombinationClass) {
      return [firstCombinationClass, secondCombinationClass];
    }
    if (classArr[0] === "Custom" && customClass) {
      console.log("blooo");
      return [customClass];
    }
    return [];
  };

  React.useEffect(() => {
    if ((combinationClass && classArr.length === 2) || !combinationClass) {
      console.log(getFinalClass());
      setCharacter({
        ...character,
        class: getFinalClass(),
        spells: startingSpells,
      });
    }
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
  }, [classArr]);

  React.useEffect(() => {
    if (firstCombinationClass && secondCombinationClass) {
      setClassArr([firstCombinationClass, secondCombinationClass]);
    }
  }, [firstCombinationClass, secondCombinationClass]);

  return (
    <Flex gap={16} vertical className={className}>
      <div>classArr: {...classArr}</div> {/* TODO: delete */}
      <div>magicCharacter: {hasMagicCharacterClass ? "true" : "false"}</div>
      <div>
        spells:{" "}
        {startingSpells
          ? startingSpells.map((spell) => spell.name).join(", ")
          : ""}
      </div>
      {/* TODO: delete above */}
      <Flex gap={16}>
        <Flex gap={8}>
          <Typography.Text>Enable Supplemental Content</Typography.Text>
          <Switch
            checked={supplementalContent}
            onChange={onSupplementalContentChange}
          />
        </Flex>
        {races[character.race as RaceNames]?.allowedCombinationClasses && (
          <Flex gap={8}>
            <Typography.Text>Use Combination Class</Typography.Text>
            <Switch
              checked={combinationClass}
              onChange={onCombinationClassChange}
            />
          </Flex>
        )}
      </Flex>
      {!combinationClass ? (
        <Select
          options={
            supplementalContent
              ? getClassSelectOptions(character, false)
              : getClassSelectOptions(character)
          }
          value={standardClass}
          onChange={onStandardClassChange}
          placeholder="Select a class"
        />
      ) : (
        <Flex gap={16} vertical>
          <Select
            placeholder="Choose the first combination class"
            options={combinationClassOptions[0]}
            value={firstCombinationClass}
            onChange={onFirstCombinationClassSelectChange}
          />
          <Select
            placeholder="Choose the second combination class"
            options={combinationClassOptions[1]}
            value={secondCombinationClass}
            onChange={onSecondCombinationClassSelectChange}
          />
        </Flex>
      )}
      {classArr[0] === "Custom" && (
        <Input value={customClass} onChange={(e) => onCustomClassChange(e)} />
      )}
      {hasMagicCharacterClass && (
        <Card
          title={
            <span className="font-enchant text-3xl tracking-wide">
              Choose a spell
            </span>
          }
        >
          <Flex vertical gap={16}>
            <Typography.Text className="[&_p]:m-0">
              <div dangerouslySetInnerHTML={{ __html: classDescription }} />
            </Typography.Text>
            <Select
              options={spellSelectOptions}
              value={startingSpells?.[0]?.name}
              onChange={onStartingSpellChange}
            />
            {!!startingSpells?.length && (
              <WSpellCard startingSpells={startingSpells} />
            )}
          </Flex>
        </Card>
      )}
      {!!classArr.length &&
        classArr[0] !== "Custom" &&
        classArr.map((className) => (
          <WRaceClassDescription
            subject={className === "Custom" ? "doog" : className}
            image={classImage(className as ClassNames)}
            key={className}
          />
        ))}
    </Flex>
  );
};

export default StepClass;
