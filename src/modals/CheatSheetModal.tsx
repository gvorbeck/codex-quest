import { Collapse, Modal } from "antd";
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
  return (
    <Modal
      title="CHEAT SHEET"
      open={isCheatSheetModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<CloseIcon />}
    >
      <Collapse className="bg-seaBuckthorn mt-4" accordion>
        <Collapse.Panel header="Attack and Defense" key="1">
          <AttackDefense />
        </Collapse.Panel>
        <Collapse.Panel header="Attack Bonus / Penalty" key="2">
          <AttackBonus />
        </Collapse.Panel>
        <Collapse.Panel header="Brawling" key="3">
          <Brawling />
        </Collapse.Panel>
        <Collapse.Panel header="Charging" key="4">
          <Charging />
        </Collapse.Panel>
        <Collapse.Panel header="Combat Movement" key="5">
          <CombatMovement />
        </Collapse.Panel>
        <Collapse.Panel header="Combat Overview" key="6">
          <CombatOverview />
        </Collapse.Panel>
        <Collapse.Panel header="Damage" key="7">
          <Damage />
        </Collapse.Panel>
        <Collapse.Panel header="Day to Day Survival" key="8">
          <Survival />
        </Collapse.Panel>
        <Collapse.Panel header="Holy Water Vs Undead" key="9">
          <HolyWater />
        </Collapse.Panel>
        <Collapse.Panel header="Magic-Users and Spells" key="10">
          <MagicUsersSpells />
        </Collapse.Panel>
        <Collapse.Panel header="Missile Fire" key="11">
          <MissileFire />
        </Collapse.Panel>
        <Collapse.Panel header="Missiles that Miss" key="12">
          <MissilesMiss />
        </Collapse.Panel>
        <Collapse.Panel header="Oil Grenade-like Missiles" key="13">
          <OilMissiles />
        </Collapse.Panel>
        <Collapse.Panel header="Running" key="14">
          <Running />
        </Collapse.Panel>
        <Collapse.Panel header="Subduing Damage" key="15">
          <Subduing />
        </Collapse.Panel>
        <Collapse.Panel header="Surprise" key="16">
          <Surprise />
        </Collapse.Panel>
        <Collapse.Panel header="Typical Actions" key="17">
          <TypicalActions />
        </Collapse.Panel>
        <Collapse.Panel header="Wounds & Healing, Death & Dying" key="18">
          <Healing />
        </Collapse.Panel>
      </Collapse>
    </Modal>
  );
}
