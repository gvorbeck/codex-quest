import { Modal } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import EquipmentStore from "../components/EquipmentStore/EquipmentStore";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import { AddEquipmentModalProps } from "./definitions";

export default function AddEquipmentModal({
  characterData,
  handleCancel,
  isAddEquipmentModalOpen,
  setCharacterData,
}: AddEquipmentModalProps) {
  const [prevValue, setPrevValue] = useState(characterData?.equipment);
  const { uid, id } = useParams();

  const updateEquipment = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (characterData && characterData.equipment !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          equipment: characterData.equipment,
          gold: characterData.gold,
        });
        setPrevValue(characterData.equipment);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    updateEquipment();
  }, [characterData?.equipment, characterData?.gold, characterData?.weight]);

  return (
    <Modal
      title="ADD EQUIPMENT"
      open={isAddEquipmentModalOpen}
      onCancel={handleCancel}
      footer={false}
      width={1000}
      closeIcon={<CloseIcon />}
    >
      {characterData && (
        <EquipmentStore
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      )}
    </Modal>
  );
}
