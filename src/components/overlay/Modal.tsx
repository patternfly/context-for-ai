import React from 'react';
import { Modal as PFModal } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { inferModalPurpose, inferModalInteractionType } from '../../utils/inference';
import { useSemanticContext } from '../../context/SemanticContext';

export interface ModalProps extends Omit<React.ComponentProps<typeof PFModal>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this modal (auto-inferred from variant if not provided) */
  purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
  /** The type of interaction this modal facilitates (auto-inferred from props if not provided) */
  interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
  /** The component that triggered this modal to open (auto-inferred from context if not provided) */
  triggeredBy?: string;
}

/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Modal = React.forwardRef<any, ModalProps>(({
  semanticName,
  semanticRole,
  aiMetadata: _aiMetadata,
  purpose,
  interactionType,
  triggeredBy,
  children,
  variant,
  isOpen,
  ...props
}, ref) => {
  // Register as visual parent in semantic context
  const { addContext, removeContext } = useSemanticContext();
  
  React.useEffect(() => {
    addContext('Modal', undefined, true);  // true = qualified visual parent
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

  // Auto-infer semantic properties from PatternFly props
  const inferredPurpose = purpose || inferModalPurpose({ variant });
  const inferredInteractionType = interactionType || inferModalInteractionType(isOpen);
  
  // Auto-infer triggeredBy from current hierarchy context
  // Extract the semantic name of the last component (usually the triggering button)
  const inferredTriggeredBy = triggeredBy || (hierarchy.fullPath ? 
    hierarchy.fullPath.split(' > ').pop() || 'unknown' : 'unknown');
  
  // Generate semantic role
  const role = semanticRole || `modal-${inferredPurpose}-${inferredInteractionType}`;

  // Default semantic name if not provided
  const componentName = semanticName || 'Modal';

  return (
    <PFModal
      {...props}
      ref={ref}
      variant={variant}
      isOpen={isOpen}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-triggered-by={inferredTriggeredBy}
      data-semantic-role={role}
      data-purpose={inferredPurpose}
      data-interaction-type={inferredInteractionType}
    >
      {children}
    </PFModal>
  );
});

Modal.displayName = 'Modal';

export default Modal;
