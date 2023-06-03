import { Input, InputNumber } from "antd";
import { CharacterDetails } from "../types";

export default function HitPoints({
  character,
  setCharacter,
  className,
}: CharacterDetails) {
  return (
    <div className={className}>
      <InputNumber
        value={character.hp.points}
        min={0}
        max={character.hp.max}
        addonAfter={`Max: ${character.hp.max}`}
      />
      <Input.TextArea rows={4} placeholder="Wounds and Conditions" />
    </div>
  );
}
