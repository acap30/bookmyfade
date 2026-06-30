import type { Role } from "../types/auth";
import type { IOwner } from "../types/owner";
import api from "./axios";

interface ICreateOwner {
  user: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string | null;
    role: Role;
  };
  salon_id: number;
}

const baseUrl = import.meta.env.VITE_API_URL;

export const getOwners = async (): Promise<IOwner[]> => {
  const { data: owners } = await api.get("/owner");
  const mappedOwners = await Promise.all(
    owners.map(async (owner: any) => {
      const { data: user } = await api.get(`/users/${owner.user_id}`);

      const { data: salon } = await api.get(`/salon/${owner.salon_id}`);

      return {
        id: owner.id,

        user: {
          id: user.id,
          fullName: `${user.first_name} ${user.last_name}`,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          email: user.email,
          role: user.role,
          phoneNumber: user.phone_number,
          profileImage: user.image_url ? `${baseUrl}${user.image_url}` : null,
        },

        salon: salon,
        isActive: owner.is_active,
      };
    }),
  );

  return mappedOwners;
};

export const createOwner = async (data: ICreateOwner) => {
  const { data: user } = await api.post("/users/", data.user);
  const { data: owner } = await api.post("/owner/", {
    user_id: user.id,
    salon_id: data.salon_id,
  });
  return {
    user,
    owner,
  };
};

export const updateOwner = async (user) => {
  await api.put(`/users/${user.id}`, {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
  });
};

export const changeOwnerActivity = async (
  owner_id: number,
  isActive: boolean,
) => {
  if (isActive) {
    const res = await api.put(`/owner/deactivate/${owner_id}`);
    return res.data;
  }

  const res = await api.put(`/owner/activate/${owner_id}`);
  return res.data;
};

export const deleteOwner = async (
  owner_id: number | string,
  user_id: number | string,
) => {
  await api.delete(`/owner/${owner_id}`);
  await api.delete(`/users/${user_id}`);
};
