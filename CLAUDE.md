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
This is a React + TypeScript + Vite application for creating Basic Fantasy Role-Playing Game (BFRPG) characters. The app uses:

- **React 19** with functional components and hooks
- **Wouter** for lightweight client-side routing
- **TailwindCSS v4** for styling
- **Firebase** for authentication and Firestore database
- **Vite** for build tooling with optimized chunk splitting

### Key Architecture Patterns

#### Data Flow
The application follows a wizard-based character creation flow with persistent state:
- `CharGen.tsx` orchestrates the multi-step character creation process
- Each step is a separate component in `src/components/features/`
- Character data is stored in localStorage during creation and synced to Firebase when authenticated
- All character state uses the `Character` interface from `src/types/character.ts`

#### State Management
- **Local State**: React hooks (`useState`, `useLocalStorage` custom hook)
- **Global State**: Custom hooks for auth (`useAuth`) and characters (`useCharacters`)
- **Persistence**: localStorage for draft characters, Firebase Firestore for saved characters
- **Validation**: Cascade validation system that automatically updates dependent fields

#### Component Organization
- `src/components/ui/` - Reusable UI components (Button, Modal, Stepper, etc.)
- `src/components/features/` - Feature-specific components for character creation steps
- `src/components/pages/` - Top-level page components
- `src/components/auth/` - Authentication-related components

#### Services Layer
- `src/services/characters.ts` - Firebase character CRUD operations
- `src/services/auth.ts` - Firebase authentication wrapper
- `src/services/characterValidation.ts` - Character validation logic
- `src/services/characterMigration.ts` - Data migration for character schema changes
- `src/services/dataLoader.ts` - Preloading critical game data

### Game Data System
Game data (races, classes, equipment, spells) is stored as TypeScript modules in `src/data/`:
- Each race/class is a separate .ts file with type-safe data
- Equipment and spells are JSON files loaded dynamically
- Data includes both core BFRPG content and supplemental content flags

### Firebase Integration
- Authentication with email/password
- Firestore database structure: `/users/{userId}/characters/{characterId}`
- Character migration system handles schema evolution

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
- **Dice Rolling**: Comprehensive dice notation parser (`src/utils/dice.ts`) supporting standard RPG dice expressions
- **Currency**: Utility functions for currency conversion between gold/silver/copper
- **Validation**: Schema-based validation with TypeScript type guards

## Working with Character Data

### Character Schema
The main `Character` interface includes:
- Abilities (6 standard D&D-style ability scores with modifiers)
- Race and class selection (classes stored as arrays for multi-class support)
- Equipment with detailed properties (weapons, armor, cost, weight)
- Currency system (gold, silver, copper, etc.)
- HP tracking and spell lists
- Settings object for feature flags and data versioning

### Data Migration
When modifying character schema:
1. Update the `Character` interface in `src/types/character.ts`
2. Add migration logic in `src/services/characterMigration.ts`
3. Increment version number in character settings

### Firebase Environment Variables
Required environment variables for Firebase (stored in `.env.local`):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`