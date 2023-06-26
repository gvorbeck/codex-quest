import { Collapse, Radio, Space, Typography } from "antd";
import { EquipmentAccordionProps } from "./definitions";
import { toTitleCase } from "../formatters";
import equipmentItems from "../../data/equipment-items.json";
import EquipmentCheckbox from "../EquipmentCheckbox/EquipmentCheckbox";
import { ClassName, EquipmentItem } from "../EquipmentStore/definitions";
import { RaceName } from "../CharacterRace/definitions";
import EquipmentRadio from "../EquipmentRadio/EquipmentRadio";

const EquipmentItemDescription = (item: EquipmentItem) => (
  <Space direction="vertical">
    <Typography.Text strong>{item.name}</Typography.Text>
    <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
    {item.weight !== undefined ?? (
      <Typography.Text>{`Weight: ${item.weight}`}</Typography.Text>
    )}
    {item.damage && (
      <Typography.Text>{`Damage: ${item.damage}`}</Typography.Text>
    )}
    {item.size && <Typography.Text>{`Size: ${item.size}`}</Typography.Text>}
    {item.AC && <Typography.Text>{`AC: ${item.AC}`}</Typography.Text>}
  </Space>
);

const availableEquipmentCategories = (className: ClassName) => {
  switch (className) {
    case "Cleric":
      return [
        "ammunition",
        "armor-and-shields",
        "beasts-of-burden",
        "hammers-and-maces",
        "items",
        "other-weapons",
      ];
    case "Fighter" || "Thief":
      return [
        "ammunition",
        "armor-and-shields",
        "axes",
        "beasts-of-burden",
        "bows",
        "daggers",
        "hammers-and-maces",
        "items",
        "other-weapons",
        "swords",
      ];
    case "Magic-User":
      return ["daggers", "items", "other-weapons", "beasts-of-burden"];
    default:
      console.error(`availableEquipmentCategories: no case for supplied class`);
      return ["items"];
  }
};
// For combo class, split the class string by " " and then run this function for each. Then add the results of each into a Set that so there's no repeats.

