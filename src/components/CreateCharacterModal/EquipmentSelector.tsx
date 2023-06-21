import React from "react";
import { Collapse, Divider, Radio, Space } from "antd";
import { EquipmentSelectorProps } from "../types";
import { toTitleCase } from "../formatters";
import EquipmentCheckbox from "./EquipmentCheckbox";
import EquipmentRadio from "./EquipmentRadio";

export default function EquipmentSelector({
  armorSelection,
  equipmentCategories,
  equipmentItems,
  handleWeightChange,
  updateArmorSelection,
  weightRestrictions,
  characterData,
  setCharacterData,
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
                      handleWeightChange={handleWeightChange}
                      weightRestrictions={weightRestrictions}
                      characterData={characterData}
                      setCharacterData={setCharacterData}
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
                    .map((item) =>
                      item.name !== "Shield" ? (
                        // Separate Shield from other Armor items because it can be combined with the others.
                        <React.Fragment key={item.name}>
                          <EquipmentRadio
                            item={item}
                            characterData={characterData}
                            disabled={characterData.equipment.length === 0}
                          />
                          <Divider />
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={item.name}>
                          <EquipmentCheckbox
                            itemName={item.name}
                            equipmentItems={equipmentItems}
                            handleWeightChange={handleWeightChange}
                            weightRestrictions={weightRestrictions}
                            characterData={characterData}
                            setCharacterData={setCharacterData}
                          />
                        </React.Fragment>
                      )
                    )}
                </Space>
              </Radio.Group>
            )}
          </Collapse.Panel>
        ))}
    </Collapse>
  );
}
