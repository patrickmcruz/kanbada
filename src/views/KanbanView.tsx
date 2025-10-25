import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskWorkPackage, TeamMember } from '../types';
import { getPriorityClasses } from '../utils/styleUtils';


interface KanbanViewProps {
  columns: string[];
  tasks: TaskWorkPackage[];
  teamMembers: TeamMember[];
  onTaskStatusChange: (taskId: string, newStatus: string) => void;
  onWorkPackageDoubleClick: (workPackage: TaskWorkPackage) => void;
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


export const KanbanView: React.FC<KanbanViewProps> = ({ columns, tasks, teamMembers, onTaskStatusChange }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setIsDragging(true);
    // If a card is expanded, collapse it when dragging starts
    if (expandedTaskId) {
        setExpandedTaskId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
        onTaskStatusChange(taskId, newStatus);
    }
    setIsDragging(false);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleCardDoubleClick = (taskId: string) => {
    setExpandedTaskId(currentId => (currentId === taskId ? null : taskId));
  };


  return (
    <div 
        className={`flex gap-4 h-full overflow-x-auto pb-4 ${isDragging ? 'is-dragging' : ''}`}
        onDragEnd={handleDragEnd}
    >
      {columns.map(column => {
        const tasksInColumn = tasks.filter(task => task.status === column);
        const totalHours = tasksInColumn.reduce((sum, task) => sum + task.hours, 0);

        return (
          <div
            key={column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
            className="w-80 flex-shrink-0 bg-[var(--color-surface-2)] rounded-lg flex flex-col drop-cell transition-colors"
          >
            <div className="p-3 border-b-2 border-[var(--color-surface-1)] sticky top-0 bg-[var(--color-surface-2)] rounded-t-lg z-10">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-primary)] flex justify-between items-center">
                <span>{t(column)}</span>
                <span className="text-xs font-mono bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">{tasksInColumn.length} / {totalHours}h</span>
              </h3>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {tasksInColumn.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="animate-drop"
                >
                  {expandedTaskId === task.id ? (
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