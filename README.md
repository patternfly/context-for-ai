# Semantic UI Layer - Codemod

> **⚠️ Important**: This is a **codemod tool only**. You do NOT need to import or use any library components. Simply install the package and run the codemod to transform your existing PatternFly components. The library code in this repository is for reference/development purposes only.

**📦 Install from npm**: `npm install -D @patternfly/context-for-ai`
**🔗 Package**: [@patternfly/context-for-ai on npm](https://www.npmjs.com/package/@patternfly/context-for-ai)

A codemod tool that automatically adds standardized semantic `data-*` attributes to **all PatternFly components** in your codebase, making them AI-friendly and easier for AI tools to understand.

## 📚 Documentation & Reference

**Essential reading for understanding how attributes are determined:**

- **[Attribute Decision Logic](./codemod/ATTRIBUTE_DECISION_LOGIC.md)** - Complete guide explaining how each of the 7 data-* attributes is determined, including functions used, props checked, and decision-making process
- **[All Components Reference](./codemod/ALL_COMPONENTS_REFERENCE.md)** - Complete reference of all 150+ PatternFly components we support, with all 7 attributes and their possible values listed for each component

These reference files are invaluable for:
- Understanding how the codemod infers attributes
- Testing and validation
- Debugging attribute inference
- Extending the codemod for custom components

## Overview

This tool transforms your existing PatternFly components by adding semantic metadata attributes that appear on rendered DOM elements. AI tools can query these attributes to better understand your UI structure and component relationships.

**Key Benefits:**
- ✅ Works with **ALL PatternFly components** (not just a subset)
- ✅ Zero code changes required - just run the codemod
- ✅ Attributes appear on rendered HTML elements
- ✅ Queryable by AI tools and browser DevTools
- ✅ Non-destructive - preserves all existing code

## Quick Start

### Step 1: Install the Package

Install from npm as a dev dependency (recommended):

```bash
npm install -D @patternfly/context-for-ai
```

**📦 Package**: [@patternfly/context-for-ai on npm](https://www.npmjs.com/package/@patternfly/context-for-ai)

> **Note**:
> - Installed as a dev dependency (`-D`) since it's only needed during development
> - The package is published to npm and ready to use
> - You don't need to clone the repository or install from GitHub
> - No need to install jscodeshift globally - we'll use `npx` instead!

### Step 2: Run the Codemod

You have two options:

**Option A: Using npx with jscodeshift (recommended)**
```bash
npx jscodeshift -t node_modules/@patternfly/context-for-ai/codemod/transform.js --extensions=ts,tsx,js,jsx --parser=tsx src/
```

**Option B: Using the provided script**
```bash
./node_modules/@patternfly/context-for-ai/codemod/add-semantic-attributes.sh src/
```

### Setup on a New Computer

If you're setting up the codemod on a new computer:

1. **Install Node.js** (if not already installed)
2. **Install @patternfly/context-for-ai** in your project: `npm install -D @patternfly/context-for-ai`
3. **Run the codemod** using npx (recommended) or the bash script above

The codemod is a standalone tool - you don't need to import or use any library components. It simply transforms your existing PatternFly components by adding semantic attributes.

> **Note**: No need to install jscodeshift globally! Using `npx` automatically handles it for you.

## What It Does

The codemod transforms your PatternFly components from:

```tsx
<Card isClickable>
  <CardBody>
    <Button variant="danger">Cancel</Button>
  </CardBody>
</Card>
```

Into:

```tsx
<Card 
  isClickable
  data-role="card"
  data-purpose="clickable"
  data-variant="default"
  data-context="page"
  data-state="active"
>
  <CardBody
    data-role="card-body"
    data-purpose="display"
    data-variant="default"
    data-context="page"
    data-state="active"
  >
    <Button 
      variant="danger"
      data-role="button"
      data-purpose="action"
      data-variant="danger"
      data-context="page"
      data-action-type="destructive"
      data-state="active"
    >
      Cancel
    </Button>
  </CardBody>
</Card>
```

**These attributes appear on the rendered DOM elements** in your browser:

```html
<div class="pf-c-card" data-role="card" data-purpose="clickable" data-variant="default" data-context="page" data-state="active">
  <div class="pf-c-card__body" data-role="card-body" data-purpose="display" data-variant="default" data-context="page" data-state="active">
    <button class="pf-c-button pf-m-danger" data-role="button" data-purpose="action" data-variant="danger" data-context="page" data-action-type="destructive" data-state="active">
      Cancel
    </button>
  </div>
</div>
```

## Standardized Attributes

Every PatternFly component gets the same 7 attributes that appear on rendered DOM elements:

| Attribute | Description | Example Values |
|-----------|-------------|----------------|
| `data-role` | What the component IS | `button`, `card`, `input`, `modal`, `alert`, `breadcrumb` |
| `data-purpose` | What it DOES | `action`, `display`, `input`, `navigation`, `overlay`, `filtering` |
| `data-variant` | How it LOOKS | `primary`, `danger`, `secondary`, `warning`, `info` |
| `data-context` | Where it's USED | `form`, `modal`, `table`, `toolbar`, `navigation`, `page` |
| `data-state` | Current STATE | `active`, `disabled`, `selected`, `readonly`, `open` |
| `data-action-type` | Type of ACTION | `destructive`, `navigation`, `toggle`, `selection`, `determinate`, `indeterminate` |
| `data-size` | SIZE/SPACING | `compact`, `small`, `medium`, `large`, `extra-small`, `extra-large` |

> **📖 For complete details**: See [Attribute Decision Logic](./codemod/ATTRIBUTE_DECISION_LOGIC.md) for how each attribute is determined, and [All Components Reference](./codemod/ALL_COMPONENTS_REFERENCE.md) for all possible values per component.

## Features

- ✅ **Universal Coverage**: Works with **ALL PatternFly components** from supported packages
- ✅ **Automatic Detection**: Identifies PatternFly components by analyzing import statements
- ✅ **Smart Inference**: Enhanced inference for common components, generic inference with fallbacks for others
- ✅ **Non-Destructive**: Preserves all existing code, formatting, and comments
- ✅ **Idempotent**: Safe to run multiple times (skips components that already have attributes)
- ✅ **DOM-Ready**: Attributes appear on rendered HTML elements (React forwards `data-*` attributes)

## Installation

Install the package from npm as a dev dependency:

```bash
npm install -D @patternfly/context-for-ai
```

**📦 Package**: [@patternfly/context-for-ai on npm](https://www.npmjs.com/package/@patternfly/context-for-ai)

**Note**:
- This installs the codemod tool as a dev dependency since it's only needed during development
- You do NOT need to import any components from this package
- Simply run the codemod to transform your existing PatternFly components
- Works with both PatternFly v5 and v6 (no peer dependency conflicts)
- No need to install jscodeshift globally - use `npx jscodeshift` instead!

## Updates

### Checking for Updates

The codemod is distributed as an npm package. To check if you have the latest version:

```bash
npm outdated @patternfly/context-for-ai
```

### Updating the Codemod

```bash
npm update @patternfly/context-for-ai
# or for latest version
npm install -D @patternfly/context-for-ai@latest
```

### When to Re-run the Codemod

You should re-run the codemod after updating if:

- **New inference improvements** - Better attribute inference for components
- **New PatternFly package support** - Support for additional PatternFly packages
- **Bug fixes** - Fixes to incorrect attribute inference
- **New features** - Additional semantic attributes or capabilities

The codemod is **idempotent**, meaning you can run it multiple times safely without causing issues. Specifically:
- ✅ **Skips components that already have semantic attributes** - Won't duplicate or modify existing attributes
- ✅ **Adds attributes to new components** - If you've added new PatternFly components since the last run, it will add attributes to those
- ✅ **Safe to re-run** - Running it again won't break anything or create duplicates

This means you can re-run the codemod after updating the package to benefit from improved inference rules without worrying about breaking your code.

### Checking What Changed

Check the commit history or GitHub releases to see what improvements were made in each version. This will help you decide if you need to re-run the codemod.

### Recommended Workflow

1. **Initial setup**: Install and run the codemod once on your codebase
2. **Periodic updates**: Check for updates monthly or when you add new PatternFly components
3. **After major updates**: Re-run the codemod to benefit from improved inference
4. **Review changes**: Use `git diff` to review what changed before committing

## Usage

### Transform Entire Directory

```bash
npx jscodeshift -t node_modules/@patternfly/context-for-ai/codemod/transform.js --extensions=ts,tsx,js,jsx --parser=tsx src/
```

### Transform Specific File

```bash
npx jscodeshift -t node_modules/@patternfly/context-for-ai/codemod/transform.js src/components/MyComponent.tsx
```

### Preview Changes (Dry Run)

```bash
npx jscodeshift -t node_modules/@patternfly/context-for-ai/codemod/transform.js --dry src/
```

### Using the Bash Script

```bash
# Transform all files in src/
./node_modules/@patternfly/context-for-ai/codemod/add-semantic-attributes.sh src/

# Transform a specific file
./node_modules/@patternfly/context-for-ai/codemod/add-semantic-attributes.sh src/components/MyComponent.tsx

# Transform current directory
./node_modules/@patternfly/context-for-ai/codemod/add-semantic-attributes.sh
```

## Supported PatternFly Packages

The codemod works with **ALL components** imported from these PatternFly packages:

- `@patternfly/react-core` - All core components (Button, Card, Modal, Form, Input, Select, Alert, Breadcrumb, Tabs, Accordion, Popover, Tooltip, etc.)
- `@patternfly/react-table` - All table components (Table, Th, Td, Tr, Thead, Tbody, etc.)
- `@patternfly/react-icons` - Icon components
- `@patternfly/react-charts` - Chart components
- `@patternfly/react-topology` - Topology components

**Important**: 
- The codemod processes **any component** imported from these packages, not just a limited subset. It uses intelligent inference with fallbacks for unknown components.
- **Works with both PatternFly v5 and v6** - The codemod uses static code analysis and doesn't require PatternFly as a runtime dependency, so it works with any version of PatternFly you're using.

## How It Works

1. **Component Detection**: Scans import statements to identify PatternFly components
   - Works for **ALL components** imported from PatternFly packages
   - Handles both named and default imports
   - Handles aliased imports (e.g., `import { Button as PFButton }`)

2. **Static Inference**: Analyzes component props to infer semantic properties
   - **Enhanced inference** for common components (Button, Card, Modal, Form, Input, Select, Checkbox, Radio, Switch, Flex, Table components, Link, Drawer, etc.)
   - **Generic inference with fallbacks** for other PF components (Alert, Breadcrumb, Tabs, Accordion, Popover, Tooltip, etc.)
   - Reads `variant`, `type`, `onClick`, `isDisabled`, etc.
   - Determines purpose from component name and props
   - Detects parent context for nested components

3. **Attribute Injection**: Adds standardized attributes without modifying existing code
   - Preserves all existing props, formatting, and comments
   - Idempotent - safe to run multiple times

4. **DOM Rendering**: React automatically forwards `data-*` attributes to rendered DOM elements
   - All attributes appear on the actual HTML elements in the browser
   - Queryable via DevTools and JavaScript

### Inference Quality

**Components with Enhanced Inference:**
- Button, Card, Modal, Form, TextInput, TextArea, Select, Checkbox, Radio, Switch
- Flex, FlexItem, Table components (Th, Td, Tr, Thead, Tbody)
- Link, Drawer, MenuToggle, DropdownItem
- Accordion, ActionList, Alert, Avatar

**Components with Generic Inference:**
- All other PatternFly components (Breadcrumb, Tabs, Popover, Tooltip, Wizard, TextInputGroup, Timestamp, Title, ToggleGroup, Toolbar, TreeView, Truncate, etc.)
- Uses heuristics and fallbacks to provide reasonable defaults
- Still adds all 7 standardized attributes

> **📖 Complete Component List**: See [All Components Reference](./codemod/ALL_COMPONENTS_REFERENCE.md) for the full list of 150+ supported components with all attribute values.

**Components We Skip:**
- Static components without meaningful variants, states, or interactive behavior
- Specifically skipped: Backdrop, BackgroundImage, BackToTop, Brand
- These components always behave the same and don't benefit from semantic attributes
- **Skeleton**: Component-specific loader - skipped for now as not many prototypes have loaders

## Examples

### Button Component

```tsx
// Before
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// After
<Button 
  variant="danger" 
  onClick={handleDelete}
  data-role="button"
  data-purpose="action"
  data-variant="danger"
  data-context="default"
  data-state="active"
>
  Delete
</Button>
```

**Rendered HTML:**
```html
<button 
  class="pf-c-button pf-m-danger" 
  data-role="button" 
  data-purpose="action" 
  data-variant="danger" 
  data-context="default" 
  data-state="active"
>
  Delete
</button>
```

### Alert Component (Generic Inference)

```tsx
// Before
<Alert variant="warning" title="Warning">This is a warning</Alert>

// After
<Alert 
  variant="warning" 
  title="Warning"
  data-role="alert"
  data-purpose="display"
  data-variant="warning"
  data-context="default"
  data-state="default"
>
  This is a warning
</Alert>
```

### Form with Inputs

```tsx
// Before
<Form>
  <TextInput type="email" isRequired />
  <Select>
    <SelectOption value="1">Option 1</SelectOption>
  </Select>
</Form>

// After
<Form
  data-role="form"
  data-purpose="form-container"
  data-variant="default"
  data-context="default"
  data-state="default"
>
  <TextInput 
    type="email" 
    isRequired
    data-role="text-input"
    data-purpose="input"
    data-variant="email"
    data-context="form"
    data-state="default"
  />
  <Select
    data-role="select"
    data-purpose="input"
    data-variant="default"
    data-context="form"
    data-state="default"
  >
    <SelectOption value="1">Option 1</SelectOption>
  </Select>
</Form>
```

## Querying Attributes in Browser

Once attributes are added, you can query them in the browser:

```javascript
// Find all action buttons
document.querySelectorAll('[data-purpose="action"]')

// Find all form inputs
document.querySelectorAll('[data-context="form"]')

// Find all danger variants
document.querySelectorAll('[data-variant="danger"]')

// Find all cards
document.querySelectorAll('[data-role="card"]')

// Find all disabled components
document.querySelectorAll('[data-state="disabled"]')
```

## Limitations

### Static Analysis Only

The codemod uses **static analysis** (what it can see in your source code), not runtime values:

✅ **Works:**
- `variant="danger"` (literal string)
- `isDisabled={true}` (literal boolean)
- `onClick={handler}` (prop exists)

❌ **Can't Detect:**
- `variant={someVariable}` (variable value unknown)
- `onClick={condition ? handler1 : handler2}` (runtime decision)
- Dynamic props from state or context

### Parent Context Detection

Parent context is detected by analyzing the JSX tree structure, but:
- Only works for direct parent-child relationships
- Limited to 10 levels deep (prevents infinite loops)
- May not detect context from React Context API

## Best Practices

1. **Run on Clean Code**: Transform before adding complex logic
2. **Version Control**: Commit before running, review changes after
3. **Test After**: Verify your app still works after transformation
4. **Incremental**: Transform one directory at a time for large codebases
5. **Review Changes**: Use `git diff` to review what was changed

## Troubleshooting

### Components Not Being Transformed

1. **Check imports**: Make sure components are imported from PatternFly packages
2. **Check file extensions**: Only `.ts`, `.tsx`, `.js`, `.jsx` files are processed
3. **Check existing attributes**: Components with existing `data-role`, `data-purpose`, etc. are skipped

### Incorrect Inferences

The codemod uses heuristics to infer values. If results are incorrect:
1. Manually add attributes to override inferred values
2. Update inference logic in `codemod/static-inference.js`
3. Report issues with specific component patterns

### Formatting Issues

The codemod preserves your existing formatting. If you see formatting changes:
1. Run your formatter (Prettier, ESLint) after the transform
2. The codemod uses single quotes and trailing commas by default

## Extending the Codemod

### Adding New PatternFly Packages

Edit `codemod/static-inference.js`:

```javascript
const PF_PACKAGES = [
  '@patternfly/react-core',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@patternfly/react-charts',
  '@patternfly/react-topology',
  '@patternfly/react-new-package', // Add here
];
```

### Adding New Component Inference Rules

Edit `codemod/static-inference.js`:

```javascript
function inferPurpose(componentName, props) {
  // Add your custom logic here
  if (componentName === 'MyNewComponent') {
    return 'custom-purpose';
  }
  // ... existing logic
}
```

### Customizing Attributes

Edit `codemod/transform.js` to add or modify attributes:

```javascript
const newAttributes = [
  j.jsxAttribute(
    j.jsxIdentifier('data-role'),
    j.literal(role)
  ),
  // Add more attributes here
  j.jsxAttribute(
    j.jsxIdentifier('data-custom-attr'),
    j.literal('custom-value')
  ),
];
```

## Integration with AI Tools

Once attributes are added and rendered, AI tools can query the DOM:

- **Query by purpose**: Find all action buttons: `[data-purpose="action"]`
- **Query by context**: Find all form inputs: `[data-context="form"]`
- **Query by state**: Find all disabled components: `[data-state="disabled"]`
- **Query by role**: Find all cards: `[data-role="card"]`
- **Query by variant**: Find all danger buttons: `[data-variant="danger"]`

**Example Browser Queries:**
```javascript
// Find all action buttons
document.querySelectorAll('[data-purpose="action"]')

// Find all form inputs
document.querySelectorAll('[data-context="form"]')

// Find all danger variants
document.querySelectorAll('[data-variant="danger"]')
```

## Documentation

**Essential Reference Files:**

- **[Attribute Decision Logic](./codemod/ATTRIBUTE_DECISION_LOGIC.md)** - Complete guide explaining how each of the 7 data-* attributes is determined
  - Functions used for each attribute
  - Props checked for inference
  - Children analysis functions
  - Special cases and context inheritance

- **[All Components Reference](./codemod/ALL_COMPONENTS_REFERENCE.md)** - Complete reference of all 150+ PatternFly components
  - All 7 attributes with possible values for each component
  - Organized by component category
  - Notes on structural children, context inheritance, and variant combinations

- **[Codemod README](./codemod/README.md)** - Detailed documentation, examples, and customization options

## Note About Library Code

This repository contains both:
1. **The codemod** (recommended) - Transforms your existing PatternFly components
2. **Wrapper library code** (reference only) - Example implementations in `src/components/`

**Important**: The wrapper library code is included for reference and development purposes only. You do NOT need to import or use any components from this package. The codemod is the recommended way to add semantic attributes to your existing PatternFly codebase.

If you're using this package, you should only use the codemod tool - ignore any library/component exports.

## Development

> **For Users**: If you just want to use the codemod, install it from npm (see [Installation](#installation) above). You don't need to clone this repository.

**For Contributors**: This section is for developing the package itself.

### Setup

```bash
# Clone the repository
git clone https://github.com/patternfly/context-for-ai.git
cd context-for-ai

# Install dependencies
npm install
```

### Available Scripts

- `npm run codemod` - Run the codemod transform on the current directory
- `npm run codemod:dry` - Preview changes without modifying files
- `npm run build` - Build the library (for development/testing only)
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

To improve the codemod:

1. Add new inference rules in `codemod/static-inference.js`
2. Add support for new PatternFly components
3. Improve parent context detection
4. Add more sophisticated static analysis

## License

MIT License - see LICENSE file for details
