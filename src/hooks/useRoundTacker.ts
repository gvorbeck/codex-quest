import { CombatantType } from "@/data/definitions";
import { InputRef } from "antd";
import React from "react";

export function useRoundTracker(
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

  const handleInputConfirm = (index: number) => {
    if (inputValue) {
      const updatedCombatants = combatants.map((combatant, i) => {
        if (i === index) {
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
    setEditingCombatant,
    handleInitiaveChange,
  };
}
