import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  maxStack: number;
  onDoubleClick: (task: Task) => void;
}

const getPriorityBorderColor = (priority?: Task['priority']): string => {
  switch (priority) {
    case 'Urgente':
      return 'border-purple-500';
    case 'Alta':
      return 'border-red-500';
    case 'Média':
      return 'border-yellow-500';
    case 'Baixa':
      return 'border-blue-500';
    default:
      return 'border-[var(--color-main)]';
  }
};


export const TaskCard: React.FC<TaskCardProps> = ({ task, maxStack, onDoubleClick }) => {
  const cardBg = task.isDemand ? 'bg-[var(--color-demand-card-bg)]' : 'bg-[var(--color-surface-2)]';
  const borderColor = getPriorityBorderColor(task.priority);
  const isCompact = maxStack > 2;

  return (
    <div
      onDoubleClick={() => onDoubleClick(task)}
      className={`h-full w-full rounded-md flex items-center hover:brightness-110 transition-all duration-200 ${cardBg} border-l-4 ${borderColor} ${isCompact ? 'p-1' : 'p-2'}`}
    >
      <div className="flex justify-between items-start w-full gap-2">
        <p className={`font-bold text-[var(--color-text-primary)] ${isCompact ? 'text-[10px] leading-tight' : 'text-xs'}`}>
          {task.projectId && `[${task.projectId}] `}{task.title}
        </p>
        {task.hours && !isCompact && <p className="text-[var(--color-text-secondary)] text-xs flex-shrink-0">[{task.hours}h]</p>}
      </div>
    </div>
  );
};