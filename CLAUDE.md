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

### Code Review Prompt

⚠️ **CRITICAL PRIORITY: UI Component Usage** ⚠️

Before conducting the standard code review, **FIRST** perform a thorough audit of UI component usage:

**🔍 UI Component Duplication Assessment (HIGHEST PRIORITY)**

1. **Scan for Custom UI Implementation:**
   - Search for inline styles, custom CSS classes, or hardcoded styling
   - Identify any custom button, input, card, modal, or layout implementations
   - Flag any component that recreates functionality available in `/src/components/ui/`

2. **Available UI Components Inventory:**
   - **Design System**: Card, Typography, Badge (from `/src/components/ui/design-system/`)
   - **Inputs**: Button, Select, TextInput, NumberInput, TextArea, Switch, OptionToggle, FileUpload, EditableValue, FloatingActionButton
   - **Feedback**: Modal, Notification, Tooltip, LoadingState, Callout, InfoTooltip, TooltipWrapper
   - **Display**: StatCard, ItemGrid, Stepper, BaseCard, DetailSection, Details, StatusIndicator, SectionHeader, Icon, HorizontalRule, Breadcrumb, SimpleRoller, SkillDescriptionItem, RequirementCard
   - **Layout**: Accordion, Tabs, PageWrapper, StepWrapper, SectionWrapper
   - **Dice**: RollableButton

3. **Code Duplication Red Flags:**
   - Multiple components implementing similar button styles → Use `Button` component
   - Custom modal implementations → Use `Modal` component
   - Hardcoded card layouts → Use `Card` or `BaseCard` components
   - Custom input styling → Use appropriate input components
   - Repeated stat display patterns → Use `StatCard` or `StatGrid`
   - Custom loading spinners → Use `LoadingState` component
   - Inline typography styles → Use `Typography` component
   - Custom tooltip implementations → Use `Tooltip` or `InfoTooltip`

4. **Mandatory Refactoring Requirements:**
   - **🔴 CRITICAL**: Any custom UI implementation that duplicates existing UI components must be flagged for immediate refactoring
   - **🔴 CRITICAL**: Provide specific examples showing how to replace custom implementations with existing UI components
   - **🔴 CRITICAL**: Calculate the lines of code that could be eliminated by using UI components
   - **🔴 CRITICAL**: Prioritize UI component adoption over all other code review feedback

---

⏺ **Comprehensive React Component Code Review Prompt**

**Instructions**

You are conducting a thorough code review of a React component and its dependencies. **UI component usage takes absolute priority** - any component not leveraging the existing UI component library is considered critically deficient.

**Review Process**

1. **Component Discovery & Architecture Analysis**

- Locate the target component and all its dependencies (child components, utilities, types)
- Map the component hierarchy and data flow patterns
- Analyze the component's role within the larger application architecture
- Document import/export patterns and circular dependencies
- **🔥 PRIORITY**: Identify all opportunities to use existing UI components

2. **Code Quality Assessment**

A. **UI Component Usage Analysis (HIGHEST PRIORITY)**

- **MANDATORY**: Cross-reference every UI element with available components in `/src/components/ui/`
- Identify custom implementations that should use existing UI components
- Calculate potential code reduction from UI component adoption
- Flag any styling patterns that bypass the design system
- **Rate UI component usage**: ✨ Excellent (100% usage) → 🔴 Critical (significant custom UI)

B. **Code Duplication Analysis**

- Identify duplicate logic within the component and across related files
- Measure the extent of duplication (lines, functions, patterns)
- Assess the maintainability risk of duplicated code
- **Prioritize UI component consolidation over other refactoring**
- Propose specific refactoring strategies with code examples

C. **Complexity & Readability**

- Evaluate cyclomatic complexity of functions and conditional logic
- Review nested conditionals and complex inline logic
- Assess function length and single responsibility adherence
- Check for unclear variable names, magic numbers, and hard-coded values
- **Flag complex UI logic that could be simplified with UI components**

D. **Performance Considerations**

- Review React-specific performance patterns (memoization, key props, re-renders)
- Identify expensive operations that could be optimized
- Check for unnecessary effect dependencies and state updates
- Assess bundle size implications (unused imports, inline styles)
- **Consider performance benefits of UI component consolidation**

3. **React Best Practices Review**

A. **Hooks Usage**

- Verify proper hook dependency arrays (useEffect, useCallback, useMemo)
- Check for custom hooks that could replace duplicate logic
- Assess state management patterns and unnecessary state
- Review hook order and conditional usage

B. **Component Patterns**

- Evaluate prop drilling vs context usage
- Review component composition and reusability
- Check for proper TypeScript integration and type safety
- Assess error boundaries and error handling
- **🔥 CRITICAL**: Find instances ripe for replacement by ui and design-system components

