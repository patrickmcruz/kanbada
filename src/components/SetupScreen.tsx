import React, { useState, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { SortKey, TaskWorkPackage, ResponsibleSortOrder, PriorityDefinition, TeamPreset } from '../types';
import { getInitialPriorities, ANALYSTS_PRESET_COLUMNS, IT_PRESET_COLUMNS } from '../App';

type Settings = {
  theme: 'dark' | 'light';
  language: string;
  kanbanColumns: string[];
  defaultKanbanSort: SortKey;
  sprintDays: number;
  responsibleSortOrder: ResponsibleSortOrder;
  teamPreset: TeamPreset;
  priorities: PriorityDefinition[];
}
interface SetupScreenProps {
  onClose: () => void;
  settings: Settings;
  onSaveSettings: (settings: Settings) => void;
  handleRenameColumnTasks: (oldName: string, newName: string) => void;
  handleMoveTasks: (fromStatus: string, toStatus: string) => void;
  allTasks: TaskWorkPackage[];
}

type SetupTab = 'general' | 'workload' | 'kanban';

// --- Reducer Actions ---
type Action =
  | { type: 'UPDATE_FIELD'; payload: { field: keyof Settings; value: any } }
  | { type: 'UPDATE_TEAM_PRESET'; payload: TeamPreset }
  | { type: 'SET_COLUMNS'; payload: string[] }
  | { type: 'ADD_COLUMN'; payload: string }
  | { type: 'UPDATE_COLUMN_NAME'; payload: { index: number; newName: string } }
  | { type: 'DELETE_COLUMN'; payload: number }
  | { type: 'SET_PRIORITIES'; payload: PriorityDefinition[] }
  | { type: 'ADD_PRIORITY'; payload: string }
  | { type: 'UPDATE_PRIORITY'; payload: { index: number; newPriority: PriorityDefinition } }
  | { type: 'DELETE_PRIORITY'; payload: number }
  | { type: 'RESET_TAB'; payload: SetupTab };

// --- Icons ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const BlockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;
const GeneralIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>;
const WorkloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const KanbanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M6 3v18"/><path d="M18 3v18"/></svg>;
const GripVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-secondary)]"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>;

// --- Sub-components ---

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
        className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
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
        <div className="w-48 flex-shrink-0">{children}</div>
    </div>
);


