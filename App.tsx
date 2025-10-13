
import React, { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { Toolbar } from './components/Toolbar';
import { TEAM_MEMBERS, TASKS } from './constants';
import type { ViewLevel } from './types';

const App: React.FC = () => {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('Day');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800">
      <header className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-700">Kanban Matrix</h1>
        <p className="text-sm text-gray-500">Team Activity Overview</p>
      </header>
      <Toolbar
        viewLevel={viewLevel}
        onViewLevelChange={setViewLevel}
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
      />
      <main className="flex-1 overflow-auto p-4">
        <KanbanBoard
          viewLevel={viewLevel}
          currentDate={currentDate}
          tasks={TASKS}
          teamMembers={TEAM_MEMBERS}
        />
      </main>
    </div>
  );
};

export default App;
