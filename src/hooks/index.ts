// Auth hooks
export { useAuth } from "./auth";

// UI hooks
export {
  useModal,
  useLoadingState,
  useNotificationContext,
  useModalFormState,
  useInitialLoadingState,
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

// TanStack Query hooks (enhanced with error handling)
export {
  useEnhancedCharacters as useCharacters,
  useEnhancedCharacterSheet as useCharacterSheet,
  useEnhancedGames as useGames,
  useEnhancedGame as useGame,
} from "./queries/useEnhancedQueries";
export {
  useCharacterMutations,
  useGameMutations,
} from "./mutations/useEnhancedMutations";
export { useDataResolver } from "./queries";
export { useAuthMutations } from "./mutations";

// Enhanced error handling and offline hooks
export { useNetworkStatus, useOfflineMutations } from "./network/useNetworkStatus";
export { useEnhancedFormValidation, commonValidationRules } from "./forms/useEnhancedFormValidation";

// Direct access to enhanced hooks (for explicit usage)
export {
  useEnhancedCharacters,
  useEnhancedCharacterSheet,
  useEnhancedGames,
  useEnhancedGame,
} from "./queries/useEnhancedQueries";
export {
  useCharacterMutations as useEnhancedCharacterMutations,
  useGameMutations as useEnhancedGameMutations,
} from "./mutations/useEnhancedMutations";
