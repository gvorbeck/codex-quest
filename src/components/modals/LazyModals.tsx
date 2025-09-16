import { lazy } from 'react';

// Game Modals (Large components)
export const EncounterGeneratorModal = lazy(() =>
  import('./game/EncounterGeneratorModal').then(m => ({ default: m.default }))
);

export const TreasureGeneratorModal = lazy(() =>
  import('./game/TreasureGeneratorModal').then(m => ({ default: m.default }))
);

export const CombatTrackerModal = lazy(() =>
  import('./game/CombatTrackerModal').then(m => ({ default: m.default }))
);

// Character Modals (Medium components)
export const LevelUpModal = lazy(() =>
  import('./character/LevelUpModal').then(m => ({ default: m.default }))
);

export const CustomEquipmentModal = lazy(() =>
  import('./character/CustomEquipmentModal').then(m => ({ default: m.default }))
);

export const CantripModal = lazy(() =>
  import('./character/CantripModal').then(m => ({ default: m.default }))
);

// Feedback Modals (Small but can be lazy loaded)
export const DiceRollerModal = lazy(() =>
  import('./feedback/DiceRollerModal').then(m => ({ default: m.default }))
);

// Keep these as regular imports as they're small and frequently used
export { DeletionModal } from './base/ConfirmationModal';
export { default as SignInModal } from './auth/SignInModal';