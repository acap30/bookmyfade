import type { IService } from "../types/service";
import api from "./axios";

export const getSerivicesBySalonId = async (
  id: string,
): Promise<IService[]> => {
  const res = await api.get(`/service/salon/${id}`);
  return res.data.services;
};

export const addServiceWithSalonId = async (id, data: IService) => {
  const res = await api.post("/service", {
    salon_id: id,
    ...data,
  });
  return res;
};

export const deleteService = async (service_id) => {
  const res = await api.delete(`/service/${service_id}`);
  return res;
};
