import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KanbanBoard } from './components/KanbanBoard';
import { Toolbar } from './components/Toolbar';
import { SetupScreen } from './components/SetupScreen';
import { WorkPackageDetailModal } from './components/WorkPackageDetailModal';
import { FilterModal } from './components/FilterModal';
import { TEAM_MEMBERS } from './data/team';
import { WORK_PACKAGES as initialWorkPackages } from './data/work-packages';
import type { ViewLevel, TaskWorkPackage, ProjectWorkPackage, DemandWorkPackage, Filters } from './types';

interface SelectedWorkPackageInfo {
  task: TaskWorkPackage;
  phaseTitle: string;
  projectTitle: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [viewLevel, setViewLevel] = useState<ViewLevel>('Day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workPackages, setWorkPackages] = useState<(ProjectWorkPackage | DemandWorkPackage)[]>(initialWorkPackages);
  const [filterText, setFilterText] = useState<string>('');
  const [advancedFilters, setAdvancedFilters] = useState<Filters>({ responsibles: [], priorities: [] });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedWorkPackageInfo, setSelectedWorkPackageInfo] = useState<SelectedWorkPackageInfo | null>(null);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const allTasks = useMemo((): TaskWorkPackage[] => {
    // FIX: Add explicit type argument to flatMap to resolve type inference issue.
    return workPackages.flatMap<TaskWorkPackage>(container => {
      if (container.type === 'Project') {
        return container.phases.flatMap(phase =>
          phase.tasks.map(task => ({
            ...task,
            isDemand: false
          }))
        );
      } else if (container.type === 'Demand') {
        return container.tasks.map(task => ({
          ...task,
          isDemand: true
        }));
      }
      return [];
    });
  }, [workPackages]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleFilterChange = (value: string) => {
    setFilterText(value);
  };
  
  const handleApplyAdvancedFilters = (newFilters: Filters) => {
    setAdvancedFilters(newFilters);
    setIsFilterModalOpen(false);
  };
  
  const isAdvancedFilterActive = advancedFilters.responsibles.length > 0 || advancedFilters.priorities.length > 0;

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
            phaseTitle = t('tasks'); // Using the new translation key
        }
    }
    
    setSelectedWorkPackageInfo({ task, phaseTitle: phaseTitle || 'N/A', projectTitle: projectTitle || 'N/A' });
  };

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      // Text filter
      const textFilterMatch = (() => {
        if (filterText === '') return true;
        const lowerCaseFilter = filterText.toLowerCase();
        const owner = TEAM_MEMBERS.find(m => m.id === task.ownerId);
        const ownerName = owner ? owner.name : TEAM_MEMBERS.find(m => m.id === 'unassigned')?.name || 'Unassigned';
        const responsibleMatch = ownerName.toLowerCase().includes(lowerCaseFilter);
        const projectMatch = task.projectId.toLowerCase().includes(lowerCaseFilter);
        const titleMatch = task.title.toLowerCase().includes(lowerCaseFilter);
        return responsibleMatch || projectMatch || titleMatch;
      })();
      if (!textFilterMatch) return false;

      // Advanced responsible filter
      const responsibleFilterMatch = advancedFilters.responsibles.length === 0 || 
        advancedFilters.responsibles.includes(task.ownerId ?? 'unassigned');
      if (!responsibleFilterMatch) return false;

      // Advanced priority filter
      const priorityFilterMatch = advancedFilters.priorities.length === 0 ||
        (task.priority && advancedFilters.priorities.includes(task.priority));
      if (!priorityFilterMatch) return false;

      return true;
    });
  }, [allTasks, filterText, advancedFilters]);

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
        viewLevel={viewLevel}
        onViewLevelChange={setViewLevel}
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
        filterText={filterText}
        onFilterChange={handleFilterChange}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        isAdvancedFilterActive={isAdvancedFilterActive}
      />
      <main className="flex-1 overflow-auto p-4">
        <KanbanBoard
          viewLevel={viewLevel}
          currentDate={currentDate}
          workPackages={filteredTasks}
          teamMembers={TEAM_MEMBERS}
          onWorkPackageDoubleClick={handleWorkPackageDoubleClick}
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
      {isFilterModalOpen && (
        <FilterModal
            onClose={() => setIsFilterModalOpen(false)}
            onApply={handleApplyAdvancedFilters}
            currentFilters={advancedFilters}
            teamMembers={TEAM_MEMBERS}
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