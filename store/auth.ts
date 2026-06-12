import type { User } from "@/types";

const AUTH_KEY = "sapori_user";

// Mock session stored in localStorage.
// Later replace this with a JWT stored in a cookie or localStorage.
export function getLoggedInUser(): User | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(AUTH_KEY);
  return data ? (JSON.parse(data) as User) : null;
}

export function saveLoggedInUser(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}
