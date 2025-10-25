import React, { useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskWorkPackage, TeamMember, ViewLevel } from '../types';
import { generateDateColumns, getStartOfDay } from '../utils/dateUtils';
import { WorkPackageCard } from './WorkPackageCard';

interface WorkloadViewProps {
  viewLevel: ViewLevel;
  currentDate: Date;
  workPackages: TaskWorkPackage[];
  teamMembers: TeamMember[];
  onWorkPackageDoubleClick: (workPackage: TaskWorkPackage) => void;
}

// --- Helper functions for new avatar design ---
const avatarColors = [
    'bg-purple-600', 'bg-green-600', 'bg-blue-600', 'bg-red-600',
    'bg-yellow-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600'
];
const getColorForId = (id: string) => {
    let hash = 0;
    if (id.length === 0) return avatarColors[0];
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const index = Math.abs(hash % avatarColors.length);
    return avatarColors[index];
}
const getInitials = (name: string) => name.charAt(0).toUpperCase();
// --- End of helper functions ---

export const WorkloadView: React.FC<WorkloadViewProps> = ({ viewLevel, currentDate, workPackages, teamMembers, onWorkPackageDoubleClick }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
  const dateColumns = generateDateColumns(viewLevel, currentDate, locale);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When the view changes to 'Month', scroll the current month into the center of the view.
    if (viewLevel === 'Month' && scrollContainerRef.current) {
        const currentMonthIndex = currentDate.getMonth();
        const container = scrollContainerRef.current;
        const grid = container.querySelector(':scope > div.grid') as HTMLElement;

        if (grid && grid.children.length >= dateColumns.length) {
            const targetColumn = grid.children[currentMonthIndex] as HTMLElement;

            if (targetColumn) {
                const containerWidth = container.offsetWidth;
                const targetOffsetLeft = targetColumn.offsetLeft;
                const targetWidth = targetColumn.offsetWidth;

                // Calculate the scroll position to center the target column
                const scrollLeft = targetOffsetLeft - (containerWidth / 2) + (targetWidth / 2);

                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    } else if (scrollContainerRef.current) {
        // For other views, reset scroll to the beginning.
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [viewLevel, currentDate, dateColumns]);

  const allMembers = useMemo(() => 
    [...teamMembers.filter(m => m.id !== 'unassigned'), ...teamMembers.filter(m => m.id === 'unassigned')],
    [teamMembers]
  );

  const workPackageLayouts = useMemo(() => {
    const layouts = new Map<string, { stackIndex: number; maxStack: number }>();

    allMembers.forEach(member => {
        const memberTasks = workPackages
            .filter(task => (task.ownerId ?? 'unassigned') === member.id)
            .sort((a, b) => {
                const startDiff = a.startDate.getTime() - b.startDate.getTime();
                if (startDiff !== 0) return startDiff;
                const durationA = a.endDate.getTime() - a.startDate.getTime();
                const durationB = b.endDate.getTime() - b.startDate.getTime();
                return durationB - durationA; // Longer tasks first
            });

        if (memberTasks.length === 0) {
            return;
        }

        const lanes: Date[] = []; 
        const tasksWithStack = [];

        for (const task of memberTasks) {
            const taskStartDateSOD = getStartOfDay(task.startDate);

            let placedInLane = false;
            for (let i = 0; i < lanes.length; i++) {
                const laneEndDateSOD = getStartOfDay(lanes[i]);
                if (taskStartDateSOD.getTime() > laneEndDateSOD.getTime()) {
                    lanes[i] = task.endDate;
                    tasksWithStack.push({ taskId: task.id, stackIndex: i });
                    placedInLane = true;
                    break;
                }
            }

            if (!placedInLane) {
                lanes.push(task.endDate);
                tasksWithStack.push({ taskId: task.id, stackIndex: lanes.length - 1 });
            }
        }
        
        const maxStack = lanes.length > 0 ? lanes.length : 1;

        tasksWithStack.forEach(({ taskId, stackIndex }) => {
            layouts.set(taskId, { stackIndex, maxStack });
        });
    });

    return layouts;
  }, [workPackages, allMembers]);

  const getWorkPackagePosition = (workPackage: TaskWorkPackage) => {
    const viewStartDate = dateColumns[0].startDate;
    const viewEndDate = dateColumns[dateColumns.length - 1].endDate;

    const taskStartDateSOD = getStartOfDay(workPackage.startDate);
    const taskEndDateSOD = getStartOfDay(workPackage.endDate);
    const viewStartDateSOD = getStartOfDay(viewStartDate);
    const viewEndDateSOD = getStartOfDay(viewEndDate);

    if (taskEndDateSOD.getTime() < viewStartDateSOD.getTime() || taskStartDateSOD.getTime() > viewEndDateSOD.getTime()) {
      return null;
    }

    const taskStartInView = new Date(Math.max(taskStartDateSOD.getTime(), viewStartDateSOD.getTime()));
    const taskEndInView = new Date(Math.min(taskEndDateSOD.getTime(), viewEndDateSOD.getTime()));

    let startColIndex = dateColumns.findIndex(col =>
        taskStartInView.getTime() <= getStartOfDay(col.endDate).getTime()
    );
    if (startColIndex === -1) { 
        return null;
    }
    
    let endColIndex = -1;
    for(let i = dateColumns.length - 1; i >= 0; i--) {
        if (taskEndInView.getTime() >= getStartOfDay(dateColumns[i].startDate).getTime()) {
            endColIndex = i;
            break;
        }
    }
    if(endColIndex === -1) {
        return null;
    }
    
    if(startColIndex > endColIndex) {
        startColIndex = endColIndex;
    }
    
    const columnSpan = endColIndex - startColIndex + 1;
    if (columnSpan <= 0) return null;

    return {
      gridColumn: `${startColIndex + 1} / span ${columnSpan}`,
    };
  };

  const timelineGridTemplateColumns = `repeat(${dateColumns.length}, minmax(180px, 2fr))`;

  return (
    <div className="bg-[var(--color-surface-1)] rounded-lg overflow-hidden border border-[var(--color-surface-2)] flex h-full">
        {/* --- Left Column: Responsible --- */}
        <div className="flex-shrink-0 z-10 border-r border-[var(--color-surface-2)]" style={{ width: '150px' }}>
            <div className="p-4 font-bold text-xs text-left uppercase tracking-wider text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-b-2 border-[var(--color-surface-2)] sticky top-0 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>{t('responsible')}</span>
            </div>
            {allMembers.map((member) => {
                if (member.id === 'unassigned') {
                    return (
                        <div key={member.id} className="p-3 text-sm font-medium text-center text-[var(--color-text-secondary)] italic bg-transparent border-b border-[var(--color-surface-2)] min-h-[80px] flex items-center justify-center">
                            {t('unassigned')}
                        </div>
                    );
                }
                
                const avatarColor = getColorForId(member.id);
                const initials = getInitials(member.name);
        
                return (
                    <div key={member.id} className="p-3 text-sm font-medium text-[var(--color-text-primary)] bg-transparent border-b border-[var(--color-surface-2)] min-h-[80px] flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${avatarColor}`}>
                            {initials}
                        </div>
                        <span className="truncate capitalize">{member.name}</span>
                    </div>
                );
            })}
        </div>

        {/* --- Right Column: Timeline (scrollable) --- */}
        <div className="flex-1 overflow-auto" ref={scrollContainerRef}>
            <div
                className="grid relative"
                style={{
                    gridTemplateColumns: timelineGridTemplateColumns,
                    gridTemplateRows: `auto repeat(${allMembers.length}, min-content)`
                }}
            >
                {/* Date Headers */}
                {dateColumns.map((col, index) => (
                    <div key={index} className="p-4 text-center font-bold text-xs uppercase tracking-wider text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-b-2 border-r border-[var(--color-surface-2)] last:border-r-0 sticky top-0 z-20">
                        {col.label}
                    </div>
                ))}
                
                {/* Rows with Cells and Tasks */}
                {allMembers.map((member, rowIndex) => (
                    <div
                        key={member.id}
                        className="contents" // This makes the div not affect the grid layout itself
                    >
                        {/* Cells */}
                        {dateColumns.map((_, colIndex) => (
                            <div
                                key={colIndex}
                                style={{ gridRow: rowIndex + 2, gridColumn: colIndex + 1 }}
                                className="border-b border-r border-[var(--color-surface-2)] last:border-r-0 min-h-[80px]"
                            ></div>
                        ))}

                        {/* Tasks for this member */}
                        {workPackages
                            .filter(task => (task.ownerId ?? 'unassigned') === member.id)
                            .map((workPackage) => {
                                const position = getWorkPackagePosition(workPackage);
                                if (!position) return null;
                                
                                const layoutInfo = workPackageLayouts.get(workPackage.id);
                                const style: React.CSSProperties = { ...position, gridRow: rowIndex + 2 };

                                if (layoutInfo && layoutInfo.maxStack > 1) {
                                    const { stackIndex, maxStack } = layoutInfo;
                                    const heightPercentage = 100 / maxStack;
                                    const topOffsetPercentage = heightPercentage * stackIndex;
                                    
                                    style.position = 'relative';
                                    style.height = `calc(${heightPercentage}% - 4px)`;
                                    style.top = `calc(${topOffsetPercentage}% + 2px)`;
                                    style.zIndex = stackIndex;
                                }

                                return (
                                    <div 
                                        key={workPackage.id} 
                                        style={style} 
                                        className="p-1 z-10"
                                    >
                                        <WorkPackageCard 
                                            workPackage={workPackage} 
                                            maxStack={layoutInfo?.maxStack ?? 1}
                                            onDoubleClick={onWorkPackageDoubleClick} 
                                        />
                                    </div>
                                );
                            })}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};