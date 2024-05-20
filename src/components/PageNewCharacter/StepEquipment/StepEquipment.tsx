import EquipmentStore from "@/components/EquipmentStore/EquipmentStore";
import { CharData } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Button, Flex, FloatButton, InputNumber, Space } from "antd";
import CharacterInventory from "./CharacterInventory/CharacterInventory";

interface StepEquipmentProps {
  character: CharData;
  characterDispatch: React.Dispatch<any>;
  hideDiceButton?: boolean;
  hideInventory?: boolean;
}

const StepEquipment: React.FC<
  StepEquipmentProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  characterDispatch,
  hideDiceButton,
  hideInventory,
}) => {
  const { isMobile } = useDeviceType();

  function handleRollGoldClick() {
    characterDispatch({
      type: "SET_GOLD",
    });
  }

  function handleGoldInputChange(value: number | null) {
    if (!value) {
      characterDispatch({
        type: "SET_GOLD",
        payload: {
          gold: 0,
        },
      });
    } else {
      characterDispatch({
        type: "SET_GOLD",
        payload: {
          gold: value,
        },
      });
    }
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
      <FloatButton.BackTop
        shape="square"
        className="[&_sup]:w-full"
        badge={{ count: character.gold, offset: [0, 50] }}
      />
    </Flex>
  );
};

export default StepEquipment;
