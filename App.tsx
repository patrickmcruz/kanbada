import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KanbanBoard } from './components/KanbanBoard';
import { Toolbar } from './components/Toolbar';
import { SetupScreen } from './components/SetupScreen';
import { TaskDetailModal } from './components/TaskDetailModal';
import { TEAM_MEMBERS } from './data/team';
import { TASKS as initialTasks } from './data/tasks';
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
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

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

  const handleTaskDoubleClick = (task: Task) => {
    setSelectedTask(task);
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
    <div className="flex flex-col h-screen font-sans bg-[var(--color-back)] text-[var(--color-text-primary)]">
      <header className="p-4 border-b border-[var(--color-surface-2)] bg-[var(--color-surface-1)] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('kanbanMatrix')}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{t('teamActivityOverview')}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSetupOpen(true)}
            className={`p-2 rounded-full transition-colors ${
              isSetupOpen
                ? 'bg-[var(--color-main)] text-white'
                : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
            }`}
            aria-label={t('setup')}
            aria-pressed={isSetupOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
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
          onTaskDoubleClick={handleTaskDoubleClick}
        />
      </main>
      {isSetupOpen && (
        <SetupScreen
          onClose={() => setIsSetupOpen(false)}
          currentTheme={theme}
          onChangeTheme={setTheme}
          currentLang={i18n.language}
          onChangeLang={changeLanguage}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          teamMembers={TEAM_MEMBERS}
        />
      )}
    </div>
  );
};

export default App;