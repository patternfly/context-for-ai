# Semantic UI Layer - Architecture

## File Structure

```
@patternfly/context-for-ai/
├── src/
│   ├── index.ts                          # Main entry point
│   ├── types/index.ts                    # Core type definitions
│   ├── context/SemanticContext.tsx       # Hierarchy tracking
│   ├── utils/
│   │   ├── inference.ts                  # All inference logic (DRY source)
│   │   ├── metadata.ts                   # Metadata utilities
│   │   └── accessibility.ts              # Accessibility helpers
│   ├── hooks/
│   │   ├── useSemanticMetadata.ts        # Metadata hook
│   │   └── useAccessibility.ts           # A11y hook
│   └── components/
│       ├── core/                         # Core UI components
│       │   ├── Button.tsx
│       │   ├── Link.tsx
│       │   └── StarIcon.tsx
│       ├── forms/                        # Form components
│       │   ├── Checkbox.tsx
│       │   ├── Form.tsx
│       │   ├── TextInput.tsx
│       │   ├── TextArea.tsx
│       │   ├── Select.tsx
│       │   ├── Radio.tsx
│       │   └── Switch.tsx
│       ├── data-display/                 # Data display components
│       │   ├── Card.tsx
│       │   ├── StatusBadge.tsx
│       │   ├── Tbody.tsx
│       │   ├── Thead.tsx
│       │   ├── Tr.tsx
│       │   ├── Th.tsx
│       │   └── Td.tsx
│       ├── layout/                       # Layout components
│       │   ├── Flex.tsx
│       │   └── FlexItem.tsx
│       ├── overlay/                      # Overlay components
│       │   ├── Modal.tsx
│       │   └── Drawer.tsx
│       └── navigation/                   # Navigation components
│           ├── MenuToggle.tsx
│           └── DropdownItem.tsx
├── codemod/                              # Codemod for adding attributes to PF components
│   ├── transform.js                      # JSCodeShift transform
│   ├── static-inference.js               # Static inference utilities
│   ├── add-semantic-attributes.sh        # User-friendly script
│   └── README.md                         # Codemod documentation
└── dist/                                 # Built output
```

---

## Core Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER APPLICATION                                │
│                                                                           │
│  <SemanticProvider>  ← Wraps app to enable hierarchy tracking           │
│    <Modal>           ← Adds "Modal" to context stack                    │
│      <Form>          ← Adds "Form" to context stack                     │
│        <Button />    ← Uses context to get hierarchy                    │
│      </Form>         ← Removes "Form" from stack                        │
│    </Modal>          ← Removes "Modal" from stack                       │
│  </SemanticProvider>                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SEMANTIC COMPONENT                               │
│                      (e.g., Button.tsx, Link.tsx)                       │
│                                                                           │
│  1. Receive props (variant, onClick, children, etc.)                    │
│  2. Try to get hierarchy from SemanticContext                           │
│  3. Call inference functions for semantic properties                    │
│  4. Build structured metadata                                            │
│  5. Render PatternFly component with data-* attributes                  │
└─────────────────────────────────────────────────────────────────────────┘
                 │                         │                     │
                 │                         │                     │
                 ▼                         ▼                     ▼
    ┌──────────────────┐    ┌──────────────────────┐   ┌──────────────┐
    │ SemanticContext  │    │ utils/inference.ts   │   │ types/index  │
    │                  │    │                      │   │              │
    │ getHierarchy()   │    │ inferButtonAction()  │   │ Hierarchy    │
    │ addContext()     │    │ inferContext()       │   │ Metadata     │
    │ removeContext()  │    │ inferCardPurpose()   │   │ Action       │
    │ clearContext()   │    │ inferInputPurpose()  │   │ Metadata     │
    └──────────────────┘    │ inferSelectPurpose() │   │ Semantic     │
                             │ ...20+ functions     │   │ Props        │
                             └──────────────────────┘   └──────────────┘
                                       │
                                       │ (DRY principle)
                                       │ Single source of truth
                                       ▼
                             ┌──────────────────────┐
                             │   All Components     │
                             │   Import From Here   │
                             └──────────────────────┘
