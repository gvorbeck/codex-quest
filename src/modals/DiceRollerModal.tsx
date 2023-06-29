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
      >
        input for typing in dice roll, it also auto fills when clicking die
        buttons
        <br />
        have individual die buttons. clicking adds another of that die to the
        input
        <br />
        right clicking clears that die from the input
      </Modal>
    </>
  );
}
