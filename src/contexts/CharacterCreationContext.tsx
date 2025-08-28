import { createContext, useReducer, useMemo } from "react";
import type { ReactNode } from "react";
import type { Character, Race, Class } from "@/types/character";

// Action types for character creation state management
type CharacterCreationAction =
  | { type: "SET_CHARACTER"; payload: Character }
  | { type: "UPDATE_CHARACTER"; payload: Partial<Character> }
  | { type: "SET_RACE_FILTER"; payload: { includeSupplemental: boolean } }
  | { type: "SET_CLASS_FILTER"; payload: { includeSupplemental: boolean; useCombination: boolean } }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "MARK_STEP_COMPLETE"; payload: number }
  | { type: "MARK_STEP_INCOMPLETE"; payload: number }
  | { type: "RESET" };

// Enhanced state interface
interface CharacterCreationState {
  character: Character;
  currentStep: number;
  completedSteps: Set<number>;
  filters: {
    includeSupplementalRace: boolean;
    includeSupplementalClass: boolean;
    useCombinationClass: boolean;
  };
}

interface CharacterCreationContextType {
  // State
  character: Character;
  currentStep: number;
  completedSteps: Set<number>;
  
  // Filters (backward compatibility)
  filteredRaces: Race[];
  filteredClasses: Class[];
  includeSupplementalRace: boolean;
  setIncludeSupplementalRace: (include: boolean) => void;
  includeSupplementalClass: boolean;
  setIncludeSupplementalClass: (include: boolean) => void;
  useCombinationClass: boolean;
  setUseCombinationClass: (use: boolean) => void;
  
  // Enhanced actions
  setCharacter: (character: Character) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  markStepIncomplete: (step: number) => void;
  isStepComplete: (step: number) => boolean;
  getCompletionPercentage: (totalSteps: number) => number;
  resetCharacter: () => void;
}

// Initial state
const createInitialState = (initialCharacter?: Partial<Character>): CharacterCreationState => ({
  character: {
    id: "",
    name: "",
    race: { name: "", abilities: {}, hitPointBonus: 0, spellAbility: null },
    characterClass: { name: "", hitDie: "", spellcasting: null, abilities: {} },
    abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    hitPoints: 0,
    spells: [],
    cantrips: [],
    ...initialCharacter,
  } as Character,
  currentStep: 0,
  completedSteps: new Set(),
  filters: {
    includeSupplementalRace: false,
    includeSupplementalClass: false,
    useCombinationClass: false,
  },
});

const CharacterCreationContext = createContext<CharacterCreationContextType | null>(null);

// Reducer function
function characterCreationReducer(
  state: CharacterCreationState,
  action: CharacterCreationAction
): CharacterCreationState {
  switch (action.type) {
    case "SET_CHARACTER":
      return { ...state, character: action.payload };
    case "UPDATE_CHARACTER":
      return { ...state, character: { ...state.character, ...action.payload } };
    case "SET_RACE_FILTER":
      return {
        ...state,
        filters: { ...state.filters, includeSupplementalRace: action.payload.includeSupplemental },
      };
    case "SET_CLASS_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          includeSupplementalClass: action.payload.includeSupplemental,
          useCombinationClass: action.payload.useCombination,
        },
      };
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    case "MARK_STEP_COMPLETE":
      return {
        ...state,
        completedSteps: new Set([...state.completedSteps, action.payload]),
      };
    case "MARK_STEP_INCOMPLETE": {
      const newCompletedSteps = new Set(state.completedSteps);
      newCompletedSteps.delete(action.payload);
      return { ...state, completedSteps: newCompletedSteps };
    }
    case "RESET":
      return createInitialState();
    default:
      return state;
  }
}

interface CharacterCreationProviderProps {
  children: ReactNode;
  initialCharacter?: Partial<Character>;
  filteredRaces?: Race[];
  filteredClasses?: Class[];
}

export function CharacterCreationProvider({ 
  children, 
  initialCharacter,
  filteredRaces = [],
  filteredClasses = []
}: CharacterCreationProviderProps) {
  const [state, dispatch] = useReducer(
    characterCreationReducer, 
    createInitialState(initialCharacter)
  );

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<CharacterCreationContextType>(() => {
    return {
      // State
      character: state.character,
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      
      // Backward compatibility props
      filteredRaces,
      filteredClasses,
      includeSupplementalRace: state.filters.includeSupplementalRace,
      includeSupplementalClass: state.filters.includeSupplementalClass,
      useCombinationClass: state.filters.useCombinationClass,
      
      // Actions
      setCharacter: (character: Character) => {
        dispatch({ type: "SET_CHARACTER", payload: character });
      },
      
      updateCharacter: (updates: Partial<Character>) => {
        dispatch({ type: "UPDATE_CHARACTER", payload: updates });
      },
      
      setIncludeSupplementalRace: (include: boolean) => {
        dispatch({ type: "SET_RACE_FILTER", payload: { includeSupplemental: include } });
      },
      
      setIncludeSupplementalClass: (include: boolean) => {
        dispatch({ 
          type: "SET_CLASS_FILTER", 
          payload: { 
            includeSupplemental: include, 
            useCombination: state.filters.useCombinationClass 
          }
        });
      },
      
      setUseCombinationClass: (use: boolean) => {
        dispatch({ 
          type: "SET_CLASS_FILTER", 
          payload: { 
            includeSupplemental: state.filters.includeSupplementalClass, 
            useCombination: use 
          }
        });
      },
      
      setCurrentStep: (step: number) => {
        dispatch({ type: "SET_CURRENT_STEP", payload: step });
      },
      
      markStepComplete: (step: number) => {
        dispatch({ type: "MARK_STEP_COMPLETE", payload: step });
      },
      
      markStepIncomplete: (step: number) => {
        dispatch({ type: "MARK_STEP_INCOMPLETE", payload: step });
      },
      
      isStepComplete: (step: number) => {
        return state.completedSteps.has(step);
      },
      
      getCompletionPercentage: (totalSteps: number) => {
        return Math.round((state.completedSteps.size / totalSteps) * 100);
      },
      
      resetCharacter: () => {
        dispatch({ type: "RESET" });
      },
    };
  }, [state, filteredRaces, filteredClasses]);

  return (
    <CharacterCreationContext.Provider value={contextValue}>
      {children}
    </CharacterCreationContext.Provider>
  );
}

export default CharacterCreationContext;
