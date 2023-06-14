import { Modal } from "antd";
import { AddEquipmentModalProps } from "../types";
import CharEquipmentStep from "../CreateCharacterModal/CharEquipmentStep";
import equipmentItems from "../../data/equipment-items.json";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AddEquipmentModal({
  character,
  handleCancel,
  isAddEquipmentModalOpen,
  setCharacter,
}: AddEquipmentModalProps) {
  const [prevValue, setPrevValue] = useState(character.equipment);
  const { uid, id } = useParams();

  const updateEquipment = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (character.equipment !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          equipment: character.equipment,
        });
        setPrevValue(character.equipment);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    updateEquipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.equipment]);

  return (
    <Modal
      title="ADD EQUIPMENT MODAL"
      open={isAddEquipmentModalOpen}
      onCancel={handleCancel}
      footer={false}
      width={1000}
    >
      <CharEquipmentStep
        characterData={character}
        equipmentItems={equipmentItems}
        setCharacterData={setCharacter}
      />
    </Modal>
  );
}
