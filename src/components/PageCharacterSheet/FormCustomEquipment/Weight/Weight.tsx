import { Form, InputNumber } from "antd";
import React from "react";

const Weight: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  return (
    <Form.Item label="Weight" name="weight" className={className}>
      <InputNumber step={0.1} />
    </Form.Item>
  );
};

export default Weight;
