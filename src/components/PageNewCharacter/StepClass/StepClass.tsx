import { Flex, SelectProps } from "antd";
import React from "react";
import RaceClassSelector from "../RaceClassSelector/RaceClassSelector";
import { CharData, ClassNames, DiceTypes } from "@/data/definitions";
import { getClassSelectOptions } from "@/support/characterSupport";
import { classes } from "@/data/classes";
import SpellOptions from "./SpellOptions/SpellOptions";
import ComboClassOptions from "./ComboClassOptions/ComboClassOptions";
import RaceClassDescription from "../RaceClassDescription/RaceClassDescription";
import spellsData from "@/data/spells.json";
import Options from "./Options/Options";

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
  comboClass,
  comboClassSwitch,
  setComboClassSwitch,
}) => {
  const [customClassInput, setCustomClassInput] = React.useState<string>("");
  const [classSelector, setClassSelector] = React.useState<string>(
    character.class[0],
  );
  const [startingSpells, setStartingSpells] = React.useState<string[]>([]);
  const [secondClass, setSecondClass] = React.useState<ClassNames | undefined>(
    undefined,
  );
  const [supplementalContentSwitch, setSupplementalContentSwitch] =
    React.useState<boolean>(false);
  const [classSelectOptions, setClassSelectOptions] = React.useState<
    SelectProps["options"]
  >([]);
  const firstClass = ClassNames.MAGICUSER;

  const handleCustomClassInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomClassInput(e.target.value);
    setCharacter({ ...character, class: [e.target.value] });
  };
  const handleSelectChange = (value: string) => {
    setClassSelector(value);
  };

  React.useEffect(() => {
    setStartingSpells([]);
    if (classSelector !== "custom" && classSelector !== "") {
      setCharacter({
        ...character,
        class: [classSelector],
        spells: [],
        hp: {
          ...character.hp,
          dice: classes[classSelector as ClassNames]?.hitDice,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classSelector]);

  React.useEffect(() => {
    let newHP = "0";
    if (character.class.length > 1) {
      if (character.class.includes(ClassNames.FIGHTER)) newHP = DiceTypes.D6;
      if (character.class.includes(ClassNames.THIEF)) newHP = DiceTypes.D4;
    } else {
      newHP = classes[character.class[0] as ClassNames]?.hitDice;
    }
    setCharacter({
      ...character,
      hp: { ...character.hp, dice: newHP },
    });
    if (firstClass && !secondClass) {
      comboClassSwitch
        ? setCharacter({ ...character, class: [firstClass] })
        : setCharacter({ ...character, class: [] });
    }
    if (secondClass && !firstClass)
      setCharacter({ ...character, class: [secondClass] });
    if (secondClass && firstClass)
      setCharacter({ ...character, class: [firstClass, secondClass] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondClass]);

  React.useEffect(() => {
    const newSpells = spellsData.filter(
      (spell) =>
        startingSpells.includes(spell.name) || spell.name === "Read Magic",
    );
    setCharacter({
      ...character,
      spells: newSpells,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingSpells]);

  React.useEffect(() => {
    console.info(comboClassSwitch);
    if (!comboClassSwitch) {
      // uncommenting this code removes your class selection upon returning to this step.
      // setClassSelector("");
      // setSecondClass(undefined);
      // setCharacter({
      //   ...character,
      //   class: [],
      //   spells: [],
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comboClassSwitch]);

  React.useEffect(() => {
    const options = getClassSelectOptions(
      character,
      !supplementalContentSwitch,
    );
    setClassSelectOptions(options);
  }, [supplementalContentSwitch, character]);

  return (
    <Flex vertical gap={16} className={className}>
      <Options
        comboClass={comboClass}
        comboClassSwitch={comboClassSwitch}
        setComboClassSwitch={setComboClassSwitch}
        setSupplementalContentSwitch={setSupplementalContentSwitch}
        supplementalContentSwitch={supplementalContentSwitch}
      />
      {comboClass && comboClassSwitch ? (
        <ComboClassOptions
          character={character}
          setCharacter={setCharacter}
          firstClass={firstClass}
          secondClass={secondClass}
          setSecondClass={setSecondClass}
        />
      ) : (
        <RaceClassSelector
          customInput={customClassInput}
          handleCustomInputChange={handleCustomClassInputChange}
          handleSelectChange={handleSelectChange}
          selectOptions={classSelectOptions}
          selector={classSelector}
          type="class"
        />
      )}
      {character.class
        .filter(
          (className) =>
            !!classes[className as ClassNames]?.spellBudget?.[0][0],
        )
        .map((className) => (
          <SpellOptions
            key={className}
            character={character}
            characterClass={className}
            startingSpells={startingSpells}
            setStartingSpells={setStartingSpells}
          />
        ))}
      {!character.class.includes("Custom") &&
        !!character.class.length &&
        character.class.map(
          (className) =>
            classes[className as ClassNames] && (
              <RaceClassDescription
                key={className}
                name={className}
                description={`${classes[className as ClassNames]?.details
                  ?.description}`}
              />
            ),
        )}
    </Flex>
  );
};

export default StepClass;
