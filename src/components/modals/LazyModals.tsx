import { lazy } from 'react';

// Game Modals (Large components)
export const EncounterGeneratorModal = lazy(() =>
  import('../features/game/modals/EncounterGeneratorModal').then(m => ({ default: m.default }))
);

export const TreasureGeneratorModal = lazy(() =>
  import('../features/game/modals/TreasureGeneratorModal').then(m => ({ default: m.default }))
);

export const CombatTrackerModal = lazy(() =>
  import('../features/game/modals/CombatTrackerModal').then(m => ({ default: m.default }))
);

// Character Modals (Medium components)
export const LevelUpModal = lazy(() =>
  import('../features/character/modals/LevelUpModal').then(m => ({ default: m.default }))
);

export const CustomEquipmentModal = lazy(() =>
  import('../domain/equipment/CustomEquipmentModal').then(m => ({ default: m.default }))
);

export const CantripModal = lazy(() =>
  import('../features/character/modals/CantripModal').then(m => ({ default: m.default }))
);

// Feedback Modals (Small but can be lazy loaded)
export const DiceRollerModal = lazy(() =>
  import('../domain/dice/DiceRollerModal').then(m => ({ default: m.default }))
);

// Keep these as regular imports as they're small and frequently used
export { DeletionModal } from './base/ConfirmationModal';
export { default as SignInModal } from './auth/SignInModal';