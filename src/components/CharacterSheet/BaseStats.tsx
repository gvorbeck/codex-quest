import { CharacterDetails } from "../types";
import { Avatar, Divider, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ExperiencePoints from "./ExperiencePoints";

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
          <Avatar size={64} src={character.avatar} />
        ) : (
          <Avatar size={64} icon={<UserOutlined />} />
        )}
        <Typography.Title level={1} className="!mt-0 !mb-0 !text-shipGray ml-4">
          {character.name}
        </Typography.Title>
      </div>
      <Divider className="mt-4 mb-4" />
      <div className="flex flex-col justify-between md:flex-row">
        <ExperiencePoints
          character={character}
          setCharacter={setCharacter}
          userIsOwner={userIsOwner}
          showLevelUpModal={showLevelUpModal}
          className="text-lg"
        />
        <dl className="flex m-0 justify-end text-base mt-2">
          <div className="flex">
            <dt className="font-bold">Level</dt>
            <dd className="m-0 pl-1">{character.level}</dd>
          </div>
          <div className="flex pl-2">
            <dt className="font-bold">Race</dt>
            <dd className="m-0 pl-1">{character.race}</dd>
          </div>
          <div className="flex pl-2">
            <dt className="font-bold">Class</dt>
            <dd className="m-0 pl-1">{character.class} </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
