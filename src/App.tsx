import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadView } from './views/WorkloadView';
import { KanbanView } from './views/KanbanView';
import { Toolbar } from './components/Toolbar';
import { SetupScreen } from './components/SetupScreen';
import { WorkPackageDetailModal } from './components/WorkPackageDetailModal';
import { useWorkload } from './hooks/useWorkload';
import { TEAM_MEMBERS } from './data/team';
import type { ViewLevel, TaskWorkPackage, AppView } from './types';

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
  } = useWorkload(currentDate);

  const [viewLevel, setViewLevel] = useState<ViewLevel>('Day');
  const [activeView, setActiveView] = useState<AppView>('Workload');
  const [kanbanColumns, setKanbanColumns] = useState<string[]>(['toDo', 'sprint', 'doing', 'done']);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedWorkPackageInfo, setSelectedWorkPackageInfo] = useState<SelectedWorkPackageInfo | null>(null);

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

  return (
    <div className="flex flex-col h-screen font-sans bg-[var(--color-back)] text-[var(--color-text-primary)]">
      <header className="p-4 border-b border-[var(--color-surface-2)] bg-[var(--color-surface-1)] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('workloadView')}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{t('teamActivityOverview')}</p>
        </div>
        <div className="flex items-center gap-4">
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
        activeView={activeView}
        onActiveViewChange={setActiveView}
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
            />
        ) : (
            <KanbanView 
              columns={kanbanColumns}
              tasks={kanbanTasks}
              teamMembers={TEAM_MEMBERS}
              onTaskStatusChange={handleTaskStatusChange}
              onWorkPackageDoubleClick={handleWorkPackageDoubleClick}
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
