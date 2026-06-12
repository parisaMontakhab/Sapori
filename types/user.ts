import type { Address } from "./address";

export type UserRole = "customer" | "restaurant_owner" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Address;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
