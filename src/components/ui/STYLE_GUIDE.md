# UI Component Style Guide

## Component Patterns

### 1. Function Declarations (Preferred)
```typescript
// ✅ Use this pattern
export function ComponentName({ prop }: Props) {
  return <div>{prop}</div>;
}

// ❌ Avoid React.FC
export const ComponentName: React.FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};
```

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
className="text-text-primary"      // Primary text
className="text-text-secondary"    // Secondary text  
className="bg-background-primary"  // Primary background
className="border-border"          // Standard borders
className="text-highlight-400"     // Accent colors

// ❌ Avoid hardcoded colors
className="text-zinc-100"         // Don't hardcode
className="bg-amber-500"          // Use semantic tokens
```

## Component Architecture

### 1. Business Logic Separation
```typescript
// ✅ Extract business logic to hooks
function useEquipmentManagement(character: Character) {
  const handleAdd = useCallback((equipment: Equipment) => {
    // Complex business logic here
  }, [character]);
  
  const totalWeight = useMemo(() => 
    calculateWeight(character.equipment), [character.equipment]
  );
  
  return { handleAdd, handleRemove, totalWeight };
}

// ✅ Clean UI component
function EquipmentStep({ character, onCharacterChange }: Props) {
  const equipment = useEquipmentManagement(character);
  
  return (
    <StepWrapper>
      {/* Clean UI rendering */}
    </StepWrapper>
  );
}
```

### 2. Component Composition
```typescript
// ✅ Use composition over props
<HeroSection
  title="Welcome"
  subtitle="Description"
  logo={<img src="/logo.webp" alt="Logo" />}
>
  <CustomContent />
</HeroSection>

// ✅ Use feature components
<FeatureCard 
  icon="dice"
  title="Interactive Rolling"
  description="Roll with animated dice"
/>
```

### 3. Code Splitting
```typescript
// ✅ Lazy load large components
const EncounterGeneratorModal = lazy(() => 
  import('./modals/game/EncounterGeneratorModal')
);

const TreasureGeneratorModal = lazy(() => 
  import('./modals/game/TreasureGeneratorModal')
);

// ✅ Use Suspense boundaries
<Suspense fallback={<LoadingState />}>
  <LargeComponent />
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
    inputs/           # Form controls (Button, TextInput, Select)
    feedback/         # User feedback (Modal, Notification, Tooltip)
    display/          # Data display (StatCard, Icon, Table)
    layout/           # Layout components (PageWrapper, Tabs, Accordion)
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