import { apiFetch } from "@/lib/api";
import { mapUser, type BackendUser } from "@/lib/mappers";
import { saveAuthSession, saveLoggedInUser } from "@/store/auth";
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

interface UpdateMeResponse {
  status: string;
  data: {
    user: BackendUser;
  };
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  photo?: File;
}

export interface ResetPasswordInput {
  password: string;
  passwordConfirm: string;
}

export interface UpdatePasswordInput {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}

interface MessageResponse {
  status: string;
  message: string;
}

function persistAuthResponse(response: AuthResponse): User {
  const user = mapUser(response.data.user);
  saveAuthSession({ token: response.token, user });
  return user;
}

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const response = await apiFetch<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return persistAuthResponse(response);
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

  return persistAuthResponse(response);
}

export async function forgotPassword(email: string): Promise<string> {
  const response = await apiFetch<MessageResponse>("/users/forgotPassword", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  return response.message;
}

export async function resetPassword(
  token: string,
  input: ResetPasswordInput,
): Promise<User> {
  const response = await apiFetch<AuthResponse>(
    `/users/resetPassword/${token}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  return persistAuthResponse(response);
}

export async function updatePassword(input: UpdatePasswordInput): Promise<User> {
  const response = await apiFetch<AuthResponse>("/users/updateMyPassword", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return persistAuthResponse(response);
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

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("email", input.email);

  if (input.photo) {
    formData.append("photo", input.photo);
  }

  const response = await apiFetch<UpdateMeResponse>("/users/updateMe", {
    method: "PATCH",
    body: formData,
  });

  const user = mapUser(response.data.user);
  saveLoggedInUser(user);
  return user;
}
