import { EquipmentItem, ModalDisplay } from "@/data/definitions";
import { Flex, Switch } from "antd";
import React from "react";
import ThrownAttackForm from "./ThrownAttackForm/ThrownAttackForm";
import AmmoAttackForm from "./AmmoAttackForm/AmmoAttackForm";
import MeleeAttackForm from "./MeleeAttackForm/MeleeAttackForm";

interface ModalAttackProps {
  item: EquipmentItem;
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const ModalAttack: React.FC<
  ModalAttackProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, setModalDisplay }) => {
  const [attackSwitch, setAttackWitch] = React.useState(false);
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
            <AmmoAttackForm item={item} setModalDisplay={setModalDisplay} />
          ) : (
            <ThrownAttackForm item={item} setModalDisplay={setModalDisplay} />
          )}
        </>
      ) : (
        <MeleeAttackForm item={item} setModalDisplay={setModalDisplay} />
      )}
    </Flex>
  );
};

export default ModalAttack;
