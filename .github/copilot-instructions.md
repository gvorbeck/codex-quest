# Codex.Quest - BFRPG Character Generator - AI Coding Agent Instructions

## Core Architecture

**React 19 + TypeScript + Vite** application for creating Basic Fantasy Role-Playing Game (BFRPG) characters. Uses **Wouter** for lightweight routing, **TailwindCSS v4** for styling, and **Firebase** for auth/database.

### Key Data Flow Pattern

Character creation follows a **wizard-based flow** with persistent state:

- `CharGen.tsx` orchestrates multi-step creation process with `Stepper` component
- Character data persisted in `localStorage` during creation, synced to Firebase when authenticated
- **Cascade validation system** automatically clears invalid selections when prerequisites change via `useCascadeValidation`
- All character state uses the `Character` interface from `src/types/character.ts`
- **Custom Class/Race System**: Unified utility functions in `src/utils/characterHelpers.ts` handle both standard and custom content

## Essential Development Commands

```bash
npm run dev          # Development server with hot reload
npm run build        # Production build (runs TypeScript check first)
npm run lint         # ESLint on all TypeScript/React files
npm run preview      # Preview production build locally
```

## Critical Architecture Patterns

### 1. State Management Strategy

- **Local State**: React hooks + custom `useLocalStorage` hook for persistence
- **Global State**: Custom hooks pattern (`useAuth`, `useCharacters`, `useCascadeValidation`)
- **No global state library** - uses React context sparingly, prefers prop drilling for clarity
- **Validation**: Cascade system that auto-updates dependent fields via `useCascadeValidation`
- **Custom Content**: Character helpers provide unified API for standard/custom classes and races

### 2. Component Organization (Strict Hierarchy)

```
src/components/
├── ui/                    # Reusable design system components
│   ├── design-system/     # Core components (Card, Typography, Badge)
│   ├── inputs/           # Form inputs (Button, Select, TextInput, etc.)
│   ├── feedback/         # User feedback (Modal, Notification, Tooltip)
│   ├── display/          # Data display (StatCard, ItemGrid, Stepper)
│   ├── layout/           # Layout components (Accordion, Tabs, PageWrapper)
│   └── dice/             # Dice rolling components
├── character/            # Character-specific functionality
│   ├── creation/         # Character creation wizard steps
│   ├── management/       # Character list and management
│   ├── sheet/           # Character sheet display and editing
│   └── shared/          # Shared character components
├── game/                # Game management features
├── auth/                # Authentication components
├── modals/              # Application modals
└── pages/               # Top-level page components
```

### 3. Data Layer Architecture

- **Game Data**: TypeScript modules in `src/data/` (races, classes as .ts files, equipment/spells as JSON)
- **Services Layer**: `src/services/` handles Firebase operations, validation, migration
- **Character Migration**: Built-in system handles schema evolution via `characterMigration.ts`
- **Firebase Structure**: `/users/{userId}/characters/{characterId}`
- **Utility Layer**: `src/utils/characterHelpers.ts` provides unified API for standard/custom content

### 4. Bundle Optimization Strategy

Vite config includes **manual chunk splitting**:

- React, Firebase, router, and game data get separate chunks
- Path aliases configured: `@/components`, `@/types`, `@/utils`, etc.
- Critical game data preloaded via `useAppData` hook

## Project-Specific Conventions

### Character Schema Design

```typescript
// Character interface supports multi-class via array
class: string[];  // ["fighter"] or ["magic-user", "thief"] for combinations

// Abilities use combined value+modifier structure
abilities: {
  strength: { value: number, modifier: number }
}

// Custom classes and races support
customClasses?: {
  [classId: string]: {
    name: string;
    usesSpells?: boolean;
    hitDie?: string;
  }
};
customRace?: {
  name: string;
  // Additional custom race properties...
};

// Settings object handles versioning for migration
settings: { version: number, useCoinWeight?: boolean }
```

### Custom Content System

Use `src/utils/characterHelpers.ts` for unified standard/custom content handling:

```typescript
// Check if class ID is custom
isCustomClass(classId: string): boolean

// Check if character can cast spells (handles custom classes)
canCastSpells(character: Character, availableClasses: Class[]): boolean

// Get primary class info (standard or custom)
getPrimaryClassInfo(character: Character, availableClasses: Class[])

// Check if character can level up
canLevelUp(character: Character, availableClasses: Class[]): boolean
```

### Validation & Migration Pattern

1. **Cascade Validation**: When race changes, incompatible classes auto-clear via `useCascadeValidation`
2. **Data Migration**: Version-controlled schema evolution in `characterMigration.ts`
3. **Type Guards**: `src/utils/typeGuards.ts` for runtime type safety
4. **Character Helpers**: Centralized utilities handle standard/custom class logic

