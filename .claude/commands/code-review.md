# Code Review Command

World-class React expert code review focusing on UI component usage, accessibility, performance, and BFRPG-specific patterns.

## Example

```bash
/code-review src/components/character/creation/SpellChecklistSelector.tsx
```

The files to review: $ARGUMENTS

## Review Process

**Priority Order:**

1. 🔥 UI Component Usage (Critical)
2. 🔴 Code Duplication
3. 🔵 Data Management & Caching
4. 🟡 Performance & Best Practices
5. 🟢 Architecture & Maintainability

### 1. UI Component Audit (HIGHEST PRIORITY)

- Cross-reference ALL UI elements with `/src/components/ui/` inventory
- Flag custom implementations that should use existing components
- Calculate potential LOC reduction from UI component adoption
- Rate usage: ✨ Excellent → 🔴 Critical

**Available UI Components:**

- **Design System**: Card, Typography, Badge
- **Inputs**: Button, Select, TextInput, NumberInput, TextArea, Switch, Checkbox, OptionToggle, FileUpload, EditableValue, FloatingActionButton, FormField
- **Feedback**: Notification, Tooltip, LoadingState, Callout, InfoTooltip, TooltipWrapper, Skeleton, ErrorBoundary
- **Display**: StatCard, Icon, Table, List, MarkdownText, ItemGrid, Stepper, BaseCard, DetailSection, Details, StatusIndicator, SectionHeader, HorizontalRule, Breadcrumb, SimpleRoller, SkillDescriptionItem, RequirementCard, FeatureCard, HeroSection
- **Layout**: PageWrapper, Tabs, Accordion, StepWrapper, SectionWrapper
- **Dice**: RollableButton

### 2. Code Duplication Analysis

- Scan for identical/similar functions across codebase
- Identify utility extraction opportunities
- Find repeated business logic patterns
- Flag constants/types that should be shared
- Security vulnerabilities: XSS, input validation, data exposure

### 3. Data Management & Caching Analysis

- **Query Implementation**: Check for proper use of `useEnhancedQueries` vs manual `useQuery`, query key consistency with `queryKeys` structure
- **Mutation Patterns**: Verify use of `useCharacterMutations`/`useGameMutations` vs manual mutations, optimistic update implementation, error handling consistency
- **Store Usage**: Assess Zustand store patterns - proper action organization, persistence configuration, state shape optimization
- **Cache Strategy**: Review staleTime settings, invalidation patterns, query dependencies, data transformation in `select` functions

### 4. React Best Practices & Performance

- Hook dependency arrays and memoization
- Component patterns (memo, forwardRef, composition)
- Performance optimization opportunities
- TypeScript usage and type safety
- Accessibility (WCAG 2.1 AA): ARIA, keyboard nav, screen readers
- SEO considerations: semantic HTML, meta tags, structured data
- Compliance with /src/components/STYLE_GUIDE.md

### 5. BFRPG-Specific Patterns

- Character data handling consistency
- Game system integration
- Magic system type usage
- Validation and migration patterns
- No rules should be guessed or made-up. Reference `/sources/BFRPG-rulebook.txt` for any and all rules questions or clarifications.

## Output Format

**🔥 UI Component Usage**: [Rating] - [Specific missing components]

**🔴 Critical Issues**:

- **Issue**: [Brief description]
- **Fix**: [Specific solution with code example]
- **Impact**: [Why it matters]

**🟡 Improvements**:

- **Issue**: [Description]
- **Fix**: [Solution]
- **Impact**: [Benefit]

**🔵 Data Management**:

- **Query Strategy**: [TanStack Query usage, caching, invalidation]
- **State Management**: [Zustand store patterns, persistence]
- **Mutations**: [Error handling, optimistic updates, rollback]

**🟢 Strengths**:

- [What works well]

**📊 Metrics**:

- LOC reduction potential: [number]
- UI components missing: [count]
- Duplication instances: [count]
- Query/mutation optimization opportunities: [count]
- Store usage consistency: [rating]

**⚡ Quick Wins** (implement first):

1. [Highest impact, lowest effort changes]

Keep total output under 400 words. Focus on actionable items with code examples.
