import { InputNumber } from "antd";
import { CharacterDetails } from "../types";

export default function Money({ character, setCharacter }: CharacterDetails) {
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
      {Object.entries(makeChange()).map(([key, value]) => (
        <InputNumber key={key} min={0} value={value} addonAfter={key} />
      ))}
    </div>
  );
}
