import { Form, InputNumber } from "antd";
import React from "react";

const Amount: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  return (
    <Form.Item label="Amount" name="amount" className={className}>
      <InputNumber min={1} />
    </Form.Item>
  );
};

export default Amount;
