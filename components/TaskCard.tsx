import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  maxStack: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, maxStack }) => {
  const cardBg = task.isDemand ? 'bg-sky-100' : 'bg-gray-100';
  const borderColor = task.isDemand ? 'border-sky-500' : 'border-indigo-500';
  const isCompact = maxStack > 2;

  return (
    <div
      className={`h-full w-full rounded-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 ${cardBg} border-l-4 ${borderColor} ${isCompact ? 'p-1' : 'p-2'}`}
    >
        <div>
            <p className={`font-bold text-gray-800 ${isCompact ? 'text-[10px] leading-tight' : 'text-xs'}`}>
                {task.projectId && `[${task.projectId}] `}{task.title}
            </p>
        </div>
        {task.hours && !isCompact && <p className="text-gray-500 mt-1 self-end text-xs">[{task.hours}h]</p>}
    </div>
  );
};