export type ViewLevel = 'Day' | 'Week' | 'Month';
export type AppView = 'Workload' | 'Kanban';
export type SortKey = 'priority' | 'title' | 'responsible' | 'startDate' | 'endDate' | 'createdAt';
export type ResponsibleSortOrder = 'asc' | 'desc';

export interface TeamMember {
  id: string;
  name: string;
}

// Represents the priority key
export type Priority = string;

export interface PriorityDefinition {
  key: string;
  name: string;
  color: string;
}

// Base interface for all work packages
interface WorkPackageBase {
  id:string;
  title: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
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
  status: string; // New field for Kanban status
}

export type WorkPackage = ProjectWorkPackage | DemandWorkPackage | PhaseWorkPackage | TaskWorkPackage;


export interface DateColumn {
    startDate: Date;
    endDate: Date;
    label: string;
}