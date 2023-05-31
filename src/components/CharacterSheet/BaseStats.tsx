import { CharacterSheetProps } from "../types";
import { Typography } from "antd";

export default function BaseStats({
  character,
  setCharacter,
}: CharacterSheetProps) {
  console.log(character);
  return (
    <section>
      <Typography.Title level={1}>{character.name}</Typography.Title>

      {/* < */}
    </section>
  );
}
