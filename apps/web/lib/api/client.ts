const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

interface ApiError {
  success: false;
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message || "Something went wrong",
    );
  }

  return result.data as T;
}
