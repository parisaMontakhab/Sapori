import { getAuthToken } from "@/store/auth";

const SERVER_API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sapori-backend.onrender.com/api/v1";

const CLIENT_API_URL = "/api/v1";
const REQUEST_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiErrorBody {
  message?: string;
}

function getApiUrl(): string {
  if (typeof window === "undefined") {
    return SERVER_API_URL;
  }

  return CLIENT_API_URL;
}

function buildHeaders(options?: RequestInit): Headers {
  const headers = new Headers(options?.headers);
  const isFormData = options?.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      ...options,
      headers: buildHeaders(options),
      signal: options?.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError("The request timed out. Please try again.", 408);
    }

    throw error;
  }

  if (!response.ok) {
    let message = `API error: ${response.status}`;

    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.message) {
        message = body.message;
      }
    } catch {
      // Response body is not JSON.
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
