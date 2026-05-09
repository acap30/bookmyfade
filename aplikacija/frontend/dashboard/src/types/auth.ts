export const ROLES = {
  ADMIN: "admin",
  VLASNIK: "vlasnik",
  FRIZER: "frizer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface IAuthData {
  user: IUser;
  token: string;
  refreshToken: string;
}
