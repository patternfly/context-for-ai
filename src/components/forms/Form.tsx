import React from 'react';
import { Form as PFForm } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { useSemanticContext } from '../../context/SemanticContext';

export interface FormProps extends Omit<React.ComponentProps<typeof PFForm>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this form */
  purpose?: 'create' | 'edit' | 'search' | 'filter' | 'settings';
}

/** Form - PatternFly Form wrapper with semantic metadata for AI tooling */
export const Form: React.FC<FormProps> = ({
  semanticName,
  semanticRole,
  purpose,
  children,
  ...props
}) => {
  // Register as wrapper (not a visual parent) in semantic context
  const { addContext, removeContext } = useSemanticContext();
  
  React.useEffect(() => {
    addContext('Form', undefined, false);  // false = wrapper (always visible)
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

  // Auto-infer purpose from context if not provided
  const inferredPurpose = purpose || 'edit';
  
  // Generate semantic role
  const role = semanticRole || `form-${inferredPurpose}`;

  // Default semantic name if not provided
  const componentName = semanticName || 'Form';

  return (
    <PFForm
      {...props}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={role}
      data-purpose={inferredPurpose}
    >
      {children}
    </PFForm>
  );
};

export default Form;

