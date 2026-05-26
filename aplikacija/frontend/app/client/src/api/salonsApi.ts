export type Salon = {
  id: number;
  name: string;
  address?: string;
  phone?: string;
};

import api from "./axios";

export const getSalons = async (): Promise<Salon[]> => {
  const response = await api.get("/public/salon/");
  return response.data;
};

export const getSalonById = async (id: string): Promise<Salon> => {
  const response = await api.get(`/public/salon/${id}`);
  return response.data;
};