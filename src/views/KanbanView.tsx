import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskWorkPackage, TeamMember, Priority, SortKey } from '../types';
import { getPriorityClasses } from '../utils/styleUtils';


interface KanbanViewProps {
  columns: string[];
  tasks: TaskWorkPackage[];
  teamMembers: TeamMember[];
  defaultSortKey: SortKey;
  onTaskStatusChange: (taskId: string, newStatus: string) => void;
  onColumnsChange: (columns: string[]) => void;
  onWorkPackageDoubleClick: (workPackage: TaskWorkPackage) => void;
  sprintDays: number;
}

// --- Avatar helper functions ---
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
// --- End of avatar functions ---

const CompactTaskCard: React.FC<{ task: TaskWorkPackage; onDoubleClick: (taskId: string) => void; teamMembers: TeamMember[] }> = ({ task, onDoubleClick, teamMembers }) => {
    const owner = teamMembers.find(m => m.id === task.ownerId);
    const { border: borderColor } = getPriorityClasses(task.priority);

    return (
        <div
            onDoubleClick={() => onDoubleClick(task.id)}
            className={`w-full bg-[var(--color-surface-1)] rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-[var(--color-surface-3)] border-l-4 ${borderColor} transition-all`}
        >
            <p className="font-semibold text-xs text-[var(--color-text-primary)] truncate flex-1 pr-2">
                {task.projectId && `[${task.projectId}] `}{task.title}
            </p>
            {owner && owner.id !== 'unassigned' && (
                <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0 ${getColorForId(owner.id)}`}
                    title={owner.name}
                >
                    {getInitials(owner.name)}
                </div>
            )}
        </div>
    );
};

const ExpandedTaskCard: React.FC<{ task: TaskWorkPackage; onDoubleClick: (taskId: string) => void; teamMembers: TeamMember[] }> = ({ task, onDoubleClick, teamMembers }) => {
    const { i18n } = useTranslation();
    const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
    const owner = teamMembers.find(m => m.id === task.ownerId);
    const { border: borderColor, dot: dotColor, text: textColor } = getPriorityClasses(task.priority);

    return (
        <div
            onDoubleClick={() => onDoubleClick(task.id)}
            className={`w-full bg-[var(--color-surface-1)] rounded-lg p-3 cursor-pointer border-l-4 ${borderColor} ring-2 ring-[var(--color-main)] shadow-lg`}
        >
            <p className="font-bold text-sm text-[var(--color-text-primary)] mb-2">
                {task.projectId && `[${task.projectId}] `}{task.title}
            </p>
            
            <div className="space-y-2 text-xs">
                {owner && owner.id !== 'unassigned' && (
                    <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0 ${getColorForId(owner.id)}`}>
                            {getInitials(owner.name)}
                        </div>
                        <span className="text-[var(--color-text-secondary)] capitalize">{owner.name}</span>
                    </div>
                )}
                
                {task.priority && (
                     <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                        <span className={`font-medium ${textColor}`}>{task.priority}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>{task.hours}h</span>
                </div>
                
                 <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>{task.startDate.toLocaleDateString(locale, {day: '2-digit', month: '2-digit'})} - {task.endDate.toLocaleDateString(locale, {day: '2-digit', month: '2-digit'})}</span>
                </div>
            </div>
        </div>
    );
};

const priorityOrder: Record<Priority, number> = {
  'Urgente': 1,
  'Alta': 2,
  'Média': 3,
  'Baixa': 4,
};

const MoreVerticalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
);


