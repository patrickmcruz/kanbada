import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ViewLevel } from '../types';
import { addDays, addMonths, addYears, getFormattedDateRange } from '../utils/dateUtils';

interface ToolbarProps {
  viewLevel: ViewLevel;
  onViewLevelChange: (level: ViewLevel) => void;
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
  filterText: string;
  onFilterTextChange: (text: string) => void;
  filterResponsible: string;
  onFilterResponsibleChange: (text: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (text: string) => void;
}

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-secondary)]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const Toolbar: React.FC<ToolbarProps> = ({ 
    viewLevel, 
    onViewLevelChange, 
    currentDate, 
    onCurrentDateChange,
    filterText,
    onFilterTextChange,
    filterResponsible,
    onFilterResponsibleChange,
    filterPriority,
    onFilterPriorityChange
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const handlePrev = () => {
    if (viewLevel === 'Day') onCurrentDateChange(addDays(currentDate, -7));
    if (viewLevel === 'Week') onCurrentDateChange(addMonths(currentDate, -1));
    if (viewLevel === 'Month') onCurrentDateChange(addYears(currentDate, -1));
  };

  const handleNext = () => {
    if (viewLevel === 'Day') onCurrentDateChange(addDays(currentDate, 7));
    if (viewLevel === 'Week') onCurrentDateChange(addMonths(currentDate, 1));
    if (viewLevel === 'Month') onCurrentDateChange(addYears(currentDate, 1));
  };
  
  const handleToday = () => {
    onCurrentDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[var(--color-surface-1)] border-b border-[var(--color-surface-2)] gap-4">
      {/* Left side: Navigation and Date */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-1)] border border-[var(--color-surface-2)] rounded-md hover:bg-[var(--color-surface-2)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-back)] focus:ring-[var(--color-main)] cursor-pointer"
        >
          {t('today')}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} className="p-2 text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border border-[var(--color-surface-2)] rounded-md hover:bg-[var(--color-surface-2)] cursor-pointer"><ChevronLeftIcon /></button>
          <button onClick={handleNext} className="p-2 text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border border-[var(--color-surface-2)] rounded-md hover:bg-[var(--color-surface-2)] cursor-pointer"><ChevronRightIcon /></button>
        </div>
        <div className="text-lg font-semibold text-[var(--color-text-primary)] w-64 text-center">
            {getFormattedDateRange(viewLevel, currentDate, locale)}
        </div>
      </div>
      
      {/* Middle: Filters (takes remaining space) */}
      <div className="flex-1 flex items-center gap-2">
          <div className="relative w-1/3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon />
              </span>
              <input
                  type="text"
                  placeholder={t('cardNamePlaceholder') as string}
                  value={filterText}
                  onChange={(e) => onFilterTextChange(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-surface-2)] py-2 pl-10 pr-10 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
              />
              {filterText && (
                <button
                    onClick={() => onFilterTextChange('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    aria-label={t('clearFilter') as string}
                >
                    <XIcon />
                </button>
              )}
          </div>
          <div className="relative w-1/3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon />
              </span>
              <input
                  type="text"
                  placeholder={t('responsiblePlaceholder') as string}
                  value={filterResponsible}
                  onChange={(e) => onFilterResponsibleChange(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-surface-2)] py-2 pl-10 pr-10 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
              />
              {filterResponsible && (
                <button
                    onClick={() => onFilterResponsibleChange('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    aria-label={t('clearFilter') as string}
                >
                    <XIcon />
                </button>
              )}
          </div>
          <div className="relative w-1/3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon />
              </span>
              <input
                  type="text"
                  placeholder={t('priorityPlaceholder') as string}
                  value={filterPriority}
                  onChange={(e) => onFilterPriorityChange(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-surface-2)] py-2 pl-10 pr-10 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
              />
              {filterPriority && (
                <button
                    onClick={() => onFilterPriorityChange('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    aria-label={t('clearFilter') as string}
                >
                    <XIcon />
                </button>
              )}
          </div>
      </div>

      {/* Right side: View switcher */}
      <div className="flex items-center bg-transparent border border-[var(--color-surface-2)] rounded-md flex-shrink-0">
        {(['Day', 'Week', 'Month'] as ViewLevel[]).map(level => (
          <button
            key={level}
            onClick={() => onViewLevelChange(level)}
            className={`px-4 py-2 text-sm font-medium border-l border-[var(--color-surface-2)] first:border-l-0 rounded-md first:rounded-r-none last:rounded-l-none cursor-pointer
              ${viewLevel === level ? 'bg-[var(--color-main)] text-white' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'}`}
          >
            {t(level.toLowerCase())}
          </button>
        ))}
      </div>
    </div>
  );
};