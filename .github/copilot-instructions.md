# Torchlight - BFRPG Character Generator - AI Coding Agent Instructions

## Core Architecture

**React + TypeScript + Vite** application for creating Basic Fantasy Role-Playing Game (BFRPG) characters. Uses **Wouter** for lightweight routing, **TailwindCSS v4** for styling, and **Firebase** for auth/database.

### Key Data Flow Pattern

Character creation follows a **wizard-based flow** with persistent state:

- `CharGen.tsx` orchestrates multi-step creation process with `Stepper` component
- Character data persisted in `localStorage` during creation, synced to Firebase when authenticated
- **Cascade validation system** automatically clears invalid selections when prerequisites change
- All character state uses the `Character` interface from `src/types/character.ts`

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

### 2. Component Organization (Strict Hierarchy)

```
src/components/
├── ui/              # Reusable design system components
├── features/        # Feature-specific components (character creation steps)
├── pages/           # Top-level page components
└── auth/            # Authentication components
```

### 3. Data Layer Architecture

- **Game Data**: TypeScript modules in `src/data/` (races, classes as .ts files, equipment/spells as JSON)
- **Services Layer**: `src/services/` handles Firebase operations, validation, migration
- **Character Migration**: Built-in system handles schema evolution via `characterMigration.ts`
- **Firebase Structure**: `/users/{userId}/characters/{characterId}`

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

// Settings object handles versioning for migration
settings: { version: number, useCoinWeight?: boolean }
```

### Validation & Migration Pattern

1. **Cascade Validation**: When race changes, incompatible classes auto-clear
2. **Data Migration**: Version-controlled schema evolution in `characterMigration.ts`
3. **Type Guards**: `src/utils/typeGuards.ts` for runtime type safety

### Firebase Integration Specifics

- **Authentication**: Email/password only (no social providers)
- **Environment Variables**: All start with `VITE_FIREBASE_` prefix
- **Error Handling**: Services throw Error objects, UI components catch and display
- **Auto-migration**: Legacy character data migrated on read operations

### Design System Usage

- **Design Tokens**: Centralized in `src/constants/designTokens.ts` with size variants
- **TailwindCSS v4**: Custom theme with RPG-appropriate color scheme (zinc/amber)
- **Accessibility**: WCAG 2.1 AA compliance target - use semantic HTML, ARIA labels
- **Component Pattern**: UI components accept `className` prop for customization

### Critical Game System Knowledge

- **BFRPG System**: Basic Fantasy RPG with supplemental content (see: `/sources/BFRPG-rulebook.txt`)
- **Dice Notation**: Comprehensive parser in `utils/dice.ts` supports "3d6", "4d6L", etc.
- **Currency System**: Gold/silver/copper with conversion utilities
- **Multi-class Support**: Only elves and dokkalfar can use combination classes

## Integration Points & Data Flow

### Character Creation Wizard Flow

1. **AbilityScoreStep** → sets base stats with dice rolling
2. **RaceStep** → triggers cascade validation, may clear invalid classes
3. **ClassStep** → validates against race restrictions, handles combinations
4. **HitPointsStep** → calculates based on class hit die + constitution
5. **EquipmentStep** → filters by class/race restrictions
6. **ReviewStep** → final validation, requires authentication to save

### Error Boundary Strategy

- **Page-level boundaries**: `HomeErrorBoundary`, `CharGenErrorBoundary`, etc.
- **Lazy loading**: All page components are lazy-loaded with Suspense
- **Graceful degradation**: Components handle missing data without crashing

### Performance Optimization Patterns

- **Memoization**: Heavy use of `useMemo` for validation functions and filtered data
- **Bundle splitting**: Manual chunks for game data to enable lazy loading
- **Local storage**: Aggressive caching of character creation state

## Testing & Quality Patterns

**No test framework currently configured** - focus on TypeScript strict mode and ESLint for quality.

### Code Quality Checks

- TypeScript strict mode enabled in `tsconfig.json`
- ESLint with React hooks rules and TypeScript integration
- Manual testing workflow: create character → save → reload → verify persistence

When adding features:

1. Update `Character` interface if needed
2. Add migration logic if schema changes
3. Update validation in `CharacterValidationService`
4. Test cascade validation scenarios (race change clearing classes)
5. Verify Firebase persistence and migration on existing data
