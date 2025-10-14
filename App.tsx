import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KanbanBoard } from './components/KanbanBoard';
import { Toolbar } from './components/Toolbar';
import { TEAM_MEMBERS, TASKS as initialTasks } from './constants';
import type { ViewLevel, Task } from './types';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('Day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState(initialTasks);
  const [justUpdatedTaskId, setJustUpdatedTaskId] = useState<string | null>(null);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    setJustUpdatedTaskId(updatedTask.id);
    setTimeout(() => {
        setJustUpdatedTaskId(null);
    }, 500); // Reset after animation duration
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800">
      <header className="p-4 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">{t('kanbanMatrix')}</h1>
          <p className="text-sm text-gray-500">{t('teamActivityOverview')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${i18n.language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            aria-pressed={i18n.language === 'en'}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('pt')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${i18n.language.startsWith('pt') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            aria-pressed={i18n.language.startsWith('pt')}
          >
            PT
          </button>
        </div>
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
          tasks={tasks}
          teamMembers={TEAM_MEMBERS}
          onTaskUpdate={handleTaskUpdate}
          justUpdatedTaskId={justUpdatedTaskId}
        />
      </main>
    </div>
  );
};

export default App;