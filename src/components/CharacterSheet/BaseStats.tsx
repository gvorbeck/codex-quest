import { CharacterDetails } from "../types";
import { Divider, Typography } from "antd";

export default function BaseStats({ character }: CharacterDetails) {
  return (
    <>
      <div className="flex justify-between items-baseline">
        <Typography.Title level={1} className="!mb-2 !mt-6 !text-shipGray">
          {character.name}
        </Typography.Title>
        <dl className="flex m-0">
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
      </div>
      <Divider className="!m-0" />
    </>
  );
}
