
import { apiRequest } from "./client";

export type ProjectStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD";

export type MilestoneStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface Project {
  id: number;
  title: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  startDate: string | null;
  endDate: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Milestone {
  id: number;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  dueDate: string | null;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMilestonePayload {
  title: string;
  description?: string;
  status?: MilestoneStatus;
  dueDate?: string;
}

export interface UpdateMilestonePayload {
  title?: string;
  description?: string;
  status?: MilestoneStatus;
  dueDate?: string | null;
}

// Projects API

export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/projects");
}

export async function getProject(id: number): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`);
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<Project> {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(
  id: number,
  payload: UpdateProjectPayload,
): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: number): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, {
    method: "DELETE",
  });
}

// Milestones API

export async function getMilestones(
  projectId: number,
): Promise<Milestone[]> {
  return apiRequest<Milestone[]>(
    `/projects/${projectId}/milestones`,
  );
}

export async function createMilestone(
  projectId: number,
  payload: CreateMilestonePayload,
): Promise<Milestone> {
  return apiRequest<Milestone>(
    `/projects/${projectId}/milestones`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function updateMilestone(
  projectId: number,
  milestoneId: number,
  payload: UpdateMilestonePayload,
): Promise<Milestone> {
  return apiRequest<Milestone>(
    `/projects/${projectId}/milestones/${milestoneId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteMilestone(
  projectId: number,
  milestoneId: number,
): Promise<Milestone> {
  return apiRequest<Milestone>(
    `/projects/${projectId}/milestones/${milestoneId}`,
    {
      method: "DELETE",
    },
  );
}
