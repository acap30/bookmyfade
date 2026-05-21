import type { ISalon } from "../types/salon";
import api from "./axios";

export const getSalons = async (): Promise<ISalon[]> => {
  const response = await api.get("/salon");
  return response.data;
};

export const deleteSalon = async (id: number) => {
  await api.delete(`/salon/${id}`);
};
