import { useState, useMemo } from 'react';
import { WORK_PACKAGES as initialWorkPackages } from '../data/work-packages';
import { TEAM_MEMBERS } from '../data/team';
import { getStartOfWeek, addDays, getStartOfDay } from '../utils/dateUtils';
import type { TaskWorkPackage, ProjectWorkPackage, DemandWorkPackage, Priority } from '../types';

export const useWorkload = (currentDate: Date) => {
    const [workPackages, setWorkPackages] = useState<(ProjectWorkPackage | DemandWorkPackage)[]>(initialWorkPackages);
    const [filterCardName, setFilterCardName] = useState<string[]>([]);
    const [filterResponsible, setFilterResponsible] = useState<string[]>([]);
    const [filterPriority, setFilterPriority] = useState<string[]>([]);

    const allTasks = useMemo((): TaskWorkPackage[] => {
        return workPackages.flatMap<TaskWorkPackage>(container => {
            if (container.type === 'Project') {
                return container.phases.flatMap(phase =>
                    phase.tasks.map(task => ({ ...task, isDemand: false }))
                );
            } else if (container.type === 'Demand') {
                return container.tasks.map(task => ({ ...task, isDemand: true }));
            }
            return [];
        });
    }, [workPackages]);

    const cardNameOptions = useMemo(() => {
        const titles = new Set<string>();
        allTasks.forEach(task => {
            titles.add(task.title);
            titles.add(task.projectId);
        });
        return Array.from(titles).sort();
    }, [allTasks]);

    const responsibleOptions = useMemo(() => {
        const memberMap = new Map(TEAM_MEMBERS.map(m => [m.id, m.name]));
        const responsibles = new Set<string>();
        allTasks.forEach(task => {
            const name = memberMap.get(task.ownerId ?? 'unassigned');
            if (name) { responsibles.add(name); }
        });
        return Array.from(responsibles).sort();
    }, [allTasks]);

    const priorityOptions = useMemo((): Priority[] => ['urgent', 'high', 'medium', 'low'], []);

    const handleTaskStatusChange = (taskId: string, newStatus: string) => {
        const updatedWorkPackages = workPackages.map(container => {
            const updateTasks = (tasks: TaskWorkPackage[]) => tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            );

            if (container.type === 'Project') {
                return {
                    ...container,
                    phases: container.phases.map(phase => ({ ...phase, tasks: updateTasks(phase.tasks) }))
                };
            }
            if (container.type === 'Demand') {
                return { ...container, tasks: updateTasks(container.tasks) };
            }
            return container;
        });
        setWorkPackages(updatedWorkPackages);
    };
    
    const handleRenameColumnTasks = (oldStatus: string, newStatus: string) => {
        const updatedWorkPackages = workPackages.map(container => {
            const updateTasks = (tasks: TaskWorkPackage[]) => tasks.map(task =>
                task.status === oldStatus ? { ...task, status: newStatus } : task
            );

            if (container.type === 'Project') {
                return {
                    ...container,
                    phases: container.phases.map(phase => ({ ...phase, tasks: updateTasks(phase.tasks) }))
                };
            }
            if (container.type === 'Demand') {
                return { ...container, tasks: updateTasks(container.tasks) };
            }
            return container;
        });
        setWorkPackages(updatedWorkPackages);
    };
    
    const handleMoveTasks = (fromStatus: string, toStatus: string) => {
        const updatedWorkPackages = workPackages.map(container => {
            const updateTasks = (tasks: TaskWorkPackage[]) => tasks.map(task =>
                task.status === fromStatus ? { ...task, status: toStatus } : task
            );

            if (container.type === 'Project') {
                return {
                    ...container,
                    phases: container.phases.map(phase => ({ ...phase, tasks: updateTasks(phase.tasks) }))
                };
            }
            if (container.type === 'Demand') {
                return { ...container, tasks: updateTasks(container.tasks) };
            }
            return container;
        });
        setWorkPackages(updatedWorkPackages);
    };


    const filteredTasks = useMemo(() => {
        const responsibleMap = new Map(TEAM_MEMBERS.map(member => [member.id, member.name]));

        if (filterCardName.length === 0 && filterResponsible.length === 0 && filterPriority.length === 0) {
            return allTasks;
        }

        return allTasks.filter(task => {
            const taskResponsibleName = responsibleMap.get(task.ownerId ?? 'unassigned') ?? '';
            const cardNameMatch = filterCardName.length === 0 || filterCardName.includes(task.title) || filterCardName.includes(task.projectId);
            const responsibleMatch = filterResponsible.length === 0 || filterResponsible.includes(taskResponsibleName);
            const priorityMatch = filterPriority.length === 0 || (task.priority && filterPriority.includes(task.priority));
            return cardNameMatch && responsibleMatch && priorityMatch;
        });
    }, [allTasks, filterCardName, filterResponsible, filterPriority]);

    const kanbanTasks = useMemo(() => {
        const weekStart = getStartOfWeek(currentDate);
        const weekEnd = addDays(weekStart, 6);
        const weekStartSOD = getStartOfDay(weekStart);
        const weekEndSOD = getStartOfDay(weekEnd);

        return filteredTasks.filter(task => {
            const taskStartSOD = getStartOfDay(task.startDate);
            const taskEndSOD = getStartOfDay(task.endDate);
            const overlaps = taskStartSOD.getTime() <= weekEndSOD.getTime() && taskEndSOD.getTime() >= weekStartSOD.getTime();
            return overlaps;
        });
    }, [filteredTasks, currentDate]);

    return {
        workPackages,
        allTasks,
        filteredTasks,
        kanbanTasks,
        cardNameOptions,
        responsibleOptions,
        priorityOptions,
        filterCardName,
        setFilterCardName,
        filterResponsible,
        setFilterResponsible,
        filterPriority,
        setFilterPriority,
        handleTaskStatusChange,
        handleRenameColumnTasks,
        handleMoveTasks,
    };
};