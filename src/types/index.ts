/**
 * Defines the granularity of the timeline view in the Workload screen.
 * 'Day': Shows individual days (e.g., Mon, Tue, Wed).
 * 'Week': Shows weeks within a month.
 * 'Month': Shows months within a year.
 */
export type ViewLevel = 'Day' | 'Week' | 'Month';

/**
 * Defines the main application view being displayed.
 * 'Workload': The timeline/Gantt-style view.
 * 'Kanban': The column-based task board view.
 */
export type AppView = 'Workload' | 'Kanban';

/**
 * Defines the available keys for sorting tasks within a Kanban column.
 */
export type SortKey = 'priority' | 'title' | 'responsible' | 'startDate' | 'endDate' | 'createdAt';

/**
 * Defines the sort order for the 'Responsible' column in the Workload view.
 */
export type ResponsibleSortOrder = 'asc' | 'desc';

/**
 * Defines the preset configuration for a team, primarily affecting default Kanban columns.
 * 'analysts': Default profile for Analyst teams.
 * 'it': Default profile for Information Technology teams.
 */
export type TeamPreset = 'analysts' | 'it';

/**
 * Represents a team member in the application.
 */
export interface TeamMember {
  /** A unique identifier for the team member (e.g., 'joaozinho'). */
  id: string;
  /** The display name of the team member (e.g., 'Joãozinho'). */
  name: string;
}

/**
 * Represents the unique key for a priority level (e.g., 'urgent', 'high').
 */
export type Priority = string;

/**
 * Defines the properties of a priority level, including its display name and associated color.
 */
export interface PriorityDefinition {
  /** The unique key for the priority (e.g., 'high'). */
  key: string;
  /** The human-readable name of the priority (e.g., 'High'). */
  name: string;
  /** The hexadecimal color code associated with this priority (e.g., '#ef4444'). */
  color: string;
}

/**
 * Base interface for all work package types, containing common properties.
 */
interface WorkPackageBase {
  /** A unique identifier for the work package. */
  id:string;
  /** The display title of the work package. */
  title: string;
  /** The scheduled start date of the work package. */
  startDate: Date;
  /** The scheduled end date of the work package. */
  endDate: Date;
  /** The date when the work package was created. */
  createdAt: Date;
}

/**
 * Represents a high-level project container which consists of multiple phases.
 */
export interface ProjectWorkPackage extends WorkPackageBase {
  type: 'Project';
  /** An array of phases that belong to this project. */
  phases: PhaseWorkPackage[];
}

/**
 * Represents a high-level demand container which consists of multiple tasks.
 */
export interface DemandWorkPackage extends WorkPackageBase {
  type: 'Demand';
  /** An array of tasks that belong to this demand. */
  tasks: TaskWorkPackage[];
}

/**
 * Represents a phase within a project, which groups related tasks.
 */
export interface PhaseWorkPackage extends WorkPackageBase {
  type: 'Phase';
  /** The ID of the parent project. */
  projectId: string;
  /** An array of tasks that belong to this phase. */
  tasks: TaskWorkPackage[];
}

/**
 * Represents the most granular, schedulable item on the board (a task).
 */
export interface TaskWorkPackage extends WorkPackageBase {
  type: 'Task';
  /** The ID of the parent phase (optional, as tasks within Demands don't have a phase). */
  phaseId?: string;
  /** The ID of the parent project or demand for easy identification. */
  projectId: string;
  /** The estimated effort in hours. */
  hours: number;
  /** The ID of the team member assigned to this task. Can be null if unassigned. */
  ownerId: string | null;
  /** A flag to indicate if the task originates from a Demand for special styling. */
  isDemand?: boolean;
  /** The priority key associated with the task. */
  priority?: Priority;
  /** The current status of the task, corresponding to a Kanban column name. */
  status: string;
}

/**
 * A union type representing any possible type of work package in the system.
 */
export type WorkPackage = ProjectWorkPackage | DemandWorkPackage | PhaseWorkPackage | TaskWorkPackage;

/**
 * Represents a single column in the timeline view, defining its date range and display label.
 */
export interface DateColumn {
    /** The start date of the column. */
    startDate: Date;
    /** The end date of the column. */
    endDate: Date;
    /** The string label to be displayed in the column header. */
    label: string;
}
