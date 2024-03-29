import { Form, Input } from "antd";
import React from "react";

const Notes: React.FC<React.ComponentPropsWithRef<"div">> = ({ className }) => {
  return (
    <Form.Item label="Notes" name="notes" className={className}>
      <Input.TextArea rows={5} />
    </Form.Item>
  );
};

export default Notes;
