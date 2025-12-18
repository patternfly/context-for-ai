/**
 * Inference utilities for automatically determining semantic properties
 * from PatternFly component props
 */

/**
 * Determine if a component is a visual parent (requires user action to see contents)
 * vs a wrapper/structure (always visible)
 */
export const isVisualParent = (componentName: string): boolean => {
  const visualParents = [
    'modal', 'drawer', 'popover', 'tooltip',           // Overlays
    'wizardstep', 'wizard', 'tab', 'accordion',        // Navigation containers
    'expandable', 'dropdown', 'menu', 'menutoggle'     // Expandable containers
  ];
  return visualParents.includes(componentName.toLowerCase());
};

/**
 * Infer button action from PatternFly variant and props
 * Returns both behavior (what it does) and styling (how it looks)
 */
export const inferButtonAction = (
  variant?: string,
  href?: string,
  onClick?: unknown,
  target?: string
): { type: string; variant: string } => {
  // Determine behavior - what the button DOES
  let behaviorType = 'default';
  
  if (href) {
    // Has href - it's a link
    if (href.startsWith('http')) behaviorType = 'external';
    else if (target === '_blank') behaviorType = 'external';
    else if (href.startsWith('/')) behaviorType = 'navigation';
    else behaviorType = 'navigation';
  } else if (onClick) {
    // Has onClick but no href - it's an action
    behaviorType = 'action';
  }
  
  // Determine styling - visual importance/appearance
  let styleVariant = 'secondary';
  
  switch (variant) {
    case 'primary':
      styleVariant = 'primary';
      break;
    case 'danger':
      styleVariant = 'destructive';
      break;
    case 'control':
      styleVariant = 'toggle';
      break;
    case 'secondary':
    case 'tertiary':
    case 'plain':
    case 'link':
      styleVariant = variant;
      break;
  }
  
  return {
    type: behaviorType,
    variant: styleVariant
  };
};

/**
 * Infer input purpose from type
 */
export const inferInputPurpose = (type?: string): string => {
  switch (type) {
    case 'email':
      return 'email-input';
    case 'password':
      return 'password-input';
    case 'search':
      return 'search-input';
    case 'tel':
      return 'phone-input';
    case 'url':
      return 'url-input';
    case 'number':
      return 'numeric-input';
    case 'date':
    case 'datetime-local':
    case 'time':
      return 'date-time-input';
    case 'text':
    default:
      return 'text-input';
  }
};

/**
 * Infer alert severity
 */
export const inferAlertSeverity = (variant?: string): string => {
  switch (variant) {
    case 'success':
      return 'success';
    case 'danger':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    case 'default':
    default:
      return 'info';
  }
};

/**
 * Infer context from parent or usage
 */
export const inferContext = (props: Record<string, unknown>): string => {
  if (props.onClick || props.onSubmit) return 'active';
  if (props.isDisabled) return 'disabled';
  if (props.isReadOnly) return 'readonly';
  return 'default';
};

/**
 * Infer card purpose from PatternFly props
 */
export const inferCardPurpose = (props: Record<string, unknown>): string => {
  // Interactive cards
  if (props.isSelectable) return 'selection-panel';
  if (props.isClickable) return 'action-panel';
  if (props.isExpanded !== undefined) return 'expandable-content';
  
  // Layout-based cards
  if (props.isCompact) return 'data-summary';
  if (props.isPlain) return 'content-display';
  
  // Content-based cards (based on children analysis)
  if (props.children) {
    const childrenStr = props.children.toString().toLowerCase();
    if (childrenStr.includes('logo') || childrenStr.includes('brand')) return 'brand-display';
    if (childrenStr.includes('chart') || childrenStr.includes('graph')) return 'data-visualization';
    if (childrenStr.includes('form') || childrenStr.includes('input')) return 'form-container';
    if (childrenStr.includes('table') || childrenStr.includes('list')) return 'data-display';
  }
  
  return 'content-display';
};

