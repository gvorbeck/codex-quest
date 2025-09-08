import { lazy } from 'react';

// Game Modals (Large components)
export const EncounterGeneratorModal = lazy(() => 
  import('./game/EncounterGeneratorModal')
);

export const TreasureGeneratorModal = lazy(() => 
  import('./game/TreasureGeneratorModal')
);

export const CombatTrackerModal = lazy(() => 
  import('./game/CombatTrackerModal')
);

// Character Modals (Medium components)
export const LevelUpModal = lazy(() => 
  import('./character/LevelUpModal')
);

export const CustomEquipmentModal = lazy(() => 
  import('./character/CustomEquipmentModal')
);

export const CantripModal = lazy(() => 
  import('./character/CantripModal')
);

// Feedback Modals (Small but can be lazy loaded)
export const DiceRollerModal = lazy(() => 
  import('./feedback/DiceRollerModal')
);

// Keep these as regular imports as they're small and frequently used
export { default as DeleteCharacterModal } from './feedback/DeleteCharacterModal';
export { default as DeleteGameModal } from './feedback/DeleteGameModal';
export { default as DeletePlayerModal } from './feedback/DeletePlayerModal';
export { default as SignInModal } from './auth/SignInModal';