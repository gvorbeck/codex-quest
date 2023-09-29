import { Collapse, CollapseProps, Modal } from "antd";
import { CheatSheetModalProps } from "./definitions";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import AttackDefense from "../components/CheatSheet/AttackDefense/AttackDefense";
import AttackBonus from "../components/CheatSheet/AttackBonus/AttackBonus";
import Brawling from "../components/CheatSheet/Brawling/Brawling";
import Charging from "../components/CheatSheet/Charging/Charging";
import CombatMovement from "../components/CheatSheet/CombatMovement/CombatMovement";
import CombatOverview from "../components/CheatSheet/CombatOverview/CombatOverview";
import Damage from "../components/CheatSheet/Damage/Damage";
import HolyWater from "../components/CheatSheet/HolyWater/HolyWater";
import MagicUsersSpells from "../components/CheatSheet/MagicUsersSpells/MagicUsersSpells";
import MissileFire from "../components/CheatSheet/MissileFire/MissileFire";
import MissilesMiss from "../components/CheatSheet/MissilesMiss/MissilesMiss";
import OilMissiles from "../components/CheatSheet/OilMissiles/OilMissiles";
import Running from "../components/CheatSheet/Running/Running";
import Subduing from "../components/CheatSheet/Subduing/Subduing";
import Surprise from "../components/CheatSheet/Surprise/Surprise";
import TypicalActions from "../components/CheatSheet/TypicalActions/TypicalActions";
import Survival from "../components/CheatSheet/Survival/Survival";
import Healing from "../components/CheatSheet/Healing/Healing";

export default function CheatSheetModal({
  isCheatSheetModalOpen,
  handleCancel,
}: CheatSheetModalProps) {
  const items: CollapseProps["items"] = [
    { key: "1", label: "Attack and Defense", children: <AttackDefense /> },
    { key: "2", label: "Attack Bonus / Penalty", children: <AttackBonus /> },
    { key: "3", label: "Brawling", children: <Brawling /> },
    { key: "4", label: "Charging", children: <Charging /> },
    { key: "5", label: "Combat Movement", children: <CombatMovement /> },
    { key: "6", label: "Combat Overview", children: <CombatOverview /> },
    { key: "7", label: "Damage", children: <Damage /> },
    { key: "8", label: "Day to Day Survival", children: <Survival /> },
    { key: "9", label: "Holy Water Vs Undead", children: <HolyWater /> },
    {
      key: "10",
      label: "Magic-Users and Spells",
      children: <MagicUsersSpells />,
    },
    { key: "11", label: "Missile Fire", children: <MissileFire /> },
    { key: "12", label: "Missiles that Miss", children: <MissilesMiss /> },
    {
      key: "13",
      label: "Oil Grenade-like Missiles",
      children: <OilMissiles />,
    },
    { key: "14", label: "Running", children: <Running /> },
    { key: "15", label: "Subduing Damage", children: <Subduing /> },
    { key: "16", label: "Surprise", children: <Surprise /> },
    { key: "17", label: "Typical Actions", children: <TypicalActions /> },
    {
      key: "18",
      label: "Wounds & Healing, Death & Dying",
      children: <Healing />,
    },
  ];
  return (
    <Modal
      title="CHEAT SHEET"
      open={isCheatSheetModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<CloseIcon />}
      width={800}
    >
      <Collapse items={items} className="bg-seaBuckthorn mt-4" accordion />
    </Modal>
  );
}
