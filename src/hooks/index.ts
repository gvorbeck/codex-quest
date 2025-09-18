// Auth hooks
export { useAuth } from "./auth";

// UI hooks
export {
  useModal,
  useLoadingState,
  useNotifications,
  useNotificationContext,
  useModalFormState,
} from "./ui";

// Form and validation hooks
export {
  useFormValidation,
  useDebounce,
  useDebouncedUpdate,
  useValidationAnnouncements,
} from "./forms";

// Character hooks
export { useCharacterCard, usePlayerCharacters, useHPGain } from "./character";

// Equipment hooks
export { useEquipmentManagement, useEquipmentManager } from "./equipment";

// Dice and combat hooks
export { useDiceRoll, useDiceRoller, useCombatLogic } from "./dice";

// Data and skill hooks
export {
  useAppData,
  useSkillDataByClass,
  useSkillColumns,
  useSpellSelection,
} from "./data";

// Navigation hooks
export {
  useEntityNavigation,
  useCharacterNavigation,
  useGameNavigation,
  useStepNavigation,
  useFocusManagement,
} from "./navigation";

// Accessibility hooks
export { useStepAnnouncements } from "./a11y";

// TanStack Query hooks
export {
  useCharacters,
  useCharacterSheet,
  useDataResolver,
  useGame,
  useGames,
} from "./queries";
export { useCharacterMutations } from "./mutations";
