import { FormEvent } from "react";
import { CharacterData } from "../data/definitions";
import { User } from "firebase/auth";

export type ModalProps = {
  handleCancel: () => void;
  characterData?: CharacterData;
};

export interface LevelUpModalProps extends ModalProps {
  isLevelUpModalOpen: boolean;
  hitDice: (level: number, className: string[], dice: string) => string;
  setCharacterData: (character: CharacterData) => void;
  characterData: CharacterData;
}

export interface DiceRollerModalProps extends ModalProps {
  isDiceRollerModalOpen: boolean;
}

export interface AddEquipmentModalProps extends ModalProps {
  isAddEquipmentModalOpen: boolean;
  setCharacterData: (character: CharacterData) => void;
  user: User | null;
}

export interface CheatSheetModalProps extends ModalProps {
  isCheatSheetModalOpen: boolean;
}

export interface AddCustomEquipmentModalProps extends ModalProps {
  isAddCustomEquipmentModalOpen: boolean;
  setCharacterData: (character: CharacterData) => void;
  characterData: CharacterData;
  user: User | null;
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

export interface CreateCharacterModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onCharacterAdded: () => void;
}
