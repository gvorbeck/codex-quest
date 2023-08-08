import { useReducer } from "react";
import { Button, Checkbox, Modal, Typography } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import { ClassNames, Spell, SpellLevels } from "../components/definitions";
import { Action, LevelUpModalProps } from "./definitions";
import { spellBudgets } from "../data/spellBudgets";
import spellList from "../data/spells.json";
import { getClassType } from "../support/helpers";

const roller = new DiceRoller();

export default function LevelUpModal({
  characterData,
  handleCancel,
  isLevelUpModalOpen,
  setCharacterData,
  hitDice,
}: LevelUpModalProps) {
  const [spellCounts, dispatch] = useReducer(
    (state: number[], action: Action) => {
      switch (action.type) {
        case "increment":
          return state.map((count, index) =>
            index === action.level ? count + 1 : count
          );
        case "decrement":
          return state.map((count, index) =>
            index === action.level ? count - 1 : count
          );
        case "init":
          // When the action type is "init", return the spellCounts from the action
          return action.spellCounts;
        default:
          return state;
      }
    },
    [0, 0, 0, 0, 0, 0]
  );

  const newHitDiceValue = hitDice(
    characterData.level + 1,
    characterData.class,
    characterData.hp.dice
  );
  const spells: Spell[] = spellList;

  const spellsOfLevel = (className: string, level: number) => {
    const classType = getClassType(className);

    let filteredSpells: Spell[] = [];

    switch (classType) {
      case "standard":
        filteredSpells = spells.filter(
          (spell) =>
            spell.level[className.toLowerCase() as keyof SpellLevels] === level
        );
        break;
      case "combination":
        const classes = className.split(" ");
        filteredSpells = spells.filter((spell) =>
          classes.some(
            (cls) =>
              spell.level[cls.toLowerCase() as keyof SpellLevels] === level
          )
        );
        break;
      case "custom":
        // If the level is 1, return all spells. Otherwise, return an empty array.
        filteredSpells = level === 1 ? spells : [];
        break;
      default:
        filteredSpells = [];
    }

    return filteredSpells;
  };

  const SpellSelector = () => {
    let spellBudget: number[] = [];
    const newSpells = characterData.spells;
    const newSpellCounts = newSpells.reduce(
      (acc, spell) => {
        const spellLevel =
          getClassType(characterData.class) === "combination"
            ? spell.level[
                ClassNames.MAGICUSER.toLowerCase() as keyof SpellLevels
              ]
            : spell.level[
                characterData.class.toLowerCase() as keyof SpellLevels
              ];
        if (spellLevel !== null && !isNaN(spellLevel)) {
          acc[spellLevel - 1] += 1;
        }
        return acc;
      },
      [0, 0, 0, 0, 0, 0]
    );
    // If the character is a Magic-User, Cleric, or Druid, get the spell budget for the character's level
    if (
      (characterData.class.includes(ClassNames.MAGICUSER) ||
        characterData.class.includes(ClassNames.CLERIC) ||
        characterData.class.includes(ClassNames.DRUID)) &&
      getClassType(characterData.class) !== "custom"
    ) {
      if (getClassType(characterData.class) === "standard") {
        spellBudget =
          spellBudgets[characterData.class as keyof typeof spellBudgets][
            characterData.level
          ];
      } else {
        spellBudget = spellBudgets[ClassNames.MAGICUSER][characterData.level];
      }
      // If the character is a custom class, get the spell budget for the character's level
    } else if (getClassType(characterData.class) === "custom") {
      spellBudget = new Array(6).fill(Infinity);
    }
    console.log(spellBudget, newSpellCounts);

    const handleSpellChange =
      (level: number) => (checkedValues: CheckboxValueType[]) => {
        let newCheckedSpells: Spell[] = [];

        const classType = getClassType(characterData.class);

        if (classType === "custom" && level === 1) {
          // For custom classes, handle all spells
          newCheckedSpells = spells.filter((spell) =>
            checkedValues.includes(spell.name)
          );
        } else {
          // For standard and combination classes, filter out spells of the specific level
          const classNameToCheck =
            classType === "combination"
              ? ClassNames.MAGICUSER.toLowerCase()
              : characterData.class.toLowerCase();

          newCheckedSpells = characterData.spells.filter(
            (spell) =>
              spell.level[classNameToCheck as keyof SpellLevels] !== level
          );

          checkedValues.forEach((value) => {
            const foundSpell = spells.find((spell) => spell.name === value);
            if (foundSpell) {
              newCheckedSpells.push(foundSpell);
            }
          });
        }

        setCharacterData({ ...characterData, spells: newCheckedSpells });
      };

    const isCustomClass = getClassType(characterData.class) === "custom";

    return spellBudget.length ? (
      <>
        {spellBudget.map((max, index) => {
          // If it's a custom class and we're not on the first iteration, return null
          if (isCustomClass && index !== 0) {
            return null;
          }

          return max > 0 ? (
            <div key={index} className="mb-4">
              <Typography.Title level={5}>
                {isCustomClass
                  ? "Select your Custom Class Spells"
                  : `Select Level ${index + 1} Spells`}
              </Typography.Title>
              <Checkbox.Group
                className="grid grid-cols-1 [&>*+*]:mt-2"
                value={characterData.spells.map((spell) => spell.name)}
                onChange={handleSpellChange(index + 1)}
              >
                {spellsOfLevel(characterData.class, index + 1)
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort spells alphabetically
                  .map((spell) => (
                    <div key={spell.name}>
                      <Checkbox
                        value={spell.name}
                        disabled={
                          spell.name === "Read Magic" ||
                          (newSpellCounts[index] >= spellBudget[index] &&
                            !newSpells.some(
                              (knownSpell) => knownSpell.name === spell.name
                            ))
                        }
                      >
                        {spell.name}
                      </Checkbox>
                    </div>
                  ))}
              </Checkbox.Group>
            </div>
          ) : null;
        })}
      </>
    ) : null;
  };

  const handleLevelUp = () => {
    const result = roller.roll(newHitDiceValue).total;
    setCharacterData({
      ...characterData,
      hp: { ...characterData.hp, max: result },
      level: characterData.level + 1,
    });
    handleCancel();
  };

  return (
    <Modal
      title={`LEVEL UP TO LEVEL ${characterData.level + 1}`}
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<CloseIcon />}
    >
      <SpellSelector />
      <Button type="primary" onClick={handleLevelUp}>
        Roll new Hit Points ({newHitDiceValue})
      </Button>
    </Modal>
  );
}

