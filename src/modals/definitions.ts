import { RadioChangeEvent } from "antd";
import { EquipmentItem } from "../components/EquipmentStore/definitions";
import { CharacterData } from "../components/definitions";

interface ModalProps {
  handleCancel: () => void;
  characterData?: CharacterData;
}

export interface LevelUpModalProps extends ModalProps {
  isLevelUpModalOpen: boolean;
  hitDice: string;
  setCharacterData: (character: CharacterData) => void;
  characterData: CharacterData;
}

export interface DiceRollerModalProps extends ModalProps {
  isDiceRollerModalOpen: boolean;
}

export interface AddEquipmentModalProps extends ModalProps {
  isAddEquipmentModalOpen: boolean;
  setCharacterData: (character: CharacterData) => void;
}

export interface AddCustomEquipmentModalProps extends ModalProps {
  isAddCustomEquipmentModalOpen: boolean;
  setCharacterData: (character: CharacterData) => void;
  characterData: CharacterData;
}

export interface SpellCheckboxGroupProps {
  characterClass: string;
  level: number;
  max: number;
  checkedSpells: string[];
  setCheckedSpells: (checkedSpells: string[]) => void;
  checkedSpellsCount: number[];
  setCheckedSpellsCount: (checkedSpellsCount: number[]) => void;
  unrestricted?: boolean;
}

export interface AttackModalProps extends ModalProps {
  isAttackModalOpen: boolean;
  attackBonus: number;
  weapon?: EquipmentItem;
}

export interface RangeRadioButtons {
  missileRangeBonus: number;
  handleRangeChange: (e: RadioChangeEvent) => void;
  missileRangeValues: number[];
}

export interface AttackButtonsProps {
  weapon: EquipmentItem;
  damage: (damage: string) => void;
  attack: (attack: "melee" | "missile") => void;
  type: "melee" | "missile";
  className?: string;
}

export interface CreateCharacterModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onCharacterAdded: () => void;
}
