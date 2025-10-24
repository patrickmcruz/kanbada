import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskWorkPackage, TeamMember, ViewLevel } from '../types';
import { generateDateColumns, daysBetween, addDays, getStartOfDay } from '../utils/dateUtils';
import { WorkPackageCard } from './WorkPackageCard';

interface KanbanBoardProps {
  viewLevel: ViewLevel;
  currentDate: Date;
  workPackages: TaskWorkPackage[];
  teamMembers: TeamMember[];
  onWorkPackageUpdate: (workPackage: TaskWorkPackage) => void;
  justUpdatedWorkPackageId: string | null;
  onWorkPackageDoubleClick: (workPackage: TaskWorkPackage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ viewLevel, currentDate, workPackages, teamMembers, onWorkPackageUpdate, justUpdatedWorkPackageId, onWorkPackageDoubleClick }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
  const dateColumns = generateDateColumns(viewLevel, currentDate, locale);
  
  const [draggedWorkPackageId, setDraggedWorkPackageId] = useState<string | null>(null);

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

  const handleDragStart = (e: React.DragEvent, workPackage: TaskWorkPackage) => {
    e.dataTransfer.setData('workPackageId', workPackage.id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        setDraggedWorkPackageId(workPackage.id);
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedWorkPackageId(null);
  };

  const handleDragOver = (e: React.DragEvent, rowIndex: number) => {
    if (!draggedWorkPackageId) return;
    const workPackage = workPackages.find(t => t.id === draggedWorkPackageId);
    if (!workPackage) return;
    const taskOwnerId = workPackage.ownerId ?? 'unassigned';
    const dropRowOwnerId = allMembers[rowIndex].id;
    if (taskOwnerId === dropRowOwnerId) {
        e.preventDefault();
    }
  };
  
  const handleDrop = (e: React.DragEvent, colIndex: number) => {
    e.preventDefault();
    const workPackageId = e.dataTransfer.getData('workPackageId');
    if (!workPackageId) return;
    const originalWorkPackage = workPackages.find(t => t.id === workPackageId);
    if (!originalWorkPackage) return;
    const targetColumn = dateColumns[colIndex];
    const duration = daysBetween(originalWorkPackage.startDate, originalWorkPackage.endDate);
    const newStartDate = targetColumn.startDate;
    const newEndDate = addDays(newStartDate, duration - 1);
    const updatedWorkPackage: TaskWorkPackage = { ...originalWorkPackage, startDate: newStartDate, endDate: newEndDate };
    onWorkPackageUpdate(updatedWorkPackage);
  };

  const timelineGridTemplateColumns = `repeat(${dateColumns.length}, minmax(120px, 2fr))`;

  return (
    <div className="bg-[var(--color-surface-1)] rounded-lg overflow-hidden border border-[var(--color-surface-2)] flex h-full">
        {/* --- Left Column: Responsible --- */}
        <div className="flex-shrink-0 z-10 border-r border-[var(--color-surface-2)]" style={{ width: '150px' }}>
            <div className="p-3 font-semibold text-sm text-[var(--color-text-secondary)] bg-[var(--color-back)] border-b border-[var(--color-surface-2)] sticky top-0">
                {t('responsible')}
            </div>
            {allMembers.map((member) => (
                <div key={member.id} className="p-3 text-sm font-medium text-[var(--color-text-primary)] bg-transparent border-b border-[var(--color-surface-2)] min-h-[80px] flex items-center">
                    {member.id === 'unassigned' ? t('unassigned') : member.name}
                </div>
            ))}
        </div>

        {/* --- Right Column: Timeline (scrollable) --- */}
        <div className={`flex-1 overflow-auto ${draggedWorkPackageId ? 'is-dragging' : ''}`}>
            <div
                className="grid relative"
                style={{
                    gridTemplateColumns: timelineGridTemplateColumns,
                    gridTemplateRows: `auto repeat(${allMembers.length}, min-content)`
                }}
            >
                {/* Date Headers */}
                {dateColumns.map((col, index) => (
                    <div key={index} className="p-3 text-center font-semibold text-sm text-[var(--color-text-secondary)] bg-[var(--color-back)] border-b border-r border-[var(--color-surface-2)] last:border-r-0 sticky top-0 z-20">
                        {col.label}
                    </div>
                ))}
                
                {/* Rows with Drop Cells and Tasks */}
                {allMembers.map((member, rowIndex) => (
                    <div
                        key={member.id}
                        className="contents" // This makes the div not affect the grid layout itself
                    >
                        {/* Drop Cells */}
                        {dateColumns.map((_, colIndex) => (
                            <div
                                key={colIndex}
                                style={{ gridRow: rowIndex + 2, gridColumn: colIndex + 1 }}
                                className="drop-cell border-b border-r border-[var(--color-surface-2)] last:border-r-0 min-h-[80px] transition-colors duration-150"
                                onDragOver={(e) => handleDragOver(e, rowIndex)}
                                onDrop={(e) => handleDrop(e, colIndex)}
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
                                
                                const isDraggable = workPackage.ownerId !== null;
                                const wasJustUpdated = workPackage.id === justUpdatedWorkPackageId;

                                return (
                                    <div 
                                        key={workPackage.id} 
                                        style={style} 
                                        className={`p-1 z-10 transition-all duration-300 ease-in-out ${isDraggable ? 'cursor-grab' : ''} ${draggedWorkPackageId === workPackage.id ? 'invisible' : (draggedWorkPackageId ? 'pointer-events-none' : '')} ${wasJustUpdated ? 'animate-drop' : ''}`}
                                        draggable={isDraggable}
                                        onDragStart={isDraggable ? (e) => handleDragStart(e, workPackage) : undefined}
                                        onDragEnd={isDraggable ? handleDragEnd : undefined}
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
