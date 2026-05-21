import type { IOwner } from "../types/owner";
import api from "./axios";

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
        },

        salon: salon,
      };
    }),
  );

  return mappedOwners;
};

export const deleteOwner = async (id: number) => {
  await api.delete(`/owner/${id}`);
};
