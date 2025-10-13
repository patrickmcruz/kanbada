
import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const cardBg = task.isDemand ? 'bg-sky-100' : 'bg-gray-100';
  const borderColor = task.isDemand ? 'border-sky-500' : 'border-indigo-500';

  return (
    <div
      className={`h-full w-full rounded-md p-2 flex flex-col justify-between text-xs shadow-sm hover:shadow-md transition-shadow duration-200 ${cardBg} border-l-4 ${borderColor}`}
    >
        <div>
            <p className="font-bold text-gray-800">
                {task.projectId && `[${task.projectId}] `}{task.title}
            </p>
        </div>
        {task.hours && <p className="text-gray-500 mt-1 self-end">[{task.hours}h]</p>}
    </div>
  );
};