// import { Button, Checkbox, Modal, Typography } from "antd";
// import {
//   SpellItem,
//   Spell,
//   ClassNames,
//   SpellLevels,
// } from "../components/definitions";
// import { DiceRoller } from "@dice-roller/rpg-dice-roller";
// import { useEffect, useState } from "react";
// import { doc, updateDoc } from "firebase/firestore";
// import { useParams } from "react-router-dom";
// import { db } from "../firebase";
// import SpellData from "../data/spells.json";
// import {
//   clericSpellBudget,
//   magicUserSpellBudget,
//   druidSpellBudget,
// } from "../data/spellBudgets";
// import { hitDiceModifiers } from "../data/hitDiceModifiers";
// import CloseIcon from "../components/CloseIcon/CloseIcon";
// import { classChoices } from "../data/classDetails";
// import { LevelUpModalProps, SpellCheckboxGroupProps } from "./definitions";
// import HomebrewWarning from "../components/HomebrewWarning/HomebrewWarning";

// const roller = new DiceRoller();

// // This function determines the spell budget for a given character class.
// // It checks if the character class is a Magic User or a Cleric and returns the corresponding spell budget.
// // If the character class is not one of the predefined classes in ClassNames, it returns an array filled with Infinity.
// const getSpellBudget = (characterClass: string) => {
//   switch (true) {
//     case characterClass.includes(ClassNames.MAGICUSER):
//       return magicUserSpellBudget;
//     case characterClass.includes(ClassNames.CLERIC):
//       return clericSpellBudget;
//     case characterClass.includes(ClassNames.DRUID):
//       return druidSpellBudget;
//     case !Object.values(ClassNames).some((className) =>
//       characterClass.includes(className)
//     ):
//       return new Array(9).fill(Infinity);
//     default:
//       return;
//   }
// };

