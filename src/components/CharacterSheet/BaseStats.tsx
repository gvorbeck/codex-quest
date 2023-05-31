import { CharacterDetails } from "../types";
import { Button, Tooltip, Typography } from "antd";
import { EditTwoTone } from "@ant-design/icons";

export default function BaseStats({
  character,
  setCharacter,
}: CharacterDetails) {
  console.log(character);
  return (
    <section>
      <Typography.Title level={1}>{character.name}</Typography.Title>
      <dl>
        <div>
          <dt>Level</dt>
          <dd>
            {character.level}
            <Tooltip title="edit">
              <Button type="ghost" shape="circle" icon={<EditTwoTone />} />
            </Tooltip>
          </dd>
        </div>
        <div>
          <dt>Race</dt>
          <dd>{character.race}</dd>
        </div>
        <div>
          <dt>Class</dt>
          <dd>{character.class}</dd>
        </div>
      </dl>
    </section>
  );
}
