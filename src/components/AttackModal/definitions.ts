import { ModalProps } from "../../modals/definitions";
import { EquipmentItem } from "../EquipmentStore/definitions";
import { CharacterData } from "../definitions";

export type AttackType = "melee" | "missile";

export interface AttackModalProps extends ModalProps {
  isAttackModalOpen: boolean;
  attackBonus: number;
  weapon?: EquipmentItem;
  setCharacterData: (character: CharacterData) => void;
}
