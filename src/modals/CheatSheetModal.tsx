import { Collapse, Descriptions, List, Modal, Table, Typography } from "antd";
import { CheatSheetModalProps } from "./definitions";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import AttackDefense from "../components/CheatSheet/AttackDefense/AttackDefense";
import AttackBonus from "../components/CheatSheet/AttackBonus/AttackBonus";
import Brawling from "../components/CheatSheet/Brawling/Brawling";

export default function CheatSheetModal({
  isCheatSheetModalOpen,
  handleCancel,
}: CheatSheetModalProps) {
  const missileFireDataSource: {
    key: number;
    distance: string;
    ab: string;
  }[] = [];
  const missileFireColumns = [
    { title: "Target distance", dataIndex: "distance", key: "distance" },
    { title: "Attack bonus/penalty", dataIndex: "ab", key: "ab" },
  ];
  [
    { distance: "5' or less", ab: "-5*" },
    { distance: "Up to short range ", ab: "+1" },
    { distance: "Up to medium range", ab: "+0" },
    { distance: "Up to long range", ab: "-2" },
    { distance: "Beyond long range", ab: "Cannot be attacked" },
  ].forEach((item, index) => {
    missileFireDataSource.push({
      key: index + 1,
      distance: item.distance,
      ab: item.ab,
    });
  });

  const coverDataSource: {
    key: number;
    percent: string;
    covered: string;
    concealed: string;
  }[] = [];
  const coverColumns = [
    { title: "Percent", dataIndex: "percent", key: "percent" },
    { title: "Covered", dataIndex: "covered", key: "covered" },
    { title: "Concealed", dataIndex: "concealed", key: "concealed" },
  ];
  [
    { percent: "25%", covered: "-2", concealed: "-1" },
    { percent: "50%", covered: "-4", concealed: "-2" },
    { percent: "75%", covered: "-6", concealed: "-3" },
    { percent: "90%", covered: "-8", concealed: "-4" },
  ].forEach((item, index) => {
    coverDataSource.push({
      key: index + 1,
      percent: item.percent,
      covered: item.covered,
      concealed: item.concealed,
    });
  });

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
          <Typography.Paragraph>
            In some cases, characters or creatures can attack after a running
            move, known as a charge. The charger must move at least 10 feet, up
            to double their normal rate, in a straight line toward the target.
            The path must be clear, and the attacker should use a weapon like a
            spear, lance, or polearm suitable for charging. Monsters with horns
            can use natural attacks. If the attacker lacks line of sight at the
            start, the opponent can't be charged.
          </Typography.Paragraph>
          <Typography.Paragraph>
            The post-charge attack gets a +2 on the attack roll, but the charger
            takes a -2 penalty to Armor Class for the round. If the attack hits,
            it deals double damage.
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Set Weapon Against Charge</strong>: Spears, pole arms, and
            certain other piercing weapons deal double damage when “set” (braced
            against the ground or floor) and used against a charging creature.
            For this to be done, the character or creature being charged must
            have equal or better Initiative; this counts as holding an action:
            both attacker and defender act on the attacker's Initiative number
            and are therefore simultaneous.
          </Typography.Paragraph>
        </Collapse.Panel>
        <Collapse.Panel header="Combat Movement" key="3">
          <Typography.Paragraph>
            When opponents are over 5' apart, they move freely. Within 5',
            they're "engaged" and follow Defensive Movement rules. Sometimes,
            they may not know they're engaged, like during a sneak attack.
          </Typography.Paragraph>
          <Typography.Paragraph>
            To evade, treat evasion and pursuit as combat actions. No mapping
            while fleeing. Navigating obstacles may require a saving throw vs.
            Death Ray. Failing means falling and pausing until the next round.
          </Typography.Paragraph>
          <Typography.Paragraph>
            If pursuers get within 5', melee combat starts. Fleeing characters
            risk "parting shots." If they escape the pursuer's sight for a full
            round, they've evaded.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Turning your back on an adjacent, armed opponent allows them a
            "parting shot" with a +2 attack bonus. You can also back away at
            half speed while fighting, known as a fighting withdrawal. You still
            move first.
          </Typography.Paragraph>
        </Collapse.Panel>
        <Collapse.Panel header="Combat Overview" key="2">
          <List
            size="small"
            dataSource={[
              "Check for Surprise (GM)",
              "Check monster reaction (GM)",
              "Combat cycle",
            ]}
            renderItem={(item, index) => (
              <List.Item>
                {index + 1}. {item}
              </List.Item>
            )}
          />
          <Typography.Title level={4}>Combat Cycle</Typography.Title>
          <Typography.Paragraph>
            <strong>Roll Initiative</strong>. Roll 1d6 and add any bonuses or
            penalties, including DEX bonus, -1 if deafened, and -2 if blinded.
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Act in descending initiative order</strong>. Characters who
            have the same initiative number act simultaneously. A character can
            delay their action until another character acts, acting
            simultaneously with them.
          </Typography.Paragraph>
          <Typography.Paragraph>
            On their turn, individuals may move and then attack (in that order),
            just move, or just attack. An attack ends the character's turn. In
            combat, casting a spell usually takes the same time as making an
            attack. If a spellcaster is attacked on the Initiative number on
            which they are casting a spell, the spell is spoiled and lost.
          </Typography.Paragraph>
        </Collapse.Panel>
        <Collapse.Panel header="Damage" key="13">
          <Typography.Paragraph>
            If an attack hits, the attacker rolls damage as given for the
            weapon. Melee attacks apply the Strength bonus or penalty to the
            damage dice, as do thrown missile weapons such as daggers or spears.
            Usually, attacks with bows or crossbows do not gain the Strength
            bonus, but sling bullets or stones do.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Also, magic weapons will add their bonuses to damage (and cursed
            weapons will apply their penalty). Note that, regardless of any
            penalties to damage, any successful hit will do at least one point
            of damage. As explained elsewhere, a creature or character reduced
            to 0 hit points is dead.
          </Typography.Paragraph>
        </Collapse.Panel>
        <Collapse.Panel header="Holy Water Vs Undead" key="11">
          <List size="small" bordered>
            <List.Item>
              Can be thrown at corporeal undead; must be poured out onto
              incorporeal undead.
            </List.Item>
            <List.Item>Direct hit: 1d8 points of damage.</List.Item>
            <List.Item>
              Splash Hit: 1d6 points of damage within 5 feet of the point of
              impact.
            </List.Item>
            <List.Item>Effective for 1 round</List.Item>
          </List>
        </Collapse.Panel>
        <Collapse.Panel header="Magic-Users and Spells" key="17">
          <Typography.Paragraph>
            Magic-Users may learn spells by being taught directly by another
            Magic-User, or by studying another MagicUser's spellbook. If being
            taught, a spell can be learned in a single day; researching another
            Magic-User's spellbook takes one day per spell level. Either way,
            the spell learned must be transcribed into the Magic-User's own
            spellbook, at a cost of 500 gp per spell level transcribed. A
            beginning Magic-User starts with a spellbook containing read magic
            and at least one other first-level spell, as determined by the GM,
            at no cost.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Each day, usually in the morning, Magic-Users must study their
            spellbooks to prepare spells to replace those they have used. Spells
            prepared but not used persist from day to day; only those actually
            cast must be replaced. A spellcaster may always choose to dismiss a
            prepared spell (without casting it) in order to prepare a different
            spell of that level.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Spellcasters must have at least one hand free, and be able to speak,
            in order to cast spells; thus, binding and gagging a spellcaster is
            an effective means of preventing them from casting spells. In
            combat, casting a spell usually takes the same time as making an
            attack. If a spell caster is attacked (even if not hit) or must make
            a saving throw (whether successful or not) on the Initiative number
            on which they are casting a spell, the spell is spoiled and lost. As
            a specific exception, two spell casters releasing their spells at
            each other on the same Initiative number will both succeed in their
            casting; one caster may disrupt another with a spell only if they
            have a better Initiative, and chooses to delay casting the spell
            until right before the other caster.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Some spells are reversible; such spells are shown with an asterisk
            (*) after the name.
          </Typography.Paragraph>
        </Collapse.Panel>
        <Collapse.Panel header="Missile Fire" key="9">
          <Table
            dataSource={missileFireDataSource}
            columns={missileFireColumns}
            pagination={false}
          />
          <Typography.Text type="secondary">
            * If the attacker is behind the target creature and undetected, or
            that creature is distracted apply +1 bonus (+3 total bonus if
            attacking from behind)
          </Typography.Text>
          <Typography.Title level={5}>
            Cover and Concealment Penalty
          </Typography.Title>
          <Table
            dataSource={coverDataSource}
            columns={coverColumns}
            pagination={false}
          />
          {/* HERE */}
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
