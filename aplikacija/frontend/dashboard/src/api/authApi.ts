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
      fullName: `${response.data.first_name} ${response.data.last_name}`,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
      phoneNumber: response.data.phone_number,
    },
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};
