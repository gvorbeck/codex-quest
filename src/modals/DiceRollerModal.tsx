import { Button, Input, Modal, Space, Typography, notification } from "antd";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { DiceRollerModalProps } from "./definitions";
import { useState } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

export default function DiceRollerModal({
  isDiceRollerModalOpen,
  handleCancel,
}: DiceRollerModalProps) {
  // State for storing the current value of the dice notation input.
  const [inputValue, setInputValue] = useState("");

  // Create a new DiceRoller instance.
  const roller = new DiceRoller();

  // Use Ant Design's notification context.
  const [api, contextHolder] = notification.useNotification();

  // Handler for rolling the dice when the roll button is clicked.
  const handleRollClick = () => {
    try {
      // Attempt to roll the dice with the input value, then open a notification with the result.
      const result = roller.roll(inputValue).output;
      openNotification(result);
    } catch (error) {
      console.error(error);
    }
  };

  // Handler for updating the input value state when the dice notation input changes.
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Function for opening a notification with a given message.
  const openNotification = (result: string) => {
    api.open({
      message: "Virtual Dice",
      description: result,
      duration: 0,
      className: "!bg-seaBuckthorn",
    });
  };

  // Return the JSX for the modal.
  return (
    <>
      {contextHolder} {/* The notification context holder */}
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
            placeholder="1d6"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button type="primary" onClick={handleRollClick}>
            Roll
          </Button>
        </Space.Compact>
        <Typography.Paragraph type="secondary">
          Type any dice notation in the input box. ex: 2d0+5
        </Typography.Paragraph>
      </Modal>
    </>
  );
}
