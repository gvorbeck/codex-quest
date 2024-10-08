import { Button, Collapse, Flex, Input } from "antd";
import React from "react";
// import CollapseEquipment from "../CollapseEquipment/CollapseEquipment";
import EquipmentItemDescription from "../CollapseEquipment/EquipmentItemDescription/EquipmentItemDescription";
import { kickItem, punchItem } from "@/support/equipmentSupport";
import { DrawerForms, EquipmentItem, ModalDisplay } from "@/data/definitions";
import { CharacterDataContext } from "@/store/CharacterContext";

interface EquipmentProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
  showDrawer: () => void;
  setDrawerForms: React.Dispatch<React.SetStateAction<DrawerForms>>;
  setEditItem: React.Dispatch<React.SetStateAction<EquipmentItem | undefined>>;
}

const Equipment: React.FC<
  EquipmentProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  setModalDisplay,
  showDrawer,
  setDrawerForms,
  setEditItem,
}) => {
  const { character } = React.useContext(CharacterDataContext);
  const [search, setSearch] = React.useState("");
  const { equipment } = character;
  // Sort equipment by category
  const [equipmentItems, setEquipmentItems] = React.useState(
    [...equipment].sort((a, b) => a.category.localeCompare(b.category)),
  );
  const items = [
    {
      key: "1",
      label: "Equipment",
      children: (
        <ul className="m-0 list-none p-0 [&>li+li]:mt-4">
          {[...equipmentItems].map((item) => (
            <li key={item.name}>
              <EquipmentItemDescription
                item={item}
                setModalDisplay={setModalDisplay}
                showDrawer={showDrawer}
                setDrawerForms={setDrawerForms}
                setEditItem={setEditItem}
              />
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchClear = () => {
    setSearch("");
  };

  React.useEffect(() => {
    setEquipmentItems(
      equipment
        .filter((item) => item.name.toLowerCase().includes(search))
        .sort((a, b) => a.category.localeCompare(b.category)),
    );
  }, [search, equipment]);

  return (
    <Flex vertical gap={16} className={className}>
      <Flex gap={8}>
        <Input
          placeholder="Search equipment"
          value={search}
          className="mt-[1px]"
          onChange={handleSearchChange}
        />
        <Button type="primary" onClick={handleSearchClear}>
          Clear
        </Button>
      </Flex>
      <Collapse items={items} defaultActiveKey={["1"]} />
      <EquipmentItemDescription
        item={kickItem}
        setModalDisplay={setModalDisplay}
        showAttackButton
        hideEditButton
        hideAmount
      />

      <EquipmentItemDescription
        item={punchItem}
        setModalDisplay={setModalDisplay}
        showAttackButton
        hideEditButton
        hideAmount
      />
      {/* <Flex gap={16} vertical>
        <EquipmentItemDescription
          item={kickItem}
          showAttackButton
          setModalDisplay={setModalDisplay}
        />
        <EquipmentItemDescription
          item={punchItem}
          showAttackButton
          setModalDisplay={setModalDisplay}
        />
      </Flex>
      <CollapseEquipment onCharacterSheet setModalDisplay={setModalDisplay} /> */}
    </Flex>
  );
};

export default Equipment;
