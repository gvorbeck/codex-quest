import { Button, Checkbox, Modal } from "antd";
import { LevelUpModalProps, SpellItem, Spell } from "../types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import SpellData from "../../data/spells.json";
import {
  clericSpellBudget,
  magicUserSpellBudget,
} from "../../data/spellBudgets";

const roller = new DiceRoller();

const getSpellBudget = (characterClass: string) => {
  if (characterClass.includes("Magic-User")) {
    return magicUserSpellBudget;
  } else if (characterClass.includes("Cleric")) {
    return clericSpellBudget;
  }
  return [];
};

const getSpellLevel = (spell: Spell, characterClass: string) => {
  if (characterClass.includes("Magic-User")) {
    return spell.level["magic-user"];
  } else if (characterClass.includes("Cleric")) {
    return spell.level["cleric"];
  }
  return 0;
};

const SpellCheckboxGroup = ({
  characterClass,
  level,
  max,
  checkedSpells,
  setCheckedSpells,
  checkedSpellsCount,
  setCheckedSpellsCount,
}: {
  characterClass: string;
  level: number;
  max: number;
  checkedSpells: string[];
  setCheckedSpells: (checkedSpells: string[]) => void;
  checkedSpellsCount: number[];
  setCheckedSpellsCount: (checkedSpellsCount: number[]) => void;
}) => {
  if (max) {
    return (
      <Checkbox.Group
        value={checkedSpells}
        onChange={(checkedValues) => {
          const newCheckedSpells = checkedValues as string[];

          // Add only the spells from current level to checkedSpells
          const otherLevelSpells = checkedSpells.filter(
            (spellName: string) =>
              !SpellData.some(
                (spell) =>
                  spell.name === spellName &&
                  getSpellLevel(spell, characterClass) === level + 1
              )
          );
          setCheckedSpells([...otherLevelSpells, ...newCheckedSpells]);

          // Update the count for current level in checkedSpellsCount
          const newCheckedSpellsCount = [...checkedSpellsCount];
          newCheckedSpellsCount[level] = newCheckedSpells.filter((spellName) =>
            SpellData.some(
              (spell) =>
                spell.name === spellName &&
                getSpellLevel(spell, characterClass) === level + 1
            )
          ).length;
          setCheckedSpellsCount(newCheckedSpellsCount);
        }}
      >
        level: {level + 1}{" "}
        {SpellData.filter(
          (spell) => getSpellLevel(spell, characterClass) === level + 1
        ).map((spell) => (
          <Checkbox
            key={spell.name}
            value={spell.name}
            disabled={
              spell.name === "Read Magic" ||
              (!checkedSpells.includes(spell.name) &&
                checkedSpellsCount[level] >= max)
            }
          >
            {spell.name}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  }
  return null;
};

export default function LevelUpModal({
  character,
  handleCancel,
  isLevelUpModalOpen,
  hitDiceModifiers,
  setCharacter,
}: LevelUpModalProps) {
  const [checkedSpells, setCheckedSpells] = useState(
    character.spells.map((spell: SpellItem) => spell.name)
  );
  const [checkedSpellsCount, setCheckedSpellsCount] = useState<number[]>(
    new Array(magicUserSpellBudget[character.level - 1].length).fill(0)
  );

  console.log("this is here to pass github actions", clericSpellBudget);

  let newHitDice: string;

  const { uid, id } = useParams();

  // Determine how many hit dice to roll
  if (character.level + 1 >= 10) {
    newHitDice = "9" + character.hp.dice;
  } else {
    const prefix = character.level + 1;
    newHitDice = prefix.toString() + "d" + character.hp.dice.split("d")[1];
  }

  // Determine what, if any, modifier is added to the roll
  if (
    (character.class.includes("Fighter") ||
      character.class.includes("Thief")) &&
    hitDiceModifiers.double[character.level] !== null
  ) {
    newHitDice += `+${hitDiceModifiers.double[character.level]}`;
  } else if (hitDiceModifiers.single[character.level] !== null) {
    newHitDice += `+${hitDiceModifiers.single[character.level]}`;
  }

  const getSelectedSpells = (checkedSpells: string[]): Spell[] => {
    return checkedSpells
      .map((spellName) => SpellData.find((spell) => spell.name === spellName))
      .filter(Boolean) as Spell[];
  };

  const rollNewHitPoints = async (dice: string) => {
    handleCancel();
    const result = roller.roll(dice).total;

    const selectedSpells = getSelectedSpells(checkedSpells);

    setCharacter({
      ...character,
      hp: { ...character.hp, max: result, dice },
      level: character.level + 1,
      spells: selectedSpells,
    });

    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    const docRef = doc(db, "users", uid, "characters", id);
    try {
      await updateDoc(docRef, {
        "hp.max": result,
        "hp.dice": dice,
        level: character.level + 1,
        spells: selectedSpells,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const initialCheckedSpellsCount = magicUserSpellBudget[
      character.level - 1
    ].map(
      (_, index) =>
        checkedSpells.filter((spellName) =>
          SpellData.some(
            (spell) =>
              spell.name === spellName &&
              spell.level["magic-user"] === index + 1
          )
        ).length
    );

    setCheckedSpellsCount(initialCheckedSpellsCount);
  }, [character.level, checkedSpells]);

  return (
    <Modal
      title="LEVEL UP MODAL"
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      {["Magic-User", "Cleric"].map((characterClass) => {
        if (character.class.includes(characterClass)) {
          const spellBudget = getSpellBudget(characterClass);
          return spellBudget[character.level].map((max: number, index) => (
            <SpellCheckboxGroup
              key={index}
              characterClass={characterClass}
              level={index}
              max={max}
              checkedSpells={checkedSpells}
              setCheckedSpells={setCheckedSpells}
              checkedSpellsCount={checkedSpellsCount}
              setCheckedSpellsCount={setCheckedSpellsCount}
            />
          ));
        }
        return null;
      })}

      <Button type="primary" onClick={() => rollNewHitPoints(newHitDice)}>
        Roll new Hit Points ({newHitDice})
      </Button>
    </Modal>
  );
}
