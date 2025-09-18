# Codex.Quest - BFRPG Character Generator - AI Coding Agent Instructions

## Core Architecture

**React 19 + TypeScript + Vite** application for Basic Fantasy Role-Playing Game (BFRPG) character management. Uses **TanStack Query** for server state, **Zustand** for client state, **Wouter** for routing, **TailwindCSS v4** for styling, and **Firebase** for auth/database.

## Essential Development Commands

```bash
npm run dev          # Development server with hot reload
npm run build        # Production build (TypeScript check + Vite)
npm run lint         # ESLint on all TypeScript/React files
npm run preview      # Preview production build locally
```

## State Management Architecture

### TanStack Query (Server State)

**Query Keys**: Centralized in `src/lib/queryKeys.ts` with factory pattern

```typescript
queryKeys.characters.user(userId); // User's character list
queryKeys.characters.detail(userId, charId); // Full character sheet
queryKeys.characters.summary(userId, charId); // Character summary for lists
```

**Key Hooks**:

- `useCharacters()` - Character list with 2min stale time
- `useCharacterSheet()` - Full character with optimistic updates
- `useDataResolver()` - Batch character summaries with caching
- `useGame()` - Game session management

**Query Configuration**:

- Default 5min stale time, 10min garbage collection
- Auto-retry except 4xx errors (auth/permissions)
- Optimistic updates for character modifications

### Zustand (Client State)

**Character Store** (`src/stores/characterStore.ts`):

```typescript
useCharacterStore(); // Draft character during creation, preferences, step navigation
```

**UI Store** (`src/stores/uiStore.ts`):

```typescript
useUiStore(); // Collapsed sections, UI preferences with persistence
```

**Combat Store** (`src/stores/combatStore.ts`):

```typescript
useCombatStore(); // Game session combat state management
```

## Component Architecture

```
src/components/
├── app/              # Core app structure (Header, Footer, Routes)
├── domain/           # Domain-specific (dice, spells, equipment)
├── features/         # Feature modules (character/, game/)
│   ├── character/
│   │   ├── creation/ # Wizard steps (AbilityScoreStep, RaceStep, etc.)
│   │   ├── management/ # Character lists and actions
│   │   └── sheet/    # Character sheet components
├── modals/           # Application modals
├── pages/            # Top-level pages (CharGen, CharacterSheet, etc.)
└── ui/               # Design system components
    ├── core/         # Primitives (Button, Card, Typography)
    └── composite/    # Complex UI (Stepper, ItemGrid, StatGrid)
```

## Critical Data Flow Patterns

### Character Creation Wizard

**State Management**: Zustand store persists draft character + preferences across sessions
**Validation Pipeline**: `src/validation/character.ts` with step-by-step validation
**Cascade Validation**: `useCascadeValidation()` auto-clears invalid selections when race/class changes

```typescript
// Character creation flow
CharGen.tsx → useCharacterStore() → AbilityScoreStep → RaceStep → ClassStep → etc.
```

**Step Validation**: Each step validates independently, enabling/disabling navigation
**Save Pattern**: Authentication required to persist to Firebase via `useCharacterMutations()`

### Firebase Integration

**Services Layer**: `src/services/` handles all Firebase operations

```typescript
src / services / characters.ts; // CRUD operations with migration
src / services / auth.ts; // Authentication wrapper
src / services / games.ts; // Game session management
```

**Data Structure**: `/users/{userId}/characters/{characterId}` and `/users/{userId}/games/{gameId}`
**Migration System**: Automatic schema evolution via `processCharacterData()`

### Character Validation System

**Cascade Validation**: When race changes, incompatible classes auto-clear

```typescript
useCascadeValidation({
  character,
  onCharacterChange,
  includeSupplementalRace,
  includeSupplementalClass,
});
```

**Validation Pipeline**: Step-by-step validation with detailed error messages
**Custom Content**: Unified handling of standard + custom races/classes via character utils

## Firebase Configuration

**Required Environment Variables** (in `.env.local`):

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

**Authentication**: Email/password only, handled via `useAuth()` hook
**Error Handling**: Use `getErrorMessage(error, fallback)` for consistent error display

## Character System Specifics

### Character Schema

```typescript
// Multi-class support via arrays
class: string[]  // ["fighter"] or ["magic-user", "thief"]

// Abilities with value + modifier
abilities: { strength: { value: 15, modifier: 1 } }

// Custom content support
customClasses?: { [id: string]: CustomClass }
customRace?: CustomRace
```

### Character Utilities (`src/utils/character.ts`)

**Essential Functions**:

```typescript
isCustomClass(classId: string): boolean
canCastSpells(character: Character, classes: Class[]): boolean
cascadeValidateCharacter(character: Character, race?: Race, classes: Class[]): Character
getHitDie(character: Character, classes: Class[]): string
```

**Game Rules**: Multi-class limited to elves/dokkalfar, custom races have no restrictions

## Build & Bundle Optimization

**Vite Configuration**: Manual chunk splitting to prevent React initialization issues

```typescript
// Keep React core in main bundle (critical)
// Separate chunks: firebase, spells, monsters, equipment
// Path aliases: @/components, @/types, @/utils, etc.
```

**Performance Patterns**:

- Heavy `useMemo()` usage for expensive calculations
- Lazy-loaded page components with Suspense
- TanStack Query caching reduces Firebase calls

## Development Workflow Patterns

### Adding New Features

1. Update TypeScript interfaces in `src/types/` if needed
2. Add services layer functions in `src/services/`
3. Create TanStack Query hooks in `src/hooks/queries/`
4. Add Zustand store slice if client state needed
5. Update validation in `src/validation/`
6. Create UI components following design system hierarchy
7. Test with character creation → save → reload cycle

### Common Code Patterns

- **Error Handling**: Always use `getErrorMessage(error, fallback)`
- **Character Utilities**: Use centralized functions, don't duplicate logic
- **Memoization**: Wrap expensive calculations in `useMemo()`
- **Query Invalidation**: Invalidate related queries after mutations
- **Type Safety**: Prefer TypeScript interfaces over `any`

### Debugging Tips

- Use TanStack Query DevTools (enabled in dev mode)
- Character state logged to console in development
- Firebase operations include structured logging
- Validation errors provide specific step-by-step feedback
