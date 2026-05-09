import api from "./axios";
import type { IAuthData } from "../types/auth";

export const signIn = async (
  email: string,
  password: string,
): Promise<IAuthData> => {
  const response = await api.post("/login", {
    email,
    password,
  });

  return response.data;
};
