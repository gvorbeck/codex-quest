import { Modal } from "antd";
import { LevelUpModalProps } from "../types";

export default function LevelUpModal({
  character,
  handleCancel,
  isLevelUpModalOpen,
}: LevelUpModalProps) {
  return (
    <Modal
      title="LEVEL UP MODAL"
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      hi there
    </Modal>
  );
}
