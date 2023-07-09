import { CharacterDetails } from "../types";
import { Avatar, Descriptions, Divider, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ExperiencePoints from "./ExperiencePoints/ExperiencePoints";

export default function BaseStats({
  character,
  setCharacter,
  userIsOwner,
  showLevelUpModal,
}: CharacterDetails) {
  return (
    <div>
      <div className="flex flex-col items-center mt-4 md:flex-row">
        {character.avatar.length ? (
          <Avatar
            size={64}
            src={character.avatar}
            alt={character.name}
            className="print:grayscale"
          />
        ) : (
          <Avatar
            size={64}
            icon={<UserOutlined />}
            alt={character.name}
            className="print:grayscale"
          />
        )}
        <Typography.Title
          level={1}
          className="!mt-0 !mb-0 !text-shipGray ml-4 text-center"
        >
          {character.name}
        </Typography.Title>
      </div>
      <Divider className="mt-4 mb-4" />
      <div className="flex flex-col justify-between md:flex-row print:block">
        <ExperiencePoints
          character={character}
          setCharacter={setCharacter}
          userIsOwner={userIsOwner}
          showLevelUpModal={showLevelUpModal}
          className="text-lg print:w-1/2 print:float-left"
        />
        <Descriptions
          bordered
          size="small"
          className="[&_th]:leading-none [&_td]:leading-none mt-4 sm:mt-0 [&_td]:px-3 [&_th]:px-2"
        >
          <Descriptions.Item label="Level" span={1}>
            {character.level}
          </Descriptions.Item>
          <Descriptions.Item label="Race" span={1}>
            {character.race}
          </Descriptions.Item>
          <Descriptions.Item label="Class" span={1}>
            {character.class}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
}
