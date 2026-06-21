import type { IService } from "../types/service";
import api from "./axios";

export const getSerivicesBySalonId = async (
  id: string | number,
): Promise<IService[]> => {
  const res = await api.get(`/service/salon/${id}`);
  return res.data.services;
};

export const getServicesByBarberId = async (
  id: string | number,
): Promise<IService[]> => {
  const res = await api.get(
    `/service/hairdresser/{hairdresser_id}?hd_id=${id}`,
  );
  return res.data.services;
};

export const addServiceWithSalonId = async (id, data: IService) => {
  const res = await api.post("/service", {
    salon_id: id,
    ...data,
  });
  return res;
};

export const linkServiceToBarber = async (
  barber_id,
  service_id,
  price: number,
) => {
  const res = await api.post(`/service/link/${barber_id}/${service_id}`, {
    price,
  });
  return res;
};

export const deleteService = async (service_id) => {
  const res = await api.delete(`/service/${service_id}`);
  return res;
};

export const unlinkServiceFromBarber = async (service_id, barber_id) => {
  const res = await api.delete(`/service/link/${barber_id}/${service_id}`);
  return res;
};

export const updateServiceToBarber = async (service_id, barber_id, price) => {
  const res = await api.put(`/service/link/${barber_id}/${service_id}`, {
    price,
  });
  return res;
};

export const updateService = async (service_id, service) => {
  const res = await api.put(`/service/${service_id}`, {
    name: service.name,
    length: service.length,
  });
  return res;
};
