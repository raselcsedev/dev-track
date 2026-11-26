
import { apiRequest } from "./client";

export type ProjectStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD";

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
  progress?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  progress?: number;
  startDate?: string | null;
  endDate?: string | null;
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/projects");
}

// Get a single project
export async function getProject(id: number): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`);
}

// Create project
export async function createProject(
  payload: CreateProjectPayload,
): Promise<Project> {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Update project
export async function updateProject(
  id: number,
  payload: UpdateProjectPayload,
): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Delete project
export async function deleteProject(id: number): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, {
    method: "DELETE",
  });
}
