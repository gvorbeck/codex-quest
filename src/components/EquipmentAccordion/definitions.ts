import { RaceName } from "../CharacterRace/definitions";
import { ClassName, EquipmentItem } from "../EquipmentStore/definitions";

export interface EquipmentAccordionProps {
  playerClass: ClassName;
  playerEquipment: EquipmentItem[];
  playerRace: RaceName;
  onAmountChange: (item?: EquipmentItem) => void;
  onCheckboxCheck: (item?: EquipmentItem) => void;
  onRadioCheck: (item?: EquipmentItem) => void;
  className?: string;
}
