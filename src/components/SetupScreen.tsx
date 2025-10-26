import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SortKey, TaskWorkPackage } from '../types';

interface SetupScreenProps {
  onClose: () => void;
  currentTheme: 'dark' | 'light';
  onChangeTheme: (theme: 'dark' | 'light') => void;
  currentLang: string;
  onChangeLang: (lang: string) => void;
  kanbanColumns: string[];
  onChangeKanbanColumns: (columns: string[]) => void;
  onDeleteKanbanColumn: (column: string) => void;
  onRenameKanbanColumn: (oldName: string, newName: string) => boolean;
  allTasks: TaskWorkPackage[];
  defaultKanbanSort: SortKey;
  onChangeDefaultKanbanSort: (sortKey: SortKey) => void;
  sprintDays: number;
  onChangeSprintDays: (days: number) => void;
}

type SetupTab = 'general' | 'workload' | 'kanban';

// --- Icons ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const GeneralIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const WorkloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const KanbanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M6 3v18"/><path d="M18 3v18"/></svg>;
const GripVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-secondary)]"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>;

const TabButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--color-main)] text-white'
        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-surface-2)] pb-2">{title}</h3>
        {children}
    </div>
);


export const SetupScreen: React.FC<SetupScreenProps> = ({ onClose, currentTheme, onChangeTheme, currentLang, onChangeLang, kanbanColumns, onChangeKanbanColumns, onDeleteKanbanColumn, onRenameKanbanColumn, allTasks, defaultKanbanSort, onChangeDefaultKanbanSort, sprintDays, onChangeSprintDays }) => {
  const { t } = useTranslation();
  const [newColumnName, setNewColumnName] = useState('');
  const [activeTab, setActiveTab] = useState<SetupTab>('general');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const dragTargetRef = React.useRef<HTMLDivElement | null>(null);

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newColumnName.trim();
    if (trimmedName && !kanbanColumns.find(col => col.toLowerCase() === trimmedName.toLowerCase())) {
        onChangeKanbanColumns([...kanbanColumns, trimmedName]);
        setNewColumnName('');
    }
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;
      
      dragTargetRef.current = e.currentTarget as HTMLDivElement;
      
      const newColumns = [...kanbanColumns];
      const [draggedItem] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(index, 0, draggedItem);

      if (JSON.stringify(newColumns) !== JSON.stringify(kanbanColumns)) {
        onChangeKanbanColumns(newColumns);
        setDraggedIndex(index);
      }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragTargetRef.current = null;
  };

  const handleStartEditing = (column: string) => {
    setEditingColumn(column);
    setEditingValue(column);
  };

  const handleFinishEditing = () => {
    if (editingColumn && editingValue.trim() && editingColumn !== editingValue.trim()) {
      const success = onRenameKanbanColumn(editingColumn, editingValue.trim());
      if (!success) {
        alert(t('renameColumnError'));
      }
    }
    setEditingColumn(null);
    setEditingValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      setEditingColumn(null);
      setEditingValue('');
    }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'general':
              return (
                <Section title={t('appearance')}>
                  <fieldset>
                    <legend className="text-md font-medium text-[var(--color-text-primary)] mb-3">{t('theme')}</legend>
                    <div className="flex gap-4">
                      <button
                        onClick={() => onChangeTheme('dark')}
                        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${currentTheme === 'dark' ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                        aria-pressed={currentTheme === 'dark'}
                      >
                        {t('dark')}
                      </button>
                      <button
                        onClick={() => onChangeTheme('light')}
                        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${currentTheme === 'light' ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                        aria-pressed={currentTheme === 'light'}
                      >
                        {t('light')}
                      </button>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-md font-medium text-[var(--color-text-primary)] mb-3">{t('language')}</legend>
                    <div className="flex gap-4">
                      <button
                        onClick={() => onChangeLang('en')}
                        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${currentLang === 'en' ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                        aria-pressed={currentLang === 'en'}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => onChangeLang('pt')}
                        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${currentLang.startsWith('pt') ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                        aria-pressed={currentLang.startsWith('pt')}
                      >
                        PT
                      </button>
                    </div>
                  </fieldset>
                </Section>
              );
          case 'workload':
              return (
                  <Section title={t('workload')}>
                      <p className="text-sm text-[var(--color-text-secondary)] italic">{t('noWorkloadSettings')}</p>
                  </Section>
              );
          case 'kanban':
              return (
                  <div className="space-y-8">
                      <Section title={t('kanbanColumns')}>
                          <div className='space-y-2 max-h-48 overflow-y-auto pr-2'>
                              {kanbanColumns.map((column, index) => {
                                const tasksInColumn = allTasks.some(task => task.status === column);
                                return (
                                <div 
                                    key={column}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-center justify-between bg-[var(--color-surface-2)] p-2 rounded-md transition-opacity ${draggedIndex === index ? 'opacity-30' : 'opacity-100'}`}
                                >
                                    <div className="flex items-center gap-2 text-sm cursor-grab active:cursor-grabbing">
                                        <GripVerticalIcon />
                                        {editingColumn === column ? (
                                            <input
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={handleFinishEditing}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                className="bg-[var(--color-surface-3)] border border-[var(--color-main)] focus:outline-none text-sm rounded px-1 py-0.5"
                                            />
                                        ) : (
                                            <span onDoubleClick={() => handleStartEditing(column)} className="py-0.5">{t(column)}</span>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <button 
                                            onClick={() => onDeleteKanbanColumn(column)}
                                            className={`p-1 rounded-full text-red-400 ${tasksInColumn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500/20'}`}
                                            aria-label={`Delete ${column}`}
                                            disabled={tasksInColumn}
                                        >
                                            <TrashIcon />
                                        </button>
                                        {tasksInColumn && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-[var(--color-surface-3)] text-[var(--color-text-primary)] text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {t('deleteColumnError')}
                                            </div>
                                        )}
                                    </div>
                              </div>
                              )})}
                          </div>
                          <form onSubmit={handleAddColumn} className="flex gap-2 mt-4">
                              <input 
                                  type="text"
                                  value={newColumnName}
                                  onChange={(e) => setNewColumnName(e.target.value)}
                                  placeholder={t('columnNamePlaceholder') as string}
                                  className="flex-1 w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-2 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                              />
                              <button
                                  type="submit"
                                  className="px-3 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-main)] text-white hover:brightness-110 flex items-center"
                                  aria-label={t('addColumn')}
                              >
                                  <PlusIcon />
                              </button>
                          </form>
                      </Section>
                      <Section title={t('sprintSettings')}>
                        <div>
                            <label htmlFor="sprint-days" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                {t('sprintDuration')}
                            </label>
                            <input
                                type="number"
                                id="sprint-days"
                                value={sprintDays}
                                onChange={(e) => onChangeSprintDays(parseInt(e.target.value, 10) || 1)}
                                min="1"
                                className="w-full max-w-xs rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-2 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                            />
                        </div>
                      </Section>
                      <Section title={t('defaultColumnSort')}>
                          <select
                              id="default-sort"
                              value={defaultKanbanSort}
                              onChange={(e) => onChangeDefaultKanbanSort(e.target.value as SortKey)}
                              className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-2 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                          >
                              <option value="priority">{t('priority')}</option>
                              <option value="title">{t('title')}</option>
                              <option value="responsible">{t('responsible')}</option>
                          </select>
                      </Section>
                  </div>
              );
      }
  }


  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-title"
    >
      <div 
        className="bg-[var(--color-surface-1)] text-[var(--color-text-primary)] rounded-lg shadow-2xl w-full max-w-3xl m-4 animate-modal-in flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--color-surface-2)] flex-shrink-0">
          <h2 id="setup-title" className="text-xl font-bold">{t('setup')}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] cursor-pointer"
            aria-label={t('close')}
          >
            <XIcon />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
            <nav className="w-1/3 md:w-1/4 p-4 border-r border-[var(--color-surface-2)] space-y-2 overflow-y-auto">
                <TabButton icon={<GeneralIcon/>} label={t('general')} isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                <TabButton icon={<WorkloadIcon/>} label={t('workload')} isActive={activeTab === 'workload'} onClick={() => setActiveTab('workload')} />
                <TabButton icon={<KanbanIcon/>} label={t('kanban')} isActive={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} />
            </nav>
            
            <main className="flex-1 p-6 space-y-8 overflow-y-auto h-[430px]">
                {renderContent()}
            </main>
        </div>
        
        <footer className="p-4 border-t border-[var(--color-surface-2)] flex justify-end flex-shrink-0">
             <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-main)] text-white hover:brightness-110"
              >
                {t('close')}
              </button>
        </footer>
      </div>
    </div>
  );
};