
import React from 'react';
import type { Task, TeamMember, ViewLevel, DateColumn } from '../types';
import { generateDateColumns, daysBetween } from '../utils/dateUtils';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  viewLevel: ViewLevel;
  currentDate: Date;
  tasks: Task[];
  teamMembers: TeamMember[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ viewLevel, currentDate, tasks, teamMembers }) => {
  const dateColumns = generateDateColumns(viewLevel, currentDate);
  const gridTemplateColumns = `minmax(150px, 1fr) repeat(${dateColumns.length}, minmax(120px, 2fr))`;

  const getTaskPosition = (task: Task, rowIndex: number) => {
    const viewStartDate = dateColumns[0].startDate;
    const viewEndDate = dateColumns[dateColumns.length - 1].endDate;

    if (task.endDate < viewStartDate || task.startDate > viewEndDate) {
      return null; // Task is not in the current view
    }

    const taskStartInView = task.startDate < viewStartDate ? viewStartDate : task.startDate;
    const taskEndInView = task.endDate > viewEndDate ? viewEndDate : task.endDate;
    
    let startColumnIndex = -1;
    for(let i = 0; i < dateColumns.length; i++){
        if(taskStartInView >= dateColumns[i].startDate && taskStartInView <= dateColumns[i].endDate){
            startColumnIndex = i + 1;
            break;
        }
    }
    // If start is before view, it starts at column 1
    if (startColumnIndex === -1 && taskStartInView < dateColumns[0].startDate) {
        startColumnIndex = 1;
    }

    if (startColumnIndex === -1) return null;


    let endColumnIndex = -1;
    for(let i = 0; i < dateColumns.length; i++){
        if(taskEndInView >= dateColumns[i].startDate && taskEndInView <= dateColumns[i].endDate){
            endColumnIndex = i + 1;
            break;
        }
    }

    // If end is after view, it ends at the last column
    if (endColumnIndex === -1 && taskEndInView > dateColumns[dateColumns.length-1].endDate) {
        endColumnIndex = dateColumns.length;
    }
    
    if (endColumnIndex === -1) return null;


    const columnSpan = endColumnIndex - startColumnIndex + 1;
    
    return {
      gridRow: rowIndex + 2,
      gridColumn: `${startColumnIndex + 1} / span ${columnSpan}`,
    };
  };

  const allMembers = [...teamMembers.filter(m => m.id !== 'unassigned'), ...teamMembers.filter(m => m.id === 'unassigned')];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div
            className="grid sticky top-0 z-20"
            style={{ gridTemplateColumns }}
        >
            {/* Corner block */}
            <div className="p-3 font-semibold text-sm text-gray-600 bg-gray-100 border-b border-r border-gray-200 sticky left-0 z-10">
                Responsável
            </div>
            {/* Date headers */}
            {dateColumns.map((col, index) => (
                <div key={index} className="p-3 text-center font-semibold text-sm text-gray-600 bg-gray-100 border-b border-r border-gray-200 last:border-r-0">
                    {col.label}
                </div>
            ))}
        </div>
        <div
            className="grid relative"
            style={{ gridTemplateColumns }}
        >
            {/* Member names and grid lines */}
            {allMembers.map((member, rowIndex) => (
                <React.Fragment key={member.id}>
                    <div className="p-3 text-sm font-medium text-gray-700 capitalize bg-gray-50 border-b border-r border-gray-200 sticky left-0 z-10">
                        {member.name}
                    </div>
                    {dateColumns.map((_, colIndex) => (
                        <div key={colIndex} className="border-b border-r border-gray-200 last:border-r-0 min-h-[80px]"></div>
                    ))}
                </React.Fragment>
            ))}

            {/* Render Tasks */}
            {tasks.map((task) => {
                const ownerId = task.ownerId === null ? 'unassigned' : task.ownerId;
                const rowIndex = allMembers.findIndex(m => m.id === ownerId);
                if (rowIndex === -1) return null;

                const position = getTaskPosition(task, rowIndex);
                if (!position) return null;

                return (
                    <div key={task.id} style={position} className="p-1 z-10">
                        <TaskCard task={task} />
                    </div>
                );
            })}
        </div>
    </div>
  );
};
