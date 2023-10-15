import { Space } from "antd";
import equipmentItems from "../../../data/equipmentItems.json";
import { equipmentItemIsDisabled } from "../../../support/helpers";
import {
  CharacterData,
  ClassNames,
  EquipmentItem,
  RaceNames,
} from "../../../data/definitions";
import EquipmentCheckbox from "../EquipmentCheckbox/EquipmentCheckbox";
import EquipmentItemDescription from "../EquipmentItemDescription/EquipmentItemDescription";

export default function EquipmentCheckboxGroup({
  category,
  subCategory,
  characterData,
  onCheckboxCheck,
  onAmountChange,
}: {
  category: string;
  subCategory?: string;
  characterData: CharacterData;
  onAmountChange: (item?: EquipmentItem) => void;
  onCheckboxCheck: (item?: EquipmentItem) => void;
}) {
  return (
    <Space direction="vertical">
      {equipmentItems
        .filter(
          (categoryItem) =>
            categoryItem.category === category &&
            (!subCategory || categoryItem.subCategory === subCategory)
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((categoryItem) => {
          if (
            !equipmentItemIsDisabled(
              characterData.class as ClassNames[],
              characterData.race as RaceNames,
              categoryItem
            )
          ) {
            return (
              <EquipmentCheckbox
                key={categoryItem.name}
                item={categoryItem}
                disabled={equipmentItemIsDisabled(
                  characterData.class as ClassNames[],
                  characterData.race as RaceNames,
                  categoryItem
                )}
                onCheckboxCheck={onCheckboxCheck}
                onAmountChange={onAmountChange}
                playerHasItem={characterData.equipment.some(
                  (invItem: EquipmentItem) => invItem.name === categoryItem.name
                )}
                equipmentItemDescription={
                  <EquipmentItemDescription item={categoryItem} />
                }
                inputDisabled={categoryItem.costValue > characterData.gold}
                itemAmount={
                  characterData.equipment.filter(
                    (invItem: EquipmentItem) =>
                      invItem.name === categoryItem.name
                  )[0]?.amount
                }
              />
            );
          } else {
            return null;
          }
        })}
    </Space>
  );
}
