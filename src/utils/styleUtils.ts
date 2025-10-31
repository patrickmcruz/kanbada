// Fix: Import CSSProperties from React to use for type definitions.
import type { CSSProperties } from 'react';
import type { Priority, PriorityDefinition } from '../types';

interface PriorityStyles {
  border: CSSProperties;
  dot: CSSProperties;
  text: CSSProperties;
}

const defaultStyles: PriorityStyles = {
  border: { borderColor: 'var(--color-main)' },
  dot: { backgroundColor: 'var(--color-text-secondary)' },
  text: { color: 'var(--color-text-secondary)' },
};

export const getPriorityStyles = (
  priorityKey: Priority | undefined,
  priorities: PriorityDefinition[]
): PriorityStyles => {
  if (!priorityKey) {
    return defaultStyles;
  }

  const priority = priorities.find(p => p.key === priorityKey);
  if (!priority) {
    return defaultStyles;
  }
  
  return {
    border: { borderColor: priority.color },
    dot: { backgroundColor: priority.color },
    text: { color: priority.color },
  };
};