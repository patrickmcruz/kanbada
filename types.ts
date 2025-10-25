

export type ViewLevel = 'Day' | 'Week' | 'Month';

export interface TeamMember {
  id: string;
  name: string;
}

// Explicit priority type
export type Priority = 'Urgente' | 'Alta' | 'Média' | 'Baixa';

// Interface for advanced filters
export interface Filters {
  responsibles: string[];
  priorities: Priority[];
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

// Demand type
export interface DemandWorkPackage extends WorkPackageBase {
  type: 'Demand';
  tasks: TaskWorkPackage[];
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
  phaseId?: string; // Optional as demands don't have phases
  projectId: string; // Keep for easier filtering
  hours: number;
  ownerId: string | null; // null for unassigned
  isDemand?: boolean; // For special styling
  priority?: Priority;
}

export type WorkPackage = ProjectWorkPackage | DemandWorkPackage | PhaseWorkPackage | TaskWorkPackage;


export interface DateColumn {
    startDate: Date;
    endDate: Date;
    label: string;
}