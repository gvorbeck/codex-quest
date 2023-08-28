import { Collapse, Descriptions, Modal, Typography } from "antd";
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
        <Collapse.Panel header="Attack and Defense" key="7">
          <AttackDefense />
        </Collapse.Panel>
        <Collapse.Panel header="Attack Bonus / Penalty" key="8">
          <AttackBonus />
        </Collapse.Panel>
        <Collapse.Panel header="Brawling" key="16">
          <Brawling />
        </Collapse.Panel>
        <Collapse.Panel header="Charging" key="5">
          <Charging />
        </Collapse.Panel>
        <Collapse.Panel header="Combat Movement" key="3">
          <CombatMovement />
        </Collapse.Panel>
        <Collapse.Panel header="Combat Overview" key="2">
          <CombatOverview />
        </Collapse.Panel>
        <Collapse.Panel header="Damage" key="13">
          <Damage />
        </Collapse.Panel>
        <Collapse.Panel header="Holy Water Vs Undead" key="11">
          <HolyWater />
        </Collapse.Panel>
        <Collapse.Panel header="Magic-Users and Spells" key="17">
          <MagicUsersSpells />
        </Collapse.Panel>
        <Collapse.Panel header="Missile Fire" key="9">
          <MissileFire />
        </Collapse.Panel>
        <Collapse.Panel header="Missiles that Miss" key="12"></Collapse.Panel>
        <Collapse.Panel
          header="Oil Grenade-like Missiles"
          key="10"
        ></Collapse.Panel>
        <Collapse.Panel header="Running" key="4">
          <Typography.Paragraph>
            A running character is not normally allowed to attack (except
            Charging). Running characters can move at double their normal
            encounter movement rate for a maximum number of rounds equal to 2
            times the character's Constitution, after which they are exhausted
            and may only walk (at the normal encounter rate). For monsters
            without a given Constitution, allow the monster to run for 24
            rounds. Exhausted characters or creatures must rest for at least a
            turn before running again.
          </Typography.Paragraph>
        </Collapse.Panel>
        <Collapse.Panel header="Subduing Damage" key="14"></Collapse.Panel>
        <Collapse.Panel header="Surprise" key="1">
          <Typography.Paragraph>
            If applicable, the GM rolls a 1d6. Characters are usually surprised
            on a 1-2, or in the case of a well-prepared ambush on a 1-4.
            Deafened characters are surprised on a 1-3 and blinded characters on
            a 1-4. Elves are surprised on a 1 normally, 1-2 if deafened, and 1-3
            when blinded or in ambushes. Characters who are surprised cannot act
            in the first combat round, though they can defend themselves and so
            have normal AC.
          </Typography.Paragraph>
        </Collapse.Panel>
        <Collapse.Panel header="Typical Actions" key="6">
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Standard attack">
              Move (encounter movement distance) + melee or ranged attack
            </Descriptions.Item>
            <Descriptions.Item label="Run">
              Move (2 x encounter movement distance)
            </Descriptions.Item>
            <Descriptions.Item label="Charge*">
              Move (2 x encounter movement distance) + attack (+2 bonus)
            </Descriptions.Item>
            <Descriptions.Item label="Parting shot">
              Free attack (+2 bonus) vs. opponents turning from the fight
            </Descriptions.Item>
            <Descriptions.Item label="Fighting withdrawel">
              Move back (half normal walking movement) + melee attack
            </Descriptions.Item>
          </Descriptions>
          <Typography.Text type="secondary">
            * -2 penalty to Armor Class for the round
          </Typography.Text>
        </Collapse.Panel>
        <Collapse.Panel
          header="Wounds & Healing, Death & Dying"
          key="15"
        ></Collapse.Panel>
      </Collapse>
    </Modal>
  );
}
