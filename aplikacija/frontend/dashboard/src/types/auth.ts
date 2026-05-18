export const ROLES = {
  ADMIN: "admin",
  OWNER: "owner",
  BARBER: "hairstylist",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface IUser {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role;
  phoneNumber: string | null;
}

export interface IAuthData {
  user: IUser;
  token: string;
  refreshToken: string;
}
