import React, { useState, useMemo } from 'react';
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
  const [filters, setFilters] = useState<{ responsible: string; project: string }>({
    responsible: 'all',
    project: '',
  });

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

  const handleFilterChange = (filterType: 'responsible' | 'project', value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const responsibleMatch =
        filters.responsible === 'all' || (task.ownerId ?? 'unassigned') === filters.responsible;
      const projectMatch =
        filters.project === '' ||
        task.projectId.toLowerCase().includes(filters.project.toLowerCase());
      return responsibleMatch && projectMatch;
    });
  }, [tasks, filters]);

  return (
    <div className="flex flex-col h-screen font-sans">
      <header className="p-4 border-b border-[#40464a] bg-[#2a2f32] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('kanbanMatrix')}</h1>
          <p className="text-sm text-[#b0b3b8]">{t('teamActivityOverview')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${i18n.language === 'en' ? 'bg-[#8cb45a] text-white' : 'bg-[#40464a] text-white hover:bg-[#52585c]'}`}
            aria-pressed={i18n.language === 'en'}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('pt')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${i18n.language.startsWith('pt') ? 'bg-[#8cb45a] text-white' : 'bg-[#40464a] text-white hover:bg-[#52585c]'}`}
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
        filters={filters}
        onFilterChange={handleFilterChange}
        teamMembers={TEAM_MEMBERS}
      />
      <main className="flex-1 overflow-auto p-4">
        <KanbanBoard
          viewLevel={viewLevel}
          currentDate={currentDate}
          tasks={filteredTasks}
          teamMembers={TEAM_MEMBERS}
          onTaskUpdate={handleTaskUpdate}
          justUpdatedTaskId={justUpdatedTaskId}
        />
      </main>
    </div>
  );
};

export default App;