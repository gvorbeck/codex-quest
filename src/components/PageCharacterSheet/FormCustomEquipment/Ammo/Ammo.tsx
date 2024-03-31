import { Form, Select, SelectProps } from "antd";
import React from "react";
import equipment from "@/data/equipmentItems.json";
import { EquipmentCategories } from "@/data/definitions";

interface AmmoProps {
  ammoSelect: string | undefined;
  handleAmmoChange: (value: string) => void;
}

const Ammo: React.FC<AmmoProps & React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const options: SelectProps["options"] = equipment
    .filter((item) => item.category === EquipmentCategories.AMMUNITION)
    .map((item) => ({ label: item.name, value: item.name }));
  return (
    <Form.Item
      label="Ammunition"
      name="ammo"
      className={className}
      rules={[{ required: true }]}
    >
      <Select mode="multiple" options={options} />
    </Form.Item>
  );
};

export default Ammo;
