import { Modal } from "antd";
import { AddEquipmentModalProps } from "../types";

export default function AddEquipmentModal({
  character,
  handleCancel,
  isAddEquipmentModalOpen,
}: AddEquipmentModalProps) {
  return (
    <Modal
      title="ADD EQUIPMENT MODAL"
      open={isAddEquipmentModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      hi there
    </Modal>
  );
}
