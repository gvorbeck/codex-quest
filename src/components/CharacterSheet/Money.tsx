import { InputNumber, Space, Typography } from "antd";
import { CharacterDetails } from "../types";

export default function Money({
  character,
  setCharacter,
  userIsOwner,
}: CharacterDetails) {
  function makeChange() {
    // Convert gold to copper
    let copper = character.gold * 100;

    // Calculate the number of gold pieces
    let goldPieces = Math.floor(copper / 100);
    copper %= 100;

    // Calculate the number of silver pieces
    let silverPieces = Math.floor(copper / 10);
    copper %= 10;

    // The remaining copper is the number of copper pieces
    let copperPieces = copper;

    return {
      gp: goldPieces,
      sp: silverPieces,
      cp: copperPieces,
    };
  }

  return (
    <div>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Money
      </Typography.Title>
      <Space direction="vertical">
        {Object.entries(makeChange()).map(([key, value]) => (
          <InputNumber
            key={key}
            min={0}
            value={value}
            addonAfter={key}
            disabled={!userIsOwner}
          />
        ))}
      </Space>
    </div>
  );
}
