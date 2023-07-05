import { Button, Input, Modal, Space, Typography } from "antd";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { DiceRollerModalProps } from "./definitions";
import { useState } from "react";

export default function DiceRollerModal({
  isDiceRollerModalOpen,
  handleCancel,
}: DiceRollerModalProps) {
  const [diceFormula, setDiceFormula] = useState([]);

  // prevent the context menu from appearing on right click
  const handleContextMenu = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  const DiceButton = ({ die }: { die: string }) => {
    const [dieCount, setDieCount] = useState(0);
    return (
      <Button
        onAuxClick={() => {
          setDieCount(0);
        }}
        onClick={() => setDieCount(dieCount + 1)}
        onContextMenu={handleContextMenu}
        onMouseDown={(e) => {
          console.log(
            "function that creates the dice formula shown in the input"
          );
        }}
        type="primary"
      >{`${dieCount > 0 ? dieCount : ""}${die}`}</Button>
    );
  };
  return (
    <>
      <Modal
        title="Virtual Dice"
        open={isDiceRollerModalOpen}
        onCancel={handleCancel}
        footer={false}
        closeIcon={<ModalCloseIcon />}
        className="text-shipGray"
      >
        <Space.Compact className="w-full">
          <Input
            placeholder="Click the buttons below or type here (ex: 1d6)"
            value={diceFormula.join("+")}
          />
          <Button type="primary">Roll</Button>
        </Space.Compact>
        <div className="flex justify-between my-4">
          <DiceButton die="d4" />
          <DiceButton die="d6" />
          <DiceButton die="d8" />
          <DiceButton die="d10" />
          <DiceButton die="d12" />
          <DiceButton die="d20" />
        </div>
        <Typography.Paragraph>
          Instructions for clicking and rolling
        </Typography.Paragraph>
      </Modal>
    </>
  );
}
