import type { ViewLevel, DateColumn } from '../types';

// Helper to get the start of the day (00:00:00)
export const getStartOfDay = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const getStartOfWeek = (date: Date): Date => {
    const d = getStartOfDay(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

export const getStartOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getStartOfYear = (date: Date): Date => {
    return new Date(date.getFullYear(), 0, 1);
};

export const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
};

export const addYears = (date: Date, years: number): Date => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
};

export const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};


export const generateDateColumns = (viewLevel: ViewLevel, currentDate: Date, locale: string): DateColumn[] => {
    const columns: DateColumn[] = [];
    
    switch (viewLevel) {
        case 'Day': {
            const startOfWeek = getStartOfWeek(currentDate);
            for (let i = 0; i < 5; i++) { // Monday to Friday
                const day = addDays(startOfWeek, i);
                const weekday = day.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase();
                const dayOfMonth = day.getDate();
                columns.push({
                    startDate: day,
                    endDate: day,
                    label: `${weekday}, ${dayOfMonth}`
                });
            }
            break;
        }
        case 'Week': {
            const startOfMonth = getStartOfMonth(currentDate);
            let current = getStartOfWeek(startOfMonth);
            // Ensure we start from a week that is part of the current month view
             if (current.getMonth() < startOfMonth.getMonth() && current.getFullYear() <= startOfMonth.getFullYear()) {
                if (addDays(current, 6).getMonth() < startOfMonth.getMonth() && addDays(current, 6).getFullYear() <= startOfMonth.getFullYear()) {
                     current = addDays(current, 7);
                }
            }

            for (let i = 0; i < 5; i++) { // Show 5 weeks
                const endOfWeek = addDays(current, 6);
                
                const startMonth = current.toLocaleDateString(locale, { month: 'short' });
                const endMonth = endOfWeek.toLocaleDateString(locale, { month: 'short' });
                let weekLabel = '';
                if (startMonth === endMonth) {
                    weekLabel = `${current.getDate()} - ${endOfWeek.getDate()} ${startMonth}`;
                } else {
                    weekLabel = `${current.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth}`;
                }

                columns.push({
                    startDate: current,
                    endDate: endOfWeek,
                    label: `W${i+1} (${weekLabel})`
                });
                current = addDays(current, 7);
            }
            break;
        }
        case 'Month': {
            const startOfYear = getStartOfYear(currentDate);
            for (let i = 0; i < 12; i++) {
                const monthDate = new Date(startOfYear.getFullYear(), i, 1);
                 const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
                columns.push({
                    startDate: monthDate,
                    endDate: endOfMonth,
                    label: monthDate.toLocaleDateString(locale, { month: 'long' })
                });
            }
            break;
        }
    }
    return columns;
};

export const getFormattedDateRange = (viewLevel: ViewLevel, currentDate: Date, locale: string): string => {
    switch (viewLevel) {
        case 'Day':
            const startOfWeek = getStartOfWeek(currentDate);
            const endOfWeek = addDays(startOfWeek, 4);
            return `${startOfWeek.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`;
        case 'Week':
            return currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
        case 'Month':
            return currentDate.toLocaleDateString(locale, { year: 'numeric' });
        default:
            return '';
    }
};

export const datesAreEqual = (d1: Date, d2: Date): boolean => {
    return getStartOfDay(d1).getTime() === getStartOfDay(d2).getTime();
};

export const daysBetween = (startDate: Date, endDate: Date): number => {
    const diffTime = Math.abs(getStartOfDay(endDate).getTime() - getStartOfDay(startDate).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};