// // This function determines the level of a spell for a given character class.
// // It checks if the character class is a Magic User or a Cleric and returns the corresponding spell level.
// // If the character class is not included in the class choices, it returns the maximum level among all spell levels.
// const getSpellLevel = (spell: Spell, characterClass: string) => {
//   switch (true) {
//     case characterClass.includes(ClassNames.MAGICUSER):
//       return spell.level[
//         ClassNames.MAGICUSER.toLowerCase() as keyof SpellLevels
//       ];
//     case characterClass.includes(ClassNames.CLERIC):
//       return spell.level[ClassNames.CLERIC.toLowerCase() as keyof SpellLevels];
//     case characterClass.includes(ClassNames.DRUID):
//       return spell.level[ClassNames.DRUID.toLowerCase() as keyof SpellLevels];
//     case !classChoices.includes(
//       ClassNames[characterClass as keyof typeof ClassNames]
//     ):
//       return Math.max(...Object.values(spell.level));
//     default:
//       return; // or return a default value if needed
//   }
// };

// // This component renders a group of checkboxes for spells of a specific level for a character class, with the ability to limit the maximum number of checked spells.
// const SpellCheckboxGroup = ({
//   characterClass,
//   level,
//   max,
//   checkedSpells,
//   setCheckedSpells,
//   checkedSpellsCount,
//   setCheckedSpellsCount,
// }: SpellCheckboxGroupProps) => {
//   if (max) {
//     return (
//       <>
//         <Typography.Title level={4}>Level {level + 1} Spells</Typography.Title>
//         <Checkbox.Group
//           value={checkedSpells}
//           className="mb-4"
//           onChange={(checkedValues) => {
//             const newCheckedSpells = checkedValues as string[];

//             // Add only the spells from current level to checkedSpells
//             const otherLevelSpells = checkedSpells.filter(
//               (spellName: string) =>
//                 !SpellData.some(
//                   (spell) =>
//                     spell.name === spellName &&
//                     getSpellLevel(spell, characterClass) === level + 1
//                 )
//             );
//             setCheckedSpells([...otherLevelSpells, ...newCheckedSpells]);

//             // Update the count for current level in checkedSpellsCount
//             const newCheckedSpellsCount = [...checkedSpellsCount];
//             newCheckedSpellsCount[level] = newCheckedSpells.filter(
//               (spellName) =>
//                 SpellData.some(
//                   (spell) =>
//                     spell.name === spellName &&
//                     getSpellLevel(spell, characterClass) === level + 1
//                 )
//             ).length;
//             setCheckedSpellsCount(newCheckedSpellsCount);
//           }}
//         >
//           {SpellData.filter(
//             (spell) => getSpellLevel(spell, characterClass) === level + 1
//           ).map((spell) => (
//             <Checkbox
//               key={spell.name}
//               value={spell.name}
//               className="flex-[1_1_40%] py-1"
//               disabled={
//                 spell.name === "Read Magic" ||
//                 (!checkedSpells.includes(spell.name) &&
//                   checkedSpellsCount[level] >= max)
//               }
//             >
//               {spell.name}
//             </Checkbox>
//           ))}
//         </Checkbox.Group>
//       </>
//     );
//   }
//   return null;
// };

// export default function LevelUpModal({
//   characterData,
//   handleCancel,
//   isLevelUpModalOpen,
//   setCharacterData,
// }: LevelUpModalProps) {
//   const [checkedSpells, setCheckedSpells] = useState(
//     characterData.spells.map((spell: SpellItem) => spell.name)
//   );
//   const [checkedSpellsCount, setCheckedSpellsCount] = useState<number[]>(
//     new Array(magicUserSpellBudget[characterData.level - 1].length).fill(0)
//   );

//   let newHitDice: string;

//   const { uid, id } = useParams();

//   // Determine how many hit dice to roll
//   if (characterData.level + 1 >= 10) {
//     newHitDice = characterData.hp.dice.split("+")[0];
//   } else {
//     const prefix = characterData.level + 1;
//     newHitDice = prefix.toString() + "d" + characterData.hp.dice.split("d")[1];
//   }

