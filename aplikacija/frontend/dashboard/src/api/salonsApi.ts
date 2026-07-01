import type { ISalon } from "../types/salon";
import api from "./axios";

const mapDay = (day: { start: string; end: string; off: boolean }) => ({
  from: day.start?.slice(0, 5),
  to: day.end?.slice(0, 5),
  off: day.off,
});

export const getSalons = async (): Promise<ISalon[]> => {
  const response = await api.get("/salon");
  return response.data;
};

export const getSalonById = async (id: string) => {
  const response = await api.get(`/salon/${id}`);
  const data = response.data;

  return {
    ...data,
    wh: {
      monday: mapDay(data.wh.monday),
      tuesday: mapDay(data.wh.tuesday),
      wednesday: mapDay(data.wh.wednesday),
      thursday: mapDay(data.wh.thursday),
      friday: mapDay(data.wh.friday),
      saturday: mapDay(data.wh.saturday),
      sunday: mapDay(data.wh.sunday),
    },
  };
};

export const getMySalon = async () => {
  const response = await api.get("/salon");
  const data = response.data;

  return {
    ...data,
    wh: {
      monday: mapDay(data.wh.monday),
      tuesday: mapDay(data.wh.tuesday),
      wednesday: mapDay(data.wh.wednesday),
      thursday: mapDay(data.wh.thursday),
      friday: mapDay(data.wh.friday),
      saturday: mapDay(data.wh.saturday),
      sunday: mapDay(data.wh.sunday),
    },
  };
};

export const getMySalonId = async () => {
  const response = await api.get("/salon");

  return response.data.id;
};

export const deleteSalon = async (id: number) => {
  await api.delete(`/salon/${id}`);
};

export const addSalon = async (data: ISalon) => {
  const res = await api.post("/salon/", data);
  return res;
};

export const changeSalonActivity = async (
  salon_id: number,
  isActive: boolean,
) => {
  if (isActive) {
    const res = await api.put(`/salon/deactivate/${salon_id}`);
    return res.data;
  }

  const res = await api.put(`/salon/activate/${salon_id}`);
  return res.data;
};

export const updateSalon = async (id: number, data: Omit<ISalon, "id">) => {
  await api.put(`/salon/${id}`, data);
};

export const uploadSalonImage = async (
  salon_id: number,
  formData: FormData,
) => {
  const response = await api.patch(
    `/salon/${salon_id}/upload-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
