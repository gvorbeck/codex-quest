import React from "react";
import { CharData } from "@/data/definitions";
import { Button, Flex, InputNumber, Space } from "antd";
import { classSplit, isStandardClass } from "@/support/classSupport";
import { rollDice } from "@/support/diceSupport";

interface StepHitPointsProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const StepHitPoints: React.FC<
  StepHitPointsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const [max, setMax] = React.useState<number>(character.hp.max || 0);

  const classArr = classSplit(character.class);

  const hasCustomClass = classArr.some(
    (className) => !isStandardClass(className),
  );
  const handleButtonClick = () => {
    let roll =
      rollDice(character.hp.dice) +
      parseInt(character.abilities.modifiers.constitution + "");
    roll = roll < 1 ? 1 : roll;
    setMax(roll);
  };

  React.useEffect(() => {
    setCharacter({
      ...character,
      hp: { ...character.hp, max, points: max },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max]);
  return (
    <Flex vertical className={className} gap={16}>
      {hasCustomClass ? (
        <div>hasCustomClass</div>
      ) : (
        <Space.Compact>
          <InputNumber value={max} />
          <Button onClick={handleButtonClick}>
            Roll&nbsp;{character.level === 1 && "1"}
            {character.hp.dice}
            {character.abilities.modifiers.constitution}
          </Button>
        </Space.Compact>
      )}
    </Flex>
  );
};

export default StepHitPoints;
