import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadView } from './views/WorkloadView';
import { KanbanView } from './views/KanbanView';
import { Toolbar } from './components/Toolbar';
import { SetupScreen } from './components/SetupScreen';
import { WorkPackageDetailModal } from './components/WorkPackageDetailModal';
import { useWorkload } from './hooks/useWorkload';
import { TEAM_MEMBERS } from './data/team';
import type { ViewLevel, TaskWorkPackage, AppView, SortKey, ResponsibleSortOrder } from './types';

interface SelectedWorkPackageInfo {
  task: TaskWorkPackage;
  phaseTitle: string;
  projectTitle: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    workPackages,
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
  } = useWorkload(currentDate);

  const [viewLevel, setViewLevel] = useState<ViewLevel>('Day');
  const [activeView, setActiveView] = useState<AppView>('Workload');
  const [kanbanColumns, setKanbanColumns] = useState<string[]>(['toDo', 'sprint', 'doing', 'done']);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [defaultKanbanSort, setDefaultKanbanSort] = useState<SortKey>('priority');
  const [selectedWorkPackageInfo, setSelectedWorkPackageInfo] = useState<SelectedWorkPackageInfo | null>(null);
  const [sprintDays, setSprintDays] = useState<number>(7);
  const [responsibleSortOrder, setResponsibleSortOrder] = useState<ResponsibleSortOrder>('asc');


  useEffect(() => {
    document.body.className = `theme-${theme}`;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  const handleWorkPackageDoubleClick = (task: TaskWorkPackage) => {
    let phaseTitle = '';
    let projectTitle = '';

    const container = workPackages.find(p => {
        if (p.type === 'Project') {
            return p.phases.some(ph => ph.tasks.some(t => t.id === task.id));
        } else { // Demand
            return p.tasks.some(t => t.id === task.id);
        }
    });

    if (container) {
        projectTitle = container.title;
        if (container.type === 'Project') {
            const phase = container.phases.find(ph => ph.tasks.some(t => t.id === task.id));
            if (phase) {
                phaseTitle = phase.title;
            }
        } else {
            phaseTitle = t('tasks');
        }
    }
    
    setSelectedWorkPackageInfo({ task, phaseTitle: phaseTitle || 'N/A', projectTitle: projectTitle || 'N/A' });
  };

  const handleDeleteKanbanColumn = (columnToDelete: string) => {
    const toDoColumn = kanbanColumns[0];
    if (columnToDelete !== toDoColumn) {
      handleMoveTasks(columnToDelete, toDoColumn);
      setKanbanColumns(prev => prev.filter(c => c !== columnToDelete));
    }
  };

  const handleRenameKanbanColumn = (oldName: string, newName: string) => {
    if (kanbanColumns.some(col => col.toLowerCase() === newName.toLowerCase() && col.toLowerCase() !== oldName.toLowerCase())) {
        return false; // Indicate failure due to duplicate name
    }
    handleRenameColumnTasks(oldName, newName);
    setKanbanColumns(prev => prev.map(col => col === oldName ? newName : col));
    return true; // Indicate success
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
          </button>
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
            />
        )}
      </main>
      {isSetupOpen && (
        <SetupScreen
          onClose={() => setIsSetupOpen(false)}
          currentTheme={theme}
          onChangeTheme={setTheme}
          currentLang={i18n.language}
          onChangeLang={changeLanguage}
          kanbanColumns={kanbanColumns}
          onChangeKanbanColumns={setKanbanColumns}
          onDeleteKanbanColumn={handleDeleteKanbanColumn}
          onRenameKanbanColumn={handleRenameKanbanColumn}
          allTasks={allTasks}
          defaultKanbanSort={defaultKanbanSort}
          onChangeDefaultKanbanSort={setDefaultKanbanSort}
          sprintDays={sprintDays}
          onChangeSprintDays={setSprintDays}
          responsibleSortOrder={responsibleSortOrder}
          onChangeResponsibleSortOrder={setResponsibleSortOrder}
        />
      )}
      {selectedWorkPackageInfo && (
        <WorkPackageDetailModal
          workPackage={selectedWorkPackageInfo.task}
          phaseTitle={selectedWorkPackageInfo.phaseTitle}
          projectTitle={selectedWorkPackageInfo.projectTitle}
          onClose={() => setSelectedWorkPackageInfo(null)}
          teamMembers={TEAM_MEMBERS}
        />
      )}
    </div>
  );
};

export default App;