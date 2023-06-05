import { CharacterDetails } from "../types";
import { Avatar, Divider, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ExperiencePoints from "./ExperiencePoints";

export default function BaseStats({
  character,
  setCharacter,
}: CharacterDetails) {
  return (
    <div>
      <Space direction="horizontal" className="items-center mt-4">
        {character.avatar.length ? (
          <Avatar size={64} src={character.avatar} />
        ) : (
          <Avatar size={64} icon={<UserOutlined />} />
        )}
        <Typography.Title level={1} className="!mt-0 !mb-0 !text-shipGray ml-4">
          {character.name}
        </Typography.Title>
      </Space>
      <Divider className="mt-4 mb-4" />
      <Space direction="horizontal" className="flex justify-between">
        <ExperiencePoints character={character} setCharacter={setCharacter} />
        <dl className="flex m-0 justify-end text-lg">
          <div className="flex">
            <dt className="font-bold">Level</dt>
            <dd className="ml-2">{character.level}</dd>
          </div>
          <div className="flex ml-4">
            <dt className="font-bold">Race</dt>
            <dd className="ml-2">{character.race}</dd>
          </div>
          <div className="flex ml-4">
            <dt className="font-bold">Class</dt>
            <dd className="ml-2">{character.class} </dd>
          </div>
        </dl>
      </Space>
    </div>
  );
}
