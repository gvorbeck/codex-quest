import { CharacterDetails } from "../types";
import { List, Typography } from "antd";

export default function SpecialsRestrictions({
  character,
  className,
}: CharacterDetails) {
  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Special Abilities & Restrictions
      </Typography.Title>
      <List
        bordered
        dataSource={[
          ...character.specials.race,
          ...character.specials.class,
          ...character.restrictions.race,
          ...character.restrictions.class,
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>
  );
}
