import { Modal } from "antd";
import { AddEquipmentModalProps } from "../types";
import CharEquipmentStep from "../CreateCharacterModal/CharEquipmentStep";
import equipmentItems from "../../data/equipment-items.json";

export default function AddEquipmentModal({
  character,
  handleCancel,
  isAddEquipmentModalOpen,
  setCharacter,
}: AddEquipmentModalProps) {
  return (
    <Modal
      title="ADD EQUIPMENT MODAL"
      open={isAddEquipmentModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      <CharEquipmentStep
        characterData={character}
        equipmentItems={equipmentItems}
        setCharacterData={setCharacter}
      />
    </Modal>
  );
}
