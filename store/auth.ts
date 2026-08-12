import type { User } from "@/types";

const AUTH_KEY = "sapori_auth";

export interface AuthSession {
  user: User;
  token: string;
}

function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as AuthSession;
  } catch {
    return null;
  }
}

function writeSession(session: AuthSession | null): void {
  if (typeof window === "undefined") return;

  if (session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getAuthSession(): AuthSession | null {
  return readSession();
}

export function getAuthToken(): string | null {
  return readSession()?.token ?? null;
}

export function saveAuthSession(session: AuthSession): void {
  writeSession(session);
}

export function getLoggedInUser(): User | null {
  return readSession()?.user ?? null;
}

/** Keeps an existing token when UI layers update the stored user only. */
export function saveLoggedInUser(user: User): void {
  const existing = readSession();

  writeSession({
    user,
    token: existing?.token ?? "",
  });
}

export function logout(): void {
  writeSession(null);
}
