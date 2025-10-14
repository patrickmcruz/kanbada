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
    <div className="flex items-center justify-between p-3 bg-[#2a2f32] border-b border-[#40464a]">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium text-white bg-[#2a2f32] border border-[#40464a] rounded-md hover:bg-[#40464a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181c1e] focus:ring-[#8cb45a]"
        >
          {t('today')}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} className="p-2 text-[#b0b3b8] bg-[#2a2f32] border border-[#40464a] rounded-md hover:bg-[#40464a]"><ChevronLeftIcon /></button>
          <button onClick={handleNext} className="p-2 text-[#b0b3b8] bg-[#2a2f32] border border-[#40464a] rounded-md hover:bg-[#40464a]"><ChevronRightIcon /></button>
        </div>
        <div className="text-lg font-semibold text-white w-64 text-center">
            {getFormattedDateRange(viewLevel, currentDate, locale)}
        </div>
         <div className="flex items-center gap-3 border-l border-[#40464a] pl-4">
          <div>
            <label htmlFor="responsible-filter" className="sr-only">{t('filterByResponsible')}</label>
            <select
              id="responsible-filter"
              value={filters.responsible}
              onChange={(e) => onFilterChange('responsible', e.target.value)}
              className="block w-40 pl-3 pr-10 py-2 text-sm bg-[#40464a] border-[#52585c] text-white focus:outline-none focus:ring-[#8cb45a] focus:border-[#8cb45a] rounded-md"
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
              className="block w-40 pl-3 pr-3 py-2 text-sm bg-[#40464a] border-[#52585c] text-white placeholder-gray-400 focus:outline-none focus:ring-[#8cb45a] focus:border-[#8cb45a] rounded-md"
              aria-label={t('filterByProject') as string}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center bg-transparent border border-[#40464a] rounded-md">
        {(['Day', 'Week', 'Month'] as ViewLevel[]).map(level => (
          <button
            key={level}
            onClick={() => onViewLevelChange(level)}
            className={`px-4 py-2 text-sm font-medium border-l border-[#40464a] first:border-l-0 rounded-md first:rounded-r-none last:rounded-l-none
              ${viewLevel === level ? 'bg-[#8cb45a] text-white' : 'text-white hover:bg-[#40464a]'}`}
          >
            {t(level.toLowerCase())}
          </button>
        ))}
      </div>
    </div>
  );
};