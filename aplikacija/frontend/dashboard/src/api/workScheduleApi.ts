import type { IWorkSchedule } from "../types/workSchedule";
import api from "./axios";

const mapDay = (day: { start: string; end: string; off: boolean }) => ({
  from: day.start.slice(0, 5),
  to: day.end.slice(0, 5),
  off: day.off,
});

export const getWorkSchedule = async (
  hairdresserId: number | string,
): Promise<IWorkSchedule> => {
  const response = await api.get(`/workhours/week/${hairdresserId}`);

  const data = response.data;

  return {
    monday: mapDay(data.monday),
    tuesday: mapDay(data.tuesday),
    wednesday: mapDay(data.wednesday),
    thursday: mapDay(data.thursday),
    friday: mapDay(data.friday),
    saturday: mapDay(data.saturday),
    sunday: mapDay(data.sunday),
  };
};

export const updateWorkSchedule = async (
  barber_id: number | string,
  data: IWorkSchedule,
) => {};

export const createWorkSchedule = async (
  hairdresserId: number | string,
  schedule: IWorkSchedule,
) => {
  const payload = {
    hairdresser_id: hairdresserId,
    monday: {
      start: schedule.monday.from,
      end: schedule.monday.to,
      off: schedule.monday.off,
    },
    tuesday: {
      start: schedule.tuesday.from,
      end: schedule.tuesday.to,
      off: schedule.tuesday.off,
    },
    wednesday: {
      start: schedule.wednesday.from,
      end: schedule.wednesday.to,
      off: schedule.wednesday.off,
    },
    thursday: {
      start: schedule.thursday.from,
      end: schedule.thursday.to,
      off: schedule.thursday.off,
    },
    friday: {
      start: schedule.friday.from,
      end: schedule.friday.to,
      off: schedule.friday.off,
    },
    saturday: {
      start: schedule.saturday.from,
      end: schedule.saturday.to,
      off: schedule.saturday.off,
    },
    sunday: {
      start: schedule.sunday.from,
      end: schedule.sunday.to,
      off: schedule.sunday.off,
    },
  };
  const response = await api.post("/workhours/week/", payload);
  return response.data;
};
