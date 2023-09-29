import { Button, Collapse, Typography } from "antd";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import { EquipmentInfoProps } from "./definitions";
import Spells from "./Spells/Spells";
import EquipmentList from "./EquipmentList/EquipmentList";
import { EquipmentItem } from "../../EquipmentStore/definitions";
import {
  AppstoreAddOutlined,
  ExperimentOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { EquipmentCategories } from "../../../data/definitions";

export default function EquipmentInfo({
  userIsOwner,
  showAddEquipmentModal,
  showAddCustomEquipmentModal,
  characterData,
  setCharacterData,
  handleCustomDelete,
  setWeapon,
  showAttackModal,
  updateAC,
  className,
  collapseItems,
}: EquipmentInfoProps & React.ComponentPropsWithRef<"div">) {
  const equipmentListCategories = {
    weapons: [
      "weapons",
      "brawling",
      EquipmentCategories.AXES,
      EquipmentCategories.BOWS,
      EquipmentCategories.DAGGERS,
      EquipmentCategories.SWORDS,
      EquipmentCategories.HAMMERMACE,
      EquipmentCategories.IMPROVISED,
      EquipmentCategories.CHAINFLAIL,
      EquipmentCategories.OTHERWEAPONS,
      EquipmentCategories.SLINGHURLED,
      EquipmentCategories.SPEARSPOLES,
    ],
    general: [EquipmentCategories.GENERAL, "items"],
    armor: [EquipmentCategories.ARMOR, "armor-and-shields"],
    shields: [EquipmentCategories.SHIELDS, "armor-and-shields"],
    beasts: [EquipmentCategories.BEASTS, EquipmentCategories.BARDING],
    ammo: [EquipmentCategories.AMMUNITION],
  };

  const handleAttackClick = (item: EquipmentItem) => {
    if (setWeapon) {
      setWeapon(item);
    }
    if (showAttackModal) {
      showAttackModal();
    }
  };

  return (
    <div className={className}>
      <div className="flex items-baseline gap-4">
        <Typography.Title level={3} className="mt-0 text-shipGray">
          Equipment
        </Typography.Title>
        <HelpTooltip text="Adding & removing equipment will automatically modify your gold balance." />
      </div>
      <div className="print:hidden flex flex-wrap gap-4">
        <Button
          type="primary"
          disabled={!userIsOwner}
          onClick={showAddEquipmentModal}
          icon={<ToolOutlined />}
        >
          Add/Edit Equipment
        </Button>
        <Button
          type="primary"
          disabled={!userIsOwner}
          onClick={showAddCustomEquipmentModal}
          icon={<ExperimentOutlined />}
        >
          Add Custom Equipment
        </Button>
      </div>
      <div className="hidden print:block">
        {characterData.equipment.map((item) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
      <Collapse
        items={collapseItems}
        className="bg-seaBuckthorn mt-4 print:hidden"
      />
      {/* SPELLS */}
      {/* {characterData.spells.length > 0 && (
          <Collapse.Panel
            header="Spells"
            key="spells"
            className="[&>div:not(:first)]:bg-springWood"
          >
            <Spells characterData={characterData} />
          </Collapse.Panel>
        )} */}
      {/* WEAPONS */}
      {/* <Collapse.Panel
          header="Weapons"
          key="weapons"
          className="[&>div:not:first-child]:bg-springWood"
        >
          <EquipmentList
            characterData={characterData}
            setCharacterData={setCharacterData}
            categories={equipmentListCategories.weapons}
            handleCustomDelete={handleCustomDelete}
            handleAttackClick={handleAttackClick}
            handleAttack
          />
        </Collapse.Panel> */}
      {/* GENERAL EQUIPMENT */}
      {/* <Collapse.Panel
          header="General Equipment"
          key="general-equipment"
          className="[&>div:not:first-child]:bg-springWood"
        >
          <EquipmentList
            characterData={characterData}
            categories={equipmentListCategories.general}
            setCharacterData={setCharacterData}
            handleCustomDelete={handleCustomDelete}
          />
        </Collapse.Panel> */}
      {/* ARMOR */}
      {/* 'armor-and-shields' was an old category that included armor AND shields. Keep for legacy characters. */}
      {/* <Collapse.Panel
          header="Armor"
          key="armor"
          className="[&>div:not:first-child]:bg-springWood"
        >
          <EquipmentList
            characterData={characterData}
            categories={equipmentListCategories.armor}
            setCharacterData={setCharacterData}
            handleCustomDelete={handleCustomDelete}
            updateAC={updateAC}
          />
        </Collapse.Panel> */}
      {/* SHIELDS */}
      {/* <Collapse.Panel
          header="Shields"
          key="shields"
          className="[&>div:not:first-child]:bg-springWood"
        >
          <EquipmentList
            characterData={characterData}
            categories={equipmentListCategories.shields}
            setCharacterData={setCharacterData}
            handleCustomDelete={handleCustomDelete}
            updateAC={updateAC}
          />
        </Collapse.Panel> */}
      {/* BEAST OF BURDEN */}
      {/* <Collapse.Panel
          header="Beasts of Burden"
          key="beasts-of-burden"
          className="[&>div:not:first-child]:bg-springWood"
        >
          <EquipmentList
            characterData={characterData}
            categories={equipmentListCategories.beasts}
            setCharacterData={setCharacterData}
            handleCustomDelete={handleCustomDelete}
          />
        </Collapse.Panel> */}
      {/* Ammunition */}
      {/* <Collapse.Panel
          header="Ammunition"
          key="ammunition"
          className="[&>div:not:first-child]:bg-springWood"
        >
          <EquipmentList
            characterData={characterData}
            categories={equipmentListCategories.ammo}
            setCharacterData={setCharacterData}
            handleCustomDelete={handleCustomDelete}
          />
        </Collapse.Panel> */}
      {/* </Collapse> */}
    </div>
  );
}
