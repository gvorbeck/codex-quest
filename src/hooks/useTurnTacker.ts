import { CombatantType } from "@/data/definitions";
import { InputRef, message } from "antd";
import React from "react";

export function useTurnTracker(
  combatants: CombatantType[],
  setCombatants: (combatants: CombatantType[]) => void,
) {
  // State
  const [turn, setTurn] = React.useState(0);
  const [inputVisible, setInputVisible] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [editingCombatant, setEditingCombatant] = React.useState<string | null>(
    null,
  );
  // Refs
  const inputRef = React.useRef<InputRef>(null);
  // Handlers
  const handleCombatantRemove = (item: CombatantType) => {
    const updatedCombatants = combatants.filter(
      (combatant) => combatant.name !== item.name,
    );
    message.success(`${item.name} removed from Turn Tracker`);
    setCombatants(updatedCombatants);
  };

  const handleInitiaveChange = (
    item: CombatantType,
    newValue: number | null,
  ) => {
    const newInitiative = newValue ?? 0;
    // Update the combatant's initiative without sorting immediately
    const updatedCombatants = combatants.map((combatant) => {
      if (combatant.name === item.name) {
        return { ...combatant, initiative: newInitiative };
      }
      return combatant;
    });
    setCombatants(updatedCombatants);
  };

  const handleShowInput = (name: string) => {
    setInputVisible(name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue) {
      const updatedCombatants = combatants.map((combatant) => {
        if (combatant.name === inputVisible) {
          // Compare with inputVisible which now holds the name
          return { ...combatant, tags: [...combatant.tags, inputValue] };
        }
        return combatant;
      });
      setCombatants(updatedCombatants);
    }
    setInputVisible(null); // Hide the input
    setInputValue("");
  };
  const handleClose = (removedTag: string, combatant: string) => {
    const updatedCombatants = combatants.map((item) => {
      if (item.name === combatant) {
        return {
          ...item,
          tags: item.tags.filter((tag) => tag !== removedTag),
        };
      }
      return item;
    });
    setCombatants(updatedCombatants);
  };

  const handleRenameConfirm = (combatant: CombatantType, newName: string) => {
    setCombatants(
      combatants.map((item) =>
        item.name === combatant.name ? { ...item, name: newName } : item,
      ),
    );
    setEditingCombatant(null);
  };
  // Funnctions
  const sortCombatants = () => {
    setCombatants([...combatants].sort((a, b) => b.initiative - a.initiative));
  };
  return {
    turn,
    setTurn,
    inputRef,
    inputValue,
    handleClose,
    inputVisible,
    setInputValue,
    sortCombatants,
    handleShowInput,
    setInputVisible,
    editingCombatant,
    handleInputChange,
    handleInputConfirm,
    handleRenameConfirm,
    setEditingCombatant,
    handleInitiaveChange,
    handleCombatantRemove,
  };
}
