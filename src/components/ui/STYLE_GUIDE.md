# UI Component Style Guide

## Component Patterns

### 1. Function Declarations (Preferred)
```typescript
// ✅ Preferred pattern
export function ComponentName({ prop }: Props) {
  return <div>{prop}</div>;
}

// 🟡 Acceptable for compatibility or specific use cases
export const ComponentName: React.FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};

// ✅ Use with forwardRef when needed
export const ComponentName = forwardRef<HTMLButtonElement, Props>(
  function ComponentName({ prop }, ref) {
    return <button ref={ref}>{prop}</button>;
  }
);
```

**Note**: While function declarations are preferred for consistency and better debugging, React.FC patterns are acceptable in existing codebases for compatibility. Choose one pattern per file/feature for consistency.

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