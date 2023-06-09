import { Button, Modal } from "antd";
import { LevelUpModalProps } from "../types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";

const roller = new DiceRoller();

export default function LevelUpModal({
  character,
  handleCancel,
  isLevelUpModalOpen,
  hitDiceModifiers,
  setCharacter,
}: LevelUpModalProps) {
  const [buttonClicked, setButtonClicked] = useState(false);

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
  )
    newHitDice += `+${hitDiceModifiers.double[character.level]}`;
  else if (hitDiceModifiers.single[character.level] !== null)
    newHitDice += `+${hitDiceModifiers.single[character.level]}`;

  const rollNewHitPoints = async (dice: string) => {
    const result = roller.roll(dice).total;
    setCharacter({
      ...character,
      hp: { ...character.hp, max: result, dice },
      level: character.level + 1,
    });
    setButtonClicked(true);

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
      });
      console.log(
        `${character.name}'s level, max HP, and HP dice have been updated.`
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <Modal
      title="LEVEL UP MODAL"
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      {character.class.includes("Magic-User") ? (
        <div>MAGIC-USER</div>
      ) : character.class.includes("Cleric") ? (
        <div>CLERIC</div>
      ) : (
        <div>THIEF OR FIGHTER. Your hit dice are now {``}</div>
      )}
      {!buttonClicked && (
        <Button type="primary" onClick={() => rollNewHitPoints(newHitDice)}>
          Roll new Hit Points ({newHitDice})
        </Button>
      )}
    </Modal>
  );
}
