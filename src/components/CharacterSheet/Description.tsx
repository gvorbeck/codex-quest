import { CharacterDetails } from "../types";
import { Input, Typography } from "antd";

export default function Description({
  character,
  setCharacter,
}: CharacterDetails) {
  return (
    <div>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Bio & Notes
      </Typography.Title>
      <Input.TextArea
        rows={4}
        placeholder={`Write anything and everything about ${character.name}`}
      />
    </div>
  );
}
