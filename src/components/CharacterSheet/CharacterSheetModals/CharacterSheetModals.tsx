import AddCustomEquipmentModal from "../../../modals/AddCustomEquipmentModal";
import AddEquipmentModal from "../../../modals/AddEquipmentModal";
import CheatSheetModal from "../../../modals/CheatSheetModal";
import DiceRollerModal from "../../../modals/DiceRollerModal";
import LevelUpModal from "../../../modals/LevelUpModal";
import { getAttackBonus, getHitDice } from "../../../support/helpers";
import AttackModal from "../../AttackModal/AttackModal";
import {
  CharacterData,
  SetCharacterData,
  EquipmentItem,
} from "../../../data/definitions";

type CharacterSheetModalsProps = {
  characterData: CharacterData;
  handleCancel: () => void;
  isAddCustomEquipmentModalOpen: boolean;
  isAddEquipmentModalOpen: boolean;
  isAttackModalOpen: boolean;
  isCheatSheetModalOpen: boolean;
  isDiceRollerModalOpen: boolean;
  isLevelUpModalOpen: boolean;
  setCharacterData: SetCharacterData;
  weapon: EquipmentItem | undefined;
};

export default function CharacterSheetModals({
  characterData,
  handleCancel,
  isAddCustomEquipmentModalOpen,
  isAddEquipmentModalOpen,
  isAttackModalOpen,
  isCheatSheetModalOpen,
  isDiceRollerModalOpen,
  isLevelUpModalOpen,
  setCharacterData,
  weapon,
}: CharacterSheetModalsProps) {
  return (
    <>
      <LevelUpModal
        isLevelUpModalOpen={isLevelUpModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        hitDice={getHitDice}
        setCharacterData={setCharacterData}
      />
      <DiceRollerModal
        handleCancel={handleCancel}
        isDiceRollerModalOpen={isDiceRollerModalOpen}
      />
      <AddEquipmentModal
        isAddEquipmentModalOpen={isAddEquipmentModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        setCharacterData={setCharacterData}
      />
      <AddCustomEquipmentModal
        isAddCustomEquipmentModalOpen={isAddCustomEquipmentModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        setCharacterData={setCharacterData}
      />
      <AttackModal
        isAttackModalOpen={isAttackModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        attackBonus={getAttackBonus(characterData)}
        weapon={weapon}
        setCharacterData={setCharacterData}
      />
      <CheatSheetModal
        handleCancel={handleCancel}
        isCheatSheetModalOpen={isCheatSheetModalOpen}
      />
    </>
  );
}