```

---

## Data Flow: Component Rendering

```
Component Render
    │
    ├─► 1. Get Hierarchy (optional)
    │       │
    │       └─► useSemanticContext().getHierarchy()
    │           Returns: { 
    │             fullPath: string,
    │             qualifiedParents: string[],
    │             wrappers: string[],
    │             immediateParent: string,
    │             immediateWrapper: string,
    │             depth: number
    │           }
    │
    ├─► 2. Infer Semantic Properties
    │       │
    │       ├─► inferButtonAction(variant, href, onClick, target) → { type: "action", variant: "primary" }
    │       ├─► inferContext({ onClick, isDisabled, ... }) → "active" | "disabled" | ...
    │       └─► inferCategory('Button') → "button"
    │
    ├─► 3. Build Metadata Object
    │       │
    │       └─► {
    │             description: string,
    │             category: string,
    │             hierarchy: HierarchyMetadata,
    │             action: ActionMetadata { 
    │               type,           // What it DOES
    │               variant,        // How it LOOKS
    │               target, 
    │               consequence, 
    │               affectsParent 
    │             }
    │           }
    │
    └─► 4. Render with Data Attributes
            │
                └─► <PatternFly Component
                  data-semantic-name="Form Action"
                  data-semantic-path="Modal > Form > Button"
                  data-parent="Modal"
                  data-wrapper="Form"
                  data-num-parents="1"
                  data-semantic-role="button-action-active"
                  data-action-variant="destructive"
                  data-target="user-record"
                  data-consequence="destructive-permanent"
                  data-affects-parent="false"
                />
```

---

## Key Type Definitions

### `src/types/index.ts`

```typescript
HierarchyData {
  fullPath: string              // "Modal > Form > Card" (ALL components)
  qualifiedParents: string[]    // ["Modal"] (only visual parents)
  wrappers: string[]            // ["Form", "Card"] (only wrappers)
  immediateParent: string       // "Modal" (last visual parent)
  immediateWrapper: string      // "Card" (last wrapper)
  depth: number                 // 1 (count of visual parents only)
}
// Visual Parents = require user action to see (Modal, Drawer, Tab, Wizard Step)
// Wrappers = always visible (Form, Card, Grid, Flex)

ActionMetadata {
  type: string           // "action", "navigation", "external" (what it DOES)
  variant: string        // "primary", "destructive", "secondary" (how it LOOKS)
  target?: string        // "user-record", "parent-modal"
  consequence?: string   // "destructive-permanent", "safe"
  affectsParent?: boolean // true if closes/dismisses parent
}

SemanticComponentProps {
  semanticName?: string
  semanticRole?: string
  target?: string        // What the component affects
  action?: string        // What it does (inferred or explicit)
  context?: string       // State context (inferred or explicit)
  aiMetadata?: {
    description?: string
    category?: string
    accessibility?: string[]
    usage?: string[]
    hierarchy?: HierarchyMetadata
    action?: ActionMetadata
  }
}
```

---

## Inference System (DRY)

### `src/utils/inference.ts` - Single Source of Truth

All components import inference logic from this file:

```typescript
// Component type detection
isVisualParent(componentName) → boolean

// Button inference
inferButtonAction(variant, href, onClick, target) → { type: string, variant: string }
inferContext(props) → string
inferCategory(componentName) → string

// Card inference
inferCardPurpose(props) → string
inferCardContentType(props) → string
inferCardInteractiveState(props) → string

// Form inference
inferInputPurpose(type) → string
inferSelectPurpose() → string
inferSelectSelectionType(variant) → string
inferRadioPurpose() → string
inferRadioGroupContext(name) → string
inferSwitchPurpose() → string
inferSwitchToggleTarget() → string
inferTextAreaPurpose() → string
inferTextAreaContentType() → string
inferCheckboxPurpose(isChecked) → string

// Modal/Drawer inference
inferModalPurpose(props) → string
inferModalInteractionType(isOpen) → string

// Link inference
inferLinkPurpose(href, children) → string

// Status inference
inferStatusBadgeType(content) → string
inferStatusBadgePurpose() → string

// Context inference
inferFormContext() → string
inferValidationContext(isRequired) → string
inferSettingsContext() → string

