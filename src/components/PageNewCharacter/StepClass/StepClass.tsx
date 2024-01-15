import { Flex } from "antd";
import React from "react";
import RaceClassSelector from "../RaceClassSelector/RaceClassSelector";
import { CharData, ClassNames, DiceTypes, RaceNames } from "@/data/definitions";
import { classes } from "@/data/classes";
import SpellOptions from "./SpellOptions/SpellOptions";
import ComboClassOptions from "./ComboClassOptions/ComboClassOptions";
import RaceClassDescription from "../RaceClassDescription/RaceClassDescription";
import spellsData from "@/data/spells.json";
import Options from "./Options/Options";
import { classSplit, getClassSelectOptions } from "@/support/classSupport";
import { useStepClass } from "./useStepClass";
import { races } from "@/data/races";

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
  const {
    classSelector,
    setClassSelector,
    customClassInput,
    setCustomClassInput,
    // firstClass,
    secondClass,
    setSecondClass,
    //   startingSpells,
    //   setStartingSpells,
    supplementalContentSwitch,
    setSupplementalContentSwitch,
    //   classSelectOptions,
    //   setClassSelectOptions,
    //   adjustHitDice,
    characterHasSpells,
  } = useStepClass(character);
  const [isMagicCharacter, setIsMagicCharacter] = React.useState<boolean>(
    characterHasSpells(character) ?? false,
  );
  const [hasClassSelections, setHasClassSelections] = React.useState<boolean>(
    !!classSplit(character.class).length,
  );
  const [characterClassSelections, setCharacterClassSelections] =
    React.useState<string[]>(classSplit(character.class) ?? []); // TODO: this should have a better initial value, based on the character's class

  React.useEffect(() => {
    if (comboClassSwitch) {
      setCustomClassInput("");
      setClassSelector("");
      setCharacterClassSelections([ClassNames.MAGICUSER]);
    } else {
      setCharacterClassSelections([]);
    }
  }, [comboClassSwitch]);
  // Whenever the comboClassSwitch is toggled,

  return (
    <div>
      <Options
        comboClass={comboClass}
        comboClassSwitch={comboClassSwitch}
        setComboClassSwitch={setComboClassSwitch}
        setSupplementalContentSwitch={setSupplementalContentSwitch}
        supplementalContentSwitch={supplementalContentSwitch}
      />
      <div>
        {!comboClassSwitch ? (
          <RaceClassSelector
            customInput={customClassInput}
            handleCustomInputChange={handleCustomClassInputChange}
            handleSelectChange={handleSelectChange}
            selectOptions={classSelectOptions}
            selector={classSelector}
            type="class"
          />
        ) : (
          <div>
            <div>first class select</div>
            <div>second class select</div>
          </div>
        )}
        {isMagicCharacter && <div>spell select/description</div>}
        {hasClassSelections && <div>class selections</div>}
      </div>
    </div>
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
