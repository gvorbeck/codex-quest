import { Button, Checkbox, Modal, Typography } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import { ClassNames, Spell, SpellLevels } from "../components/definitions";
import { LevelUpModalProps } from "./definitions";
import { spellBudgets } from "../data/oldoldold/spellBudgets";
import spellList from "../data/spells.json";
import { getClassType } from "../support/helpers";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { marked } from "marked";
import DescriptionBubble from "../components/CreateCharacter/DescriptionBubble/DescriptionBubble";

const roller = new DiceRoller();

export default function LevelUpModal({
  characterData,
  handleCancel,
  isLevelUpModalOpen,
  setCharacterData,
  hitDice,
}: LevelUpModalProps) {
  const { uid, id } = useParams();
  const [spellDescription, setSpellDescription] = useState("");
  const [spellName, setSpellName] = useState("");

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

  const shouldDisableCheckbox = (
    spell: string,
    newSpellCounts: number[],
    spellBudget: number[],
    newSpells: Spell[],
    index: number
  ) => {
    return (
      spell === "Read Magic" ||
      (newSpellCounts[index] >= spellBudget[index] &&
        !newSpells.some((knownSpell) => knownSpell.name === spell))
    );
  };

  const showSpellDescription = (text: string, title?: string) => {
    title && setSpellName(title);
    setSpellDescription(text);
  };

  const SpellSelector = ({ className }: { className: string }) => {
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
    // If the character is a Magic-User, Cleric, Illusionist, or Druid, get the spell budget for the character's level
    if (
      (characterData.class.includes(ClassNames.MAGICUSER) ||
        characterData.class.includes(ClassNames.CLERIC) ||
        characterData.class.includes(ClassNames.ILLUSIONIST) ||
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

    return characterData.level < 20 && spellBudget?.length ? (
      <div className={className}>
        {spellBudget.map((max, index) => {
          if ((isCustomClass && index !== 0) || max === 0) return null;

          return (
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
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((spell) => {
                    const description = marked(spell.description);
                    return (
                      <div key={spell.name}>
                        <Checkbox
                          value={spell.name}
                          disabled={shouldDisableCheckbox(
                            spell.name,
                            newSpellCounts,
                            spellBudget,
                            newSpells,
                            index
                          )}
                        >
                          {spell.name}
                          <Button
                            type="ghost"
                            shape="circle"
                            size="small"
                            icon={<InfoCircleOutlined />}
                            onClick={() =>
                              showSpellDescription(description, spell.name)
                            }
                            aria-label={`${spell.name} description`}
                            title={`${spell.name} description`}
                          />
                        </Checkbox>
                      </div>
                    );
                  })}
              </Checkbox.Group>
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const handleLevelUp = async () => {
    const result = roller.roll(newHitDiceValue).total;
    const newCharacterData = {
      ...characterData,
      hp: { ...characterData.hp, max: result, dice: newHitDiceValue },
      level: characterData.level + 1,
    };

    // Update the character in the component state
    setCharacterData(newCharacterData);

    // Update the character in Firebase
    try {
      if (!uid || !id) {
        console.error("User ID or Character ID is undefined");
        return;
      }

      const docRef = doc(db, "users", uid, "characters", id);
      await updateDoc(docRef, {
        "hp.max": newCharacterData.hp.max,
        "hp.dice": newCharacterData.hp.dice,
        level: newCharacterData.level,
        spells: newCharacterData.spells,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    handleCancel();
  };

  return (
    <Modal
      title={`LEVEL UP TO LEVEL ${characterData.level + 1}`}
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<CloseIcon />}
      width={800}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_auto] items-start md:relative">
        <SpellSelector className="col-start-1" />
        {spellDescription !== "" && (
          <DescriptionBubble
            title={spellName ? ` ${spellName}` : ""}
            description={spellDescription}
            className="md:col-start-2 md:row-span-2 md:sticky md:top-4 self-start"
          />
        )}
      </div>
      <Button type="primary" onClick={handleLevelUp}>
        Roll new Hit Points ({newHitDiceValue})
      </Button>
    </Modal>
  );
}
