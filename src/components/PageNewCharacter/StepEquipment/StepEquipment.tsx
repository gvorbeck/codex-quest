import EquipmentStore from "@/components/EquipmentStore/EquipmentStore";
import { CharData, UpdateCharAction } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Button, Flex, FloatButton, InputNumber, Space } from "antd";
import CharacterInventory from "./CharacterInventory/CharacterInventory";
import { rollDice } from "@/support/diceSupport";

interface StepEquipmentProps {
  character: CharData;
  characterDispatch: React.Dispatch<UpdateCharAction>;
  hideDiceButton?: boolean;
  hideInventory?: boolean;
  hideFloatButton?: boolean;
}

const StepEquipment: React.FC<
  StepEquipmentProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  characterDispatch,
  hideDiceButton,
  hideInventory,
  hideFloatButton,
}) => {
  const { isMobile } = useDeviceType();

  function handleRollGoldClick() {
    characterDispatch({
      type: "UPDATE",
      payload: {
        gold: rollDice("3d6*10"),
      },
    });
  }

  function handleGoldInputChange(value: number | null) {
    characterDispatch({
      type: "UPDATE",
      payload: {
        gold: value || 0,
      },
    });
  }
  return (
    <Flex vertical gap={16} className={className}>
      {!hideDiceButton && (
        <Space.Compact>
          <InputNumber
            className="pb-0.5"
            value={character.gold}
            onChange={handleGoldInputChange}
          />
          <Button type="primary" onClick={handleRollGoldClick}>
            Roll 3d6x10
          </Button>
        </Space.Compact>
      )}
      <Flex
        gap={16}
        className={!hideInventory ? "[&>div]:flex-[0_1_50%]" : undefined}
        vertical={isMobile}
      >
        <EquipmentStore
          character={character}
          characterDispatch={characterDispatch}
        />
        {!hideInventory && (
          <CharacterInventory equipment={character.equipment} />
        )}
      </Flex>
      {!hideFloatButton && (
        <FloatButton.BackTop
          shape="square"
          className="[&_sup]:w-full"
          badge={{ count: character.gold, offset: [0, 50] }}
        />
      )}
    </Flex>
  );
};

export default StepEquipment;
