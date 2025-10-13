
export type ViewLevel = 'Day' | 'Week' | 'Month';

export interface TeamMember {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  hours: number;
  ownerId: string | null; // null for unassigned
  startDate: Date;
  endDate: Date;
  isDemand?: boolean; // For special styling
}

export interface DateColumn {
    startDate: Date;
    endDate: Date;
    label: string;
}
