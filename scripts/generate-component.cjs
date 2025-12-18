#!/usr/bin/env node

/**
 * Component Generator Script
 * 
 * Usage: node scripts/generate-component.js ComponentName category complexity
 * Example: node scripts/generate-component.js TextInput forms simple
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const componentName = args[0];
const category = args[1] || 'data-display';
const complexity = args[2] || 'simple';

if (!componentName) {
  console.error('Error: Component name is required');
  console.log('Usage: node scripts/generate-component.js ComponentName [category] [complexity]');
  console.log('Example: node scripts/generate-component.js TextInput forms simple');
  process.exit(1);
}

const categories = {
  'forms': 'forms',
  'navigation': 'navigation',
  'data-display': 'data-display',
  'feedback': 'feedback',
  'layout': 'layout',
  'overlay': 'overlay',
  'advanced': 'advanced'
};

const validCategory = categories[category] || 'data-display';
const validComplexity = ['simple', 'moderate', 'complex'].includes(complexity) ? complexity : 'simple';

// Convert to camelCase
const camelCase = componentName.charAt(0).toLowerCase() + componentName.slice(1);

// Read template
const templatePath = path.join(__dirname, 'component-template.ts');
let template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
template = template.replace(/\{\{ComponentName\}\}/g, componentName);
template = template.replace(/\{\{componentName\}\}/g, camelCase);
template = template.replace(/\{\{CATEGORY\}\}/g, validCategory);
template = template.replace(/\{\{COMPLEXITY\}\}/g, validComplexity);

// Determine output directory based on category
const categoryDirs = {
  'forms': 'forms',
  'navigation': 'navigation',
  'data-display': 'data-display',
  'feedback': 'feedback',
  'layout': 'layout',
  'overlay': 'overlay',
  'advanced': 'advanced'
};

const outputDir = path.join(__dirname, '..', 'src', 'components', categoryDirs[validCategory] || '');
const outputPath = path.join(outputDir, `${componentName}.tsx`);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write component file
fs.writeFileSync(outputPath, template);

console.log(`✅ Created component: ${outputPath}`);
console.log(`Category: ${validCategory}`);
console.log(`Complexity: ${validComplexity}`);
console.log(`\nNext steps:`);
console.log(`1. Edit ${outputPath} to add component-specific logic`);
console.log(`2. Add export to src/components/${categoryDirs[validCategory]}/index.ts`);
console.log(`3. Create tests for ${componentName}`);
console.log(`4. Update documentation`);

