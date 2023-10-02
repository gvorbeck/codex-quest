import { Collapse, CollapseProps } from "antd";
import { slugToTitleCase } from "../../../support/stringSupport";
import equipmentItems from "../../../data/equipmentItems.json";
import WeaponKeys from "../../WeaponKeys/WeaponKeys";
import { classes } from "../../../data/classes";
import {
  CharacterData,
  EquipmentCategories,
  EquipmentItem,
} from "../../../data/definitions";
import { ClassNames } from "../../../data/definitions";
import classNames from "classnames";
import EquipmentCheckboxGroup from "../EquipmentCheckboxGroup/EquipmentCheckboxGroup";

type EquipmentAccordionProps = {
  characterData: CharacterData;
  onAmountChange: (item?: EquipmentItem) => void;
  onCheckboxCheck: (item?: EquipmentItem) => void;
  onRadioCheck: (item?: EquipmentItem) => void;
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

  const equipmentAccordionClassNames = classNames(
    className,
    "bg-seaBuckthorn",
    "h-fit"
  );

  const generalEquipmentName = "general-equipment";

  const generalEquipmentItems: CollapseProps["items"] = [
    ...new Set(
      equipmentItems
        .filter((item) => item.category === generalEquipmentName)
        .map((item) => item.subCategory)
    ),
  ].map((subCategory, index) => {
    return {
      key: index + 1 + "",
      label: slugToTitleCase(subCategory || ""),
      children: (
        <EquipmentCheckboxGroup
          category={generalEquipmentName}
          subCategory={subCategory}
          characterData={characterData}
          onAmountChange={onAmountChange}
          onCheckboxCheck={onCheckboxCheck}
        />
      ),
    };
  });

  const items: CollapseProps["items"] = categories
    .sort((a, b) => a.localeCompare(b))
    .map((category, index) => {
      return {
        key: index + 1 + "",
        label: slugToTitleCase(category),
        children:
          category === "general-equipment" ? (
            <Collapse
              items={generalEquipmentItems}
              accordion
              ghost
              size="small"
            />
          ) : (
            <EquipmentCheckboxGroup
              category={category}
              characterData={characterData}
              onAmountChange={onAmountChange}
              onCheckboxCheck={onCheckboxCheck}
            />
          ),
      };
    });

  return (
    <>
      <Collapse
        accordion
        className={equipmentAccordionClassNames}
        items={items}
      />
      <WeaponKeys className="mt-4" />
    </>
  );
}
