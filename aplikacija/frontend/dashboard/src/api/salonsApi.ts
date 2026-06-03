import type { ISalon } from "../types/salon";
import api from "./axios";

export const getSalons = async (): Promise<ISalon[]> => {
  const response = await api.get("/salon");
  return response.data;
};

export const getSalonById = async (id: string): Promise<ISalon> => {
  const response = await api.get(`/salon/${id}`);
  return response.data;
};

export const getMySalon = async (): Promise<ISalon> => {
  const response = await api.get("/salon");
  return response.data;
};

export const deleteSalon = async (id: number) => {
  await api.delete(`/salon/${id}`);
};

export const addSalon = async (data: ISalon) => {
  const res = await api.post("/salon/", data);
  return res;
};

export const updateSalon = async (id: number, data: Omit<ISalon, "id">) => {
  await api.put(`/salon/${id}`, data);
};
