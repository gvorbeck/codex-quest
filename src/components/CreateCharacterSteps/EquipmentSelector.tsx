import React from "react";
import { Collapse, Divider, Radio, Space } from "antd";
import { EquipmentSelectorProps } from "../types";
import { toTitleCase } from "../formatters";
import EquipmentCheckbox from "./EquipmentCheckbox";
import EquipmentRadio from "./EquipmentRadio";

export default function EquipmentSelector({
  armorSelection,
  equipment,
  equipmentCategories,
  equipmentItems,
  gold,
  handleWeightChange,
  race,
  setEquipment,
  setGold,
  updateArmorSelection,
  weight,
  weightRestrictions,
}: EquipmentSelectorProps) {
  return (
    <Collapse accordion>
      {equipmentCategories
        .sort((a, b) => a.localeCompare(b))
        .map((cat) => (
          <Collapse.Panel
            header={toTitleCase(cat.replaceAll("-", " "))}
            key={cat}
          >
            {cat !== "armor-and-shields" ? (
              <Space direction="vertical">
                {equipmentItems
                  .filter((catItem) => catItem.category === cat)
                  .map((item) => (
                    <EquipmentCheckbox
                      key={item.name}
                      itemName={item.name}
                      equipmentItems={equipmentItems}
                      equipment={equipment}
                      setEquipment={setEquipment}
                      setGold={setGold}
                      gold={gold}
                      handleWeightChange={handleWeightChange}
                      weight={weight}
                      weightRestrictions={weightRestrictions}
                      race={race}
                    />
                  ))}
              </Space>
            ) : (
              <Radio.Group
                value={armorSelection ? armorSelection.name : null}
                onChange={(e) => updateArmorSelection(e.target.value)}
              >
                <Space direction="vertical">
                  {equipmentItems
                    .filter((catItem) => catItem.category === cat)
                    .map((item) => (
                      <React.Fragment key={item.name}>
                        <EquipmentRadio item={item} />
                        <Divider />
                      </React.Fragment>
                    ))}
                </Space>
              </Radio.Group>
            )}
          </Collapse.Panel>
        ))}
    </Collapse>
  );
}
