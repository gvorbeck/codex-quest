import { Button, Collapse, Typography } from "antd";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import { EquipmentInfoProps } from "./definitions";
import Spells from "./Spells/Spells";
import EquipmentList from "./EquipmentList/EquipmentList";
import { EquipmentItem } from "../../EquipmentStore/definitions";

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
}: EquipmentInfoProps & React.ComponentPropsWithRef<"div">) {
  const equipmentListCategories = {
    weapons: [
      "weapons",
      "axes",
      "bows",
      "daggers",
      "swords",
      "hammers-and-maces",
      "improvised-weapons",
      "brawling",
      "chain-and-flail",
      "hammers-and-maces",
      "other-weapons",
      "slings-and-hurled-weapons",
      "spears-and-polearms",
    ],
    general: ["general-equipment", "items"],
    armor: ["armor", "armor-and-shields"],
    shields: ["shields", "armor-and-shields"],
    beasts: ["beasts-of-burden", "barding"],
    ammo: ["ammunition"],
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
        >
          Add/Edit Equipment
        </Button>
        <Button
          type="primary"
          disabled={!userIsOwner}
          onClick={showAddCustomEquipmentModal}
        >
          Add Custom Equipment
        </Button>
      </div>
      <div className="hidden print:block">
        {characterData.equipment.map((item) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
      <Collapse className="bg-seaBuckthorn mt-4 print:hidden">
        {/* SPELLS */}
        {characterData.spells.length > 0 && (
          <Collapse.Panel
            header="Spells"
            key="spells"
            className="[&>div:not(:first)]:bg-springWood"
          >
            <Spells characterData={characterData} />
          </Collapse.Panel>
        )}
        {/* WEAPONS */}
        <Collapse.Panel
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
        </Collapse.Panel>
        {/* GENERAL EQUIPMENT */}
        <Collapse.Panel
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
        </Collapse.Panel>
        {/* ARMOR */}
        {/* 'armor-and-shields' was an old category that included armor AND shields. Keep for legacy characters. */}
        <Collapse.Panel
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
        </Collapse.Panel>
        {/* SHIELDS */}
        <Collapse.Panel
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
        </Collapse.Panel>
        {/* BEAST OF BURDEN */}
        <Collapse.Panel
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
        </Collapse.Panel>
        {/* Ammunition */}
        <Collapse.Panel
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
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
