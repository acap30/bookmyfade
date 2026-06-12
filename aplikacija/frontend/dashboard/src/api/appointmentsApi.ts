import api from "./axios";
import { getBarberById } from "./barbersApi";

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();

export const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const getAppointments = async (skip = 0, limit = 5) => {
  const { data: appointments } = await api.get(
    `/reservation/?skip=${skip}&limit=${limit}`,
  );
  const mappedAppointments = await Promise.all(
    appointments.data.map(async (appointment: any) => {
      const barber = getBarberById(appointment.hs_id);
      return {
        id: appointment.id,
        clientName: appointment.client_name,
        clientPhone: appointment.client_phone,
        barber: barber,
        date: formatDate(appointment.start_time),
        startTime: formatTime(appointment.start_time),
        endTime: formatTime(appointment.end_time),
      };
    }),
  );

  return {
    list: mappedAppointments,
    total: appointments.total,
  };
};
