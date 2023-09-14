import { Collapse, Descriptions, Space, Typography } from "antd";
import { EquipmentAccordionProps } from "./definitions";
import { toTitleCase } from "../../../support/stringSupport";
import equipmentItems from "../../../data/equipmentItems.json";
import EquipmentCheckbox from "../EquipmentCheckbox/EquipmentCheckbox";
import { EquipmentItem } from "../definitions";
import WeaponKeys from "../../WeaponKeys/WeaponKeys";
import { ClassNamesTwo, classes } from "../../../data/classes";
import { RaceNamesTwo, races } from "../../../data/races";
import { getClassType } from "../../../support/helpers";
import { equipmentCategories } from "../../../data/definitions";

const EquipmentItemDescription = (item: EquipmentItem) => (
  <>
    <Typography.Text strong>{item.name}</Typography.Text>
    <Descriptions bordered size="small" column={2} className="flex-grow mt-2">
      <Descriptions.Item label="Cost">
        {`${item.costValue}${item.costCurrency}`}
      </Descriptions.Item>
      {item.weight && (
        <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
      )}
      {item.size && (
        <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
      )}
      {item.AC && <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>}
      {item.damage && (
        <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
      )}
    </Descriptions>
  </>
);

const itemIsDisabled = (
  className: ClassNamesTwo[],
  raceName: RaceNamesTwo,
  item: EquipmentItem
) => {
  if (getClassType(className) === "custom") return false;
  className.forEach((classPiece) => {
    const specificEquipmentItems =
      classes[classPiece as ClassNamesTwo].specificEquipmentItems;

    if (specificEquipmentItems) {
      if (specificEquipmentItems[0].includes(item.category)) {
        if (
          specificEquipmentItems[1].some((specificItem) =>
            item.name.toLowerCase().includes(specificItem)
          )
        ) {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }

    if (races[raceName].noLargeEquipment && item.size === "L") return true;

    return true;
  });
};

export default function EquipmentAccordion({
  onAmountChange,
  onCheckboxCheck,
  characterData,
  className,
}: EquipmentAccordionProps) {
  const classCategories = characterData.class.flatMap(
    (classPiece) =>
      classes[classPiece as ClassNamesTwo]?.availableEquipmentCategories
  );

  const categories = classCategories.some((category) => category !== undefined)
    ? Array.from(new Set(classCategories))
    : Object.values(equipmentCategories);

  const generateEquipmentCheckboxes = (
    category: string,
    subCategory?: string
  ) => (
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
            !itemIsDisabled(
              characterData.class as ClassNamesTwo[],
              characterData.race as RaceNamesTwo,
              categoryItem
            )
          ) {
            return (
              <EquipmentCheckbox
                key={categoryItem.name}
                item={categoryItem}
                disabled={itemIsDisabled(
                  characterData.class as ClassNamesTwo[],
                  characterData.race as RaceNamesTwo,
                  categoryItem
                )}
                onCheckboxCheck={onCheckboxCheck}
                onAmountChange={onAmountChange}
                playerHasItem={characterData.equipment.some(
                  (invItem: EquipmentItem) => invItem.name === categoryItem.name
                )}
                equipmentItemDescription={EquipmentItemDescription(
                  categoryItem
                )}
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

  return (
    <div>
      <Collapse accordion className={`${className} bg-seaBuckthorn h-fit`}>
        {categories
          .sort((a, b) => a.localeCompare(b))
          .map((category: string) => (
            <Collapse.Panel
              key={category}
              header={toTitleCase(category.replaceAll("-", " "))}
              className="[&>div:not(:first)]:bg-springWood"
            >
              {/* if category === 'general-equipment' Create a sub Collapse */}
              {category === "general-equipment" ? (
                <Collapse accordion ghost size="small">
                  {[
                    ...new Set(
                      equipmentItems
                        .filter((item) => item.category === category)
                        .map((item) => item.subCategory)
                    ),
                  ].map((subCategory) => {
                    return (
                      subCategory !== undefined && (
                        <Collapse.Panel
                          key={subCategory}
                          header={toTitleCase(
                            subCategory?.replaceAll("-", " ")
                          )}
                        >
                          {generateEquipmentCheckboxes(category, subCategory)}
                        </Collapse.Panel>
                      )
                    );
                  })}
                </Collapse>
              ) : (
                generateEquipmentCheckboxes(category)
              )}
            </Collapse.Panel>
          ))}
      </Collapse>
      <WeaponKeys className="mt-4" />
    </div>
  );
}
