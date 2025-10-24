

export type ViewLevel = 'Day' | 'Week' | 'Month';

export interface TeamMember {
  id: string;
  name: string;
}

// Base interface for all work packages
interface WorkPackageBase {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

// Project type
export interface ProjectWorkPackage extends WorkPackageBase {
  type: 'Project';
  phases: PhaseWorkPackage[];
}

// Phase type
export interface PhaseWorkPackage extends WorkPackageBase {
  type: 'Phase';
  projectId: string;
  tasks: TaskWorkPackage[];
}

// Task type (the schedulable item on the board)
export interface TaskWorkPackage extends WorkPackageBase {
  type: 'Task';
  phaseId: string;
  projectId: string; // Keep for easier filtering
  hours: number;
  ownerId: string | null; // null for unassigned
  isDemand?: boolean; // For special styling
  priority?: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
}

export type WorkPackage = ProjectWorkPackage | PhaseWorkPackage | TaskWorkPackage;


export interface DateColumn {
    startDate: Date;
    endDate: Date;
    label: string;
}
