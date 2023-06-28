import { Modal } from "antd";
import { AddEquipmentModalProps } from "../components/types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import EquipmentStore from "../components/EquipmentStore/EquipmentStore";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";

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
          gold: character.gold,
        });
        setPrevValue(character.equipment);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    updateEquipment();
  }, [character.equipment, character.gold, character.weight]);

  return (
    <Modal
      title="ADD EQUIPMENT MODAL"
      open={isAddEquipmentModalOpen}
      onCancel={handleCancel}
      footer={false}
      width={1000}
      closeIcon={<ModalCloseIcon />}
    >
      <EquipmentStore
        characterData={character}
        setCharacterData={setCharacter}
      />
    </Modal>
  );
}
