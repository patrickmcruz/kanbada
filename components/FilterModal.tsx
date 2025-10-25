import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TeamMember, Priority, Filters } from '../types';

interface FilterModalProps {
  onClose: () => void;
  onApply: (filters: Filters) => void;
  currentFilters: Filters;
  teamMembers: TeamMember[];
  allTitles: string[];
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-secondary)]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const PRIORITIES: Priority[] = ['Urgente', 'Alta', 'Média', 'Baixa'];

interface MultiSelectDropdownProps<T extends string> {
    label: string;
    options: { value: T; label: string }[];
    selected: T[];
    onToggle: (value: T) => void;
    onClear: () => void;
}

const MultiSelectDropdown = <T extends string>({ label, options, selected, onToggle, onClear }: MultiSelectDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    const getSelectionLabel = () => {
        if (selected.length === 0) return t('all');
        if (selected.length === 1) {
            const selectedOption = options.find(opt => opt.value === selected[0]);
            return selectedOption ? selectedOption.label : '';
        }
        return `${selected.length} selecionados`;
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <fieldset>
            <div className="flex justify-between items-baseline mb-2">
              <legend className="text-lg font-medium text-[var(--color-text-primary)]">{label}</legend>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-main)] transition-colors cursor-pointer"
                  aria-label={`${t('clearSelection')} ${label}`}
                >
                  {t('clearSelection')}
                </button>
              )}
            </div>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 text-sm bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] text-[var(--color-text-primary)] rounded-md cursor-pointer"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span>{getSelectionLabel()}</span>
                    <ChevronDownIcon />
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 p-2 border border-[var(--color-surface-3)] rounded-md bg-[var(--color-surface-2)] shadow-lg">
                        <div className="relative mb-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('searchInDropdown') as string}
                                className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-surface-1)] py-2 pl-10 pr-4 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => (
                                    <label key={option.value} className="flex items-center gap-3 cursor-pointer p-1 rounded hover:bg-[var(--color-surface-3)]">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(option.value)}
                                            onChange={() => onToggle(option.value)}
                                            className="w-5 h-5 rounded bg-[var(--color-surface-1)] border-[var(--color-surface-3)] text-[var(--color-main)] focus:ring-[var(--color-main)]"
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                ))
                            ) : (
                                <div className="text-center text-sm text-[var(--color-text-secondary)] p-2">
                                    {t('noOptionsFound')}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </fieldset>
    );
};


export const FilterModal: React.FC<FilterModalProps> = ({ onClose, onApply, currentFilters, teamMembers, allTitles }) => {
  const { t } = useTranslation();
  const [selectedTitles, setSelectedTitles] = useState<string[]>(currentFilters.titles);
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(currentFilters.responsibles);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(currentFilters.priorities);

  const handleTitleToggle = (title: string) => {
    setSelectedTitles(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleResponsibleToggle = (id: string) => {
    setSelectedResponsibles(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const handlePriorityToggle = (priority: Priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
    );
  };

  const handleApply = () => {
    onApply({
      titles: selectedTitles,
      responsibles: selectedResponsibles,
      priorities: selectedPriorities,
    });
  };

  const handleClear = () => {
    const clearedFilters = { titles: [], responsibles: [], priorities: [] };
    setSelectedTitles(clearedFilters.titles);
    setSelectedResponsibles(clearedFilters.responsibles);
    setSelectedPriorities(clearedFilters.priorities);
    onApply(clearedFilters);
  };

  const titleOptions = allTitles.map(title => ({ value: title, label: title }));
  const responsibleOptions = teamMembers.map(member => ({ value: member.id, label: member.id === 'unassigned' ? t('unassigned') : member.name }));
  const priorityOptions = PRIORITIES.map(priority => ({ value: priority, label: priority }));

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-modal-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-title"
    >
      <div
        className="bg-[var(--color-surface-1)] text-[var(--color-text-primary)] rounded-lg shadow-2xl w-full max-w-md m-4 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[var(--color-surface-2)]">
          <h2 id="filter-title" className="text-xl font-bold">{t('advancedFilters')}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] cursor-pointer"
            aria-label={t('close')}
          >
            <XIcon />
          </button>
        </header>

        <main className="p-6 space-y-6 overflow-y-auto">
          <MultiSelectDropdown
            label={t('cardName')}
            options={titleOptions}
            selected={selectedTitles}
            onToggle={handleTitleToggle}
            onClear={() => setSelectedTitles([])}
          />
          <MultiSelectDropdown
            label={t('responsible')}
            options={responsibleOptions}
            selected={selectedResponsibles}
            onToggle={handleResponsibleToggle}
            onClear={() => setSelectedResponsibles([])}
          />
          <MultiSelectDropdown
            label={t('priority')}
            options={priorityOptions}
            selected={selectedPriorities}
            onToggle={handlePriorityToggle}
            onClear={() => setSelectedPriorities([])}
          />
        </main>
        <footer className="flex-shrink-0 flex items-center justify-end gap-4 p-4 border-t border-[var(--color-surface-2)]">
            <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
            >
                {t('clearFilters')}
            </button>
            <button
                onClick={handleApply}
                className="px-6 py-2 text-sm font-semibold text-white bg-[var(--color-main)] rounded-md hover:brightness-110 cursor-pointer"
            >
                {t('applyFilters')}
            </button>
        </footer>
      </div>
    </div>
  );
};