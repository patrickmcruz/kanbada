import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkloadView } from './components/KanbanBoard';
import { Toolbar } from './components/Toolbar';
import { SetupScreen } from './components/SetupScreen';
import { WorkPackageDetailModal } from './components/WorkPackageDetailModal';
import { TEAM_MEMBERS } from './data/team';
import { WORK_PACKAGES as initialWorkPackages } from './data/work-packages';
import type { ViewLevel, TaskWorkPackage, ProjectWorkPackage, DemandWorkPackage, Priority } from './types';

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
  const [filterCardName, setFilterCardName] = useState<string[]>([]);
  const [filterResponsible, setFilterResponsible] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
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

  const cardNameOptions = useMemo(() => {
    const titles = new Set<string>();
    allTasks.forEach(task => {
      titles.add(task.title);
      titles.add(task.projectId);
    });
    return Array.from(titles).sort();
  }, [allTasks]);

  const responsibleOptions = useMemo(() => {
    const memberMap = new Map(TEAM_MEMBERS.map(m => [m.id, m.name]));
    const responsibles = new Set<string>();
    allTasks.forEach(task => {
      const name = memberMap.get(task.ownerId ?? 'unassigned');
      if (name) {
        responsibles.add(name);
      }
    });
    return Array.from(responsibles).sort();
  }, [allTasks]);

  const priorityOptions = useMemo(() => {
    const priorities: Priority[] = ['Urgente', 'Alta', 'Média', 'Baixa'];
    return priorities;
  }, []);

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
            phaseTitle = t('tasks'); // Using the new translation key
        }
    }
    
    setSelectedWorkPackageInfo({ task, phaseTitle: phaseTitle || 'N/A', projectTitle: projectTitle || 'N/A' });
  };

  const filteredTasks = useMemo(() => {
    const responsibleMap = new Map(TEAM_MEMBERS.map(member => [member.id, member.name]));

    if (filterCardName.length === 0 && filterResponsible.length === 0 && filterPriority.length === 0) {
      return allTasks;
    }

    return allTasks.filter(task => {
      const taskResponsibleName = responsibleMap.get(task.ownerId ?? 'unassigned') ?? '';

      const cardNameMatch = filterCardName.length === 0 || filterCardName.includes(task.title) || filterCardName.includes(task.projectId);
      const responsibleMatch = filterResponsible.length === 0 || filterResponsible.includes(taskResponsibleName);
      const priorityMatch = filterPriority.length === 0 || (task.priority && filterPriority.includes(task.priority));

      return cardNameMatch && responsibleMatch && priorityMatch;
    });
  }, [allTasks, filterCardName, filterResponsible, filterPriority]);

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
            {/* FIX: Corrected a typo in the SVG's viewBox attribute which caused a JSX parsing error. */}
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
        <WorkloadView
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