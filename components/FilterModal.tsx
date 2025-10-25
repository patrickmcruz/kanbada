import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TeamMember, Priority, Filters } from '../types';

interface FilterModalProps {
  onClose: () => void;
  onApply: (filters: Filters) => void;
  currentFilters: Filters;
  teamMembers: TeamMember[];
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const PRIORITIES: Priority[] = ['Urgente', 'Alta', 'Média', 'Baixa'];

export const FilterModal: React.FC<FilterModalProps> = ({ onClose, onApply, currentFilters, teamMembers }) => {
  const { t } = useTranslation();
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(currentFilters.responsibles);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(currentFilters.priorities);

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
      responsibles: selectedResponsibles,
      priorities: selectedPriorities,
    });
  };

  const handleClear = () => {
    const clearedFilters = { responsibles: [], priorities: [] };
    setSelectedResponsibles(clearedFilters.responsibles);
    setSelectedPriorities(clearedFilters.priorities);
    onApply(clearedFilters);
  };

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
          {/* Responsible Selection */}
          <fieldset>
            <legend className="text-lg font-medium text-[var(--color-text-primary)] mb-3">{t('responsible')}</legend>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <label key={member.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedResponsibles.includes(member.id)}
                    onChange={() => handleResponsibleToggle(member.id)}
                    className="w-5 h-5 rounded bg-[var(--color-surface-2)] border-[var(--color-surface-3)] text-[var(--color-main)] focus:ring-[var(--color-main)]"
                  />
                  <span>{member.id === 'unassigned' ? t('unassigned') : member.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Priority Selection */}
          <fieldset>
            <legend className="text-lg font-medium text-[var(--color-text-primary)] mb-3">{t('priority')}</legend>
            <div className="space-y-2">
              {PRIORITIES.map(priority => (
                <label key={priority} className="flex items-center gap-3 cursor-pointer">
                   <input
                    type="checkbox"
                    checked={selectedPriorities.includes(priority)}
                    onChange={() => handlePriorityToggle(priority)}
                    className="w-5 h-5 rounded bg-[var(--color-surface-2)] border-[var(--color-surface-3)] text-[var(--color-main)] focus:ring-[var(--color-main)]"
                  />
                  <span>{priority}</span>
                </label>
              ))}
            </div>
          </fieldset>
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