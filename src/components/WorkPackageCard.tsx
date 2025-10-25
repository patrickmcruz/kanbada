import React from 'react';
import type { TaskWorkPackage } from '../types';
import { getPriorityClasses } from '../utils/styleUtils';

interface WorkPackageCardProps {
  workPackage: TaskWorkPackage;
  maxStack: number;
  onDoubleClick: (workPackage: TaskWorkPackage) => void;
}

export const WorkPackageCard: React.FC<WorkPackageCardProps> = ({ workPackage, maxStack, onDoubleClick }) => {
  const cardBg = workPackage.isDemand ? 'bg-[var(--color-demand-card-bg)]' : 'bg-[var(--color-surface-2)]';
  const { border: borderColor } = getPriorityClasses(workPackage.priority);
  const isCompact = maxStack > 2;

  return (
    <div
      onDoubleClick={() => onDoubleClick(workPackage)}
      className={`h-full w-full rounded-md flex items-center hover:brightness-110 transition-all duration-200 ${cardBg} border-l-4 ${borderColor} ${isCompact ? 'p-1' : 'p-2'} cursor-pointer`}
    >
      <div className="flex justify-between items-start w-full gap-2">
        <p className={`font-bold text-[var(--color-text-primary)] ${isCompact ? 'text-[10px] leading-tight' : 'text-xs'}`}>
          {workPackage.projectId && `[${workPackage.projectId}] `}{workPackage.title}
        </p>
        {workPackage.hours && !isCompact && <p className="text-[var(--color-text-secondary)] text-xs flex-shrink-0">[{workPackage.hours}h]</p>}
      </div>
    </div>
  );
};