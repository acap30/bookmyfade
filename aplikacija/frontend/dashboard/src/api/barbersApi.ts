import type { IBarber } from "../types/barber";
import api from "./axios";

export const getBarbers = async (): Promise<IBarber[]> => {
  const { data: barbers } = await api.get("/hairdresser");
  const mappedBarbers = await Promise.all(
    barbers.map(async (barber: any) => {
      const { data: user } = await api.get(`/users/${barber.user_id}`);

      const { data: salon } = await api.get(`/salon/${barber.salon_id}`);

      return {
        id: barber.id,

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

  return mappedBarbers;
};

export const deleteBarber = async (id: number) => {
  await api.delete(`/hairdresser/${id}`);
};
