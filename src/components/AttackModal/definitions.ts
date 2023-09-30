import { CharacterData, EquipmentItem } from "../../data/definitions";
import { ModalProps } from "../../modals/definitions";

export type AttackType = "melee" | "missile";

export interface AttackModalProps extends ModalProps {
  isAttackModalOpen: boolean;
  attackBonus: number;
  weapon?: EquipmentItem;
  setCharacterData: (character: CharacterData) => void;
}
