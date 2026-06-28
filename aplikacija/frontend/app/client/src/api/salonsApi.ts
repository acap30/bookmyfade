export type Salon = {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  mail: string;
  is_active: boolean;
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

export const getSalonServices = async (id: string) => {
  const response = await api.get(`/public/service/salon/${id}`);
  return response.data.services;
};
