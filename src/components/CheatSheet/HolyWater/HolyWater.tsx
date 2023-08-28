import { List } from "antd";

export default function HolyWater() {
  return (
    <>
      <List size="small" bordered>
        <List.Item>
          Can be thrown at corporeal undead; must be poured out onto incorporeal
          undead.
        </List.Item>
        <List.Item>Direct hit: 1d8 points of damage.</List.Item>
        <List.Item>
          Splash Hit: 1d6 points of damage within 5 feet of the point of impact.
        </List.Item>
        <List.Item>Effective for 1 round</List.Item>
      </List>
    </>
  );
}