const itemIsDisabled = (
  className: ClassName,
  race: RaceName,
  item: EquipmentItem
) => {
  let disabled = true;
  if (className === "Cleric") {
    if (
      item.category === "hammers-and-maces" ||
      item.category === "other-weapons" ||
      item.category === "ammunition"
    ) {
      if (
        item.name.toLowerCase().includes("warhammer") ||
        item.name.toLowerCase().includes("mace") ||
        item.name.toLowerCase().includes("maul") ||
        item.name.toLowerCase().includes("quarterstaff") ||
        item.name.toLowerCase().includes("sling") ||
        item.name.toLowerCase().includes("stone")
      ) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  } else if (className === "Fighter") {
    disabled = false;
  } else if (className === "Thief") {
    if (item.category === "armor-and-shields") {
      if (item.name.toLowerCase().includes("leather")) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  } else if (className === "Magic-User") {
    if (item.category === "other-weapons") {
      if (item.name.toLowerCase().includes("cudgel")) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  }
  return disabled;
};

export default function EquipmentAccordion({
  onAmountChange,
  onCheckboxCheck,
  onRadioCheck,
  playerClass,
  playerEquipment,
  playerRace,
}: EquipmentAccordionProps) {
  // Create a list of unique categories available for each class in the className, removing any duplicates
  const categories = Array.from(
    new Set(
      playerClass
        .split(" ")
        .flatMap((classPiece) =>
          availableEquipmentCategories(classPiece as ClassName)
        )
    )
  );

  const playerArmorSelection = playerEquipment.filter(
    (armorItem) =>
      armorItem.category === "armor-and-shields" &&
      armorItem.name.toLowerCase() !== "shield"
  );
  console.log(playerArmorSelection);

  return (
    <Collapse accordion className="bg-seaBuckthorn mt-4">
      {categories
        .sort((a, b) => a.localeCompare(b))
        .map((category: string) => (
          <Collapse.Panel
            key={category}
            header={toTitleCase(category.replaceAll("-", " "))}
            className="[&>div:not(:first)]:bg-springWood"
          >
            <Space direction="vertical">
              {category !== "armor-and-shields" ? (
                equipmentItems
                  .filter((categoryItem) => categoryItem.category === category)
                  .map((categoryItem) => {
                    if (
                      !itemIsDisabled(playerClass, playerRace, categoryItem)
                    ) {
                      return (
                        <EquipmentCheckbox
                          key={categoryItem.name}
                          item={categoryItem}
                          disabled={itemIsDisabled(
                            playerClass,
                            playerRace,
                            categoryItem
                          )}
                          onCheckboxCheck={onCheckboxCheck}
                          onAmountChange={onAmountChange}
                          playerHasItem={playerEquipment.some(
                            (invItem: EquipmentItem) =>
                              invItem.name === categoryItem.name
                          )}
                          equipmentItemDescription={EquipmentItemDescription(
                            categoryItem
                          )}
                        />
                      );
                    } else {
                      return null;
                    }
                  })
              ) : (
                <Radio.Group
                  value={
                    playerArmorSelection.length > 0
                      ? playerArmorSelection[0].name
                      : null
                  }
                  onChange={() => console.log("flooboo")}
                >
                  <Space direction="vertical">
                    {equipmentItems
                      .filter(
                        (categoryItem) => categoryItem.category === category
                      )
                      .map((categoryItem) =>
                        categoryItem.name.toLowerCase() !== "shield" ? (
                          <EquipmentRadio
                            key={categoryItem.name}
                            item={categoryItem}
                            onRadioCheck={onRadioCheck}
                            equipmentItemDescription={EquipmentItemDescription(
                              categoryItem
                            )}
                          />
                        ) : (
                          <EquipmentCheckbox
                            key={categoryItem.name}
                            item={categoryItem}
                            disabled={itemIsDisabled(
                              playerClass,
                              playerRace,
                              categoryItem
                            )}
                            onCheckboxCheck={onCheckboxCheck}
                            onAmountChange={onAmountChange}
                            playerHasItem={playerEquipment.some(
                              (invItem: EquipmentItem) =>
                                invItem.name === categoryItem.name
                            )}
                            equipmentItemDescription={EquipmentItemDescription(
                              categoryItem
                            )}
                          />
                        )
                      )}
                  </Space>
                </Radio.Group>
              )}
            </Space>
          </Collapse.Panel>
        ))}
    </Collapse>
  );
}
// import React from "react";
// import { Collapse, Divider, Radio, Space } from "antd";
// import { EquipmentSelectorProps } from "../types";
// import { toTitleCase } from "../formatters";
// import EquipmentCheckbox from "./EquipmentCheckbox";
// import EquipmentRadio from "./EquipmentRadio";

// export default function EquipmentSelector({
//   armorSelection,
//   equipmentCategories,
//   equipmentItems,
//   handleWeightChange,
//   updateArmorSelection,
//   weightRestrictions,
//   characterData,
//   setCharacterData,
// }: EquipmentSelectorProps) {
//   return (
//     <Collapse accordion>
//       {equipmentCategories
//         .sort((a, b) => a.localeCompare(b))
//         .map((cat) => (
//           <Collapse.Panel
//             header={toTitleCase(cat.replaceAll("-", " "))}
//             key={cat}
//           >
//             {cat !== "armor-and-shields" ? (
//               <Space direction="vertical">
//                 {equipmentItems
//                   .filter((catItem) => catItem.category === cat)
//                   .map((item) => (
//                     <EquipmentCheckbox
//                       key={item.name}
//                       itemName={item.name}
//                       equipmentItems={equipmentItems}
//                       handleWeightChange={handleWeightChange}
//                       weightRestrictions={weightRestrictions}
//                       characterData={characterData}
//                       setCharacterData={setCharacterData}
//                     />
//                   ))}
//               </Space>
//             ) : (
//               <Radio.Group
//                 value={armorSelection ? armorSelection.name : null}
//                 onChange={(e) => updateArmorSelection(e.target.value)}
//               >
//                 <Space direction="vertical">
//                   {equipmentItems
//                     .filter((catItem) => catItem.category === cat)
//                     .map((item) =>
//                       item.name !== "Shield" ? (
//                         // Separate Shield from other Armor items because it can be combined with the others.
//                         <React.Fragment key={item.name}>
//                           <EquipmentRadio
//                             item={item}
//                             characterData={characterData}
//                             disabled={characterData.equipment.length === 0}
//                           />
//                           <Divider />
//                         </React.Fragment>
//                       ) : (
//                         <React.Fragment key={item.name}>
//                           <EquipmentCheckbox
//                             itemName={item.name}
//                             equipmentItems={equipmentItems}
//                             handleWeightChange={handleWeightChange}
//                             weightRestrictions={weightRestrictions}
//                             characterData={characterData}
//                             setCharacterData={setCharacterData}
//                           />
//                         </React.Fragment>
//                       )
//                     )}
//                 </Space>
//               </Radio.Group>
//             )}
//           </Collapse.Panel>
//         ))}
//     </Collapse>
//   );
// }
