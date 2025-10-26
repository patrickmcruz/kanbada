import React from 'react';
import type { TaskWorkPackage, PriorityDefinition } from '../types';
import { getPriorityStyles } from '../utils/styleUtils';

interface WorkPackageCardProps {
  workPackage: TaskWorkPackage;
  maxStack: number;
  onDoubleClick: (workPackage: TaskWorkPackage) => void;
  priorities: PriorityDefinition[];
}

export const WorkPackageCard: React.FC<WorkPackageCardProps> = ({ workPackage, maxStack, onDoubleClick, priorities }) => {
  const cardBg = workPackage.isDemand ? 'bg-[var(--color-demand-card-bg)]' : 'bg-[var(--color-surface-2)]';
  const { border: borderStyle } = getPriorityStyles(workPackage.priority, priorities);
  const isCompact = maxStack > 2;

  return (
    <div
      onDoubleClick={() => onDoubleClick(workPackage)}
      className={`h-full w-full rounded-md flex items-center hover:brightness-110 transition-all duration-200 ${cardBg} border-l-4 ${isCompact ? 'p-1' : 'p-2'} cursor-pointer`}
      style={borderStyle}
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