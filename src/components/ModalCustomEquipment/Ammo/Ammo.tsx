import { Form, Select } from "antd";
import React from "react";

interface AmmoProps {
  ammoSelect: string | undefined;
  handleAmmoChange: (value: string) => void;
}

const Ammo: React.FC<AmmoProps & React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  return (
    <Form.Item
      label="Ammunition"
      name="ammunition"
      className={className}
      rules={[{ required: true }]}
    >
      <Select />
    </Form.Item>
  );
};

export default Ammo;
