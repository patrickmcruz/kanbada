
import React from 'react';
import type { ViewLevel } from '../types';
import { addDays, addMonths, addYears, getFormattedDateRange } from '../utils/dateUtils';

interface ToolbarProps {
  viewLevel: ViewLevel;
  onViewLevelChange: (level: ViewLevel) => void;
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
}

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);


export const Toolbar: React.FC<ToolbarProps> = ({ viewLevel, onViewLevelChange, currentDate, onCurrentDateChange }) => {
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
    <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Today
        </button>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"><ChevronLeftIcon /></button>
          <button onClick={handleNext} className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"><ChevronRightIcon /></button>
        </div>
        <div className="text-lg font-semibold text-gray-800 w-64 text-center">
            {getFormattedDateRange(viewLevel, currentDate)}
        </div>
      </div>
      
      <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm">
        {(['Day', 'Week', 'Month'] as ViewLevel[]).map(level => (
          <button
            key={level}
            onClick={() => onViewLevelChange(level)}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 first:border-l-0 rounded-md first:rounded-r-none last:rounded-l-none
              ${viewLevel === level ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};
