import { Collapse, Descriptions, Space, Typography } from "antd";
import { EquipmentAccordionProps } from "./definitions";
import { toTitleCase } from "../../../support/stringSupport";
import equipmentItems from "../../../data/equipmentItems.json";
import EquipmentCheckbox from "../EquipmentCheckbox/EquipmentCheckbox";
import WeaponKeys from "../../WeaponKeys/WeaponKeys";
import { classes } from "../../../data/classes";
import { races } from "../../../data/races";
import { getClassType } from "../../../support/helpers";
import { EquipmentCategories, EquipmentItem } from "../../../data/definitions";
import { ClassNames, RaceNames } from "../../../data/definitions";
import classNames from "classnames";

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
  classNames: ClassNames[],
  raceName: RaceNames,
  item: EquipmentItem
) => {
  // Nothing disabled for custom classes
  if (getClassType(classNames) === "custom") return false;
  // Races that do not allow large equipment
  if (races[raceName]?.noLargeEquipment && item.size === "L") return true;
  // Classes that do not allow large equipment
  if (
    classNames.some((className) => classes[className].noLargeEquipment) &&
    item.size === "L"
  ) {
    return true;
  }
  let disabled = false;
  classNames.forEach((className) => {
    if (classes[className].specificEquipmentItems) {
      const specificEquipmentItems = classes[className]
        .specificEquipmentItems || [[], []];

      // if the item category is listed in specificEquipmentItems[0] AND the string in specificEquipmentItems[1] is not in the item name
      if (
        specificEquipmentItems[0].includes(item.category) &&
        specificEquipmentItems[1].every(
          (string) => !item.name.toLowerCase().includes(string)
        )
      ) {
        disabled = true;
      }
    }
  });

  return disabled;
};

export default function EquipmentAccordion({
  onAmountChange,
  onCheckboxCheck,
  characterData,
  className,
}: EquipmentAccordionProps & React.ComponentPropsWithRef<"div">) {
  const classCategories = characterData.class.flatMap(
    (classPiece) =>
      classes[classPiece as ClassNames]?.availableEquipmentCategories
  );

  const categories = classCategories.some((category) => category !== undefined)
    ? Array.from(new Set(classCategories))
    : Object.values(EquipmentCategories);

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
              characterData.class as ClassNames[],
              characterData.race as RaceNames,
              categoryItem
            )
          ) {
            return (
              <EquipmentCheckbox
                key={categoryItem.name}
                item={categoryItem}
                disabled={itemIsDisabled(
                  characterData.class as ClassNames[],
                  characterData.race as RaceNames,
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

  const equipmentAccordionClassNames = classNames(
    className,
    "bg-seaBuckthorn",
    "h-fit"
  );

  return (
    <div>
      {/* TODO refactor to use `items` instead of `children` */}
      <Collapse accordion className={equipmentAccordionClassNames}>
        {categories
          .sort((a: any, b: any) => a.localeCompare(b))
          .map((category: any) => (
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
