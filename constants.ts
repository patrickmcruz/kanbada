
import type { TeamMember, Task } from './types';
import { addDays, getStartOfWeek } from './utils/dateUtils';

const today = new Date();
const startOfWeek = getStartOfWeek(today);

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'joaozinho', name: 'joãozinho' },
  { id: 'pietrinho', name: 'pietrinho' },
  { id: 'robertinho', name: 'robertinho' },
  { id: 'unassigned', name: 'sem responsavel' },
];

export const TASKS: Task[] = [
  // Joãozinho's tasks
  {
    id: 'task-1',
    title: 'TÍTULO PROJETO EXEMPLO 01',
    projectId: 'P06',
    hours: 40,
    ownerId: 'joaozinho',
    startDate: startOfWeek,
    endDate: addDays(startOfWeek, 3),
  },
  // Pietrinho's tasks
  {
    id: 'task-2',
    title: 'Título demanda 01',
    projectId: 'DAN1',
    hours: 40,
    ownerId: 'pietrinho',
    startDate: startOfWeek,
    endDate: addDays(startOfWeek, 1),
    isDemand: true,
  },
  {
    id: 'task-3',
    title: 'a - card1',
    projectId: '',
    hours: 8,
    ownerId: 'pietrinho',
    startDate: startOfWeek,
    endDate: startOfWeek,
  },
  {
    id: 'task-4',
    title: 'a - card90',
    projectId: '',
    hours: 8,
    ownerId: 'pietrinho',
    startDate: addDays(startOfWeek, 2),
    endDate: addDays(startOfWeek, 2),
  },
  // Robertinho's tasks
  {
    id: 'task-5',
    title: 'C - card3',
    projectId: '',
    hours: 4,
    ownerId: 'robertinho',
    startDate: startOfWeek,
    endDate: startOfWeek,
  },
  {
    id: 'task-6',
    title: 'D - card4',
    projectId: '',
    hours: 4,
    ownerId: 'robertinho',
    startDate: startOfWeek,
    endDate: startOfWeek,
  },
    {
    id: 'task-7',
    title: 'D',
    projectId: '',
    hours: 8,
    ownerId: 'robertinho',
    startDate: addDays(startOfWeek, 1),
    endDate: addDays(startOfWeek, 1),
  },
    {
    id: 'task-8',
    title: 'E',
    projectId: '',
    hours: 8,
    ownerId: 'robertinho',
    startDate: addDays(startOfWeek, 3),
    endDate: addDays(startOfWeek, 3),
  },
  // Unassigned tasks
  { id: 'task-9', title: 'E', projectId: '', hours: 2, ownerId: 'unassigned', startDate: startOfWeek, endDate: startOfWeek },
  { id: 'task-10', title: 'F', projectId: '', hours: 2, ownerId: 'unassigned', startDate: startOfWeek, endDate: startOfWeek },
  { id: 'task-11', title: 'G', projectId: '', hours: 2, ownerId: 'unassigned', startDate: startOfWeek, endDate: startOfWeek },
  { id: 'task-12', title: 'H', projectId: '', hours: 2, ownerId: 'unassigned', startDate: startOfWeek, endDate: startOfWeek },
  { id: 'task-13', title: 'E', projectId: '', hours: 2, ownerId: 'unassigned', startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 3) },
  { id: 'task-14', title: 'F', projectId: '', hours: 2, ownerId: 'unassigned', startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 3) },
  { id: 'task-15', title: 'G', projectId: '', hours: 2, ownerId: 'unassigned', startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 3) },
  { id: 'task-16', title: 'H', projectId: '', hours: 2, ownerId: 'unassigned', startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 3) },
];
