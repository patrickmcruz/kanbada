import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SetupScreenProps {
  onClose: () => void;
  currentTheme: 'dark' | 'light';
  onChangeTheme: (theme: 'dark' | 'light') => void;
  currentLang: string;
  onChangeLang: (lang: string) => void;
  kanbanColumns: string[];
  onChangeKanbanColumns: (columns: string[]) => void;
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export const SetupScreen: React.FC<SetupScreenProps> = ({ onClose, currentTheme, onChangeTheme, currentLang, onChangeLang, kanbanColumns, onChangeKanbanColumns }) => {
  const { t } = useTranslation();
  const [newColumnName, setNewColumnName] = useState('');

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newColumnName.trim();
    if (trimmedName && !kanbanColumns.find(col => col.toLowerCase() === trimmedName.toLowerCase())) {
        onChangeKanbanColumns([...kanbanColumns, trimmedName]);
        setNewColumnName('');
    }
  };

  const handleDeleteColumn = (columnToDelete: string) => {
      onChangeKanbanColumns(kanbanColumns.filter(c => c !== columnToDelete));
  };


  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-16" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-title"
    >
      <div 
        className="bg-[var(--color-surface-1)] text-[var(--color-text-primary)] rounded-lg shadow-2xl w-full max-w-md m-4 animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--color-surface-2)]">
          <h2 id="setup-title" className="text-xl font-bold">{t('setup')}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] cursor-pointer"
            aria-label={t('close')}
          >
            <XIcon />
          </button>
        </header>
        
        <main className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Theme Selection */}
          <fieldset>
            <legend className="text-lg font-medium text-[var(--color-text-primary)] mb-3">{t('theme')}</legend>
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

          {/* Language Selection */}
          <fieldset>
            <legend className="text-lg font-medium text-[var(--color-text-primary)] mb-3">{t('language')}</legend>
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

          {/* Kanban Columns */}
          <fieldset>
            <legend className="text-lg font-medium text-[var(--color-text-primary)] mb-3">{t('kanbanColumns')}</legend>
            <div className='space-y-2'>
                {kanbanColumns.map(column => (
                    <div key={column} className="flex items-center justify-between bg-[var(--color-surface-2)] p-2 rounded-md">
                        <span className="text-sm">{column}</span>
                        <button 
                            onClick={() => handleDeleteColumn(column)}
                            className="p-1 rounded-full text-red-400 hover:bg-red-500/20"
                            aria-label={`Delete ${column}`}
                        >
                            <TrashIcon />
                        </button>
                    </div>
                ))}
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
                    className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-[var(--color-main)] text-white hover:brightness-110 flex items-center gap-2"
                >
                    <PlusIcon /> {t('addColumn')}
                </button>
            </form>
          </fieldset>
        </main>
      </div>
    </div>
  );
};