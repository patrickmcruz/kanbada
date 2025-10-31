import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadView } from './views/WorkloadView';
import { KanbanView } from './views/KanbanView';
import { Toolbar } from './components/Toolbar';
import { SetupScreen } from './components/SetupScreen';
import { WorkPackageDetailModal } from './components/WorkPackageDetailModal';
import { useWorkload } from './hooks/useWorkload';
import { TEAM_MEMBERS } from './data/team';
import type { ViewLevel, TaskWorkPackage, AppView, SortKey, ResponsibleSortOrder, PriorityDefinition, TeamPreset } from './types';
import i18n from './config/i18n';

interface SelectedWorkPackageInfo {
  task: TaskWorkPackage;
  phaseTitle: string;
  projectTitle: string;
}

export const getInitialPriorities = (): PriorityDefinition[] => [
  { key: 'urgent', name: i18n.t('urgent'), color: '#a855f7' },
  { key: 'high', name: i18n.t('high'), color: '#ef4444' },
  { key: 'medium', name: i18n.t('medium'), color: '#eab308' },
  { key: 'low', name: i18n.t('low'), color: '#3b82f6' },
];

export const ANALYSTS_PRESET_COLUMNS = ['backlog', 'sprint', 'doing', 'review', 'done'];
export const IT_PRESET_COLUMNS = ['backlog', 'sprint', 'inProgress', 'codeReview', 'testing', 'done', 'homologation', 'production'];


