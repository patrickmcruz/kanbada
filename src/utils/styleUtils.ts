import type { Priority } from '../types';

interface PriorityClasses {
  dot: string;
  text: string;
  border: string;
}

export const getPriorityClasses = (priority?: Priority): PriorityClasses => {
  switch (priority) {
    case 'Urgente':
      return { dot: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500' };
    case 'Alta':
      return { dot: 'bg-red-500', text: 'text-red-400', border: 'border-red-500' };
    case 'Média':
      return { dot: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500' };
    case 'Baixa':
      return { dot: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500' };
    default:
      return { dot: 'bg-gray-500', text: 'text-gray-400', border: 'border-[var(--color-main)]' };
  }
};