C. **Event Handling & Side Effects**

- Review event handler patterns and performance implications
- Check for proper cleanup in useEffect hooks
- Assess async operations and race condition handling
- Verify form handling and validation patterns

4. **Accessibility (WCAG 2.1 AA Compliance)**

- Audit ARIA attributes, labels, and roles
- Test keyboard navigation and focus management
- Verify screen reader compatibility
- Check color contrast and semantic HTML usage
- Assess mobile accessibility and responsive design
- **Note**: UI components should handle most accessibility concerns automatically

5. **UI/UX Component Integration (EXPANDED PRIORITY SECTION)**

- **🔥 PRIMARY FOCUS**: Review design system consistency and component usage
- **🔴 CRITICAL**: Identify inconsistent input components or styling patterns
- **🔴 CRITICAL**: Flag any inline styles vs design tokens/CSS classes
- **🔴 CRITICAL**: Check for custom components that duplicate UI component functionality
- Assess responsive design implementation
- Verify loading states, error states, and empty states use appropriate UI components
- **Provide specific migration paths to UI components**

6. **Code Organization & Maintainability**

- Evaluate file structure and import organization
- Review separation of concerns (business logic vs UI)
- Assess utility function extraction opportunities
- Check for proper error handling and edge cases
- Review documentation and code comments
- **Prioritize UI component import consolidation**

7. **Testing & Quality Assurance**

- Check for testability (pure functions, isolated logic)
- Review potential testing gaps and edge cases
- Assess mock-ability and dependency injection
- Verify error scenarios are handled gracefully

8. **Security & Data Handling**

- Review input validation and sanitization
- Check for XSS vulnerabilities and unsafe patterns
- Assess sensitive data exposure in logs or state
- Verify proper form data handling

9. **Integration & Dependencies**

- Review external library usage and version compatibility
- Check for unused dependencies and imports
- Assess API integration patterns and error handling
- Verify proper data transformation and validation

**Deliverables**

**Summary Report Structure**

Provide a comprehensive report with **UI Component Usage as the top section**:

1. **🔥 UI Component Usage Assessment** - Detailed analysis of existing UI component adoption vs custom implementations
2. Executive Summary - Overall component health and key findings
3. Strengths - What the component does well
4. Critical Issues - High-priority problems requiring immediate attention
5. Improvement Opportunities - Medium-priority enhancements
6. Minor Issues - Low-priority polish items
7. Code Quality Metrics - Before/after comparisons if applicable
8. Specific Recommendations - Actionable items with code examples
9. Implementation Roadmap - **UI component migration first**, then other changes

**For Each Issue Identified:**

- Severity Level (Critical/High/Medium/Low) - **UI component issues are automatically Critical**
- Category (UI-Components/Performance/Security/Accessibility/Maintainability/etc.)
- Current Code Example - Show the problematic pattern
- Proposed Solution - **Provide specific UI component replacements**
- Impact Assessment - Benefits of making the change
- Implementation Notes - Any gotchas or considerations

**Code Quality Scoring**

Rate each area on a scale:

- 🔴 Critical Issues - Must fix before production (**UI component non-usage is always Critical**)
- 🟡 Needs Improvement - Should address soon
- 🟢 Good - Meets standards
- ✨ Excellent - Exemplary implementation

**Additional Considerations**

**Context Gathering**

- Ask clarifying questions about the component's purpose and constraints
- Consider the development team's skill level and codebase conventions
- Account for technical debt vs new feature development priorities
- Understand performance requirements and user experience goals
- **Emphasize the importance of UI component consistency across the codebase**

**Implementation Support**

- **🔥 PRIORITY**: Provide working code examples showing UI component replacements
- Consider backwards compatibility when proposing changes
- Suggest migration strategies for breaking changes
- Offer alternative solutions with trade-off analysis
- **Focus first on UI component migration examples**

**Follow-up Actions**

- **🔥 TOP PRIORITY**: UI component adoption and custom UI elimination
- Prioritize recommendations by impact and effort required
- Suggest testing strategies for validating improvements
- Recommend monitoring for performance or accessibility metrics
- Identify opportunities for broader codebase improvements

**Review Methodology Notes**

- Be thorough but constructive - Focus on education and improvement
- **🔥 EMPHASIZE**: The critical importance of using existing UI components over custom implementations
- Provide concrete examples - Show don't just tell
- Consider the bigger picture - How changes affect the overall application
- Balance perfectionism with pragmatism - **UI component usage is non-negotiable**
- Maintain coding standards - Ensure suggestions align with project conventions

**Use this prompt to conduct systematic, comprehensive code reviews that prioritize UI component adoption, eliminate code duplication, and improve maintainability while ensuring excellent user experience and accessibility.**
