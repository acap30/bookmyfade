import api from "./axios";
import type { IAuthData } from "../types/auth";

export const signIn = async (
  username: string,
  password: string,
): Promise<IAuthData> => {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return {
    user: {
      id: response.data.id,
      name: "Jovan Tomic",
      username: response.data.username,
      email: "jovan@example.com",
      role: "admin",
    },
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};
