import type { Priority, PriorityDefinition } from '../types';

interface PriorityStyles {
  border: React.CSSProperties;
  dot: React.CSSProperties;
  text: React.CSSProperties;
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