import { Flex, FloatButton } from "antd";
import React from "react";
import GoldRoller from "./GoldRoller/GoldRoller";
import CharacterInventory from "./CharacterInventory/CharacterInventory";
import { CharData, EquipmentItem } from "@/data/definitions";
import EquipmentStore from "@/components/EquipmentStore/EquipmentStore";
import { useDeviceType } from "@/hooks/useDeviceType";
import classNames from "classnames";

interface StepEquipmentProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  hideDiceButton?: boolean;
  hideInventory?: boolean;
}

// TODO: RACE/CLASS RESTRICTIONS
console.error("race/class equipment restrictions not implemented yet");

const StepEquipment: React.FC<
  StepEquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, hideDiceButton, hideInventory }) => {
  const [gold, setGold] = React.useState<number>(character.gold || 0);
  const [equipment, setEquipment] = React.useState<EquipmentItem[]>(
    character.equipment || [],
  );
  const { isMobile } = useDeviceType();
  const flexClassNames = classNames({
    "[&>div]:flex-[0_1_50%]": !hideInventory,
  });
  React.useEffect(() => {
    setCharacter({
      ...character,
      gold,
      equipment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipment, gold]);

  return (
    <Flex vertical gap={16} className={className}>
      {!hideDiceButton && <GoldRoller gold={gold} setGold={setGold} />}
      <Flex gap={16} className={flexClassNames} vertical={isMobile}>
        <EquipmentStore
          character={character}
          equipment={equipment}
          setEquipment={setEquipment}
          gold={gold}
          setGold={setGold}
        />
        {!hideInventory && (
          <CharacterInventory equipment={character.equipment} />
        )}
      </Flex>
      <FloatButton.BackTop
        shape="square"
        className="[&_sup]:w-full"
        badge={{ count: +gold, offset: [0, 50] }}
      />
    </Flex>
  );
};

export default StepEquipment;