### Firebase Integration Specifics

- **Authentication**: Email/password only (no social providers)
- **Environment Variables**: All start with `VITE_FIREBASE_` prefix
- **Error Handling**: Services throw Error objects, UI components catch and display
- **Auto-migration**: Legacy character data migrated on read operations

### Design System Usage

- **Design Tokens**: Centralized in `src/constants/designTokens.ts` with size variants
- **TailwindCSS v4**: Custom theme with RPG-appropriate color scheme (zinc/amber)
- **Component Hierarchy**: UI components strictly organized by function (design-system, inputs, feedback, display, layout)
- **Accessibility**: WCAG 2.1 AA compliance target - use semantic HTML, ARIA labels
- **Component Pattern**: UI components accept `className` prop for customization

### Critical Game System Knowledge

- **BFRPG System**: Basic Fantasy RPG with supplemental content (see: `/sources/BFRPG-rulebook.txt`)
- **Dice Notation**: Comprehensive parser in `utils/dice.ts` supports "3d6", "4d6L", etc.
- **Currency System**: Gold/silver/copper with conversion utilities
- **Multi-class Support**: Only elves and dokkalfar can use combination classes
- **Custom Classes**: Support user-defined classes with custom spellcasting and hit dice

## Integration Points & Data Flow

### Character Creation Wizard Flow

1. **AbilityScoreStep** → sets base stats with dice rolling
2. **RaceStep** → triggers cascade validation, may clear invalid classes
3. **ClassStep** → validates against race restrictions, handles combinations and custom classes
4. **HitPointsStep** → calculates based on class hit die + constitution (uses `getHitDie()`)
5. **EquipmentStep** → filters by class/race restrictions
6. **ReviewStep** → final validation, requires authentication to save

### Level-Up System

- **LevelUpModal**: Manages character advancement with HP gain and spell selection
- **Spell Selection**: Uses `canCastSpells()` to determine if character needs spell selection
- **HP Calculation**: Uses `getHitDie()` from character helpers for appropriate hit die
- **Custom Class Support**: Level-up system handles both standard and custom spellcasting classes

### Error Boundary Strategy

- **Page-level boundaries**: `HomeErrorBoundary`, `CharGenErrorBoundary`, etc.
- **Lazy loading**: All page components are lazy-loaded with Suspense
- **Graceful degradation**: Components handle missing data without crashing

### Performance Optimization Patterns

- **Memoization**: Heavy use of `useMemo` for validation functions and filtered data
- **Bundle splitting**: Manual chunks for game data to enable lazy loading
- **Local storage**: Aggressive caching of character creation state
- **Data Resolution**: `useDataResolver` hook for efficient batch fetching with caching

## Custom Hooks Architecture

### Core Data Hooks

```typescript
useAuth(); // Authentication state
useCharacters(); // User's character list
useLocalStorage(); // Persistent local state
useAppData(); // Preloaded game data
```

### Character-Specific Hooks

```typescript
useCascadeValidation(); // Auto-validates character data consistency
useSpellSelection(); // Manages spell selection for level-up
useHPGain(); // Handles hit point calculations
useFirebaseSheet(); // Firebase character sheet sync
```

### Utility Hooks

```typescript
useDataResolver(); // Batch character data fetching with caching
useValidationAnnouncements(); // Screen reader accessibility
useFocusManagement(); // Keyboard navigation support
useDiceRoller(); // Dice rolling functionality
```

## Testing & Quality Patterns

**No test framework currently configured** - focus on TypeScript strict mode and ESLint for quality.

### Code Quality Checks

- TypeScript strict mode enabled with enhanced type checking in `tsconfig.app.json`
- ESLint with React hooks rules and TypeScript integration
- Manual testing workflow: create character → save → reload → verify persistence

### Development Workflow

When adding features:

1. Update `Character` interface if needed
2. Add migration logic if schema changes
3. Update validation in cascade validation system
4. Use character helpers for standard/custom class logic
5. Test cascade validation scenarios (race change clearing classes)
6. Verify Firebase persistence and migration on existing data
7. Ensure level-up system works with new content

### Common Patterns to Follow

1. **Function vs Variable**: Always call utility functions - `isCustomClass()` not `isCustomClass`
2. **Character Helpers**: Use centralized utilities instead of inline logic
3. **Memoization**: Heavy use of `useMemo` for expensive calculations
4. **Error Boundaries**: Wrap major features with error boundaries
5. **Accessibility**: Include ARIA labels and semantic HTML structure
