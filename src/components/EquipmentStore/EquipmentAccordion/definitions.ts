import { RaceName } from "../../CreateCharacter/CharacterRace/definitions";
import { ClassName, EquipmentItem } from "../definitions";

export interface EquipmentAccordionProps {
  playerClass: ClassName;
  playerEquipment: EquipmentItem[];
  playerGold: number;
  playerRace: RaceName;
  onAmountChange: (item?: EquipmentItem) => void;
  onCheckboxCheck: (item?: EquipmentItem) => void;
  onRadioCheck: (item?: EquipmentItem) => void;
  className?: string;
}
