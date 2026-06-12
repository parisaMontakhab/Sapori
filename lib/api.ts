const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

// Simple fetch helper for when you connect the Express backend.
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
