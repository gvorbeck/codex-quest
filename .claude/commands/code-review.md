# Code Review Command

World-class React expert code review focusing on UI component usage, accessibility, performance, and BFRPG-specific patterns.

## Automatic File Detection

This command automatically reviews all untracked and modified files in the repository. No arguments needed.

## Important

This command ONLY provides analysis and identifies issues. It does NOT make any code edits or modifications.

## Review Process

First, run `git status --short` to identify all untracked (marked with ??) and modified (marked with M) files to review.

**Priority Order:**

1. UI Component Usage (Critical)
2. Code Duplication
3. Data Management & Caching
4. Performance & Best Practices
5. Architecture & Maintainability

### 1. UI Component Audit (HIGHEST PRIORITY)

- Cross-reference ALL UI elements with `/src/components/ui/` inventory
- Flag custom implementations that should use existing components
- Calculate potential LOC reduction from UI component adoption

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

Provide a numbered list of issues ranked by priority from highest to lowest. Each issue should include:

**Format per issue:**
[Number]. [File path]:[line number if applicable] - [Brief description]
   - **Category**: [UI Component Usage | Code Duplication | Data Management | Performance | Architecture | Security | Accessibility]
   - **Fix**: [Specific solution with code example]
   - **Impact**: [Why it matters]

**Example:**
1. src/components/MyComponent.tsx:45 - Custom button implementation duplicates existing UI component
   - **Category**: UI Component Usage
   - **Fix**: Replace `<button className="...">` with `<Button variant="primary">`
   - **Impact**: Reduces 15 LOC, ensures design system consistency

**Requirements:**
- NO emojis anywhere in the output
- Issues ordered strictly by priority (most critical first)
- Include specific file paths and line numbers
- Provide concrete code examples for fixes
- Focus on actionable items only
- Keep descriptions clear and concise
