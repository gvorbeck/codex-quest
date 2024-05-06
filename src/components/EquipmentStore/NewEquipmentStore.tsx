import {
  Alert,
  Collapse,
  CollapseProps,
  Descriptions,
  DescriptionsProps,
  Flex,
  Input,
} from "antd";
import equipmentData from "@/data/equipment.json";
import {
  CharData,
  ClassNames,
  EquipmentCategories,
  EquipmentItem,
} from "@/data/definitions";
import { slugToTitleCase } from "@/support/stringSupport";
import { classes } from "@/data/classes";
import { ClassSetup } from "@/data/classes/definitions";
import EquipmentStoreItem from "./EquipmentStoreItem/EquipmentStoreItem";

interface EquipmentStoreProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const EquipmentStore: React.FC<
  EquipmentStoreProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  function getEquipmentCategoryChildren(category: string) {
    return equipmentData.filter((item) => item.category === category);
  }

  function getEquipmentCategoryItems() {
    const items: CollapseProps["items"] = [];
    const classProps: Record<string, ClassSetup> = {};
    for (const className of character.class) {
      classProps[className] = classes[className as ClassNames] ?? {};
    }
    for (const [key, value] of Object.entries(EquipmentCategories)) {
      // Check if any class has this equipment category available
      let isCategoryAvailable = false;
      for (const classSetup of Object.values(classProps)) {
        if (classSetup.availableEquipmentCategories?.includes(value)) {
          isCategoryAvailable = true;
          break; // Stop searching once we find a match
        }
      }

      if (isCategoryAvailable) {
        items.push({
          key,
          label: slugToTitleCase(value),
          children: (
            <Flex gap={16} vertical>
              {getEquipmentCategoryChildren(value).map((equipmentItem) => (
                <EquipmentStoreItem
                  key={equipmentItem.name}
                  item={equipmentItem as EquipmentItem}
                  character={character}
                  setCharacter={setCharacter}
                />
              ))}
            </Flex>
          ),
        });
      }
    }
    return items.sort((a, b) => {
      const labelA = typeof a.label === "string" ? a.label : "";
      const labelB = typeof b.label === "string" ? b.label : "";
      return labelA.localeCompare(labelB);
    });
  }

  const items: CollapseProps["items"] = getEquipmentCategoryItems();
  const descriptionsItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "**",
      children: "This weapon only does subduing damage",
    },
    {
      key: "2",
      label: "(E)",
      children:
        "Entangling: This weapon may be used to snare or hold opponents.",
    },
    {
      key: "3",
      label: "†",
      children: "Silver tip or blade, for use against lycanthropes.",
    },
  ];

  return (
    <Flex gap={8} vertical className={className}>
      <Input placeholder="Filter equipment list" />
      <Collapse items={items} />
      <Alert
        type="info"
        message={
          <Descriptions
            size="small"
            items={descriptionsItems}
            column={1}
            contentStyle={{ fontSize: ".75rem" }}
          />
        }
      />
    </Flex>
  );
};

export default EquipmentStore;
