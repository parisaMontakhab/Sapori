import { apiFetch } from "@/lib/api";
import { mapUser, type BackendUser } from "@/lib/mappers";
import { saveAuthSession } from "@/store/auth";
import type { User } from "@/types";

interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: BackendUser;
  };
}

interface CurrentUserResponse {
  status: string;
  data: {
    data: BackendUser;
  };
}

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const response = await apiFetch<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const user = mapUser(response.data.user);
  saveAuthSession({ token: response.token, user });
  return user;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const response = await apiFetch<AuthResponse>("/users/signup", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      passwordConfirm: password,
    }),
  });

  const user = mapUser(response.data.user);
  saveAuthSession({ token: response.token, user });
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  void id;

  try {
    const response = await apiFetch<CurrentUserResponse>("/users/me");
    return mapUser(response.data.data);
  } catch {
    return null;
  }
}
