export const ROLES = {
  ADMIN: "admin",
  VLASNIK: "vlasnik",
  FRIZER: "frizer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export type AuthUser = Pick<IUser, "id" | "username">;

export interface IAuthData {
  user: AuthUser;
  token: string;
  refreshToken: string;
}
