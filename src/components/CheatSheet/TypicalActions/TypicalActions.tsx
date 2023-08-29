import { Descriptions, Typography } from "antd";

export default function TypicalActions() {
  return (
    <>
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
    </>
  );
}
