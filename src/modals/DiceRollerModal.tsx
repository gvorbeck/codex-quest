import { Modal } from "antd";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { DiceRollerModalProps } from "./definitions";

export default function DiceRollerModal({
  isDiceRollerModalOpen,
  handleCancel,
}: DiceRollerModalProps) {
  return (
    <>
      <Modal
        title="Virtual Dice"
        open={isDiceRollerModalOpen}
        onCancel={handleCancel}
        footer={false}
        closeIcon={<ModalCloseIcon />}
      />
    </>
  );
}
