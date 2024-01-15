import { Form, InputNumber, Select, SelectProps, Space } from "antd";
import React from "react";
import { CostCurrency } from "@/data/definitions";
import { CURRENCIES } from "@/support/equipmentSupport";

const currencyOptions: SelectProps<CostCurrency>["options"] = CURRENCIES.map(
  (currency) => ({ value: currency, label: currency.toUpperCase() }),
);

const Cost: React.FC<React.ComponentPropsWithRef<"div">> = ({ className }) => {
  return (
    <Form.Item label="Gold" className={className} required>
      <Space.Compact>
        <Form.Item name="costValue" rules={[{ required: true }]} noStyle>
          <InputNumber />
        </Form.Item>
        <Form.Item name="costCurrency" rules={[{ required: true }]} noStyle>
          <Select options={currencyOptions} />
        </Form.Item>
      </Space.Compact>
    </Form.Item>
  );
};

export default Cost;
