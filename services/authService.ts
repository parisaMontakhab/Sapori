import { users } from "@/data/users";
import type { User } from "@/types";

// TODO: Replace with POST /api/auth/login
export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  const user = users.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) return null;

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

// TODO: Replace with POST /api/auth/register
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User | null> {
  const exists = users.some((u) => u.email === email);
  if (exists) return null;

  const newUser: User = {
    id: `user-${users.length + 1}`,
    name,
    email,
  };

  users.push({ ...newUser, password });
  return newUser;
}

// TODO: Replace with GET /api/auth/me (JWT protected)
export async function getUserById(id: string): Promise<User | null> {
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  const { password: _password, ...safeUser } = user;
  return safeUser;
}
