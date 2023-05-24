import { useState } from "react";
import { EquipmentItemSelectorProps } from "../types";
import calculateCarryingCapacity from "../calculateCarryingCapacity";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { InputNumber, Radio, Space, Typography } from "antd";

export default function EquipmentItemSelector({
  item,
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
  weight,
  setWeight,
  strength,
}: EquipmentItemSelectorProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const totalCost = item.costValue * quantity;
  const canAffordItem = totalCost <= gold;
  const isLargeWeapon = "size" in item && item.size === "large";
  const isHalflingOrDwarf = race === "Halfling" || race === "Dwarf";
  const isOverburdened =
    weight > calculateCarryingCapacity(strength, race).heavy;
  const isDisabled = (isLargeWeapon && isHalflingOrDwarf) || isOverburdened;

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const costInGold =
      item.costCurrency === "gp" ? item.costValue : item.costValue / 10;
    setGold(gold + (checked ? -costInGold * quantity : costInGold * quantity));
    setIsChecked(checked);

    if (checked) {
      setEquipment([...equipment, { ...item, quantity }]);
    } else {
      const updatedEquipment = equipment.filter((eq) => eq.name !== item.name);
      setEquipment(updatedEquipment);
    }

    if ("weight" in item) {
      if (race === "Halfling" && item.name.includes("Armor")) {
        item.weight = item.weight * 0.25;
      }
      setWeight(
        weight + (checked ? item.weight * quantity : -item.weight * quantity)
      );
    }
  };

  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value >= 1) {
      const difference = (value - quantity) * item.costValue;
      setQuantity(value);

      if (gold - difference >= 0) {
        setGold(gold + (isChecked ? -difference : difference));
      } else {
        setQuantity(quantity);
      }

      const updatedEquipment = equipment.map((eq) => {
        if (eq.name === item.name) {
          return { ...eq, quantity: value };
        }
        return eq;
      });
      setEquipment(updatedEquipment);
    } else {
      setQuantity(0);
    }

    if ("weight" in item && value !== null)
      setWeight(weight + (value - quantity) * item.weight);
  };

  let weightElement = null;
  let sizeElement = "";

  if ("weight" in item) {
    let weight: string | number = item.weight;
    if (weight === 0) weight = "**";
    else if (weight === 0.1) weight = "*";
    weightElement = `, Weight: ${weight}`;
  }

  if ("size" in item)
    sizeElement = `, Size: ${item.size?.slice(0, 1).toUpperCase()}`;

  return !item.name.includes("Armor") ? (
    <div>
      <Space direction="vertical">
        <Checkbox
          disabled={(!canAffordItem && !isChecked) || isDisabled}
          onChange={handleCheckboxChange}
        >
          <Space direction="vertical">
            <Typography.Text strong>{item.name}</Typography.Text>
            <Typography.Text type="secondary">
              {`Cost: ${item.costValue} ${item.costCurrency}` +
                weightElement +
                sizeElement}
            </Typography.Text>
          </Space>
        </Checkbox>
        {isChecked && !item.name.includes("Armor") && (
          <InputNumber
            min={1}
            max={
              "weight" in item
                ? Math.floor(
                    (calculateCarryingCapacity(strength, race).heavy - weight) /
                      item.weight
                  )
                : Infinity
            }
            precision={0}
            defaultValue={1}
            value={quantity}
            onChange={handleQuantityChange}
          />
        )}
      </Space>
    </div>
  ) : (
    <Radio>{item.name}</Radio>
  );
}
