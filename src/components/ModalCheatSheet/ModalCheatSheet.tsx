import { Collapse, CollapseProps } from "antd";
import React from "react";
import AttackDefense from "./AttackDefense/AttackDefense";
import AttackBonus from "./AttackBonus/AttackBonus";
import Brawling from "./Brawling/Brawling";
import Charging from "./Charging/Charging";
import CombatMovement from "./CombatMovement/CombatMovement";
import CombatOverview from "./CombatOverview/CombatOverview";
import Damage from "./Damage/Damage";
import Survival from "./Survival/Survival";
import HolyWater from "./HolyWater/HolyWater";
import MagicUsersSpells from "./MagicUsersSpells/MagicUsersSpells";
import MissileFire from "./MissileFire/MissileFire";
import MissilesMiss from "./MissilesMiss/MissilesMiss";
import OilMissiles from "./OilMissiles/OilMissiles";
import Running from "./Running/Running";
import Subduing from "./Subduing/Subduing";
import Surprise from "./Surprise/Surprise";
import TypicalActions from "./TypicalActions/TypicalActions";
import Healing from "./Healing/Healing";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ModalCheatSheetProps {}

const ModalCheatSheet: React.FC<
  ModalCheatSheetProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
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
  return <Collapse items={items} className={className} accordion />;
};

export default ModalCheatSheet;
