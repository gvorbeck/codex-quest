# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run ESLint on all TypeScript/React files
- `npm run preview` - Preview production build locally

### Testing

No test framework is currently configured in this project.

## Architecture Overview

### Core Application Structure

This is a React + TypeScript + Vite application for creating and managing Basic Fantasy Role-Playing Game (BFRPG) characters and game sessions. The app uses:

- **React 19** with functional components and hooks
- **Wouter** for lightweight client-side routing
- **TailwindCSS v4** for styling with design tokens
- **Firebase** for authentication and Firestore database
- **Vite** for build tooling with optimized chunk splitting
- **Husky** for pre-commit hooks (linting and building)

### Key Architecture Patterns

#### Data Flow

The application supports both character creation and game management with persistent state:

**Character Creation Flow:**
- `CharGen.tsx` orchestrates the multi-step character creation wizard
- Each step is a separate component in `src/components/character/creation/`
- Character data is stored in localStorage during creation and synced to Firebase when authenticated
- All character state uses the `Character` interface from `src/types/character.ts`

**Game Management Flow:**
- `GameGen.tsx` and `GameSheet.tsx` handle game session creation and management
- Game data uses the `Game` interface from `src/types/game.ts`
- Games can include players (linked to characters) and combatants for encounters

#### State Management

- **Local State**: React hooks (`useState`, `useLocalStorage` custom hook)
- **Global State**: Custom hooks for auth (`useAuth`) and characters (`useCharacters`)
- **Persistence**: localStorage for draft characters, Firebase Firestore for saved characters
- **Validation**: Cascade validation system that automatically updates dependent fields

#### Component Organization

**UI Components (Design System):**
- `src/components/ui/design-system/` - Core design system components (Card, Typography, Badge)
- `src/components/ui/inputs/` - Form inputs (Button, Select, TextInput, NumberInput, etc.)
- `src/components/ui/feedback/` - User feedback (Modal, Notification, Tooltip, LoadingState, etc.)
- `src/components/ui/display/` - Data display (StatCard, ItemGrid, Stepper, etc.)
- `src/components/ui/layout/` - Layout components (Accordion, Tabs, PageWrapper, etc.)
- `src/components/ui/dice/` - Dice rolling components

**Feature Components:**
- `src/components/character/creation/` - Character creation wizard steps
- `src/components/character/management/` - Character list and management
- `src/components/character/sheet/` - Character sheet display and editing
- `src/components/character/shared/` - Shared character components (CantripSelector, etc.)
- `src/components/game/management/` - Game creation and listing
- `src/components/game/sheet/` - Game session management
- `src/components/pages/` - Top-level page components
- `src/components/auth/` - Authentication-related components

#### Services Layer

- `src/services/characters.ts` - Firebase character CRUD operations
- `src/services/games.ts` - Firebase game session CRUD operations
- `src/services/auth.ts` - Firebase authentication wrapper
- `src/services/characterValidation.ts` - Character validation logic
- `src/services/characterMigration.ts` - Data migration for character schema changes
- `src/services/dataLoader.ts` - Preloading critical game data

### Game Data System

Game data (races, classes, equipment, spells, cantrips) is stored as TypeScript modules and JSON files in `src/data/`:

**Structured Data:**
- `src/data/races/` - Each race as a separate .ts file with type-safe data (human, elf, dwarf, halfling, gnome, plus supplemental races)
- `src/data/classes/` - Each class as a separate .ts file (fighter, cleric, magic-user, thief, plus supplemental classes like paladin, ranger, barbarian, etc.)
- `src/data/equipment.json` - Weapons, armor, and gear with detailed properties
- `src/data/spells.json` - Spell database with level requirements per class
- `src/data/cantrips.json` - 0-level spells for applicable classes

**Content Flags:**
- Core BFRPG content vs supplemental material clearly marked
- Version tracking for data compatibility

**Class Magic System Types:**

All character classes are categorized into magic system types based on their spellcasting abilities:

**Magic-User Types** (get starting spells at level 1, have Read Magic ability):
- `magic-user` - Core arcane spellcaster
- `illusionist` - Supplemental, specializes in illusion magic
- `necromancer` - Supplemental, specializes in necromancy
- `spellcrafter` - Supplemental, enhanced spell preparation abilities

