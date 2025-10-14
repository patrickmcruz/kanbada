import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  maxStack: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, maxStack }) => {
  const cardBg = task.isDemand ? 'bg-[#3a5a6a]' : 'bg-[#40464a]';
  const borderColor = task.isDemand ? 'border-[#60a5fa]' : 'border-[#8cb45a]';
  const isCompact = maxStack > 2;

  return (
    <div
      className={`h-full w-full rounded-md flex flex-col justify-between hover:brightness-110 transition-all duration-200 ${cardBg} border-l-4 ${borderColor} ${isCompact ? 'p-1' : 'p-2'}`}
    >
        <div>
            <p className={`font-bold text-white ${isCompact ? 'text-[10px] leading-tight' : 'text-xs'}`}>
                {task.projectId && `[${task.projectId}] `}{task.title}
            </p>
        </div>
        {task.hours && !isCompact && <p className="text-[#b0b3b8] mt-1 self-end text-xs">[{task.hours}h]</p>}
    </div>
  );
};