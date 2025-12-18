import React from 'react';
import { Card as PFCard } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { inferCardPurpose, inferCardContentType, inferCardInteractiveState } from '../../utils/inference';
import { useSemanticContext } from '../../context/SemanticContext';

export interface CardProps extends Omit<React.ComponentProps<typeof PFCard>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this card (auto-inferred from props if not provided) */
  purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
  /** The type of content this card contains (auto-inferred from children if not provided) */
  contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}

/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
export const Card: React.FC<CardProps> = ({
  semanticName,
  semanticRole,
  aiMetadata: _aiMetadata,
  purpose,
  contentType,
  children,
  isSelectable,
  isClickable,
  isExpanded,
  isCompact,
  isSelected,
  isDisabled,
  ...props
}) => {
  // Get hierarchy from context (optional - gracefully handles no provider)
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

  // Auto-infer semantic properties from PatternFly props and children
  const inferredPurpose = purpose || inferCardPurpose({ isSelectable, isClickable, isExpanded, isCompact, children });
  const inferredContentType = contentType || inferCardContentType({ isSelectable, isClickable, isExpanded, children });
  const inferredInteractiveState = inferCardInteractiveState({ isSelectable, isClickable, isExpanded, isSelected, isDisabled });
  
  // Generate semantic role
  const role = semanticRole || `card-${inferredPurpose}-${inferredContentType}`;

  // Generate semantic name: wrapper > parent > standalone
  // Card acts on wrapper (if exists), otherwise parent, otherwise standalone
  const componentName = semanticName || (() => {
    // Priority: wrapper (immediate context) > parent > standalone
    if (hierarchy.immediateWrapper) {
      return `${hierarchy.immediateWrapper} Card`;
    } else if (hierarchy.immediateParent) {
      return `${hierarchy.immediateParent} Card`;
    }
    
    // Otherwise just "Card"
    return 'Card';
  })();

  // Register card with its semantic name in context
  React.useEffect(() => {
    addContext('Card', componentName, false);  // false = wrapper (always visible)
    return () => removeContext();
  }, [addContext, removeContext, componentName]);

  return (
    <PFCard
      {...props}
      isSelectable={isSelectable}
      isClickable={isClickable}
      isExpanded={isExpanded}
      isCompact={isCompact}
      isSelected={isSelected}
      isDisabled={isDisabled}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={role}
      data-purpose={inferredPurpose}
      data-content-type={inferredContentType}
      data-interactive-state={inferredInteractiveState}
    >
      {children}
    </PFCard>
  );
};

export default Card;
