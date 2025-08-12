import { Button, Form, Input } from "antd";
import React from "react";
import { useNotification } from "@/hooks/useNotification";
import { rollDice, validateDiceNotation } from "@/support/diceSupport";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    const result = rollDice(inputValue);
    openNotification("Virtual Dice", result.toString());
  };
  return (
    <Form className={className} layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item
        className={className}
        label="Dice Notation"
        name="diceNotation"
        rules={[
          { required: true, message: "Please input dice notation!" },
          {
            validator: (_, value) => {
              if (!value || validateDiceNotation(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Invalid dice notation"));
            },
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
