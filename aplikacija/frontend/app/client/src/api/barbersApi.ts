import api from "./axios";

export type Barber = {
  id: number;
  user_id?: number;
  salon_id?: number;
  first_name?: string;
  last_name?: string;
  title?: string;
};

export const getBarbers = async (): Promise<Barber[]> => {
  const response = await api.get("/public/hairdresser/");
  return response.data;
};

export const getSalonBarbers = async (id: string) => {
  const response = await api.get(`/public/hairdresser/salon/${id}`);
  return response.data;
};

export const getBarberById = async (id: string): Promise<Barber> => {
  const response = await api.get(`/public/hairdresser/${id}`);
  return response.data;
};
