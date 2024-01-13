import { CharData, EquipmentItem } from "@/data/definitions";
import { Flex, Switch } from "antd";
import React from "react";
import ThrownAttackForm from "./ThrownAttackForm/ThrownAttackForm";
import AmmoAttackForm from "./AmmoAttackForm/AmmoAttackForm";
import MeleeAttackForm from "./MeleeAttackForm/MeleeAttackForm";

interface ModalAttackProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  item: EquipmentItem;
  equipment: EquipmentItem[];
  setModalIsOpen: (modalIsOpen: boolean) => void;
}

const ModalAttack: React.FC<
  ModalAttackProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  item,
  equipment,
  setModalIsOpen,
  character,
  setCharacter,
}) => {
  const [attackSwitch, setAttackWitch] = React.useState(false);
  console.error("TODOS!");
  return (
    <Flex vertical gap={16} className={className}>
      {item.type === "both" && (
        <Switch
          checkedChildren="missile"
          unCheckedChildren="melee"
          checked={attackSwitch}
          onChange={(checked) => setAttackWitch(checked)}
          className="self-baseline"
        />
      )}
      {item.type === "missile" || (item.type === "both" && attackSwitch) ? (
        <>
          {item.ammo ? (
            <AmmoAttackForm
              item={item}
              equipment={equipment}
              setModalIsOpen={setModalIsOpen}
              character={character}
              setCharacter={setCharacter}
            />
          ) : (
            <ThrownAttackForm
              item={item}
              setModalIsOpen={setModalIsOpen}
              equipment={equipment}
              character={character}
              setCharacter={setCharacter}
            />
          )}
        </>
      ) : (
        <MeleeAttackForm
          item={item}
          setModalIsOpen={setModalIsOpen}
          character={character}
        />
      )}
      {/* 
      TODO:
      x get item
      x determine if melee or missile
      x determine if thrown or ammo
      determine if ammo is available
      select ammo
      if thrown, item is gone
      if ammo, 75% chance of being gone
      when closing modal, reset states (ex: range)
      */}
    </Flex>
  );
};

export default ModalAttack;
