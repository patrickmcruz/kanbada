import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskWorkPackage, TeamMember } from '../types';
import { WorkPackageCard } from './WorkPackageCard';

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

const TaskCard: React.FC<{ task: TaskWorkPackage; onDoubleClick: (task: TaskWorkPackage) => void; teamMembers: TeamMember[] }> = ({ task, onDoubleClick, teamMembers }) => {
    const owner = teamMembers.find(m => m.id === task.ownerId);

    return (
        <div className="bg-[var(--color-surface-1)] rounded-lg p-3 border border-transparent hover:border-[var(--color-main)] cursor-pointer">
            <WorkPackageCard 
                workPackage={task}
                maxStack={1} // No stacking in Kanban view
                onDoubleClick={onDoubleClick}
            />
            {owner && owner.id !== 'unassigned' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-surface-2)]">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 ${getColorForId(owner.id)}`}>
                        {getInitials(owner.name)}
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)] truncate capitalize">{owner.name}</span>
                </div>
            )}
        </div>
    );
};

export const KanbanView: React.FC<KanbanViewProps> = ({ columns, tasks, teamMembers, onTaskStatusChange, onWorkPackageDoubleClick }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setIsDragging(true);
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
            <div className="p-3 border-b-2 border-[var(--color-surface-1)] sticky top-0 bg-[var(--color-surface-2)] rounded-t-lg">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-primary)] flex justify-between items-center">
                <span>{column}</span>
                <span className="text-xs font-mono bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">{tasksInColumn.length} / {totalHours}h</span>
              </h3>
            </div>
            <div className="p-2 space-y-3 overflow-y-auto flex-1">
              {tasksInColumn.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="animate-drop"
                >
                  <TaskCard task={task} onDoubleClick={onWorkPackageDoubleClick} teamMembers={teamMembers} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};