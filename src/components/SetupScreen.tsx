import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SortKey, TaskWorkPackage, ResponsibleSortOrder, PriorityDefinition, TeamPreset } from '../types';

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
  responsibleSortOrder: ResponsibleSortOrder;
  onChangeResponsibleSortOrder: (order: ResponsibleSortOrder) => void;
  teamPreset: TeamPreset;
  onChangeTeamPreset: (preset: TeamPreset) => void;
  priorities: PriorityDefinition[];
  onChangePriorities: (priorities: PriorityDefinition[]) => void;
  onResetSettings: () => void;
}

type SetupTab = 'general' | 'workload' | 'kanban';

// --- Icons ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const GeneralIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>;
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

const ToggleSwitch: React.FC<{
  options: { label: string; value: string }[];
  currentValue: string;
  onChange: (value: string) => void;
}> = ({ options, currentValue, onChange }) => (
  <div className="flex bg-[var(--color-surface-3)] p-0.5 rounded-lg w-full">
    {options.map(option => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={`w-full px-3 py-1 text-sm font-semibold rounded-md transition-all ${
          currentValue === option.value
            ? 'bg-[var(--color-main)] text-white shadow'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--color-surface-2)] last:border-b-0">
        <label className="text-sm font-medium text-[var(--color-text-secondary)] truncate pr-4">{label}</label>
        <div className="w-36 flex-shrink-0">{children}</div>
    </div>
);


const ConfirmationDialog: React.FC<{ title: string; message: string; onConfirm: () => void; onCancel: () => void; }> = ({ title, message, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-modal-in">
            <div className="bg-[var(--color-surface-1)] rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-red-600 text-white hover:bg-red-700"
                    >
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const SetupScreen: React.FC<SetupScreenProps> = ({ onClose, currentTheme, onChangeTheme, currentLang, onChangeLang, kanbanColumns, onChangeKanbanColumns, onDeleteKanbanColumn, onRenameKanbanColumn, allTasks, defaultKanbanSort, onChangeDefaultKanbanSort, sprintDays, onChangeSprintDays, responsibleSortOrder, onChangeResponsibleSortOrder, teamPreset, onChangeTeamPreset, priorities, onChangePriorities, onResetSettings }) => {
  const { t } = useTranslation();
  const [newColumnName, setNewColumnName] = useState('');
  const [activeTab, setActiveTab] = useState<SetupTab>('general');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [columnPendingDeletion, setColumnPendingDeletion] = useState<string | null>(null);
  const dragTargetRef = React.useRef<HTMLDivElement | null>(null);
  // State for priorities
  const [draggedPriorityIndex, setDraggedPriorityIndex] = useState<number | null>(null);
  const [editingPriorityKey, setEditingPriorityKey] = useState<string | null>(null);
  const [newPriorityName, setNewPriorityName] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

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

  const handleDeleteConfirm = () => {
    if (columnPendingDeletion) {
        onDeleteKanbanColumn(columnPendingDeletion);
        setColumnPendingDeletion(null);
    }
  };

  const handleResetConfirm = () => {
    onResetSettings();
    setIsResetConfirmOpen(false);
  };

  // --- Priority Handlers ---
    const isPriorityInUse = (key: string) => allTasks.some(task => task.priority === key);

    const handleAddPriority = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newPriorityName.trim();
        if (!trimmedName) return;

        const newKey = trimmedName.toLowerCase().replace(/\s+/g, '-');
        if (priorities.some(p => p.key === newKey || p.name.toLowerCase() === trimmedName.toLowerCase())) {
            alert('A priority with this name or key already exists.');
            return;
        }

        onChangePriorities([...priorities, { key: newKey, name: trimmedName, color: '#808080' }]);
        setNewPriorityName('');
    };

    const handleUpdatePriority = (key: string, updates: Partial<PriorityDefinition>) => {
        onChangePriorities(priorities.map(p => p.key === key ? { ...p, ...updates } : p));
    };

    const handleDeletePriority = (key: string) => {
        if (isPriorityInUse(key)) {
            return;
        }
        onChangePriorities(priorities.filter(p => p.key !== key));
    };
    
    const handlePriorityDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedPriorityIndex(index);
    };

    const handlePriorityDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedPriorityIndex === null || draggedPriorityIndex === index) return;
        
        const newPriorities = [...priorities];
        const [draggedItem] = newPriorities.splice(draggedPriorityIndex, 1);
        newPriorities.splice(index, 0, draggedItem);
        onChangePriorities(newPriorities);
        setDraggedPriorityIndex(index);
    };
    
    const handlePriorityDragEnd = () => {
        setDraggedPriorityIndex(null);
    };

  const renderContent = () => {
      switch(activeTab) {
          case 'general':
              return (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('appearance')}</h3>
                        <div className="bg-[var(--color-surface-2)] rounded-lg px-4">
                            <SettingRow label={t('theme')}>
                                <ToggleSwitch
                                    options={[{ label: t('dark'), value: 'dark' }, { label: t('light'), value: 'light' }]}
                                    currentValue={currentTheme}
                                    onChange={(v) => onChangeTheme(v as 'dark' | 'light')}
                                />
                            </SettingRow>
                            <SettingRow label={t('language')}>
                                <ToggleSwitch
                                    options={[{ label: 'EN', value: 'en' }, { label: 'PT', value: 'pt' }]}
                                    currentValue={currentLang.startsWith('pt') ? 'pt' : 'en'}
                                    onChange={onChangeLang}
                                />
                            </SettingRow>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('priorities')}</h3>
                        <div className="bg-[var(--color-surface-2)] rounded-lg p-3 space-y-3">
                            <div className='space-y-2 max-h-60 overflow-y-auto pr-2'>
                                {priorities.map((p, index) => (
                                    <div
                                        key={p.key}
                                        draggable
                                        onDragStart={(e) => handlePriorityDragStart(e, index)}
                                        onDragOver={(e) => handlePriorityDragOver(e, index)}
                                        onDragEnd={handlePriorityDragEnd}
                                        className={`flex items-center gap-2 p-1 rounded-md transition-opacity bg-[var(--color-surface-3)] ${draggedPriorityIndex === index ? 'opacity-30' : ''}`}
                                    >
                                        <div className="cursor-grab active:cursor-grabbing"><GripVerticalIcon /></div>
                                        <span className="text-xs font-semibold text-[var(--color-text-secondary)] w-5 text-center">{index + 1}</span>
                                        <input
                                            type="color"
                                            value={p.color}
                                            onChange={(e) => handleUpdatePriority(p.key, { color: e.target.value })}
                                            className="w-7 h-7 rounded-md bg-transparent border-none cursor-pointer p-0"
                                        />
                                        <input
                                            type="text"
                                            value={editingPriorityKey === p.key ? editingValue : p.name}
                                            onFocus={() => { setEditingPriorityKey(p.key); setEditingValue(p.name); }}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            onBlur={() => { handleUpdatePriority(p.key, { name: editingValue.trim() }); setEditingPriorityKey(null); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingPriorityKey(null); }}
                                            className="flex-1 min-w-0 rounded-md border border-transparent hover:border-[var(--color-surface-3)] bg-transparent focus:bg-[var(--color-back)] focus:border-[var(--color-main)] py-1 px-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
                                        />
                                        <div className="relative group">
                                            <button
                                                onClick={() => handleDeletePriority(p.key)}
                                                disabled={isPriorityInUse(p.key)}
                                                className="p-1 rounded-full text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                aria-label={`Delete ${p.name}`}
                                            >
                                                <TrashIcon />
                                            </button>
                                            <div className="absolute top-1/2 -translate-y-1/2 right-full mr-2 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                {isPriorityInUse(p.key) ? t('deletePriorityError') : t('delete')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleAddPriority} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newPriorityName}
                                    onChange={e => setNewPriorityName(e.target.value)}
                                    placeholder={t('priorityName') as string}
                                    className="flex-1 min-w-0 rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-1.5 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                                />
                                <div className="relative group">
                                    <button type="submit" className="px-2 py-1.5 text-sm font-semibold rounded-md transition-colors bg-[var(--color-main)] text-white hover:brightness-110 flex items-center"><PlusIcon /></button>
                                    <div className="absolute bottom-full mb-1 right-1/2 translate-x-1/2 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {t('addPriority')}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-[var(--color-surface-2)]">
                        <button
                            onClick={() => setIsResetConfirmOpen(true)}
                            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            {t('resetSettings')}
                        </button>
                    </div>
                </div>
              );
          case 'workload':
              return (
                 <div>
                    <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('defaultResponsibleSort')}</h3>
                    <div className="bg-[var(--color-surface-2)] rounded-lg px-4">
                        <SettingRow label={t('chooseSortOrder')}>
                            <ToggleSwitch
                                options={[{ label: t('az'), value: 'asc' }, { label: t('za'), value: 'desc' }]}
                                currentValue={responsibleSortOrder}
                                onChange={(v) => onChangeResponsibleSortOrder(v as ResponsibleSortOrder)}
                            />
                        </SettingRow>
                    </div>
                </div>
              );
          case 'kanban':
              return (
                  <div className="space-y-6">
                      <div>
                          <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('management')}</h3>
                          <div className="bg-[var(--color-surface-2)] rounded-lg px-4">
                              <SettingRow label={t('teamProfile')}>
                                  <ToggleSwitch
                                      options={[
                                          { label: t('analysts'), value: 'analysts' },
                                          { label: t('informationTechnology'), value: 'it' }
                                      ]}
                                      currentValue={teamPreset}
                                      onChange={(v) => onChangeTeamPreset(v as TeamPreset)}
                                  />
                              </SettingRow>
                          </div>
                      </div>
                      <div>
                          <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('kanbanColumns')}</h3>
                          <div className="bg-[var(--color-surface-2)] rounded-lg p-3 space-y-3">
                            <div className='space-y-2 max-h-96 overflow-y-auto pr-2'>
                              {kanbanColumns.map((column, index) => (
                                <div 
                                    key={column}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-center justify-between bg-[var(--color-surface-3)] p-1 rounded-md transition-opacity ${draggedIndex === index ? 'opacity-30' : 'opacity-100'}`}
                                >
                                    <div className="flex items-center gap-2 text-sm cursor-grab active:cursor-grabbing flex-1 min-w-0">
                                        <GripVerticalIcon />
                                        {editingColumn === column ? (
                                            <input
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={handleFinishEditing}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                className="bg-[var(--color-surface-2)] border border-[var(--color-main)] focus:outline-none text-sm rounded px-1 py-0.5 w-full"
                                            />
                                        ) : (
                                            <span onDoubleClick={() => handleStartEditing(column)} className="py-0.5 truncate">{t(column)}</span>
                                        )}
                                    </div>
                                    <div className="relative group">
                                      <button 
                                          onClick={() => setColumnPendingDeletion(column)}
                                          className="p-1 rounded-full text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                          aria-label={`Delete ${column}`}
                                          disabled={index === 0}
                                      >
                                          <TrashIcon />
                                      </button>
                                      <div className="absolute top-1/2 -translate-y-1/2 right-full mr-2 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                          {index === 0 ? t('deleteFirstColumnError') : t('delete')}
                                      </div>
                                    </div>
                              </div>
                              ))}
                          </div>
                          <form onSubmit={handleAddColumn} className="flex gap-2">
                              <input 
                                  type="text"
                                  value={newColumnName}
                                  onChange={(e) => setNewColumnName(e.target.value)}
                                  placeholder={t('columnNamePlaceholder') as string}
                                  className="flex-1 min-w-0 rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-1.5 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                              />
                              <div className="relative group">
                                <button
                                    type="submit"
                                    className="px-2 py-1.5 text-sm font-semibold rounded-md transition-colors bg-[var(--color-main)] text-white hover:brightness-110 flex items-center"
                                    aria-label={t('addColumn')}
                                >
                                    <PlusIcon />
                                </button>
                                <div className="absolute bottom-full mb-1 right-1/2 translate-x-1/2 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {t('addColumn')}
                                </div>
                              </div>
                          </form>
                          </div>
                      </div>
                      <div>
                          <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('kanban')}</h3>
                          <div className="bg-[var(--color-surface-2)] rounded-lg px-4">
                            <SettingRow label={t('sprintDuration')}>
                                <input
                                    type="number"
                                    id="sprint-days"
                                    value={sprintDays}
                                    onChange={(e) => onChangeSprintDays(parseInt(e.target.value, 10) || 1)}
                                    min="1"
                                    className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-1.5 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                                />
                            </SettingRow>
                            <SettingRow label={t('defaultColumnSort')}>
                                <select
                                    id="default-sort"
                                    value={defaultKanbanSort}
                                    onChange={(e) => onChangeDefaultKanbanSort(e.target.value as SortKey)}
                                    className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-1.5 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                                >
                                    <option value="priority">{t('sortByPriority')}</option>
                                    <option value="title">{t('sortByTitle')}</option>
                                    <option value="responsible">{t('sortByResponsible')}</option>
                                    <option value="startDate">{t('sortByStartDate')}</option>
                                    <option value="endDate">{t('sortByEndDate')}</option>
                                    <option value="createdAt">{t('sortByCreationDate')}</option>
                                </select>
                            </SettingRow>
                          </div>
                      </div>
                  </div>
              );
      }
  }


  return (
    <>
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
              <nav className="w-48 flex-shrink-0 p-4 border-r border-[var(--color-surface-2)] space-y-2 overflow-y-auto">
                  <TabButton icon={<GeneralIcon/>} label={t('general')} isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                  <TabButton icon={<WorkloadIcon/>} label={t('workload')} isActive={activeTab === 'workload'} onClick={() => setActiveTab('workload')} />
                  <TabButton icon={<KanbanIcon/>} label={t('kanban')} isActive={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} />
              </nav>
              
              <main className="flex-1 p-6 space-y-6 overflow-y-auto">
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
      {columnPendingDeletion && (
        <ConfirmationDialog
            title={t('deleteColumnConfirmTitle')}
            message={t('deleteColumnConfirmMessage', { columnName: t(columnPendingDeletion), toDoColumnName: t(kanbanColumns[0]) })}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setColumnPendingDeletion(null)}
        />
      )}
      {isResetConfirmOpen && (
        <ConfirmationDialog
            title={t('resetConfirmTitle')}
            message={t('resetConfirmMessage')}
            onConfirm={handleResetConfirm}
            onCancel={() => setIsResetConfirmOpen(false)}
        />
      )}
    </>
  );
};