**Cleric Types** (divine spellcasters, start casting at level 2):
- `cleric` - Core divine spellcaster
- `druid` - Supplemental, nature-focused divine spellcaster
- `paladin` - Supplemental, holy warrior with limited divine magic (starts at level 10)

**Non-Magic Classes** (no spellcasting abilities):
- `fighter` - Core martial warrior
- `thief` - Core stealth and skill specialist
- `assassin` - Supplemental, enhanced combat specialist
- `barbarian` - Supplemental, primitive warrior
- `ranger` - Supplemental, wilderness warrior/scout
- `scout` - Supplemental, reconnaissance specialist

**Custom Classes:**
- User-defined classes can optionally have spellcasting abilities
- Custom spellcasters are treated as "magic-user" type for mechanics

This classification is implemented in `src/utils/characterHelpers.ts` via the `getSpellSystemType()` function and determines:
- Whether characters get starting spells during creation
- Which spell lists are available
- Which cantrip/orison types can be learned
- Spellcasting ability score (Intelligence for magic-user types, Wisdom for cleric types)

### Firebase Integration

**Authentication:** Email/password authentication

**Firestore Database Structure:**
- Characters: `/users/{userId}/characters/{characterId}`
- Games: `/users/{userId}/games/{gameId}`
- Character migration system handles schema evolution
- Game sessions can reference characters across users

### Accessibility Features

- WCAG 2.1 AA compliance target
- Screen reader support with proper ARIA labels
- Keyboard navigation support
- Skip links and semantic HTML structure

### Bundle Optimization

Vite configuration includes manual chunk splitting:

- Separate chunks for React, Firebase, router, and game data
- Path aliases configured for clean imports (`@/components`, `@/types`, etc.)
- Source maps enabled for debugging

### Utility Systems

- **Dice Rolling**: Comprehensive dice notation parser (`src/utils/dice.ts`) supporting standard RPG dice expressions with modal interface
- **Currency**: Utility functions for currency conversion between gold/silver/copper with automatic weight calculations
- **Validation**: Schema-based validation with TypeScript type guards and cascade validation for dependent fields
- **Cantrips & Spells**: Utility functions for spell management and class-specific availability
- **Sanitization**: HTML sanitization for user-generated content
- **Type Guards**: Runtime type checking utilities

## Working with Character Data

### Character Schema

The main `Character` interface includes:

- **Abilities**: 6 standard ability scores (STR, INT, WIS, DEX, CON, CHA) with calculated modifiers
- **Race & Class**: Race selection and class array for multi-class support
- **Equipment**: Detailed equipment with properties (weapons, armor, cost, weight, damage, AC, etc.)
- **Currency**: Multi-currency system (platinum, gold, electrum, silver, copper) with automatic weight
- **Combat Stats**: Hit points, armor class, attack bonuses, saving throws
- **Magic**: Spell lists per class, cantrips, spell slots
- **Experience**: XP tracking and level progression
- **Personal**: Name, avatar, background details
- **Settings**: Feature flags, data version, supplemental content toggles

### Game Schema

The main `Game` interface includes:

- **Basic Info**: Game name, notes
- **Players**: Array linking user IDs to character IDs with resolved names/avatars
- **Combatants**: NPCs and monsters for encounters with AC and initiative tracking
- **Extensible**: Additional properties for future features

### Data Migration

When modifying character or game schemas:

**Character Schema Changes:**
1. Update the `Character` interface in `src/types/character.ts`
2. Add migration logic in `src/services/characterMigration.ts`
3. Increment version number in character settings

**Game Schema Changes:**
1. Update the `Game` interface in `src/types/game.ts`
2. Add migration logic for games if needed
3. Test with existing game data

### Firebase Environment Variables

Required environment variables for Firebase (stored in `.env.local`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Code Review

Use the custom command for lean, thorough code reviews:

```bash
/code-review <component_path>
```

This command provides focused analysis of:
- UI component usage and design system consistency
- Code duplication and refactoring opportunities  
- React best practices and performance
- BFRPG-specific patterns and integration

The command produces concise, actionable reports under 400 words with specific code examples and priority-ranked improvements.
