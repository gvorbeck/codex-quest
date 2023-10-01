import { Collapse } from "antd";
import { EquipmentAccordionProps } from "./definitions";
import { toTitleCase } from "../../../support/stringSupport";
import equipmentItems from "../../../data/equipmentItems.json";
import WeaponKeys from "../../WeaponKeys/WeaponKeys";
import { classes } from "../../../data/classes";
import { EquipmentCategories } from "../../../data/definitions";
import { ClassNames } from "../../../data/definitions";
import classNames from "classnames";
import EquipmentCheckboxGroup from "../EquipmentCheckboxGroup/EquipmentCheckboxGroup";

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
                          <EquipmentCheckboxGroup
                            category={category}
                            subCategory={subCategory}
                            characterData={characterData}
                            onAmountChange={onAmountChange}
                            onCheckboxCheck={onCheckboxCheck}
                          />
                        </Collapse.Panel>
                      )
                    );
                  })}
                </Collapse>
              ) : (
                <EquipmentCheckboxGroup
                  category={category}
                  characterData={characterData}
                  onAmountChange={onAmountChange}
                  onCheckboxCheck={onCheckboxCheck}
                />
              )}
            </Collapse.Panel>
          ))}
      </Collapse>
      <WeaponKeys className="mt-4" />
    </div>
  );
}
