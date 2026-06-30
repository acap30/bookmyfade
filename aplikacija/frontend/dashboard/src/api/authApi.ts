import api from "./axios";
import type { IAuthData, IUser } from "../types/auth";

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
      profileImage: response.data.image_url,
    },
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};

export const refresh = async () => {
  const response = await api.post("/refresh");
  return response.data.access_token;
};

export const updateProfile = async (newUser: IUser) => {
  const response = await api.put("/users/update/", {
    username: newUser.username,
    first_name: newUser.firstName,
    last_name: newUser.lastName,
    phone_number: newUser.phoneNumber,
    email: newUser.email,
  });

  return response;
};

export const changePassword = async (current: string, newPassword: string) => {
  const response = await api.put("/users/change-password/", {
    current: current,
    new: newPassword,
  });
  return response;
};

export const getUserById = async (user_id: number) => {
  const { data: user } = await api.get(`/users/${user_id}`);
  return {
    id: user.id,
    fullName: `${user.first_name} ${user.last_name}`,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email,
    role: user.role,
    phoneNumber: user.phone_number,
    profileImage: user.image_url,
  };
};

export const uploadProfileImage = async (formData: FormData) => {
  const response = await api.patch(`/users/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
