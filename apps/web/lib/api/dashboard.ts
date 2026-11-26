
import { apiRequest } from "./client";

export interface DashboardOverview {
  goals: {
    total: number;
    completed: number;
    pending: number;
  };

  tasks: {
    total: number;
    completed: number;
    pending: number;
  };

  projects: {
    total: number;
    completed: number;
    averageProgress: number;
  };

  recentTasks: {
    id: number;
    title: string;
    completed: boolean;
    dueDate: string | null;
  }[];

  recentProjects: {
    id: number;
    title: string;
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
    progress: number;
  }[];
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return apiRequest<DashboardOverview>("/dashboard/overview");
}
