import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ViewLevel, TeamMember } from '../types';
import { addDays, addMonths, addYears, getFormattedDateRange } from '../utils/dateUtils';

interface ToolbarProps {
  viewLevel: ViewLevel;
  onViewLevelChange: (level: ViewLevel) => void;
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
  filters: { responsible: string; project: string };
  onFilterChange: (filterType: 'responsible' | 'project', value: string) => void;
  teamMembers: TeamMember[];
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
    filters,
    onFilterChange,
    teamMembers 
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
    <div className="flex items-center justify-between p-3 bg-[var(--color-surface-1)] border-b border-[var(--color-surface-2)]">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-1)] border border-[var(--color-surface-2)] rounded-md hover:bg-[var(--color-surface-2)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-back)] focus:ring-[var(--color-main)]"
        >
          {t('today')}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} className="p-2 text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border border-[var(--color-surface-2)] rounded-md hover:bg-[var(--color-surface-2)]"><ChevronLeftIcon /></button>
          <button onClick={handleNext} className="p-2 text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border border-[var(--color-surface-2)] rounded-md hover:bg-[var(--color-surface-2)]"><ChevronRightIcon /></button>
        </div>
        <div className="text-lg font-semibold text-[var(--color-text-primary)] w-64 text-center">
            {getFormattedDateRange(viewLevel, currentDate, locale)}
        </div>
         <div className="flex items-center gap-3 border-l border-[var(--color-surface-2)] pl-4">
          <div>
            <label htmlFor="responsible-filter" className="sr-only">{t('filterByResponsible')}</label>
            <select
              id="responsible-filter"
              value={filters.responsible}
              onChange={(e) => onFilterChange('responsible', e.target.value)}
              className="block w-40 pl-3 pr-10 py-2 text-sm bg-[var(--color-surface-2)] border-[var(--color-surface-3)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-main)] focus:border-[var(--color-main)] rounded-md"
              aria-label={t('filterByResponsible') as string}
            >
              <option value="all">{t('all')}</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.id === 'unassigned' ? t('unassigned') : member.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="project-filter" className="sr-only">{t('filterByProject')}</label>
            <input
              type="text"
              id="project-filter"
              placeholder={t('filterByProject') as string}
              value={filters.project}
              onChange={(e) => onFilterChange('project', e.target.value)}
              className="block w-40 pl-3 pr-3 py-2 text-sm bg-[var(--color-surface-2)] border-[var(--color-surface-3)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-[var(--color-main)] focus:border-[var(--color-main)] rounded-md"
              aria-label={t('filterByProject') as string}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center bg-transparent border border-[var(--color-surface-2)] rounded-md">
        {(['Day', 'Week', 'Month'] as ViewLevel[]).map(level => (
          <button
            key={level}
            onClick={() => onViewLevelChange(level)}
            className={`px-4 py-2 text-sm font-medium border-l border-[var(--color-surface-2)] first:border-l-0 rounded-md first:rounded-r-none last:rounded-l-none
              ${viewLevel === level ? 'bg-[var(--color-main)] text-white' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'}`}
          >
            {t(level.toLowerCase())}
          </button>
        ))}
      </div>
    </div>
  );
};