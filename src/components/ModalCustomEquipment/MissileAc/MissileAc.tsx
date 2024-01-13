import { Form, InputNumber } from "antd";
import React from "react";

interface MissileAcProps {
  missileAcInputNumber: number;
  handleMissileAcChange: (value: number) => void;
}

const MissileAc: React.FC<
  MissileAcProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleMissileAcChange, missileAcInputNumber }) => {
  return (
    <Form.Item
      label="Missile AC"
      name="missile-ac"
      className={className}
      rules={[{ required: true }]}
    >
      <InputNumber
        value={missileAcInputNumber}
        onChange={(e) => handleMissileAcChange(e as number)}
      />
    </Form.Item>
  );
};

export default MissileAc;
