import { Button, Form, Input } from "antd";
import React from "react";
import { useNotification } from "@/hooks/useNotification";
import { rollDice } from "@/support/diceSupport";

interface ModalVirtualDiceProps {}

const ModalVirtualDice: React.FC<
  ModalVirtualDiceProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const { contextHolder, openNotification } = useNotification();
  const [inputValue, setInputValue] = React.useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const onFinish = () => {
    openNotification("Virtual Dice", rollDice(inputValue));
  };
  return (
    <Form className={className} layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item
        className={className}
        label="Name"
        name="name"
        rules={[
          { required: true, message: "Please input a name!" },
          {
            pattern: /(\d+)?d(\d+)(([+-]\d+)|([kK]\d+([lLhH])?)|([eE]))?/g,
            message: "Invalid dice notation",
          },
        ]}
      >
        <Input value={inputValue} onChange={handleInputChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModalVirtualDice;
