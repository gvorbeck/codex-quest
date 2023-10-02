import { Radio, RadioChangeEvent } from "antd";
import {
  CharacterData,
  DiceTypes,
  SetCharacterData,
} from "../../../../data/definitions";

type CustomHitPointsPickerProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customHitDice: string;
  setCustomHitDice: (customHitDice: string) => void;
};

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
