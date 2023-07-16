import { List, Typography } from "antd";
import { SpecialsRestrictionsProps } from "./definitions";

export default function SpecialsRestrictions({
  characterData,
  className,
}: SpecialsRestrictionsProps) {
  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Special Abilities & Restrictions
      </Typography.Title>
      <List
        bordered
        dataSource={[
          ...characterData.specials.race,
          ...characterData.specials.class,
          ...characterData.restrictions.race,
          ...characterData.restrictions.class,
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        className="print:border-0"
      />
    </div>
  );
}
