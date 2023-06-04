import { Input, InputNumber, Typography } from "antd";
import { CharacterDetails } from "../types";

export default function HitPoints({
  character,
  setCharacter,
  className,
}: CharacterDetails) {
  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Hit Points
      </Typography.Title>
      <InputNumber
        value={character.hp.points}
        min={0}
        max={character.hp.max}
        addonAfter={`Max: ${character.hp.max}`}
      />
      <Input.TextArea
        rows={4}
        placeholder="Wounds and Conditions"
        className="mt-4"
      />
    </div>
  );
}
