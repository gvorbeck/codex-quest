import { Form, InputNumber, Space } from "antd";
import React from "react";

interface RangeProps {
  rangeArray: [number, number, number];
  handleRangeChange: (value: [number, number, number]) => void;
}

const Range: React.FC<RangeProps & React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  return (
    <Form.Item
      label="Range"
      className={className}
      required
      tooltip={{
        title: "Enter this item's short, medium, and long range values.",
      }}
    >
      <Space.Compact>
        <Form.Item
          name={["range", 0]}
          rules={[{ required: true, message: "Enter range" }]}
        >
          <InputNumber step={5} placeholder="5" min={0} />
        </Form.Item>
        <Form.Item
          name={["range", 1]}
          rules={[{ required: true, message: "Enter range" }]}
        >
          <InputNumber step={5} placeholder="10" min={0} />
        </Form.Item>
        <Form.Item
          name={["range", 2]}
          rules={[{ required: true, message: "Enter range" }]}
        >
          <InputNumber step={5} placeholder="15" min={0} />
        </Form.Item>
      </Space.Compact>
    </Form.Item>
  );
};

export default Range;
