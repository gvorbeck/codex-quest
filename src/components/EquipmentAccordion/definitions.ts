import { RaceName } from "../CharacterRace/definitions";
import { ClassName, EquipmentItem } from "../EquipmentStore/definitions";

export interface EquipmentAccordionProps {
  playerClass: ClassName;
  playerEquipment: EquipmentItem[];
  playerRace: RaceName;
  onAmountChange: () => void;
  onCheckboxCheck: () => void;
  onRadioCheck: () => void;
}
