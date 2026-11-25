
import { apiRequest } from "./client";

export interface Goal {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface GoalsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GoalsResponse {
  data: Goal[];
  meta: GoalsMeta;
}

export interface GetGoalsParams {
  search?: string;
  completed?: boolean;
  page?: number;
  limit?: number;
}

export async function getGoals(
  params: GetGoalsParams = {},
): Promise<GoalsResponse> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
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

  return apiRequest<GoalsResponse>(
    `/goals${queryString ? `?${queryString}` : ""}`,
  );
}

export async function getGoal(id: number): Promise<Goal> {
  return apiRequest<Goal>(`/goals/${id}`);
}

export async function createGoal(
  payload: CreateGoalPayload,
): Promise<Goal> {
  return apiRequest<Goal>("/goals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateGoal(
  id: number,
  payload: UpdateGoalPayload,
): Promise<Goal> {
  return apiRequest<Goal>(`/goals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteGoal(
  id: number,
): Promise<{ message: string; data: Goal }> {
  return apiRequest<{ message: string; data: Goal }>(
    `/goals/${id}`,
    {
      method: "DELETE",
    },
  );
}
