import { List } from "antd";
import { CharacterDetails } from "../types";

export default function Spells({ character, setCharacter }: CharacterDetails) {
  return (
    <List
      header={"Spells"}
      bordered
      dataSource={character.spells}
      renderItem={(item) => <List.Item>{item.name}</List.Item>}
    />
  );
}
