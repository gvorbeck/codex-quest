import { Collapse, List, Modal, Typography } from "antd";
import { CheatSheetModalProps } from "./definitions";
import CloseIcon from "../components/CloseIcon/CloseIcon";

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
      </Collapse>
    </Modal>
  );
}
