import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  maxStack: number;
  onDoubleClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, maxStack, onDoubleClick }) => {
  const cardBg = task.isDemand ? 'bg-[var(--color-demand-card-bg)]' : 'bg-[var(--color-surface-2)]';
  const borderColor = task.isDemand ? 'border-[var(--color-demand-card-border)]' : 'border-[var(--color-main)]';
  const isCompact = maxStack > 2;

  return (
    <div
      onDoubleClick={() => onDoubleClick(task)}
      className={`h-full w-full rounded-md flex flex-col justify-between hover:brightness-110 transition-all duration-200 ${cardBg} border-l-4 ${borderColor} ${isCompact ? 'p-1' : 'p-2'}`}
    >
        <div>
            <p className={`font-bold text-[var(--color-text-primary)] ${isCompact ? 'text-[10px] leading-tight' : 'text-xs'}`}>
                {task.projectId && `[${task.projectId}] `}{task.title}
            </p>
        </div>
        {task.hours && !isCompact && <p className="text-[var(--color-text-secondary)] mt-1 self-end text-xs">[{task.hours}h]</p>}
    </div>
  );
};