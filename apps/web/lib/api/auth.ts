import { apiRequest } from "./client";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}

export type LoginResponse = AuthResponse;

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}
