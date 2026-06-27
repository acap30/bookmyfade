import api from "./axios";
import { getBarberById } from "./barbersApi";

export const getAppointments = async (skip = 0, limit = 5) => {
  const { data: appointments } = await api.get(
    `/reservation/?skip=${skip}&limit=${limit}`,
  );
  const mappedAppointments = await Promise.all(
    appointments.data.map(async (appointment: any) => {
      const barber = await getBarberById(appointment.hairdresser.id);
      return {
        id: appointment.id,
        clientName: appointment.client_name,
        clientPhone: appointment.client_phone,
        barber: barber,
        service: {
          id: appointment.service.id,
          name: appointment.service.name,
          length: appointment.service.length_minutes,
        },
        date: appointment.res_date,
        startTime: appointment.start_time.slice(0, 5),
        endTime: appointment.end_time.slice(0, 5),
      };
    }),
  );

  return {
    list: mappedAppointments,
    total: appointments.total,
  };
};
