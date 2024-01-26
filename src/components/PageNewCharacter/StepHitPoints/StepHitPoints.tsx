import React from "react";
import { CharData, DiceTypes } from "@/data/definitions";
import { Button, Flex, InputNumber, Select, SelectProps, Space } from "antd";
import { rollDice } from "@/support/diceSupport";
import { getCharacterHitDiceFromClass } from "./StepHitPointsSupport";

interface StepHitPointsProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const StepHitPoints: React.FC<
  StepHitPointsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const [max, setMax] = React.useState<number>(character.hp.max || 0);
  const [useCustomDice, setUseCustomDice] = React.useState<boolean>(false);
  const [die, setDie] = React.useState<DiceTypes | undefined>(
    getCharacterHitDiceFromClass(character) || (character.hp.dice as DiceTypes),
  );

  const options: SelectProps["options"] = Object.values(DiceTypes).map(
    (die: string) => ({ label: die, value: die }),
  );

  const handleButtonClick = () => {
    let roll =
      rollDice(die!) +
      parseInt(character.abilities.modifiers.constitution + "");
    roll = roll < 1 ? 1 : roll;
    setMax(roll);
  };
  const handleInputChange = (value: number | null) => {
    if (value) setMax(value);
  };
  const onSelectChange = (value: DiceTypes) => {
    setDie(value);
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
        <Select options={options} onChange={onSelectChange} value={die} />
      )}
      <Space.Compact>
        <InputNumber value={max} onChange={handleInputChange} />
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
