import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Priority, ViewLevel, AppView } from '../types';
import { addDays, addMonths, addYears, getFormattedDateRange } from '../utils/dateUtils';
import { getPriorityClasses } from '../utils/styleUtils';
import { FilterCombobox } from './FilterCombobox';

interface ToolbarProps {
  viewLevel: ViewLevel;
  onViewLevelChange: (level: ViewLevel) => void;
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
  filterCardName: string[];
  onFilterCardNameChange: (value: string[]) => void;
  filterResponsible: string[];
  onFilterResponsibleChange: (value: string[]) => void;
  filterPriority: string[];
  onFilterPriorityChange: (value: string[]) => void;
  cardNameOptions: string[];
  responsibleOptions: string[];
  priorityOptions: string[];
  activeView: AppView;
  onActiveViewChange: (view: AppView) => void;
}

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);


export const Toolbar: React.FC<ToolbarProps> = ({ 
    viewLevel, 
    onViewLevelChange, 
    currentDate, 
    onCurrentDateChange,
    filterCardName,
    onFilterCardNameChange,
    filterResponsible,
    onFilterResponsibleChange,
    filterPriority,
    onFilterPriorityChange,
    cardNameOptions,
    responsibleOptions,
    priorityOptions,
    activeView,
    onActiveViewChange
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const handlePrev = () => {
    if (activeView === 'Kanban') {
      onCurrentDateChange(addDays(currentDate, -7));
      return;
    }
    if (viewLevel === 'Day') onCurrentDateChange(addDays(currentDate, -7));
    if (viewLevel === 'Week') onCurrentDateChange(addMonths(currentDate, -1));
    if (viewLevel === 'Month') onCurrentDateChange(addYears(currentDate, -1));
  };

  const handleNext = () => {
    if (activeView === 'Kanban') {
      onCurrentDateChange(addDays(currentDate, 7));
      return;
    }
    if (viewLevel === 'Day') onCurrentDateChange(addDays(currentDate, 7));
    if (viewLevel === 'Week') onCurrentDateChange(addMonths(currentDate, 1));
    if (viewLevel === 'Month') onCurrentDateChange(addYears(currentDate, 1));
  };
  
  const handleToday = () => {
    onCurrentDateChange(new Date());
  };

  const renderPriorityOption = (option: string) => {
    const priority = option as Priority;
    const { dot } = getPriorityClasses(priority);
    return (
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${dot}`}></span>
            <span>{option}</span>
        </div>
    );
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[var(--color-surface-1)] border-b border-[var(--color-surface-2)] gap-4 flex-wrap">
      {/* Left side: Navigation and Date */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center bg-transparent border border-[var(--color-surface-2)] rounded-md flex-shrink-0">
          {(['Workload', 'Kanban'] as AppView[]).map(view => (
            <button
              key={view}
              onClick={() => onActiveViewChange(view)}
              className={`px-4 py-2 text-sm font-medium border-l border-[var(--color-surface-2)] first:border-l-0 rounded-md first:rounded-r-none last:rounded-l-none cursor-pointer
                ${activeView === view ? 'bg-[var(--color-main)] text-white' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'}`}
            >
              {t(view.toLowerCase())}
            </button>
          ))}
        </div>

        
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
            {getFormattedDateRange(activeView === 'Kanban' ? 'Day' : viewLevel, currentDate, locale)}
        </div>
      </div>
      
      {/* Middle: Filters (takes remaining space) */}
      <div className="flex-1 flex items-center gap-2 min-w-[400px]">
          <FilterCombobox
            value={filterCardName}
            onChange={onFilterCardNameChange}
            options={cardNameOptions}
            placeholder={t('cardNamePlaceholder') as string}
          />
          <FilterCombobox
            value={filterResponsible}
            onChange={onFilterResponsibleChange}
            options={responsibleOptions}
            placeholder={t('responsiblePlaceholder') as string}
          />
          <FilterCombobox
            value={filterPriority}
            onChange={onFilterPriorityChange}
            options={priorityOptions}
            placeholder={t('priorityPlaceholder') as string}
            renderOption={renderPriorityOption}
            showSearch={false}
          />
      </div>

      {/* Right side: View switcher */}
      {activeView === 'Workload' && (
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
      )}
    </div>
  );
};