/**
 * Infer modal purpose from props
 */
export const inferModalPurpose = (props: Record<string, unknown>): string => {
  if (props.variant === 'small') return 'confirmation';
  if (props.variant === 'large') return 'form';
  return 'information';
};

/**
 * Infer accessibility features from props
 */
export const inferAccessibilityFeatures = (props: Record<string, unknown>): string[] => {
  const features: string[] = ['keyboard-navigable'];
  
  if (props['aria-label'] || props['aria-labelledby']) {
    features.push('screen-reader-friendly');
  }
  
  if (props.autoFocus) {
    features.push('auto-focus');
  }
  
  if (props.role) {
    features.push('semantic-role');
  }
  
  return features;
};

/**
 * Infer usage patterns from component type and props
 */
export const inferUsagePatterns = (
  componentType: string,
  props: Record<string, unknown>
): string[] => {
  const patterns: string[] = ['user-interface'];
  
  // Component-specific patterns
  switch (componentType.toLowerCase()) {
    case 'button':
      if (props.type === 'submit') patterns.push('form-submission');
      if (props.onClick) patterns.push('user-interaction');
      break;
    case 'textinput':
    case 'textarea':
      patterns.push('data-entry', 'form-input');
      if (props.validated === 'error') patterns.push('validation');
      break;
    case 'select':
      patterns.push('data-entry', 'selection');
      break;
    case 'checkbox':
    case 'radio':
      patterns.push('user-selection', 'form-input');
      break;
    case 'modal':
      patterns.push('user-interaction', 'workflow-step');
      break;
    case 'card':
      patterns.push('content-organization', 'data-presentation');
      break;
  }
  
  return patterns;
};

/**
 * Generate comprehensive metadata from props
 */
export const generateMetadataFromProps = (
  componentName: string,
  props: Record<string, unknown>
): {
  description: string;
  category: string;
  accessibility: string[];
  usage: string[];
} => {
  return {
    description: `${componentName} component`,
    category: inferCategory(componentName),
    accessibility: inferAccessibilityFeatures(props),
    usage: inferUsagePatterns(componentName, props)
  };
};

/**
 * Infer card content type from PatternFly props and children
 */
export const inferCardContentType = (props: Record<string, unknown>): string => {
  // Interactive states - keep them separate
  if (props.isSelectable) return 'selectable';
  if (props.isClickable) return 'clickable';
  if (props.isExpanded !== undefined) return 'expandable';
  
  // Content analysis based on children
  if (props.children) {
    const childrenStr = props.children.toString().toLowerCase();
    
    // Logo content (media cards should only contain logos)
    if (childrenStr.includes('logo') || childrenStr.includes('brand')) {
      return 'logo';
    }
    
    // Data content
    if (childrenStr.includes('table') || childrenStr.includes('chart') || childrenStr.includes('graph') || 
        childrenStr.includes('metric') || childrenStr.includes('stat')) {
      return 'data';
    }
    
    // Form content
    if (childrenStr.includes('form') || childrenStr.includes('input') || childrenStr.includes('button')) {
      return 'interactive';
    }
    
    // Text content
    if (childrenStr.includes('text') || childrenStr.includes('description') || childrenStr.includes('paragraph')) {
      return 'text';
    }
  }
  
  return 'mixed'; // Default fallback
};

/**
 * Infer card interactive state from PatternFly props
 */
export const inferCardInteractiveState = (props: Record<string, unknown>): string => {
  // Interactive states
  if (props.isSelectable) {
    if (props.isSelected) return 'selected';
    return 'selectable';
  }
  
  if (props.isClickable) {
    if (props.isDisabled) return 'disabled-clickable';
    return 'clickable';
  }
  
  if (props.isExpanded !== undefined) {
    if (props.isExpanded) return 'expanded';
    return 'collapsed';
  }
  
  // Default state
  return 'static';
};

/**
 * Infer modal interaction type
 */
