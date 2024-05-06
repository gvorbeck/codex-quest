import EquipmentStore from "@/components/EquipmentStore/NewEquipmentStore";
import { CharData } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Button, Flex, FloatButton, InputNumber, Space } from "antd";

interface StepEquipmentProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
  hideDiceButton?: boolean;
  hideInventory?: boolean;
}

const StepEquipment: React.FC<
  StepEquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, hideDiceButton, hideInventory }) => {
  const { isMobile } = useDeviceType();
  return (
    <Flex vertical gap={16} className={className}>
      {!hideDiceButton && (
        <Space.Compact>
          <InputNumber className="pb-0.5" />
          <Button type="primary">Roll 3d6x10</Button>
        </Space.Compact>
      )}
      <Flex
        gap={16}
        className={!hideInventory ? "[&>div]:flex-[0_1_50%]" : undefined}
        vertical={isMobile}
      >
        <EquipmentStore character={character} />
        {!hideInventory && <div>CHARACTER INVENTORY</div>}
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