//   // Determine what, if any, modifier is added to the roll
//   if (
//     (characterData.class.includes(ClassNames.FIGHTER) ||
//       characterData.class.includes(ClassNames.ASSASSIN) ||
//       characterData.class.includes(ClassNames.THIEF)) &&
//     hitDiceModifiers.double[characterData.level] !== null
//   ) {
//     newHitDice += `+${hitDiceModifiers.double[characterData.level]}`;
//   } else if (hitDiceModifiers.single[characterData.level] !== null) {
//     newHitDice += `+${hitDiceModifiers.single[characterData.level]}`;
//   }

//   const getSelectedSpells = (checkedSpells: string[]): Spell[] => {
//     return checkedSpells
//       .map((spellName) => SpellData.find((spell) => spell.name === spellName))
//       .filter(Boolean) as Spell[];
//   };

//   const rollNewHitPoints = async (dice: string) => {
//     handleCancel();
//     const result = roller.roll(dice).total;

//     const selectedSpells = getSelectedSpells(checkedSpells);

//     setCharacterData({
//       ...characterData,
//       hp: { ...characterData.hp, max: result, dice },
//       level: characterData.level + 1,
//       spells: selectedSpells,
//     });

//     if (!uid || !id) {
//       console.error("User ID or Character ID is undefined");
//       return;
//     }

//     const docRef = doc(db, "users", uid, "characters", id);
//     try {
//       await updateDoc(docRef, {
//         "hp.max": result,
//         "hp.dice": dice,
//         level: characterData.level + 1,
//         spells: selectedSpells,
//       });
//     } catch (error) {
//       console.error("Error updating document: ", error);
//     }
//   };

//   useEffect(() => {
//     const initialCheckedSpellsCount = magicUserSpellBudget[
//       characterData.level - 1
//     ].map(
//       (_, index) =>
//         checkedSpells.filter((spellName) =>
//           SpellData.some(
//             (spell) =>
//               spell.name === spellName &&
//               spell.level[
//                 ClassNames.MAGICUSER.toLowerCase() as keyof SpellLevels
//               ] ===
//                 index + 1
//           )
//         ).length
//     );

//     setCheckedSpellsCount(initialCheckedSpellsCount);
//   }, [characterData.level, checkedSpells]);

//   return (
//     <Modal
//       title="LEVEL UP MODAL"
//       open={isLevelUpModalOpen}
//       onCancel={handleCancel}
//       footer={false}
//       closeIcon={<CloseIcon />}
//     >
//       {classChoices.map((characterClass) => {
//         if (characterData.class.includes(characterClass)) {
//           const spellBudget = getSpellBudget(characterClass);
//           if (spellBudget && spellBudget[characterData.level]) {
//             return spellBudget[characterData.level].map(
//               (max: number, index: number) => (
//                 <SpellCheckboxGroup
//                   key={index}
//                   characterClass={characterClass}
//                   level={index}
//                   max={max}
//                   checkedSpells={checkedSpells}
//                   setCheckedSpells={setCheckedSpells}
//                   checkedSpellsCount={checkedSpellsCount}
//                   setCheckedSpellsCount={setCheckedSpellsCount}
//                 />
//               )
//             );
//           }
//         }
//         return null;
//       })}
//       {!classChoices.includes(
//         ClassNames[characterData.class.toUpperCase() as keyof typeof ClassNames]
//       ) && <HomebrewWarning homebrew="Race or Class" />}
//       {!classChoices.some((choice) => characterData.class.includes(choice)) && // For classes that are not in classChoices
//         new Array(6)
//           .fill(0)
//           .map((_, index) => (
//             <SpellCheckboxGroup
//               key={index}
//               characterClass={characterData.class}
//               level={index}
//               max={Infinity}
//               checkedSpells={checkedSpells}
//               setCheckedSpells={setCheckedSpells}
//               checkedSpellsCount={checkedSpellsCount}
//               setCheckedSpellsCount={setCheckedSpellsCount}
//             />
//           ))}

//       <Button type="primary" onClick={() => rollNewHitPoints(newHitDice)}>
//         Roll new Hit Points ({newHitDice})
//       </Button>
//     </Modal>
//   );
// }
