import { Button, Input, Modal, Space, Typography, notification } from "antd";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { DiceRollerModalProps } from "./definitions";
import { useState, useRef } from "react";
import { InputRef } from "antd/lib/input";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

export default function DiceRollerModal({
  isDiceRollerModalOpen,
  handleCancel,
}: DiceRollerModalProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  const handleRollClick = () => {
    if (inputRef.current && inputRef.current.input) {
      const result = roller.roll(inputRef.current.input.value).output;
      openNotification(result);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const openNotification = (result: string) => {
    notification.open({
      message: "Virtual Dice",
      description: result,
      duration: 0,
      className: "!bg-seaBuckthorn",
    });
  };

  return (
    <Modal
      title="Virtual Dice"
      open={isDiceRollerModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<ModalCloseIcon />}
      className="text-shipGray"
    >
      <Space.Compact className="w-full my-4">
        <Input
          ref={inputRef}
          placeholder="1d6"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button type="primary" onClick={handleRollClick}>
          Roll
        </Button>
      </Space.Compact>
      <Typography.Paragraph type="secondary">
        Click to add a die to the formula. Right click to remove a die.
        Optionally, you can type a formula in the input box.
      </Typography.Paragraph>
    </Modal>
  );
}
