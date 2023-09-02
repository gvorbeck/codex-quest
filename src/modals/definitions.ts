import { RadioChangeEvent } from "antd";
import { EquipmentItem } from "../components/EquipmentStore/definitions";
import { CharacterData } from "../components/definitions";
import { FormEvent } from "react";

interface ModalProps {
  handleCancel: () => void;
  characterData?: CharacterData;
}

export interface LevelUpModalProps extends ModalProps {
  isLevelUpModalOpen: boolean;
  hitDice: (level: number, className: string, dice: string) => string;
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

export interface CheatSheetModalProps extends ModalProps {
  isCheatSheetModalOpen: boolean;
}

export interface AddCustomEquipmentModalProps extends ModalProps {
  isAddCustomEquipmentModalOpen: boolean;
  setCharacterData: (character: CharacterData) => void;
  characterData: CharacterData;
}

export interface LoginSignupModalProps extends ModalProps {
  isLoginSignupModalOpen: boolean;
  handleLogin: () => Promise<void>;
}

export interface LoginFormProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onLogin: (e: FormEvent) => void;
}

export interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export interface SpellCheckboxGroupProps {
  characterClass: string;
  level: number;
  max: number;
  checkedSpells: string[];
  setCheckedSpells: (checkedSpells: string[]) => void;
  checkedSpellsCount: number[];
  setCheckedSpellsCount: (checkedSpellsCount: number[]) => void;
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
  damage?: (damage: string) => void;
  attack: (attack: "melee" | "missile") => void;
  type: "melee" | "missile";
  className?: string;
  ammo?: EquipmentItem;
  isMissile?: boolean;
}

export interface CreateCharacterModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onCharacterAdded: () => void;
}

export interface AmmoSelectProps {
  ammo: string[];
  equipment: EquipmentItem[];
  setAmmo: (ammo: EquipmentItem) => void;
}
