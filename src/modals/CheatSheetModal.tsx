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
      <Typography.Title level={3}>Combat</Typography.Title>
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
      </Collapse>
      <Typography.Title level={4}>Combat cycle</Typography.Title>
    </Modal>
  );
}