const ConfirmationDialog: React.FC<{ title: string; message: string; onConfirm: () => void; onCancel: () => void; }> = ({ title, message, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center animate-modal-in">
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

// --- Drag and Drop Item Component ---
const DraggableListItem: React.FC<{
    isDragging: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    children: React.ReactNode;
}> = ({ isDragging, onDragStart, onDragEnd, onDragOver, children }) => {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            className={`flex items-center gap-2 p-2 rounded-md bg-[var(--color-surface-3)] transition-opacity ${isDragging ? 'opacity-40' : 'opacity-100'}`}
        >
            {children}
        </div>
    );
};

// --- Main Component ---
export const SetupScreen: React.FC<SetupScreenProps> = ({ onClose, settings, onSaveSettings, handleRenameColumnTasks, handleMoveTasks, allTasks }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SetupTab>('general');
  const [draft, dispatch] = useReducer(settingsReducer, settings);
  const [resetConfirm, setResetConfirm] = useState<SetupTab | null>(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [newPriorityName, setNewPriorityName] = useState('');
  const [columnPendingDeletion, setColumnPendingDeletion] = useState<{ index: number; name: string } | null>(null);
  
  // Drag and Drop State
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggingItem, setDraggingItem] = useState<number | null>(null);

  const handleSave = () => {
    const originalColumns = settings.kanbanColumns;
    const newColumns = draft.kanbanColumns;

    const originalSet = new Set(originalColumns);
    const newSet = new Set(newColumns);

    const deletedColumns = originalColumns.filter(c => !newSet.has(c));
    const addedColumns = newColumns.filter(c => !originalSet.has(c));
    
    // Rudimentary rename detection: assumes if one column is deleted and one is added, it's a rename.
    if (deletedColumns.length === 1 && addedColumns.length === 1) {
        handleRenameColumnTasks(deletedColumns[0], addedColumns[0]);
    } else {
        // Otherwise, treat as simple deletions and move tasks to the first available column.
        deletedColumns.forEach(deletedCol => {
            handleMoveTasks(deletedCol, newColumns[0]);
        });
    }

    onSaveSettings(draft);
    onClose();
  };

  const handleReset = (tab: SetupTab) => {
    dispatch({ type: 'RESET_TAB', payload: tab });
    setResetConfirm(null);
  }

  const isColumnInUse = (columnName: string) => allTasks.some(task => task.status === columnName);
  const isPriorityInUse = (key: string) => allTasks.some(task => task.priority === key);

  const handleAddColumn = () => {
      if (newColumnName && !draft.kanbanColumns.includes(newColumnName)) {
          dispatch({ type: 'ADD_COLUMN', payload: newColumnName });
          setNewColumnName('');
      } else if (draft.kanbanColumns.includes(newColumnName)) {
          alert(t('renameColumnError'));
      }
  };

  const handleAddPriority = () => {
    const trimmedName = newPriorityName.trim();
    if (trimmedName && !draft.priorities.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
        dispatch({ type: 'ADD_PRIORITY', payload: trimmedName });
        setNewPriorityName('');
    } else if (draft.priorities.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
        alert(t('duplicatePriorityError'));
    }
  };

  const handleDeleteColumn = (index: number) => {
      if (isColumnInUse(draft.kanbanColumns[index])) {
          alert(t('deleteColumnError'));
          return;
      }
      setColumnPendingDeletion({ index, name: draft.kanbanColumns[index] });
  };
  
  const confirmDeleteColumn = () => {
      if (columnPendingDeletion) {
          dispatch({ type: 'DELETE_COLUMN', payload: columnPendingDeletion.index });
          setColumnPendingDeletion(null);
      }
  };

  // Generic Drag-and-Drop Handlers
  const handleDragSort = (list: any[], actionType: 'SET_COLUMNS' | 'SET_PRIORITIES') => {
      if (dragItem.current === null || dragOverItem.current === null) return;
      const newList = [...list];
      const draggedItemContent = newList.splice(dragItem.current, 1)[0];
      newList.splice(dragOverItem.current, 0, draggedItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      dispatch({ type: actionType, payload: newList });
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
                                    currentValue={draft.theme}
                                    onChange={(v) => dispatch({type: 'UPDATE_FIELD', payload: { field: 'theme', value: v }})}
                                />
                            </SettingRow>
                            <SettingRow label={t('language')}>
                                <ToggleSwitch
                                    options={[{ label: 'EN', value: 'en' }, { label: 'PT', value: 'pt' }]}
                                    currentValue={draft.language.startsWith('pt') ? 'pt' : 'en'}
                                    onChange={(v) => dispatch({type: 'UPDATE_FIELD', payload: { field: 'language', value: v }})}
                                />
                            </SettingRow>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('priorities')}</h3>
                        <div className="space-y-2">
                             {draft.priorities.map((priority, index) => (
                                <DraggableListItem
                                    key={priority.key}
                                    isDragging={draggingItem === index}
                                    onDragStart={(e) => { dragItem.current = index; setDraggingItem(index); }}
                                    onDragEnd={() => { handleDragSort(draft.priorities, 'SET_PRIORITIES'); setDraggingItem(null); }}
                                    onDragOver={(e) => { e.preventDefault(); dragOverItem.current = index; }}
                                >
                                    <span className="cursor-grab"><GripVerticalIcon /></span>
                                    <span className="w-6 h-6 flex-shrink-0 rounded-full bg-[var(--color-surface-1)] flex items-center justify-center text-xs font-bold text-[var(--color-text-secondary)]">
                                        {index + 1}
                                    </span>
                                    <input
                                        type="color"
                                        value={priority.color}
                                        onChange={(e) => dispatch({ type: 'UPDATE_PRIORITY', payload: { index, newPriority: { ...priority, color: e.target.value } } })}
                                        className="w-8 h-8 p-0 border-none bg-transparent rounded-md cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={priority.name}
                                        onChange={(e) => dispatch({ type: 'UPDATE_PRIORITY', payload: { index, newPriority: { ...priority, name: e.target.value } } })}
                                        className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-main)] rounded-sm"
                                    />
                                    {isPriorityInUse(priority.key) ? (
                                        <div className="relative group">
                                            <button
                                                disabled
                                                className="p-1 text-[var(--color-text-secondary)] opacity-50 cursor-not-allowed"
                                            >
                                                <BlockIcon />
                                            </button>
                                            <div className="absolute bottom-full mb-1 right-0 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                                {t('deletePriorityInUseTooltip')}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <button
                                                onClick={() => dispatch({ type: 'DELETE_PRIORITY', payload: index })}
                                                className="p-1 text-[var(--color-text-secondary)] hover:text-red-500"
                                                aria-label={t('deletePriority') as string}
                                            >
                                                <TrashIcon />
                                            </button>
                                             <div className="absolute bottom-full mb-1 right-0 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                                {t('deletePriority')}
                                            </div>
                                        </div>
                                    )}
                                </DraggableListItem>
                             ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={newPriorityName}
                                onChange={(e) => setNewPriorityName(e.target.value)}
                                placeholder={t('priorityNamePlaceholder') as string}
                                className="flex-grow bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                            />
                            <div className="relative group flex-shrink-0">
                                <button
                                    onClick={handleAddPriority}
                                    className="p-2 text-sm font-medium text-[var(--color-main)] hover:brightness-125 transition-all bg-[var(--color-surface-2)] rounded-md border border-[var(--color-surface-3)]"
                                    aria-label={t('addPriority') as string}
                                >
                                    <PlusIcon />
                                </button>
                                <div className="absolute bottom-full mb-2 right-0 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                    {t('addPriority')}
                                </div>
                            </div>
                        </div>
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
                                currentValue={draft.responsibleSortOrder}
                                onChange={(v) => dispatch({type: 'UPDATE_FIELD', payload: { field: 'responsibleSortOrder', value: v as ResponsibleSortOrder }})}
                            />
                        </SettingRow>
                    </div>
                </div>
              );
          case 'kanban':
              const sortOptions: { value: SortKey; label: string }[] = [
                    { value: 'priority', label: t('sortByPriority') }, { value: 'title', label: t('sortByTitle') },
                    { value: 'responsible', label: t('sortByResponsible') }, { value: 'startDate', label: t('sortByStartDate') },
                    { value: 'endDate', label: t('sortByEndDate') }, { value: 'createdAt', label: t('sortByCreationDate') }
              ];
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
                                      currentValue={draft.teamPreset}
                                      onChange={(v) => dispatch({type: 'UPDATE_TEAM_PRESET', payload: v as TeamPreset})}
                                  />
                              </SettingRow>
                          </div>
                      </div>
                      <div>
                          <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('kanbanColumns')}</h3>
                          <div className="space-y-2">
                              {draft.kanbanColumns.map((col, index) => (
                                  <DraggableListItem
                                    key={index}
                                    isDragging={draggingItem === index}
                                    onDragStart={() => { dragItem.current = index; setDraggingItem(index); }}
                                    onDragEnd={() => { handleDragSort(draft.kanbanColumns, 'SET_COLUMNS'); setDraggingItem(null); }}
                                    onDragOver={(e) => { e.preventDefault(); dragOverItem.current = index; }}
                                  >
                                    <span className="cursor-grab"><GripVerticalIcon /></span>
                                    <input
                                        type="text"
                                        value={t(col)}
                                        onBlur={(e) => {
                                            const newName = e.target.value.trim();
                                            if (newName && newName !== col && !draft.kanbanColumns.includes(newName)) {
                                                dispatch({ type: 'UPDATE_COLUMN_NAME', payload: { index, newName } });
                                            }
                                        }}
                                        onChange={(e) => {
                                            // This is complex with i18n, live renaming is disabled. onBlur handles it.
                                        }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                                        className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-main)] rounded-sm"
                                    />
                                    {index === 0 ? (
                                        <div className="relative group">
                                            <button disabled className="p-1 text-[var(--color-text-secondary)] opacity-50 cursor-not-allowed">
                                                <BlockIcon />
                                            </button>
                                            <div className="absolute bottom-full mb-1 right-0 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                                {t('deleteFirstColumnError')}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <button onClick={() => handleDeleteColumn(index)} className="p-1 text-[var(--color-text-secondary)] hover:text-red-500">
                                                <TrashIcon />
                                            </button>
                                            <div className="absolute bottom-full mb-1 right-0 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                                {t('deleteColumn')}
                                            </div>
                                        </div>
                                    )}
                                  </DraggableListItem>
                              ))}
                          </div>
                          <div className="mt-4 flex gap-2">
                               <input
                                  type="text"
                                  value={newColumnName}
                                  onChange={(e) => setNewColumnName(e.target.value)}
                                  placeholder={t('columnNamePlaceholder') as string}
                                  className="flex-grow bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                                />
                                <div className="relative group flex-shrink-0">
                                    <button 
                                        onClick={handleAddColumn} 
                                        className="p-2 text-sm font-medium text-[var(--color-main)] hover:brightness-125 transition-all bg-[var(--color-surface-2)] rounded-md border border-[var(--color-surface-3)]"
                                        aria-label={t('addColumn') as string}
                                    >
                                        <PlusIcon />
                                    </button>
                                    <div className="absolute bottom-full mb-2 right-0 w-max px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                        {t('addColumn')}
                                    </div>
                                </div>
                          </div>
                      </div>
                       <div>
                          <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-2">{t('sprintSettings')}</h3>
                          <div className="bg-[var(--color-surface-2)] rounded-lg px-4">
                              <SettingRow label={t('defaultColumnSort')}>
                                   <select
                                       value={draft.defaultKanbanSort}
                                       onChange={(e) => dispatch({type: 'UPDATE_FIELD', payload: { field: 'defaultKanbanSort', value: e.target.value as SortKey }})}
                                       className="w-full bg-[var(--color-surface-3)] border border-transparent text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-main)] cursor-pointer"
                                   >
                                       {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                   </select>
                              </SettingRow>
                              <SettingRow label={t('sprintDuration')}>
                                   <input
                                      type="number"
                                      min="1"
                                      value={draft.sprintDays}
                                      onChange={(e) => dispatch({type: 'UPDATE_FIELD', payload: { field: 'sprintDays', value: parseInt(e.target.value, 10) || 1 }})}
                                      className="w-full bg-[var(--color-surface-3)] border border-transparent text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                                    />
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
              <nav className="w-56 flex-shrink-0 p-4 border-r border-[var(--color-surface-2)] space-y-2 overflow-y-auto">
                  <TabButton icon={<GeneralIcon/>} label={t('general')} isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                  <TabButton icon={<WorkloadIcon/>} label={t('workload')} isActive={activeTab === 'workload'} onClick={() => setActiveTab('workload')} />
                  <TabButton icon={<KanbanIcon/>} label={t('kanban')} isActive={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} />
              </nav>
              
              <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {renderContent()}
                  <div className="pt-4 mt-4 border-t border-[var(--color-surface-2)]">
                        <button
                            onClick={() => setResetConfirm(activeTab)}
                            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            {t('resetToDefaults')}
                        </button>
                    </div>
              </main>
          </div>
          
          <footer className="p-4 border-t border-[var(--color-surface-2)] flex justify-end gap-3 flex-shrink-0">
               <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-main)] text-white hover:brightness-110"
                >
                  {t('save')}
                </button>
          </footer>
        </div>
      </div>
      {columnPendingDeletion && (
        <ConfirmationDialog
            title={t('deleteColumnConfirmTitle')}
            message={t('deleteColumnConfirmMessage', { columnName: t(columnPendingDeletion.name), toDoColumnName: t(draft.kanbanColumns[0]) })}
            onConfirm={confirmDeleteColumn}
            onCancel={() => setColumnPendingDeletion(null)}
        />
      )}
      {resetConfirm && (
        <ConfirmationDialog
            title={t('resetSectionConfirmTitle')}
            message={t('resetSectionConfirmMessage')}
            onConfirm={() => handleReset(resetConfirm)}
            onCancel={() => setResetConfirm(null)}
        />
      )}
    </>
  );
};

