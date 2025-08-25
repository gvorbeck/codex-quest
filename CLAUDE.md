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

### Code Review Prompt

⏺ Comprehensive React Component Code Review Prompt

Instructions

You are conducting a thorough code review of a React component and its dependencies. Perform a
systematic analysis covering all aspects of code quality, maintainability, and best practices.

Review Process

1. Component Discovery & Architecture Analysis

- Locate the target component and all its dependencies (child components, utilities, types)
- Map the component hierarchy and data flow patterns
- Analyze the component's role within the larger application architecture
- Document import/export patterns and circular dependencies

2. Code Quality Assessment

A. Code Duplication Analysis

- Identify duplicate logic within the component and across related files
- Measure the extent of duplication (lines, functions, patterns)
- Assess the maintainability risk of duplicated code
- Propose specific refactoring strategies with code examples

B. Complexity & Readability

- Evaluate cyclomatic complexity of functions and conditional logic
- Review nested conditionals and complex inline logic
- Assess function length and single responsibility adherence
- Check for unclear variable names, magic numbers, and hard-coded values

C. Performance Considerations

- Review React-specific performance patterns (memoization, key props, re-renders)
- Identify expensive operations that could be optimized
- Check for unnecessary effect dependencies and state updates
- Assess bundle size implications (unused imports, inline styles)

3. React Best Practices Review

A. Hooks Usage

- Verify proper hook dependency arrays (useEffect, useCallback, useMemo)
- Check for custom hooks that could replace duplicate logic
- Assess state management patterns and unnecessary state
- Review hook order and conditional usage

B. Component Patterns

- Evaluate prop drilling vs context usage
- Review component composition and reusability
- Check for proper TypeScript integration and type safety
- Assess error boundaries and error handling

C. Event Handling & Side Effects

- Review event handler patterns and performance implications
- Check for proper cleanup in useEffect hooks
- Assess async operations and race condition handling
- Verify form handling and validation patterns

4. Accessibility (WCAG 2.1 AA Compliance)

- Audit ARIA attributes, labels, and roles
- Test keyboard navigation and focus management
- Verify screen reader compatibility
- Check color contrast and semantic HTML usage
- Assess mobile accessibility and responsive design

5. UI/UX Component Integration

- Review design system consistency and component usage
- Identify inconsistent input components or styling patterns
- Check for inline styles vs design tokens/CSS classes
- Assess responsive design implementation
- Verify loading states, error states, and empty states

6. Code Organization & Maintainability

- Evaluate file structure and import organization
- Review separation of concerns (business logic vs UI)
- Assess utility function extraction opportunities
- Check for proper error handling and edge cases
- Review documentation and code comments

7. Testing & Quality Assurance

- Check for testability (pure functions, isolated logic)
- Review potential testing gaps and edge cases
- Assess mock-ability and dependency injection
- Verify error scenarios are handled gracefully

8. Security & Data Handling

- Review input validation and sanitization
- Check for XSS vulnerabilities and unsafe patterns
- Assess sensitive data exposure in logs or state
- Verify proper form data handling

9. Integration & Dependencies

- Review external library usage and version compatibility
- Check for unused dependencies and imports
- Assess API integration patterns and error handling
- Verify proper data transformation and validation

Deliverables

Summary Report Structure

Provide a comprehensive report with:

1. Executive Summary - Overall component health and key findings
2. Strengths - What the component does well
3. Critical Issues - High-priority problems requiring immediate attention
4. Improvement Opportunities - Medium-priority enhancements
5. Minor Issues - Low-priority polish items
6. Code Quality Metrics - Before/after comparisons if applicable
7. Specific Recommendations - Actionable items with code examples
8. Implementation Roadmap - Prioritized list of changes

For Each Issue Identified:

- Severity Level (Critical/High/Medium/Low)
- Category (Performance/Security/Accessibility/Maintainability/etc.)
- Current Code Example - Show the problematic pattern
- Proposed Solution - Provide specific refactoring suggestions
- Impact Assessment - Benefits of making the change
- Implementation Notes - Any gotchas or considerations

Code Quality Scoring

Rate each area on a scale:

- 🔴 Critical Issues - Must fix before production
- 🟡 Needs Improvement - Should address soon
- 🟢 Good - Meets standards
- ✨ Excellent - Exemplary implementation

Additional Considerations

Context Gathering

- Ask clarifying questions about the component's purpose and constraints
- Consider the development team's skill level and codebase conventions
- Account for technical debt vs new feature development priorities
- Understand performance requirements and user experience goals

Implementation Support

- Provide working code examples for all suggestions
- Consider backwards compatibility when proposing changes
- Suggest migration strategies for breaking changes
- Offer alternative solutions with trade-off analysis

Follow-up Actions

- Prioritize recommendations by impact and effort required
- Suggest testing strategies for validating improvements
- Recommend monitoring for performance or accessibility metrics
- Identify opportunities for broader codebase improvements

Review Methodology Notes

- Be thorough but constructive - Focus on education and improvement
- Provide concrete examples - Show don't just tell
- Consider the bigger picture - How changes affect the overall application
- Balance perfectionism with pragmatism - Prioritize high-impact improvements
- Maintain coding standards - Ensure suggestions align with project conventions

Use this prompt to conduct systematic, comprehensive code reviews that improve code quality,
maintainability, and team knowledge while ensuring excellent user experience and accessibility.
