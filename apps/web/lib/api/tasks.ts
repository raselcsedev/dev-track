
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

// Paginated task response
export interface TaskListResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Task query parameters
export interface GetTasksParams {
  search?: string;
  completed?: boolean;
  page?: number;
  limit?: number;
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

// Get tasks with search, filter and pagination
export async function getTasks(
  params: GetTasksParams = {},
): Promise<TaskListResponse> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.completed !== undefined) {
    query.set("completed", String(params.completed));
  }

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  const queryString = query.toString();

  return apiRequest<TaskListResponse>(
    queryString ? `/tasks?${queryString}` : "/tasks",
  );
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
