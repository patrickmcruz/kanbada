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
    phases: [
      {
        id: 'phase-1-1',
        type: 'Phase',
        projectId: 'proj-1',
        title: 'Fase de Planejamento',
        startDate: firstMondayOfOctober,
        endDate: addDays(firstMondayOfOctober, 25),
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
            priority: 'Média',
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
            priority: 'Urgente',
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
            priority: 'Urgente',
          },
    ]
  },
  {
      id: 'proj-3',
      type: 'Project',
      title: 'Tarefas Gerais',
      startDate: startOfWeek,
      endDate: addDays(startOfWeek, 4),
      phases: [
          {
            id: 'phase-3-1',
            type: 'Phase',
            projectId: 'proj-3',
            title: 'Tarefas da Semana',
            startDate: startOfWeek,
            endDate: addDays(startOfWeek, 4),
            tasks: [
                { id: 'task-3', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'a - card1', hours: 8, ownerId: 'pietrinho', startDate: startOfWeek, endDate: startOfWeek, priority: 'Urgente' },
                { id: 'task-4', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'a - card90', hours: 8, ownerId: 'pietrinho', startDate: addDays(startOfWeek, 2), endDate: addDays(startOfWeek, 2), priority: 'Urgente' },
                { id: 'task-5', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'C - card3', hours: 4, ownerId: 'robertinho', startDate: startOfWeek, endDate: startOfWeek, priority: 'Alta' },
                { id: 'task-6', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'D - card4', hours: 4, ownerId: 'robertinho', startDate: startOfWeek, endDate: startOfWeek, priority: 'Alta' },
                { id: 'task-7', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'D', hours: 8, ownerId: 'robertinho', startDate: addDays(startOfWeek, 1), endDate: addDays(startOfWeek, 1), priority: 'Média' },
                { id: 'task-8', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'E', hours: 8, ownerId: 'robertinho', startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Baixa' },
                { id: 'task-9', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'E', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Urgente' },
                { id: 'task-10', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'F', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Alta' },
                { id: 'task-11', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'G', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Média' },
                { id: 'task-12', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'H', hours: 2, ownerId: null, startDate: startOfWeek, endDate: startOfWeek, priority: 'Baixa' },
                { id: 'task-13', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'E', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Urgente' },
                { id: 'task-14', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'F', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Alta' },
                { id: 'task-15', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'G', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Média' },
                { id: 'task-16', type: 'Task', phaseId: 'phase-3-1', projectId: 'Gerais', title: 'H', hours: 2, ownerId: null, startDate: addDays(startOfWeek, 3), endDate: addDays(startOfWeek, 4), priority: 'Baixa' },
            ]
          }
      ]
  }
];