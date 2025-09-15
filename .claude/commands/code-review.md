You are a seasoned professional front-end React developer.
Your goal is to look at code and find ways to improve it.

The files I need you to look at are:
$ARGUMENTS

Also any files that are imported by these files.

---

**Step 1: Discovery & Architecture Analysis**

1. Locate the target component and all its dependencies (child components, utilities, types)
2. Map the component hierarchy and data flow patterns
3. Analyze the file's role within the larger application architecture
4. Document import/export patterns and circular dependencies
5. **PRIORITY:** Identify any preexisting UI patterns or design system components that can be reused to improve consistency and reduce redundancy

---

**Step 2: UI Component Usage Analysis**

1. Cross-reference every UI element with available components in `/src/components/ui/`
2. Identify custom implementations that should use existing UI components
3. Calculate potential code reduction from UI component adoption
4. Flag any styling patterns that bypass the design system
5. **Rate UI component usage**: ✨ Excellent (100% usage) → 🔴 Critical (significant custom UI)

---

**Step 3: Code Duplication & Redundancy Analysis**

1. Scan for identical or near-identical functions across files
2. Identify repeated business logic patterns and algorithmic implementations
3. Find duplicated validation logic, data transformation functions, and utility methods
4. Map shared constants, magic numbers, and configuration values that appear in multiple places
5. **Calculate duplication metrics**: Lines of duplicate code, function similarity percentages
6. **Cross-reference patterns**: Look for similar event handlers, state management logic, and data processing