// Category inference
inferCategory(componentType) → "forms" | "navigation" | "overlay" | ...
```

**Benefits:**
- ✅ No duplicated logic
- ✅ Consistent inference across all components
- ✅ Single place to update inference rules
- ✅ Easily testable
- ✅ Type-safe

---

## SemanticContext System

### `src/context/SemanticContext.tsx`

Manages hierarchical component relationships:

```typescript
SemanticProvider
    │
    ├─ State: contextStack: ContextItem[]
    │
    └─ Methods:
        ├─ addContext(name, semanticName?, isQualified?)  // Push to stack
        ├─ removeContext()                                 // Pop from stack
        ├─ clearContext()                                  // Reset stack
        └─ getHierarchy(): HierarchyData                  // Get current hierarchy
                │
                └─ Returns:
                    {
                      fullPath: string,
                      qualifiedParents: string[],
                      wrappers: string[],
                      immediateParent: string,
                      immediateWrapper: string,
                      depth: number
                    }
```

**Usage Pattern:**

```typescript
// In Modal component (visual parent)
React.useEffect(() => {
  addContext('Modal', 'Modal', true);  // true = qualified visual parent
  return () => removeContext();
}, []);

// In Form component (wrapper)
React.useEffect(() => {
  addContext('Form', 'Form', false);  // false = wrapper
  return () => removeContext();
}, []);

// In Button component
const hierarchy = getHierarchy();
// If contextStack = [{name: 'Modal', isQualified: true}, {name: 'Form', isQualified: false}]:
// hierarchy = { 
//   fullPath: "Modal > Form",
//   qualifiedParents: ["Modal"],
//   wrappers: ["Form"],
//   immediateParent: "Modal",
//   immediateWrapper: "Form",
//   depth: 1
// }
```

---

## Component Data Attributes

All components render with structured, queryable data attributes:

```html
<button
  data-semantic-name="Form Action"
  data-semantic-path="Modal > Form > Button"
  data-parent="Modal"
  data-wrapper="Form"
  data-num-parents="1"
  data-semantic-role="button-action-active"
  data-action-variant="destructive"
  data-target="user-record"
  data-consequence="destructive-permanent"
  data-affects-parent="false"
>
  Delete
</button>
```

**Key Insights:**

**Visual Parents vs Wrappers:**
- `data-parent="Modal"` - Immediate visual parent (user must open to see)
- `data-wrapper="Form"` - Immediate wrapper (always visible structure)
- `data-num-parents="1"` - Count of visual parents only, not wrappers
- `data-semantic-path="Modal > Form > Button"` - Full path shows ALL components

Modal is a **visual parent** (requires action to see), Form is a **wrapper** (always visible structure).

**Semantic Naming:**
- `data-semantic-name="Form Action"` - Prioritizes wrapper > parent + action type (or just action if neither)
- Button acts on its **immediate wrapper** (e.g., Form data), or **parent** if no wrapper (e.g., Modal itself)
- Never just "Button" - always describes what it DOES: Action, Navigation, External Link
- Examples: "Form Action" (in form), "Modal Action" (no wrapper), "Navigation" (standalone)

### Why Individual Attributes?

Each piece of metadata is a separate, queryable attribute for maximum AI flexibility:

```javascript
// AI parses semantic role for category + action + context
// "button-action-active" → button that performs action, currently active
// "button-navigation-disabled" → button for navigation, currently disabled
document.querySelectorAll('[data-semantic-role^="button-navigation"]')

// Find all destructive actions
document.querySelectorAll('[data-consequence="destructive-permanent"]')

// Find buttons that affect their parent (close modals, dismiss forms)
document.querySelectorAll('[data-affects-parent="true"]')

// Find deeply nested components (3+ visual parents)
document.querySelectorAll('[data-num-parents="3"]')
```

---

## Component Implementation Pattern

Every component follows this pattern:

```typescript
import { useSemanticContext } from '../../context/SemanticContext';
import { inferX, inferY } from '../../utils/inference';
import { SemanticComponentProps } from '../../types';

