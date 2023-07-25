import { Collapse, Descriptions, Space, Typography } from "antd";
import { EquipmentAccordionProps } from "./definitions";
import { toTitleCase } from "../../../support/stringSupport";
import equipmentItems from "../../../data/equipment-items.json";
import EquipmentCheckbox from "../EquipmentCheckbox/EquipmentCheckbox";
import { ClassName, EquipmentItem } from "../definitions";
import { RaceName } from "../../CreateCharacter/CharacterRace/definitions";
import { classChoices } from "../../../data/classDetails";

const EquipmentItemDescription = (item: EquipmentItem) => (
  <>
    <Typography.Text strong>{item.name}</Typography.Text>
    <Descriptions bordered size="small" column={2} className="flex-grow">
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

const availableEquipmentCategories = (className: ClassName) => {
  switch (className.toLowerCase()) {
    case "cleric":
      return [
        "ammunition",
        "armor",
        "shields",
        "bows",
        "beasts-of-burden",
        "barding",
        "hammers-and-maces",
        "general-equipment",
        "other-weapons",
        "chain-and-flail",
        "improvised-weapons",
        "slings-and-hurled-weapons",
      ];
    case "fighter":
    case "thief":
    case "assassin":
      return [
        "ammunition",
        "armor",
        "shields",
        "axes",
        "beasts-of-burden",
        "barding",
        "bows",
        "daggers",
        "hammers-and-maces",
        "general-equipment",
        "other-weapons",
        "swords",
        "spears-and-polearms",
        "improvised-weapons",
        "slings-and-hurled-weapons",
      ];
    case "magic-user":
      return [
        "daggers",
        "items",
        "other-weapons",
        "beasts-of-burden",
        "barding",
        "improvised-weapons",
      ];
    default:
      if (!classChoices.includes(className)) {
        return [
          "ammunition",
          "armor",
          "shields",
          "axes",
          "beasts-of-burden",
          "bows",
          "daggers",
          "hammers-and-maces",
          "general-equipment",
          "other-weapons",
          "swords",
          "spears-and-polearms",
          "improvised-weapons",
          "slings-and-hurled-weapons",
        ];
      } else {
        console.error(
          `availableEquipmentCategories: no case for supplied class`
        );
        return [];
      }
  }
};

const itemIsDisabled = (
  className: ClassName,
  raceName: RaceName,
  item: EquipmentItem
) => {
  let disabled = true;
  if (className.toLowerCase() === "cleric") {
    if (
      item.category === "hammers-and-maces" ||
      item.category === "other-weapons" ||
      item.category === "ammunition" ||
      item.category === "bows" ||
      item.category === "slings-and-hurled-weapons"
    ) {
      if (
        item.name.toLowerCase().includes("warhammer") ||
        item.name.toLowerCase().includes("mace") ||
        item.name.toLowerCase().includes("maul") ||
        item.name.toLowerCase().includes("crossbow") ||
        item.name.toLowerCase().includes("morningstar") ||
        item.name.toLowerCase().includes("quarterstaff") ||
        item.name.toLowerCase().includes("sling") ||
        item.name.toLowerCase().includes("stone")
      ) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  } else if (
    className.toLowerCase().includes("fighter") ||
    !classChoices.includes(className)
  ) {
    disabled = false;
  } else if (
    className.toLowerCase().includes("thief") ||
    className.toLowerCase().includes("assassin")
  ) {
    if (item.category === "armor") {
      if (item.name.toLowerCase().includes("leather")) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  } else if (className.toLowerCase().includes("magic-user")) {
    if (item.category === "other-weapons") {
      if (item.name.toLowerCase().includes("cudgel")) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  }

  if (
    raceName.toLowerCase() === "dwarf" ||
    raceName.toLowerCase() === "halfling"
  ) {
    if (item.size === "L") disabled = true;
  }

  return disabled;
};

export default function EquipmentAccordion({
  onAmountChange,
  onCheckboxCheck,
  playerClass,
  playerEquipment,
  playerRace,
  playerGold,
  className,
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

  return (
    <Collapse accordion className={`${className} bg-seaBuckthorn h-fit`}>
      {categories
        .sort((a, b) => a.localeCompare(b))
        .map((category: string) => (
          <Collapse.Panel
            key={category}
            header={toTitleCase(category.replaceAll("-", " "))}
            className="[&>div:not(:first)]:bg-springWood"
          >
            <Space direction="vertical">
              {equipmentItems
                .filter((categoryItem) => categoryItem.category === category)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((categoryItem) => {
                  if (!itemIsDisabled(playerClass, playerRace, categoryItem)) {
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
                        inputDisabled={categoryItem.costValue > playerGold}
                        itemAmount={
                          playerEquipment.filter(
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
          </Collapse.Panel>
        ))}
    </Collapse>
  );
}
