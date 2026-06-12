import type { User } from "@/types";

// Password is only used in mock data for learning login.
// A real Express API will hash passwords and never return them.
export interface UserRecord extends User {
  password: string;
}

export const users: UserRecord[] = [
  {
    id: "user-1",
    name: "Marco Rossi",
    email: "marco@example.com",
    password: "password123",
  },
  {
    id: "user-2",
    name: "Giulia Bianchi",
    email: "giulia@example.com",
    password: "password123",
  },
];
