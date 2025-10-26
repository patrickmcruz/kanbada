import type { ProjectWorkPackage, DemandWorkPackage } from '../types';
import { addDays, getStartOfWeek } from '../utils/dateUtils';

const today = new Date();
const startOfWeek = getStartOfWeek(today);

// Calculate the first Monday of October for the current year.
const firstMondayOfOctober = new Date(new Date().getFullYear(), 9, 1); // Month is 0-indexed, so 9 is October.
while (firstMondayOfOctober.getDay() !== 1) { // 1 = Monday
  firstMondayOfOctober.setDate(firstMondayOfOctober.getDate() + 1);
}

export const WORK_PACKAGES: (ProjectWorkPackage | DemandWorkPackage)[] = [
  {
    id: 'proj-1',
    type: 'Project',
    title: 'Projeto Exemplo',
    startDate: firstMondayOfOctober,
    endDate: addDays(firstMondayOfOctober, 25),
    createdAt: addDays(today, -30),
    phases: [
      {
        id: 'phase-1-1',
        type: 'Phase',
        projectId: 'proj-1',
        title: 'Fase de Planejamento',
        startDate: firstMondayOfOctober,
        endDate: addDays(firstMondayOfOctober, 25),
        createdAt: addDays(today, -30),
        tasks: [
          {
            id: 'task-1',
            type: 'Task',
            phaseId: 'phase-1-1',
            projectId: 'P06',
            title: 'TÍTULO PROJETO EXEMPLO 01',
            hours: 120,
            ownerId: 'joaozinho',
            startDate: firstMondayOfOctober,
            endDate: addDays(firstMondayOfOctober, 18),
            priority: 'medium',
            status: 'backlog',
            createdAt: addDays(today, -28),
          },
          {
            id: 'task-17',
            type: 'Task',
            phaseId: 'phase-1-1',
            projectId: 'P07',
            title: 'card and project example',
            hours: 160,
            ownerId: 'joaozinho',
            startDate: firstMondayOfOctober,
            endDate: addDays(firstMondayOfOctober, 25),
            priority: 'urgent',
            status: 'backlog',
            createdAt: addDays(today, -29),
          },
        ],
      },
    ],
  },
  {
    id: 'demand-1',
    type: 'Demand',
    title: 'DAN1',
    startDate: startOfWeek,
    endDate: addDays(startOfWeek, 1),
    createdAt: addDays(today, -5),
    tasks: [
        {
            id: 'task-2',
            type: 'Task',
            projectId: 'DAN1',
            title: 'Título demanda 01',
            hours: 40,
            ownerId: 'pietrinho',
            startDate: startOfWeek,
            endDate: addDays(startOfWeek, 1),
            priority: 'urgent',
            status: 'backlog',
            createdAt: addDays(today, -5),
          },
    ]
  },
  {
      id: 'proj-3',
      type: 'Project',
      title: 'Tarefas Gerais',
      startDate: startOfWeek,
      endDate: addDays(startOfWeek, 4),
      createdAt: addDays(today, -7),
      phases: [
          {
            id: 'phase-3-1',
            type: 'Phase',
            projectId: 'proj-3',
            title: 'Tarefas da Semana',
            startDate: startOfWeek,
            endDate: addDays(startOfWeek, 4),
            createdAt: addDays(today, -7),
            tasks: [
                { id: 'task-3', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'a - card1', hours: 8, ownerId: 'pietrinho', startDate: startOfWeek, endDate: startOfWeek, priority: 'urgent', status: 'backlog', createdAt: addDays(today, -2) },
                { id: 'task-4', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'a - card90', hours: 8, ownerId: 'pietrinho', startDate: addDays(startOfWeek, 2), endDate: addDays(startOfWeek, 2), priority: 'urgent', status: 'backlog', createdAt: addDays(today, -3) },
                { id: 'task-5', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'C - card3', hours: 4, ownerId: 'robertinho', startDate: startOfWeek, endDate: startOfWeek, priority: 'high', status: 'backlog', createdAt: addDays(today, -4) },
                { id: 'task-6', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'D - card4', hours: 4, ownerId: 'robertinho', startDate: startOfWeek, endDate: startOfWeek, priority: 'high', status: 'backlog', createdAt: addDays(today, -1) },
                { id: 'task-7', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'D', hours: 8, ownerId: 'robertinho', startDate: addDays(startOfWeek, 1), endDate: addDays(startOfWeek, 1), priority: 'medium', status: 'backlog', createdAt: addDays(today, 0) },
                { id: 'task-8', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'E', hours: 8, ownerId: 'robertinho', startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'low', status: 'backlog', createdAt: addDays(today, -6) },
                { id: 'task-9', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'E', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'urgent', status: 'backlog', createdAt: addDays(today, -8) },
                { id: 'task-10', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'F', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'high', status: 'backlog', createdAt: addDays(today, -9) },
                { id: 'task-11', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'G', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'medium', status: 'backlog', createdAt: addDays(today, -10) },
                { id: 'task-12', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'H', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'low', status: 'backlog', createdAt: addDays(today, -11) },
                { id: 'task-13', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'E', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'urgent', status: 'backlog', createdAt: addDays(today, -12) },
                { id: 'task-14', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'F', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'high', status: 'backlog', createdAt: addDays(today, -13) },
                { id: 'task-15', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'G', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'medium', status: 'backlog', createdAt: addDays(today, -14) },
                { id: 'task-16', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'H', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'low', status: 'backlog', createdAt: addDays(today, -15) },
                { id: 'task-18', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'Task in the middle of week', hours: 10, ownerId: 'joaozinho', startDate: addDays(startOfWeek, 1), endDate: addDays(startOfWeek, 3), priority: 'medium', status: 'backlog', createdAt: addDays(today, -16) },
                { id: 'task-19', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'Task ending this week', hours: 16, ownerId: 'pietrinho', startDate: addDays(startOfWeek, -2), endDate: addDays(startOfWeek, 2), priority: 'high', status: 'backlog', createdAt: addDays(today, -17) },
                { id: 'task-20', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'Task spanning the week', hours: 40, ownerId: 'robertinho', startDate: addDays(startOfWeek, -3), endDate: addDays(startOfWeek, 10), priority: 'low', status: 'backlog', createdAt: addDays(today, -18) },
                { id: 'task-21', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'Task starting this week', hours: 12, ownerId: 'joaozinho', startDate: addDays(startOfWeek, 4), endDate: addDays(startOfWeek, 8), priority: 'urgent', status: 'backlog', createdAt: addDays(today, -19) },
            ]
          }
      ]
  }
];