export const inferModalInteractionType = (isOpen?: boolean): string => {
  return isOpen ? 'blocking' : 'non-blocking';
};

/**
 * Infer select purpose
 */
export const inferSelectPurpose = (): string => {
  return 'data-entry';
};

/**
 * Infer select selection type
 */
export const inferSelectSelectionType = (variant?: string): string => {
  return variant === 'typeahead' ? 'typeahead' : 'single';
};

/**
 * Infer radio purpose
 */
export const inferRadioPurpose = (): string => {
  return 'option-selection';
};

/**
 * Infer radio group context
 */
export const inferRadioGroupContext = (name?: string): string => {
  return name || 'unknown-group';
};

/**
 * Infer switch purpose
 */
export const inferSwitchPurpose = (): string => {
  return 'setting';
};

/**
 * Infer switch toggle target
 */
export const inferSwitchToggleTarget = (): string => {
  return 'feature';
};

/**
 * Infer textarea purpose
 */
export const inferTextAreaPurpose = (): string => {
  return 'content';
};

/**
 * Infer textarea content type
 */
export const inferTextAreaContentType = (): string => {
  return 'plain-text';
};

/**
 * Infer checkbox purpose
 */
export const inferCheckboxPurpose = (isChecked?: boolean): string => {
  return isChecked !== undefined ? 'selection' : 'form-input';
};

/**
 * Infer link purpose
 */
export const inferLinkPurpose = (href?: string, children?: unknown): string => {
  if (href?.startsWith('http')) return 'external';
  if (href === '#') return 'action';
  if (href?.includes('download')) return 'download';
  if (children?.toString().toLowerCase().includes('launch')) return 'launch';
  return 'navigation';
};

/**
 * Infer star icon purpose
 */
export const inferStarIconPurpose = (isFavorited?: boolean): string => {
  return isFavorited !== undefined ? 'favorite-toggle' : 'rating';
};

/**
 * Infer validation context
 */
export const inferValidationContext = (isRequired?: boolean): string => {
  return isRequired ? 'required' : 'optional';
};

/**
 * Infer form context (default for most form components)
 */
export const inferFormContext = (): string => {
  return 'form';
};

/**
 * Infer settings context (default for switches)
 */
export const inferSettingsContext = (): string => {
  return 'settings';
};

/**
 * Infer status badge type from content
 */
export const inferStatusBadgeType = (content?: string): string => {
  const lower = content?.toLowerCase() || '';
  if (lower.includes('ready')) return 'ready';
  if (lower.includes('success')) return 'success';
  if (lower.includes('warning')) return 'warning';
  if (lower.includes('error') || lower.includes('fail')) return 'error';
  if (lower.includes('pending')) return 'pending';
  return 'info';
};

/**
 * Infer status badge purpose
 */
export const inferStatusBadgePurpose = (): string => {
  return 'status-indicator';
};

/**
 * Infer category from component name
 * Category describes WHAT the component IS, not what it DOES (that's the action)
 */
export const inferCategory = (componentName: string): string => {
  const name = componentName.toLowerCase();
  
  // Component type categorization
  if (name === 'button') {
    return 'button';
  }
  if (['textinput', 'textarea', 'select', 'radio', 'checkbox', 'switch'].includes(name)) {
    return 'forms';
  }
  if (['nav', 'breadcrumb', 'tabs', 'pagination', 'masthead'].includes(name)) {
    return 'navigation';
  }
  if (['card', 'table', 'datalist', 'label', 'badge'].includes(name)) {
    return 'data-display';
  }
  if (['alert', 'banner', 'toast', 'progress', 'spinner'].includes(name)) {
    return 'feedback';
  }
  if (['modal', 'drawer', 'popover', 'tooltip'].includes(name)) {
    return 'overlay';
  }
  if (['flex', 'grid', 'stack', 'panel'].includes(name)) {
    return 'layout';
  }
  
  return 'data-display';
};

