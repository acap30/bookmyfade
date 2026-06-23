import type { Role } from "../types/auth";
import type { IBarber } from "../types/barber";
import api from "./axios";

interface ICreateBarber {
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

export const getBarberById = async (id: string): Promise<IBarber> => {
  const { data: barber } = await api.get(`/hairdresser/${id}`);
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
    salon,
  };
};

export const getBarberIdByUserId = async (): Promise<number> => {
  const res = await api.get("/hairdresser/user/");
  return res.data.id;
};

export const createBarber = async (data: ICreateBarber) => {
  const { data: user } = await api.post("/users/", data.user);
  const { data: barber } = await api.post("/hairdresser/", {
    user_id: user.id,
    salon_id: data.salon_id,
  });
  return {
    user,
    barber,
  };
};

export const updateBarber = async (
  barber_id: number | string,
  user,
  salon_id: number,
) => {
  await api.put(`/users/${user.id}`, {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
  });
  await api.put(`/hairdresser/${barber_id}`, { salon_id });
};

export const deleteBarber = async (
  barber_id: number | string,
  user_id: number | string,
) => {
  await api.delete(`/hairdresser/${barber_id}`);
  await api.delete(`/users/${user_id}`);
};
