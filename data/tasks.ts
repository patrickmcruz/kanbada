import type { Task } from '../types';
import { addDays, getStartOfWeek } from '../utils/dateUtils';

const today = new Date();
const startOfWeek = getStartOfWeek(today);

// Calculate the first Monday of October for the current year.
const firstMondayOfOctober = new Date(new Date().getFullYear(), 9, 1); // Month is 0-indexed, so 9 is October.
while (firstMondayOfOctober.getDay() !== 1) { // 1 = Monday
  firstMondayOfOctober.setDate(firstMondayOfOctober.getDate() + 1);
}

export const TASKS: Task[] = [
  // Joãozinho's tasks
  {
    id: 'task-1',
    title: 'TÍTULO PROJETO EXEMPLO 01',
    projectId: 'P06',
    hours: 120, // 40h/week * 3 weeks
    ownerId: 'joaozinho',
    startDate: firstMondayOfOctober,
    endDate: addDays(firstMondayOfOctober, 18), // 3 work weeks (Mon-Fri)
    priority: 'Média',
  },
  {
    id: 'task-17',
    title: 'card and project example',
    projectId: 'P07',
    hours: 160, // 40h/week * 4 weeks
    ownerId: 'joaozinho',
    startDate: firstMondayOfOctober,
    endDate: addDays(firstMondayOfOctober, 25), // 4 work weeks (Mon-Fri)
    priority: 'Urgente',
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
    priority: 'Urgente',
  },
  {
    id: 'task-3',
    title: 'a - card1',
    projectId: '',
    hours: 8,
    ownerId: 'pietrinho',
    startDate: startOfWeek,
    endDate: startOfWeek,
    priority: 'Urgente',
  },
  {
    id: 'task-4',
    title: 'a - card90',
    projectId: '',
    hours: 8,
    ownerId: 'pietrinho',
    startDate: addDays(startOfWeek, 2),
    endDate: addDays(startOfWeek, 2),
    priority: 'Urgente',
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
    priority: 'Alta',
  },
  {
    id: 'task-6',
    title: 'D - card4',
    projectId: '',
    hours: 4,
    ownerId: 'robertinho',
    startDate: startOfWeek,
    endDate: startOfWeek,
    priority: 'Alta',
  },
    {
    id: 'task-7',
    title: 'D',
    projectId: '',
    hours: 8,
    ownerId: 'robertinho',
    startDate: addDays(startOfWeek, 1),
    endDate: addDays(startOfWeek, 1),
    priority: 'Média',
  },
    {
    id: 'task-8',
    title: 'E',
    projectId: '',
    hours: 8,
    ownerId: 'robertinho',
    startDate: addDays(startOfWeek, 3),
    endDate: addDays(startOfWeek, 4),
    priority: 'Baixa',
  },
  // Unassigned tasks
  { id: 'task-9', title: 'E', projectId: '', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Urgente' },
  { id: 'task-10', title: 'F', projectId: '', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Alta' },
  { id: 'task-11', title: 'G', projectId: '', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Média' },
  { id: 'task-12', title: 'H', projectId: '', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Baixa' },
  { id: 'task-13', title: 'E', projectId: '', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Urgente' },
  { id: 'task-14', title: 'F', projectId: '', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Alta' },
  { id: 'task-15', title: 'G', projectId: '', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Média' },
  { id: 'task-16', title: 'H', projectId: '', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Baixa' },
];
