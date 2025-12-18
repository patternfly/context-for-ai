import React from 'react';
import { Drawer as PFDrawer } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { useSemanticContext } from '../../context/SemanticContext';

export interface DrawerProps extends Omit<React.ComponentProps<typeof PFDrawer>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this drawer */
  purpose?: 'navigation' | 'filter' | 'details' | 'form' | 'settings';
}

/** Drawer - PatternFly Drawer wrapper with semantic metadata for AI tooling */
export const Drawer: React.FC<DrawerProps> = ({
  semanticName,
  semanticRole,
  purpose,
  children,
  isExpanded,
  ...props
}) => {
  // Register as visual parent in semantic context
  const { addContext, removeContext } = useSemanticContext();
  
  React.useEffect(() => {
    addContext('Drawer', undefined, true);  // true = qualified visual parent
    return () => removeContext();
  }, [addContext, removeContext]);

  // Get hierarchy from context
  let hierarchy;
  try {
    const semanticContext = useSemanticContext();
    hierarchy = semanticContext.getHierarchy();
  } catch {
    hierarchy = { fullPath: '', qualifiedParents: [], wrappers: [], immediateParent: '', immediateWrapper: '', depth: 0 };
  }

  // Auto-infer purpose if not provided
  const inferredPurpose = purpose || 'details';
  
  // Generate semantic role
  const role = semanticRole || `drawer-${inferredPurpose}`;

  // Default semantic name if not provided
  const componentName = semanticName || 'Drawer';

  return (
    <PFDrawer
      {...props}
      isExpanded={isExpanded}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={role}
      data-purpose={inferredPurpose}
      data-is-expanded={isExpanded}
    >
      {children}
    </PFDrawer>
  );
};

export default Drawer;