export const Component = ({ 
  semanticName, semanticRole, aiMetadata, target, 
  ...props 
}) => {
  // 1. Get hierarchy (optional - graceful fallback)
  let hierarchy;
  let addContext, removeContext;
  try {
    const semanticContext = useSemanticContext();
    hierarchy = semanticContext.getHierarchy();
    addContext = semanticContext.addContext;
    removeContext = semanticContext.removeContext;
  } catch {
    hierarchy = { fullPath: '', qualifiedParents: [], wrappers: [], immediateParent: '', immediateWrapper: '', depth: 0 };
    addContext = () => {};
    removeContext = () => {};
  }

  // 2. Infer semantic properties using DRY utilities
  const inferredAction = action || inferX(props);
  const inferredContext = context || inferY(props);
  
  // 3. Generate semantic role and name
  const role = semanticRole || `component-${inferredAction}-${inferredContext}`;
  const componentName = semanticName || generateName(hierarchy, inferredAction);
  
  // 4. Register in context (if needed)
  React.useEffect(() => {
    addContext('Component', componentName, isQualified);
    return () => removeContext();
  }, [addContext, removeContext, componentName]);

  // 5. Render with structured data attributes
  return (
    <PatternFlyComponent
      {...props}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={role}
      data-action-variant={inferredAction.variant}
      data-target={target || 'default'}
      data-consequence={consequence}
      data-affects-parent={affectsParent}
    />
  );
};
```

---

## Codemod Architecture

### `codemod/` - Static Code Transformation

For users who want to add semantic attributes directly to PatternFly components (without using wrapper components), we provide a codemod:

```
codemod/
├── transform.js              # JSCodeShift transform
├── static-inference.js       # Static inference (no runtime deps)
├── add-semantic-attributes.sh # User-friendly script
└── README.md                 # Documentation
```

**How it works:**

1. **Component Detection**: Scans import statements to identify PatternFly components
2. **Static Inference**: Analyzes component props to infer semantic properties
3. **Attribute Injection**: Adds standardized `data-*` attributes to JSX
4. **DOM Rendering**: React forwards attributes to rendered DOM elements

**Standardized Attributes Added:**
- `data-role` - What the component IS
- `data-purpose` - What it DOES
- `data-variant` - How it LOOKS
- `data-context` - Where it's USED
- `data-state` - Current STATE

See [`codemod/README.md`](./codemod/README.md) for detailed documentation.

---

## Export Structure

### `src/index.ts`

```typescript
// Types
export * from './types';

// Context
export { SemanticProvider, useSemanticContext } from './context/SemanticContext';

// Components (organized by category)
export * from './components/core';
export * from './components/forms';
export * from './components/data-display';
export * from './components/layout';
export * from './components/overlay';
export * from './components/navigation';

// Utilities
export * from './utils';

// Hooks
export * from './hooks';
```

---

## Component Categories

### Core Components (3)
- `Button` - Actions and interactions
- `Link` - Navigation links
- `StarIcon` - Rating/favorite icons

### Form Components (7)
- `Form` - Form container
- `TextInput` - Text input fields
- `TextArea` - Multi-line text input
- `Select` - Dropdown selection
- `Checkbox` - Checkbox input
- `Radio` - Radio button input
- `Switch` - Toggle switch

### Data Display Components (7)
- `Card` - Content containers
- `StatusBadge` - Status indicators
- `Th`, `Td`, `Tr`, `Thead`, `Tbody` - Table components

### Layout Components (2)
- `Flex` - Flexbox container
- `FlexItem` - Flexbox item

### Overlay Components (2)
- `Modal` - Modal dialogs
- `Drawer` - Side drawers

### Navigation Components (2)
- `MenuToggle` - Menu toggle button
- `DropdownItem` - Dropdown menu item

**Total: 23 components**

---

## Summary

| Layer | Location | Purpose |
|-------|----------|---------|
| **Types** | `src/types/` | TypeScript interfaces |
| **Context** | `src/context/` | Hierarchy tracking |
| **Inference** | `src/utils/inference.ts` | DRY semantic inference (single source) |
| **Components** | `src/components/` | PatternFly wrappers with metadata |
| **Hooks** | `src/hooks/` | Reusable React hooks |
| **Utils** | `src/utils/` | Helper functions |
| **Codemod** | `codemod/` | Static code transformation tool |

**Key Principles:**
- ✅ All inference logic lives in `utils/inference.ts` (DRY)
- ✅ All components import from single source of truth
- ✅ Graceful degradation (works without SemanticProvider)
- ✅ Type-safe throughout
- ✅ Attributes appear on rendered DOM elements

**Data Flow**: Props → Inference → Hierarchy → Metadata → Data Attributes → AI Consumption
