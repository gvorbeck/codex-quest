import { DiceTypes } from "../../../definitions";
import { CustomHitPointsPickerProps } from "./definitions";
import { Radio, RadioChangeEvent } from "antd";

export default function CustomHitPointsPicker({
  characterData,
  setCharacterData,
  customHitDice,
  setCustomHitDice,
}: CustomHitPointsPickerProps) {
  const handleChangeCustomHitDice = (event: RadioChangeEvent) => {
    setCustomHitDice(event.target.value);
    setCharacterData({
      ...characterData,
      hp: {
        ...characterData.hp,
        dice: event.target.value,
      },
    });
  };

  return (
    <Radio.Group
      value={customHitDice}
      onChange={handleChangeCustomHitDice}
      buttonStyle="solid"
      className="block mb-4"
    >
      {Object.values(DiceTypes).map((die) => (
        <Radio.Button key={die} value={die}>
          {die}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
