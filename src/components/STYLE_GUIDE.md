# Codex.Quest UI Style Guide

**React 19 + TypeScript 5.9 + TailwindCSS 4.1 + Modern Development Patterns**

---

## Table of Contents

1. [Component Declaration Patterns](#component-declaration-patterns)
2. [TypeScript Best Practices](#typescript-best-practices)
3. [Performance Optimization](#performance-optimization)
4. [Design System Usage](#design-system-usage)
5. [Component Architecture](#component-architecture)
6. [State Management Patterns](#state-management-patterns)
7. [Testing & Accessibility](#testing--accessibility)
8. [File Organization](#file-organization)
9. [Development Workflow](#development-workflow)

---

## Component Declaration Patterns

### Function Declarations (Preferred)

```typescript
// ✅ Preferred: Named function declarations for better debugging
export function ComponentName({ prop }: ComponentNameProps) {
  return <div>{prop}</div>;
}

// ✅ With forwardRef for DOM refs
export const ComponentName = forwardRef<HTMLButtonElement, ComponentNameProps>(
  function ComponentName({ prop }, ref) {
    return <button ref={ref}>{prop}</button>;
  }
);

// ✅ With memo for performance-critical components
export const ComponentName = memo(function ComponentName({ 
  character, 
  onCharacterChange 
}: ComponentNameProps) {
  const memoizedData = useMemo(() => 
    processCharacterData(character), [character]
  );
  
  return <div>{memoizedData}</div>;
});

// 🟡 Acceptable: Arrow functions for simple components
export const ComponentName: React.FC<ComponentNameProps> = ({ prop }) => (
  <div>{prop}</div>
);
```

**Key Guidelines:**
- Use **named function declarations** for main components (better stack traces)
- Use **forwardRef** for DOM element access (buttons, inputs, etc.)
- Use **memo** for expensive re-render prevention
- Always provide **displayName** for forwardRef components

---

## TypeScript Best Practices

### Interface Design

```typescript
// ✅ Extend base HTML attributes for DOM components
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

// ✅ Use strict typing for BFRPG domain objects
interface Character {
  readonly id: string;
  name: string;
  race: string;
  class: readonly string[]; // Multi-class support
  abilities: {
    readonly [K in AbilityScore]: {
      readonly value: number;
      readonly modifier: number;
    };
  };
  customRace?: CustomRace;
  customClasses?: Record<string, CustomClass>;
}

// ✅ Use discriminated unions for variant props
type CardVariant = 
  | { variant: "info"; severity?: "low" | "high" }
  | { variant: "success"; showIcon?: boolean }
  | { variant: "standard" }
  | { variant: "hero"; backgroundImage?: string };

// ✅ Generic utility types for common patterns
type WithChildren<T = {}> = T & { children: ReactNode };
type WithClassName<T = {}> = T & { className?: string };
type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
```

### Type Guards & Validation

```typescript
// ✅ Runtime type guards for API data
export function isCustomClass(classId: string): classId is CustomClassId {
  return classId.startsWith("custom-");
}

export function isValidCharacter(data: unknown): data is Character {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "abilities" in data
  );
}

// ✅ Use with error boundaries and data validation
function processCharacterData(rawData: unknown): Character {
  if (!isValidCharacter(rawData)) {
    throw new Error("Invalid character data structure");
  }
  return rawData;
}
```

---

## Performance Optimization

### React 19 Patterns

```typescript
// ✅ Use memo for expensive components (character creation steps)
export const ClassStep = memo(function ClassStep({
  character,
  onCharacterChange,
  includeSupplementalClass,
}: ClassStepProps) {
  // Memoize expensive filtering operations
  const availableClasses = useMemo(() => 
    allClasses.filter(cls => 
      includeSupplementalClass || !cls.supplementalContent
    ), [includeSupplementalClass]
  );

  // Memoize callback handlers to prevent child re-renders
  const handleClassChange = useCallback((classId: string) => {
    const updatedCharacter = cascadeValidateCharacter(
      { ...character, class: [classId] },
      getRaceById(character.race),
      availableClasses
    );
    onCharacterChange(updatedCharacter);
  }, [character, availableClasses, onCharacterChange]);

  return (
    <StepWrapper title="Choose Your Class">
      <ClassSelector 
        classes={availableClasses}
        selectedClass={character.class[0]}
        onClassSelect={handleClassChange}
      />
    </StepWrapper>
  );
});

// ✅ Optimize expensive calculations
function useCharacterStats(character: Character) {
  const calculatedStats = useMemo(() => ({
    totalModifiers: Object.values(character.abilities).reduce(
      (sum, ability) => sum + ability.modifier, 0
    ),
    hitDie: getHitDie(character, allClasses),
    canCastSpells: canCastSpells(character, allClasses),
    savingThrows: calculateSavingThrows(character),
  }), [character]);

  return calculatedStats;
}
```

### Code Splitting & Lazy Loading

```typescript
// ✅ Lazy load modals and heavy components
const CharacterSheet = lazy(() => 
  import("@/components/pages/CharacterSheet")
);

const EncounterGeneratorModal = lazy(() => 
  import("@/components/modals/game/EncounterGeneratorModal")
);

// ✅ Suspense boundaries with meaningful fallbacks
function CharacterManagement() {
  return (
    <ErrorBoundary fallback={<CharacterErrorFallback />}>
      <Suspense fallback={
        <LoadingState 
          message="Loading character sheet..." 
          skeleton="character-sheet"
        />
      }>
        <CharacterSheet />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Design System Usage

### TailwindCSS 4.1 Semantic Tokens

```typescript
// ✅ Use semantic color tokens from tailwind.config.js
const colorClasses = {
  // Text hierarchy
  textPrimary: "text-text-primary",     // #f4f4f5 (zinc-100)
  textSecondary: "text-text-secondary", // #a1a1aa (zinc-400)  
  textMuted: "text-text-muted",         // #71717a (zinc-500)
  
  // Background layers
  bgPrimary: "bg-background-primary",     // #18181b (zinc-900)
  bgSecondary: "bg-background-secondary", // #27272a (zinc-800)
  bgTertiary: "bg-background-tertiary",   // #3f3f46 (zinc-700)
  
  // Interactive elements
  highlight: "text-highlight-400",        // #fbbf24 (amber-400)
  accent: "text-accent-100",              // #f5f5f4 (stone-100)
  
  // Borders
  border: "border-border",                // #52525b (zinc-600)
  borderLight: "border-border-light",     // #71717a (zinc-500)
};

// ✅ Card variants for consistent styling
<Card variant="info">       {/* Amber accent, for informational content */}
<Card variant="success">    {/* Lime accent, for positive states */}
<Card variant="standard">   {/* Default styling */}
<Card variant="hero">       {/* Gradient backgrounds for headers */}
<Card variant="nested">     {/* Reduced padding for nested content */}
<Card variant="gradient">   {/* Interactive hover effects */}

// ❌ Avoid hardcoded Tailwind classes
<div className="text-zinc-100 bg-amber-500"> {/* Don't do this */}
<div className="text-text-primary bg-highlight-400"> {/* Do this */}
```

### Component Size & Spacing System

```typescript
// ✅ Consistent sizing across components
interface ComponentSizeProps {
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base", // Default
  lg: "px-6 py-3 text-lg",
};

// ✅ Use design tokens from constants
import { DESIGN_TOKENS } from "@/constants";

const spacing = {
  xs: DESIGN_TOKENS.spacing.xs,    // 0.5rem
  sm: DESIGN_TOKENS.spacing.sm,    // 1rem  
  md: DESIGN_TOKENS.spacing.md,    // 1.5rem
  lg: DESIGN_TOKENS.spacing.lg,    // 2rem
  xl: DESIGN_TOKENS.spacing.xl,    // 3rem
};
```

---

## Component Architecture

### Business Logic Separation

```typescript
// ✅ Extract BFRPG business logic to custom hooks
function useCharacterValidation(
  character: Character, 
  availableRaces: Race[],
  availableClasses: Class[]
) {
  const validation = useMemo(() => {
    const errors: ValidationError[] = [];
    
    // Race validation
    if (!character.race) {
      errors.push({ field: "race", message: "Race is required" });
    }
    
    // Class validation  
    if (character.class.length === 0) {
      errors.push({ field: "class", message: "At least one class is required" });
    }
    
    // Multi-class restrictions (only elves/dokkalfar)
    if (character.class.length > 1) {
      const race = getRaceById(character.race);
      if (!race?.allowsMultiClass) {
        errors.push({ 
          field: "class", 
          message: "Only elves and dokkalfar can have multiple classes" 
        });
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      hasWarnings: false, // Future: ability score warnings, etc.
    };
  }, [character, availableRaces, availableClasses]);

  return validation;
}

// ✅ Clean UI components focused on presentation
function RaceStep({ character, onCharacterChange }: RaceStepProps) {
  const validation = useCharacterValidation(character, allRaces, allClasses);
  const [selectedRace, setSelectedRace] = useState(character.race);

  const handleRaceSelect = useCallback((raceId: string) => {
    const updatedCharacter = cascadeValidateCharacter(
      { ...character, race: raceId },
      getRaceById(raceId),
      allClasses
    );
    onCharacterChange(updatedCharacter);
  }, [character, onCharacterChange]);

  return (
    <StepWrapper title="Choose Your Race" validation={validation}>
      <RaceSelector 
        races={allRaces}
        selectedRace={selectedRace}
        onRaceSelect={handleRaceSelect}
      />
    </StepWrapper>
  );
}
```

### Composition Patterns

```typescript
// ✅ Feature-based composition for BFRPG features
export function CharacterCreationWizard() {
  return (
    <WizardContainer totalSteps={8}>
      <AbilityScoreStep stepNumber={1} />
      <RaceStep stepNumber={2} />
      <ClassStep stepNumber={3} />
      <SpellSelectionStep stepNumber={4} />
      <EquipmentStep stepNumber={5} />
      <LanguageStep stepNumber={6} />
      <PersonalizationStep stepNumber={7} />
      <ReviewStep stepNumber={8} />
    </WizardContainer>
  );
}

// ✅ Compound components for related functionality
export function GameSession({ game }: GameSessionProps) {
  return (
    <PageWrapper title={`Game: ${game.name}`}>
      <GameSession.Tabs>
        <GameSession.Tab label="Players" icon="users">
          <PlayersList game={game} />
        </GameSession.Tab>
        <GameSession.Tab label="Combat" icon="sword">
          <CombatTracker game={game} />
        </GameSession.Tab>
        <GameSession.Tab label="Resources" icon="scroll">
          <ResourceLibrary game={game} />
        </GameSession.Tab>
      </GameSession.Tabs>
    </PageWrapper>
  );
}
```

---

## State Management Patterns

### TanStack Query (Server State)

```typescript
// ✅ Centralized query keys with factory pattern
export const queryKeys = {
  characters: {
    all: (userId: string) => ["characters", userId] as const,
    detail: (userId: string, charId: string) => 
      ["characters", userId, charId] as const,
    summary: (userId: string, charId: string) => 
      ["characters", userId, charId, "summary"] as const,
  },
  games: {
    all: (userId: string) => ["games", userId] as const,
    detail: (userId: string, gameId: string) => 
      ["games", userId, gameId] as const,
  },
} as const;

// ✅ Optimistic updates for character modifications
function useCharacterMutations(userId: string) {
  const queryClient = useQueryClient();

  const updateCharacter = useMutation({
    mutationFn: async ({ characterId, updates }: UpdateCharacterParams) => {
      return await updateCharacterInFirebase(userId, characterId, updates);
    },
    
    onMutate: async ({ characterId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.characters.detail(userId, characterId)
      });

      // Snapshot previous value
      const previousCharacter = queryClient.getQueryData(
        queryKeys.characters.detail(userId, characterId)
      );

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.characters.detail(userId, characterId),
        (old: Character | undefined) => old ? { ...old, ...updates } : undefined
      );

      return { previousCharacter };
    },

    onError: (_err, { characterId }, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.characters.detail(userId, characterId),
        context?.previousCharacter
      );
    },
  });

  return { updateCharacter };
}
```

### Zustand (Client State)

```typescript
// ✅ Typed Zustand stores with persistence
interface CharacterStore {
  // Draft character during creation
  draftCharacter: Character;
  currentStep: number;
  
  // User preferences
  preferences: {
    includeSupplementalRace: boolean;
    includeSupplementalClass: boolean;
    useCombinationClass: boolean;
    customClassMagicToggle: boolean;
  };

  // Actions
  updateDraft: (character: Character) => void;
  clearDraft: () => void;
  setStep: (step: number) => void;
  updatePreferences: (updates: Partial<CharacterStore['preferences']>) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      draftCharacter: createEmptyCharacter(),
      currentStep: 0,
      preferences: {
        includeSupplementalRace: false,
        includeSupplementalClass: false,
        useCombinationClass: false,
        customClassMagicToggle: false,
      },

      updateDraft: (character) => set({ draftCharacter: character }),
      
      clearDraft: () => set({ 
        draftCharacter: createEmptyCharacter(), 
        currentStep: 0 
      }),
      
      setStep: (step) => set({ currentStep: step }),
      
      updatePreferences: (updates) => set((state) => ({
        preferences: { ...state.preferences, ...updates }
      })),
    }),
    {
      name: "character-creation-store",
      version: 1,
    }
  )
);
```

---

## Testing & Accessibility

### Accessibility Standards

```typescript
// ✅ Semantic HTML and ARIA attributes
export function CharacterCard({ character }: CharacterCardProps) {
  const cardId = useId();
  const descriptionId = `${cardId}-description`;

  return (
    <article 
      className="character-card"
      aria-labelledby={`${cardId}-name`}
      aria-describedby={descriptionId}
    >
      <h3 id={`${cardId}-name`} className="text-text-primary">
        {character.name}
      </h3>
      
      <div id={descriptionId} className="text-text-secondary">
        Level {character.level} {character.race} {character.class.join("/")}
      </div>
      
      <button
        aria-label={`Edit ${character.name}`}
        className="focus:ring-2 focus:ring-highlight-400"
      >
        <Icon name="edit" aria-hidden="true" />
      </button>
    </article>
  );
}

// ✅ Screen reader announcements for dynamic content
function useStepAnnouncements(currentStep: number, totalSteps: number) {
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announceRef.current) {
      announceRef.current.textContent = 
        `Step ${currentStep + 1} of ${totalSteps}`;
    }
  }, [currentStep, totalSteps]);

  return (
    <div
      ref={announceRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
```

### Error Boundaries

```typescript
// ✅ Contextual error boundaries for different app sections
export function CharGenErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <Card variant="info" className="max-w-md mx-auto mt-8">
          <Typography variant="h3" className="text-text-primary mb-4">
            Character Creation Error
          </Typography>
          <Typography variant="body" className="text-text-secondary mb-4">
            There was a problem with the character creation wizard. 
            Your progress has been saved.
          </Typography>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
          >
            Reload Wizard
          </Button>
        </Card>
      )}
      onError={(error, errorInfo) => {
        logger.error("Character creation error:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## File Organization

```
src/
├── components/
│   ├── ui/                    # Design system components
│   │   ├── core/
│   │   │   ├── primitives/    # Button, Input, Select, etc.
│   │   │   ├── display/       # Card, Typography, Icon, etc.
│   │   │   ├── feedback/      # Notification, Tooltip, Loading, etc.
│   │   │   └── layout/        # PageWrapper, Tabs, etc.
│   │   └── composite/         # Complex UI (StatGrid, FeatureCard, etc.)
│   ├── features/              # Domain-specific components
│   │   ├── character/
│   │   │   ├── creation/      # Character wizard steps
│   │   │   ├── management/    # Character CRUD
│   │   │   ├── sheet/         # Character sheet display
│   │   │   └── shared/        # Reusable character components  
│   │   └── game/              # Game session components
│   ├── pages/                 # Top-level page components
│   └── modals/                # Modal dialogs (lazy loaded)
├── hooks/                     # Custom hooks organized by domain
│   ├── auth/                  # Authentication hooks
│   ├── character/             # Character-specific business logic
│   ├── data/                  # Data fetching and caching
│   ├── forms/                 # Form validation and handling
│   └── mutations/             # TanStack Query mutations
├── services/                  # Firebase and external API services
├── stores/                    # Zustand client state stores
├── types/                     # TypeScript type definitions
├── utils/                     # Pure utility functions
├── validation/                # Form and data validation schemas
├── constants/                 # App constants and design tokens
└── data/                      # Static BFRPG data (races, classes, etc.)
```

---

## Development Workflow

### Code Quality Standards

```bash
# ✅ Development commands
npm run dev          # Vite dev server with HMR
npm run build        # TypeScript check + production build  
npm run lint         # ESLint with React 19 rules
npm run preview      # Preview production build

# ✅ Pre-commit hooks (Husky)
- ESLint checking
- TypeScript compilation
- Prettier formatting
- No console.log statements (except in logger.ts)
```

### Performance Monitoring

```typescript
// ✅ Bundle analysis and monitoring
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React bundle (critical path)
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }
          
          // Firebase services 
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }
          
          // BFRPG data (can be lazy loaded)
          if (id.includes('/data/')) {
            return 'game-data';
          }
          
          // Modals (lazy loaded)
          if (id.includes('/modals/')) {
            return 'modals';
          }
        },
      },
    },
  },
});
```

### Migration Guidelines

**When updating existing components:**

1. **Modernize TypeScript**: Replace `any` with proper types
2. **Add Performance**: Use `memo()`, `useMemo()`, `useCallback()` where appropriate  
3. **Improve Accessibility**: Add ARIA attributes and semantic HTML
4. **Update Styling**: Replace hardcoded classes with semantic tokens
5. **Extract Logic**: Move business logic to custom hooks
6. **Add Error Boundaries**: Wrap feature areas in contextual error boundaries

**Component Creation Checklist:**

- [ ] Uses named function declarations or proper `forwardRef`
- [ ] Includes comprehensive TypeScript interfaces
- [ ] Implements proper error boundaries
- [ ] Uses semantic HTML and ARIA attributes 
- [ ] Follows design system patterns (colors, spacing, variants)
- [ ] Includes performance optimizations where needed
- [ ] Extracts business logic to custom hooks
- [ ] Uses proper file naming and organization

---

*This style guide reflects the current Codex.Quest architecture using React 19, TypeScript 5.9, TailwindCSS 4.1, TanStack Query, Zustand, and Firebase. Always prioritize maintainability, performance, and accessibility in your implementations.*

### 2. Performance Optimization
```typescript
// ✅ Memo expensive components
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // expensive calculations
  return <div>{processedData}</div>;
});

// ✅ Memoize expensive calculations
const processedData = useMemo(() => 
  expensiveCalculation(data), [data]
);

// ✅ Memoize callbacks passed to children
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

### 3. Design System Usage

#### Card Variants
```typescript
// ✅ Use design system variants
<Card variant="gradient">    // For cards with hover effects
<Card variant="hero">        // For hero sections
<Card variant="info">        // For information displays
<Card variant="success">     // For success states
<Card variant="standard">    // Default variant
<Card variant="nested">      // For nested content
```

#### Color Patterns
```typescript
// ✅ Use semantic color tokens
className="text-text-primary"      // Primary text (#f4f4f5)
className="text-text-secondary"    // Secondary text (#a1a1aa)
className="text-text-muted"        // Muted text (#71717a)
className="bg-background-primary"  // Primary background (#18181b)
className="bg-background-secondary"// Secondary background (#27272a)
className="bg-background-tertiary" // Tertiary background (#3f3f46)
className="border-border"          // Standard borders (#52525b)
className="border-border-light"    // Light borders (#71717a)
className="text-highlight-400"     // Accent colors (#fbbf24)

// ✅ Use primary/accent color scales
className="text-primary-100"       // Light text
className="bg-primary-900"         // Dark backgrounds
className="text-highlight-400"     // Interactive elements
className="text-accent-100"        // Subtle accents

// ❌ Avoid hardcoded colors
className="text-zinc-100"         // Don't hardcode
className="bg-amber-500"          // Use semantic tokens
```

## Component Architecture

### 1. Business Logic Separation
```typescript
// ✅ Extract business logic to hooks (BFRPG character creation example)
function useCharacterAbilities(character: Character) {
  const calculateModifier = useCallback((score: number) => 
    Math.floor((score - 10) / 2), []);
  
  const updateAbility = useCallback((ability: AbilityScore, value: number) => {
    const updatedCharacter = {
      ...character,
      abilities: { ...character.abilities, [ability]: value }
    };
    return updatedCharacter;
  }, [character]);
  
  const totalBonuses = useMemo(() => 
    Object.values(character.abilities).reduce((sum, score) => 
      sum + calculateModifier(score), 0
    ), [character.abilities, calculateModifier]);
  
  return { calculateModifier, updateAbility, totalBonuses };
}

// ✅ Clean UI component
function AbilitiesStep({ character, onCharacterChange }: CharacterStepProps) {
  const { calculateModifier, updateAbility } = useCharacterAbilities(character);
  
  return (
    <StepWrapper title="Ability Scores" description="Roll or assign your character's abilities">
      <StatGrid abilities={character.abilities} onUpdate={updateAbility} />
    </StepWrapper>
  );
}
```

### 2. Component Composition (BFRPG Examples)
```typescript
// ✅ Use composition for character creation
<StepWrapper 
  title="Choose Your Race"
  description="Select a race for your BFRPG character"
  currentStep={2}
  totalSteps={8}
>
  <Card variant="info">
    <Typography variant="body">
      Your race determines starting bonuses and special abilities.
    </Typography>
  </Card>
  <RaceSelector 
    selectedRace={character.race}
    onRaceSelect={handleRaceChange}
    showSupplemental={settings.supplementalContent}
  />
</StepWrapper>

// ✅ Use feature components for game features
<FeatureCard 
  icon="dice"
  title="Dice Rolling"
  description="Roll dice with BFRPG notation (1d20+2, 3d6, etc.)"
/>

<FeatureCard 
  icon="character"
  title="Character Creation"
  description="Create BFRPG characters with guided wizard"
/>

// ✅ Game management composition
<PageWrapper title="Game Session">
  <Tabs>
    <Tab label="Players" icon="users">
      <PlayersList game={game} />
    </Tab>
    <Tab label="Combat" icon="sword">
      <CombatTracker game={game} />
    </Tab>
  </Tabs>
</PageWrapper>
```

### 3. Code Splitting (BFRPG Modal Examples)
```typescript
// ✅ Lazy load BFRPG game modals
const EncounterGeneratorModal = lazy(() => 
  import('./modals/game/EncounterGeneratorModal')
);

const TreasureGeneratorModal = lazy(() => 
  import('./modals/game/TreasureGeneratorModal')
);

const CombatTrackerModal = lazy(() => 
  import('./modals/game/CombatTrackerModal')
);

// ✅ Character creation modals
const CantripModal = lazy(() => 
  import('./modals/character/CantripModal')
);

const MUAddSpellModal = lazy(() => 
  import('./modals/character/MUAddSpellModal')
);

// ✅ Use Suspense boundaries with BFRPG loading states
<Suspense fallback={<LoadingState message="Loading character wizard..." />}>
  <CharacterCreationModal />
</Suspense>

<Suspense fallback={<LoadingState message="Loading encounter generator..." />}>
  <EncounterGeneratorModal />
</Suspense>
```

## Performance Guidelines

### Bundle Size Optimization
- Lazy load components > 50KB
- Use dynamic imports for modals
- Implement proper code splitting
- Avoid importing entire libraries

### React Optimization
- Use `memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers passed to children
- Minimize re-renders with proper dependency arrays

### Accessibility Standards
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

## File Organization

```
src/components/
  ui/
    design-system/     # Core design tokens (Card, Typography, Badge)
    inputs/           # Form controls (Button, TextInput, Select, NumberInput, TextArea, Switch, 
                      # Checkbox, OptionToggle, FileUpload, EditableValue, FloatingActionButton, FormField)
    feedback/         # User feedback (Notification, Tooltip, LoadingState, Callout, InfoTooltip, 
                      # TooltipWrapper, Skeleton, ErrorBoundary, NotificationContainer)
    display/          # Data display (StatCard, Icon, Table, List, MarkdownText, ItemGrid, Stepper, 
                      # BaseCard, DetailSection, Details, StatusIndicator, SectionHeader, HorizontalRule, 
                      # Breadcrumb, SimpleRoller, SkillDescriptionItem, RequirementCard, FeatureCard, 
                      # HeroSection, InfoCardHeader, TextHeader, StatGrid)
    layout/           # Layout components (PageWrapper, Tabs, Accordion, StepWrapper, SectionWrapper)
    dice/             # Dice components (RollableButton)
  character/
    creation/         # Character creation wizard
    management/       # Character CRUD operations
    sheet/            # Character sheet display
    shared/           # Reusable character components
  game/
    management/       # Game session CRUD
    sheet/            # Game session management
  pages/              # Top-level page components
  modals/             # Modal dialogs (lazy loaded)
    base/             # Base modal component (Modal)
    auth/             # Authentication modals
    character/        # Character-related modals
    game/             # Game-related modals
    feedback/         # Feedback and confirmation modals
```

## Migration Checklist

### Replacing Custom Styles
- [ ] Replace hardcoded gradients with Card variants
- [ ] Use FeatureCard for feature displays  
- [ ] Use HeroSection for hero displays
- [ ] Replace custom padding/margins with size props
- [ ] Use semantic color tokens instead of hardcoded colors

### Performance Optimization
- [ ] Add memo() to expensive components
- [ ] Add useMemo() for calculations
- [ ] Add useCallback() for event handlers
- [ ] Implement lazy loading for large components
- [ ] Add Suspense boundaries

### Type Safety
- [ ] Replace `any` types with proper interfaces
- [ ] Add proper prop types to all components
- [ ] Use type guards for runtime validation
- [ ] Implement proper error boundaries