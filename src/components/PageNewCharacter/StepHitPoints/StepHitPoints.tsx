import React from "react";
import { CharData, DiceTypes } from "@/data/definitions";
import {
  Button,
  Flex,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { rollDice } from "@/support/diceSupport";
import { getCharacterHitDiceFromClass } from "./StepHitPointsSupport";
import { useDeviceType } from "@/hooks/useDeviceType";

interface StepHitPointsProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const StepHitPoints: React.FC<
  StepHitPointsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const { isMobile } = useDeviceType();
  const [max, setMax] = React.useState<number>(character.hp.max || 0);
  const [useCustomDice, setUseCustomDice] = React.useState<boolean>(false);
  const [die, setDie] = React.useState<DiceTypes | undefined>(
    getCharacterHitDiceFromClass(character),
  );

  const handleButtonClick = () => {
    let roll =
      rollDice(die!) +
      parseInt(character.abilities.modifiers.constitution + "");
    roll = roll < 1 ? 1 : roll;
    setMax(roll);
  };
  const onRadioGroupChange = (e: RadioChangeEvent) => {
    setDie(e.target.value);
  };

  React.useEffect(() => {
    setCharacter({
      ...character,
      hp: { ...character.hp, max, points: max, dice: die! },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max, die]);

  React.useEffect(() => {
    const result = getCharacterHitDiceFromClass(character);
    if (result === undefined) {
      setUseCustomDice(true);
    } else {
      setDie(result);
    }
  }, [character]);
  return (
    <Flex vertical className={className} gap={16}>
      {useCustomDice && (
        <Radio.Group
          defaultValue={DiceTypes.D6}
          onChange={onRadioGroupChange}
          size={isMobile ? "small" : "middle"}
        >
          {Object.values(DiceTypes).map((die: string) => (
            <Radio.Button value={die}>{die}</Radio.Button>
          ))}
        </Radio.Group>
      )}
      <Space.Compact>
        <InputNumber value={max} />
        <Button onClick={handleButtonClick} disabled={!die}>
          Roll&nbsp;{character.level === 1 && "1"}
          {die}
          {character.abilities.modifiers.constitution}
        </Button>
      </Space.Compact>
    </Flex>
  );
};

export default StepHitPoints;