export const KanbanView: React.FC<KanbanViewProps> = ({ columns, tasks, teamMembers, onTaskStatusChange, onColumnsChange, defaultSortKey, onWorkPackageDoubleClick, sprintDays }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<Record<string, SortKey>>({});
  const [openSortMenu, setOpenSortMenu] = useState<string | null>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
        if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
            setOpenSortMenu(null);
        }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setIsDragging(true);
    setExpandedCardId(null);
  };

  const handleColumnDragStart = (e: React.DragEvent<HTMLDivElement>, column: string) => {
    e.dataTransfer.setData('columnName', column);
    setDraggedColumn(column);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumn: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const draggedColumnName = e.dataTransfer.getData('columnName');

    if (taskId) {
      onTaskStatusChange(taskId, targetColumn);
    } else if (draggedColumnName && draggedColumnName !== targetColumn) {
        const newColumns = [...columns];
        const draggedIndex = newColumns.indexOf(draggedColumnName);
        const targetIndex = newColumns.indexOf(targetColumn);

        if (draggedIndex > -1) {
            const [removed] = newColumns.splice(draggedIndex, 1);
            newColumns.splice(targetIndex, 0, removed);
            onColumnsChange(newColumns);
        }
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedColumn(null);
  };
  
  const handleCardDoubleClick = (taskId: string) => {
    setExpandedCardId(prevId => prevId === taskId ? null : taskId);
  };

  const handleSortChange = (columnName: string, key: SortKey) => {
    setSortConfig(prev => ({ ...prev, [columnName]: key }));
    setOpenSortMenu(null);
  };


  return (
    <div 
        className={`flex gap-4 h-full overflow-x-auto pb-4 ${isDragging ? 'is-dragging' : ''}`}
        onDragEnd={handleDragEnd}
    >
      {columns.map(column => {
        const sortKey = sortConfig[column] || defaultSortKey;

        const tasksInColumn = tasks
            .filter(task => task.status === column)
            .sort((a, b) => {
                if (sortKey === 'title') {
                    return a.title.localeCompare(b.title);
                }
                if (sortKey === 'responsible') {
                    const ownerA = teamMembers.find(m => m.id === a.ownerId);
                    const ownerB = teamMembers.find(m => m.id === b.ownerId);
                    const nameA = (ownerA && ownerA.id !== 'unassigned') ? ownerA.name.toLowerCase() : 'zzzz';
                    const nameB = (ownerB && ownerB.id !== 'unassigned') ? ownerB.name.toLowerCase() : 'zzzz';
                    return nameA.localeCompare(nameB);
                }
                // Default sort: priority
                const priorityValueA = a.priority ? priorityOrder[a.priority] : Infinity;
                const priorityValueB = b.priority ? priorityOrder[b.priority] : Infinity;
                return priorityValueA - priorityValueB;
            });
        const totalHours = tasksInColumn.reduce((sum, task) => sum + task.hours, 0);

        return (
          <div
            key={column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
            className={`w-80 flex-shrink-0 bg-[var(--color-surface-2)] rounded-lg flex flex-col drop-cell transition-all duration-200 ${draggedColumn === column ? 'opacity-30' : ''}`}
          >
            <div
              draggable
              onDragStart={(e) => handleColumnDragStart(e, column)} 
              className="p-3 border-b-2 border-[var(--color-surface-1)] sticky top-0 bg-[var(--color-surface-2)] rounded-t-lg z-10 cursor-grab active:cursor-grabbing"
            >
              <div className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-primary)] flex justify-between items-center">
                <span>
                  {t(column)}
                  {column.toLowerCase() === 'sprint' && (
                    <span className="ml-1.5 text-[var(--color-text-secondary)]">
                        (+{sprintDays})
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">{tasksInColumn.length} / {totalHours}h</span>
                    <div className="relative">
                        <button 
                            onClick={() => setOpenSortMenu(openSortMenu === column ? null : column)}
                            className="p-1 rounded-full hover:bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]"
                            aria-label={t('sort') as string}
                            aria-haspopup="true"
                            aria-expanded={openSortMenu === column}
                        >
                            <MoreVerticalIcon />
                        </button>
                        {openSortMenu === column && (
                            <div ref={sortMenuRef} className="absolute right-0 mt-2 w-48 bg-[var(--color-surface-1)] border border-[var(--color-surface-3)] rounded-md shadow-lg z-20 py-1">
                                <button onClick={() => handleSortChange(column, 'priority')} className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]">
                                    {t('sortByPriority')}
                                </button>
                                <button onClick={() => handleSortChange(column, 'title')} className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]">
                                    {t('sortByTitle')}
                                </button>
                                <button onClick={() => handleSortChange(column, 'responsible')} className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]">
                                    {t('sortByResponsible')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {tasksInColumn.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="animate-drop"
                >
                  { expandedCardId === task.id ? (
                    <ExpandedTaskCard
                      task={task}
                      onDoubleClick={handleCardDoubleClick}
                      teamMembers={teamMembers}
                    />
                  ) : (
                    <CompactTaskCard 
                      task={task} 
                      onDoubleClick={handleCardDoubleClick} 
                      teamMembers={teamMembers} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};