const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- Settings State with localStorage persistence ---
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('theme') as 'dark' | 'light') || 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'pt');
  const [teamPreset, setTeamPreset] = useState<TeamPreset>(() => (localStorage.getItem('teamPreset') as TeamPreset) || 'analysts');
  const [kanbanColumns, setKanbanColumns] = useState<string[]>(() => {
    const stored = localStorage.getItem('kanbanColumns');
    if (stored) return JSON.parse(stored);
    const preset = (localStorage.getItem('teamPreset') as TeamPreset) || 'analysts';
    return preset === 'analysts' ? ANALYSTS_PRESET_COLUMNS : IT_PRESET_COLUMNS;
  });
  const [defaultKanbanSort, setDefaultKanbanSort] = useState<SortKey>(() => (localStorage.getItem('defaultKanbanSort') as SortKey) || 'priority');
  const [sprintDays, setSprintDays] = useState<number>(() => parseInt(localStorage.getItem('sprintDays') || '7', 10));
  const [responsibleSortOrder, setResponsibleSortOrder] = useState<ResponsibleSortOrder>(() => (localStorage.getItem('responsibleSortOrder') as ResponsibleSortOrder) || 'asc');
  const [priorities, setPriorities] = useState<PriorityDefinition[]>(() => {
      const stored = localStorage.getItem('priorities');
      return stored ? JSON.parse(stored) : getInitialPriorities();
  });
  
  const {
    allTasks,
    filteredTasks,
    kanbanTasks,
    cardNameOptions,
    responsibleOptions,
    priorityOptions,
    filterCardName,
    setFilterCardName,
    filterResponsible,
    setFilterResponsible,
    filterPriority,
    setFilterPriority,
    handleTaskStatusChange,
    handleRenameColumnTasks,
    handleMoveTasks,
  } = useWorkload(currentDate, priorities);

  const [viewLevel, setViewLevel] = useState<ViewLevel>('Day');
  const [activeView, setActiveView] = useState<AppView>('Workload');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [selectedWorkPackageInfo, setSelectedWorkPackageInfo] = useState<SelectedWorkPackageInfo | null>(null);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  
  useEffect(() => {
    if (i18n.language !== language) {
        i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleSaveSettings = (newSettings: any) => {
    setTheme(newSettings.theme);
    localStorage.setItem('theme', newSettings.theme);
    
    setLanguage(newSettings.language);
    localStorage.setItem('language', newSettings.language);

    setTeamPreset(newSettings.teamPreset);
    localStorage.setItem('teamPreset', newSettings.teamPreset);

    setKanbanColumns(newSettings.kanbanColumns);
    localStorage.setItem('kanbanColumns', JSON.stringify(newSettings.kanbanColumns));
    
    setDefaultKanbanSort(newSettings.defaultKanbanSort);
    localStorage.setItem('defaultKanbanSort', newSettings.defaultKanbanSort);
    
    setSprintDays(newSettings.sprintDays);
    localStorage.setItem('sprintDays', newSettings.sprintDays.toString());
    
    setResponsibleSortOrder(newSettings.responsibleSortOrder);
    localStorage.setItem('responsibleSortOrder', newSettings.responsibleSortOrder);
    
    setPriorities(newSettings.priorities);
    localStorage.setItem('priorities', JSON.stringify(newSettings.priorities));
  };
  
  const handleWorkPackageDoubleClick = (task: TaskWorkPackage) => {
    let phaseTitle = '';
    let projectTitle = '';

    const container = Array.from(document.querySelectorAll('[data-work-package-id]')).find(el => {
        // A simple data lookup would be better, but this avoids passing all WPs down
        return el.querySelector(`[data-task-id="${task.id}"]`);
    });

    if (container) {
        projectTitle = container.getAttribute('data-project-title') || '';
        if (container.getAttribute('data-type') === 'Project') {
            const phaseEl = container.querySelector(`[data-phase-id][data-tasks*="${task.id}"]`);
            phaseTitle = phaseEl?.getAttribute('data-phase-title') || '';
        } else {
            phaseTitle = t('tasks');
        }
    }
    
    setSelectedWorkPackageInfo({ task, phaseTitle: phaseTitle || 'N/A', projectTitle: projectTitle || 'N/A' });
  };

  const settings = {
      theme, language, teamPreset, kanbanColumns, defaultKanbanSort, sprintDays, responsibleSortOrder, priorities
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-[var(--color-back)] text-[var(--color-text-primary)]">
      <header className="p-4 border-b border-[var(--color-surface-2)] bg-[var(--color-surface-1)] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('workloadView')}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{t('teamActivityOverview')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-transparent border border-[var(--color-surface-2)] rounded-md flex-shrink-0">
            {(['Workload', 'Kanban'] as AppView[]).map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 text-sm font-medium border-l border-[var(--color-surface-2)] first:border-l-0 rounded-md first:rounded-r-none last:rounded-l-none cursor-pointer
                  ${activeView === view ? 'bg-[var(--color-main)] text-white' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'}`}
              >
                {t(view.toLowerCase())}
              </button>
            ))}
          </div>
          <div className="relative group">
            <button
              onClick={() => setIsSetupOpen(true)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isSetupOpen
                  ? 'bg-[var(--color-main)] text-white'
                  : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
              }`}
              aria-label={t('setup')}
              aria-pressed={isSetupOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
            </button>
            <div className="absolute bottom-full mb-1 right-1/2 translate-x-1/2 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                {t('setup')}
            </div>
          </div>
        </div>
      </header>
      <Toolbar
        activeView={activeView}
        viewLevel={viewLevel}
        onViewLevelChange={setViewLevel}
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
        filterCardName={filterCardName}
        onFilterCardNameChange={setFilterCardName}
        filterResponsible={filterResponsible}
        onFilterResponsibleChange={setFilterResponsible}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
        cardNameOptions={cardNameOptions}
        responsibleOptions={responsibleOptions}
        priorityOptions={priorityOptions}
        priorities={priorities}
      />
      <main className="flex-1 overflow-auto p-4">
        {activeView === 'Workload' ? (
            <WorkloadView
              viewLevel={viewLevel}
              currentDate={currentDate}
              workPackages={filteredTasks}
              teamMembers={TEAM_MEMBERS}
              onWorkPackageDoubleClick={handleWorkPackageDoubleClick}
              responsibleSortOrder={responsibleSortOrder}
              onResponsibleSortOrderChange={setResponsibleSortOrder}
              priorities={priorities}
            />
        ) : (
            <KanbanView 
              columns={kanbanColumns}
              tasks={kanbanTasks}
              teamMembers={TEAM_MEMBERS}
              onTaskStatusChange={handleTaskStatusChange}
              onColumnsChange={setKanbanColumns}
              onWorkPackageDoubleClick={handleWorkPackageDoubleClick}
              defaultSortKey={defaultKanbanSort}
              sprintDays={sprintDays}
              priorities={priorities}
            />
        )}
      </main>
      {isSetupOpen && (
        <SetupScreen
          onClose={() => setIsSetupOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          handleMoveTasks={handleMoveTasks}
          handleRenameColumnTasks={handleRenameColumnTasks}
          allTasks={allTasks}
        />
      )}
      {selectedWorkPackageInfo && (
        <WorkPackageDetailModal
          workPackage={selectedWorkPackageInfo.task}
          phaseTitle={selectedWorkPackageInfo.phaseTitle}
          projectTitle={selectedWorkPackageInfo.projectTitle}
          onClose={() => setSelectedWorkPackageInfo(null)}
          teamMembers={TEAM_MEMBERS}
          priorities={priorities}
        />
      )}
    </div>
  );
};

export default App;
