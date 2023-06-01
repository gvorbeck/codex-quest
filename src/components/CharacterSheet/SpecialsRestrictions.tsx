import { CharacterDetails } from "../types";
import { List } from "antd";

export default function SpecialsRestrictions({
  character,
  setCharacter,
}: CharacterDetails) {
  return (
    <List
      header={"Special Abilities & Restrictions"}
      bordered
      dataSource={[
        ...character.specials.race,
        ...character.specials.class,
        ...character.restrictions.race,
        ...character.restrictions.class,
      ]}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
}
