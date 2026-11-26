
import { apiRequest } from "./client";

// Task response from backend
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Create task request payload
export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
}

// Update task request payload
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dueDate?: string | null;
  completed?: boolean;
}

// Get all tasks
export async function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>("/tasks");
}

// Get single task
export async function getTask(id: number): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`);
}

// Create task
export async function createTask(
  payload: CreateTaskPayload,
): Promise<Task> {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Update task
export async function updateTask(
  id: number,
  payload: UpdateTaskPayload,
): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Delete task
export async function deleteTask(id: number): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
