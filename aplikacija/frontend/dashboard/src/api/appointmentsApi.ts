import api from "./axios";
import { getBarberById } from "./barbersApi";

export const getAppointments = async (
  skip = 0,
  limit = 5,
  filters: {
    clientName: string | null;
    barberId: number | null;
    salonId: number | null;
    canceled: boolean | number;
    dateFrom: string | null;
    dateTo: string | null;
  },
) => {
  const { data: appointments } = await api.get(
    `/reservation/?client_name=${filters.clientName}&hairdresser_id=${filters.barberId}&salon_id=${filters.salonId}${filters.dateFrom ? `&date_from=${filters.dateFrom}` : ""}${filters.dateTo ? `&date_to=${filters.dateTo}` : ""}${typeof filters.canceled === "boolean" ? `&canceled=${filters.canceled}` : ""}&skip=${skip}&limit=${limit}`,
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
          price: appointment.service.price,
        },
        date: appointment.res_date,
        startTime: appointment.start_time.slice(0, 5),
        endTime: appointment.end_time.slice(0, 5),
        canceled: appointment.canceled,
      };
    }),
  );

  return {
    list: mappedAppointments,
    total: appointments.total,
  };
};

export const cancelAppointment = async (id: number) => {
  const res = await api.put(`/reservation/cancel/${id}`);
  return res;
};
