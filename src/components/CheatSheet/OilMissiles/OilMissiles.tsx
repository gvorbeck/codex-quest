import { List } from "antd";

export default function OilMissiles() {
  return (
    <List size="small" bordered>
      <List.Item>
        Direct hit: 1d8 points of fire damage, plus in the next round an
        additional 1d8 points of damage, unless the character spends the round
        extinguishing the flames.
      </List.Item>
      <List.Item>
        Splash Hit: 1d6 points of fire damage within 5 feet of the point of
        impact. A save vs. Death Ray is allowed to avoid this damage.
      </List.Item>
      <List.Item>
        A burning puddle of oil is effective for 10 rounds. Those attempting to
        cross the burning oil will receive 1d6 points of fire damage each round
        they are in it.
      </List.Item>
    </List>
  );
}
