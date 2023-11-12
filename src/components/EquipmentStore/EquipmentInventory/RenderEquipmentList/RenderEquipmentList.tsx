import { List, Typography } from "antd";
import { classes } from "../../../../data/classes";
import { ClassNames, EquipmentItem } from "../../../../data/definitions";

export default function RenderEquipmentList({
  classNames,
}: {
  classNames: ClassNames[];
}) {
  return classNames.map(
    (classValue: ClassNames) =>
      classes[classValue].startingEquipment && (
        <List
          header={
            <Typography.Title level={3} className="m-0 text-shipGray">
              Included w/ {classValue}
            </Typography.Title>
          }
          bordered
          dataSource={classes[classValue].startingEquipment?.map(
            (item: EquipmentItem) => ({
              name: item.name,
              amount: item.amount,
            })
          )}
          renderItem={(item) => (
            <List.Item className="text-shipGray">
              <span>{item.name}</span>
              <span>x{item.amount}</span>
            </List.Item>
          )}
          size="small"
          key={classValue}
        />
      )
  );
}