// --- Reducer for settings state management ---
function settingsReducer(state: Settings, action: Action): Settings {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'UPDATE_TEAM_PRESET':
      const newPreset = action.payload;
      return {
          ...state,
          teamPreset: newPreset,
          kanbanColumns: newPreset === 'analysts' ? ANALYSTS_PRESET_COLUMNS : IT_PRESET_COLUMNS,
      };
    case 'SET_COLUMNS':
      return { ...state, kanbanColumns: action.payload };
    case 'ADD_COLUMN':
      return { ...state, kanbanColumns: [...state.kanbanColumns, action.payload] };
    case 'UPDATE_COLUMN_NAME':
      const updatedColumns = [...state.kanbanColumns];
      updatedColumns[action.payload.index] = action.payload.newName;
      return { ...state, kanbanColumns: updatedColumns };
    case 'DELETE_COLUMN':
      return { ...state, kanbanColumns: state.kanbanColumns.filter((_, i) => i !== action.payload) };
    case 'SET_PRIORITIES':
      return { ...state, priorities: action.payload };
    case 'ADD_PRIORITY': {
        const newKey = action.payload.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') + `-${Date.now()}`;
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        return {
            ...state,
            priorities: [...state.priorities, { key: newKey, name: action.payload, color: randomColor }]
        };
    }
    case 'UPDATE_PRIORITY':
        const newPriorities = [...state.priorities];
        newPriorities[action.payload.index] = action.payload.newPriority;
        return { ...state, priorities: newPriorities };
    case 'DELETE_PRIORITY':
        return { ...state, priorities: state.priorities.filter((_, i) => i !== action.payload) };
    case 'RESET_TAB':
      const tab = action.payload;
      if (tab === 'general') {
        return { ...state, theme: 'dark', language: 'pt', priorities: getInitialPriorities() };
      }
      if (tab === 'workload') {
        return { ...state, responsibleSortOrder: 'asc' };
      }
      if (tab === 'kanban') {
        const preset = state.teamPreset;
        return { 
            ...state,
            defaultKanbanSort: 'priority',
            sprintDays: 7,
            kanbanColumns: preset === 'analysts' ? ANALYSTS_PRESET_COLUMNS : IT_PRESET_COLUMNS,
        };
      }
      return state;
    default:
      return state;
  }
}
