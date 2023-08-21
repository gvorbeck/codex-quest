import { Avatar, Descriptions, Divider, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ExperiencePoints from "./ExperiencePoints/ExperiencePoints";
import { BaseStatsProps } from "./definitions";

export default function BaseStats({
  characterData,
  setCharacterData,
  userIsOwner,
  showLevelUpModal,
}: BaseStatsProps) {
  return (
    <div>
      <div className="flex flex-col items-center mt-4 md:flex-row">
        {characterData.avatar.length ? (
          <Avatar
            size={64}
            src={characterData.avatar}
            alt={characterData.name}
            className="print:grayscale shadow-md"
          />
        ) : (
          <Avatar
            size={64}
            icon={<UserOutlined />}
            alt={characterData.name}
            className="print:hidden shadow-md"
          />
        )}
        <Typography.Title
          level={2}
          className="!mt-0 !mb-0 !text-shipGray ml-4 text-center"
        >
          {characterData.name}
        </Typography.Title>
      </div>
      <Divider className="mt-4 mb-4" />
      <div className="flex flex-col justify-between md:flex-row print:flex-row print:items-baseline">
        <ExperiencePoints
          character={characterData}
          setCharacter={setCharacterData}
          userIsOwner={userIsOwner}
          showLevelUpModal={showLevelUpModal}
          className="text-lg print:w-1/2 print:float-left"
        />
        <Descriptions
          bordered
          size="small"
          className="[&_th]:leading-none [&_td]:leading-none mt-4 md:mt-0 [&_td]:px-3 [&_th]:px-2 print:w-1/2"
        >
          <Descriptions.Item label="Level">
            {characterData.level}
          </Descriptions.Item>
          <Descriptions.Item label="Race">
            {characterData.race}
          </Descriptions.Item>
          <Descriptions.Item label="Class">
            {characterData.class}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
}
