import type { IScheduleOverride, IWorkSchedule } from "../types/workSchedule";
import api from "./axios";

const mapDay = (day: { start: string; end: string; off: boolean }) => ({
  from: day.start?.slice(0, 5),
  to: day.end?.slice(0, 5),
  off: day.off,
});

const toBackendTime = (time: string) => `${time}:00.000Z`;

export const getWorkSchedule = async (
  hairdresserId: number | string,
): Promise<IWorkSchedule> => {
  const response = await api.get(
    `/workhours/hairdresser/{id}?hd_id=${hairdresserId}`,
  );

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

// export const getSalonSchedule = async (
//   salon_id: number | string,
// ): Promise<IWorkSchedule> => {
//   const response = await api.get(
//     `/workhours/hairdresser/{id}?hd_id=${salon_id}`,
//   );

//   const data = response.data;

//   return {
//     monday: mapDay(data.monday),
//     tuesday: mapDay(data.tuesday),
//     wednesday: mapDay(data.wednesday),
//     thursday: mapDay(data.thursday),
//     friday: mapDay(data.friday),
//     saturday: mapDay(data.saturday),
//     sunday: mapDay(data.sunday),
//   };
// };

export const updateWorkSchedule = async (
  barber_id: number | string,
  schedule: IWorkSchedule,
) => {
  const payload = {
    monday: {
      start: !schedule.monday.off ? toBackendTime(schedule.monday.from) : null,
      end: !schedule.monday.off ? toBackendTime(schedule.monday.to) : null,
      off: schedule.monday.off,
    },
    tuesday: {
      start: !schedule.tuesday.off
        ? toBackendTime(schedule.tuesday.from)
        : null,
      end: !schedule.tuesday.off ? toBackendTime(schedule.tuesday.to) : null,
      off: schedule.tuesday.off,
    },
    wednesday: {
      start: !schedule.wednesday.off
        ? toBackendTime(schedule.wednesday.from)
        : null,
      end: !schedule.wednesday.off
        ? toBackendTime(schedule.wednesday.to)
        : null,
      off: schedule.wednesday.off,
    },
    thursday: {
      start: !schedule.thursday.off
        ? toBackendTime(schedule.thursday.from)
        : null,
      end: !schedule.thursday.off ? toBackendTime(schedule.thursday.to) : null,
      off: schedule.thursday.off,
    },
    friday: {
      start: !schedule.friday.off ? toBackendTime(schedule.friday.from) : null,
      end: !schedule.friday.off ? toBackendTime(schedule.friday.to) : null,
      off: schedule.friday.off,
    },
    saturday: {
      start: !schedule.saturday.off
        ? toBackendTime(schedule.saturday.from)
        : null,
      end: !schedule.saturday.off ? toBackendTime(schedule.saturday.to) : null,
      off: schedule.saturday.off,
    },
    sunday: {
      start: !schedule.sunday.off ? toBackendTime(schedule.sunday.from) : null,
      end: !schedule.sunday.off ? toBackendTime(schedule.sunday.to) : null,
      off: schedule.sunday.off,
    },
  };
  const response = await api.put(
    `/workhours/hairdresser/{id}?hd_id=${barber_id}`,
    payload,
  );

  return response.data;
};

// export const createWorkSchedule = async (
//   hairdresserId: number | string,
//   schedule: IWorkSchedule,
// ) => {
//   const payload = {
//     hairdresser_id: hairdresserId,
//     monday: {
//       start: !schedule.monday.off ? toBackendTime(schedule.monday.from) : null,
//       end: !schedule.monday.off ? toBackendTime(schedule.monday.to) : null,
//       off: schedule.monday.off,
//     },
//     tuesday: {
//       start: !schedule.tuesday.off
//         ? toBackendTime(schedule.tuesday.from)
//         : null,
//       end: !schedule.tuesday.off ? toBackendTime(schedule.tuesday.to) : null,
//       off: schedule.tuesday.off,
//     },
//     wednesday: {
//       start: !schedule.wednesday.off
//         ? toBackendTime(schedule.wednesday.from)
//         : null,
//       end: !schedule.wednesday.off
//         ? toBackendTime(schedule.wednesday.to)
//         : null,
//       off: schedule.wednesday.off,
//     },
//     thursday: {
//       start: !schedule.thursday.off
//         ? toBackendTime(schedule.thursday.from)
//         : null,
//       end: !schedule.thursday.off ? toBackendTime(schedule.thursday.to) : null,
//       off: schedule.thursday.off,
//     },
//     friday: {
//       start: !schedule.friday.off ? toBackendTime(schedule.friday.from) : null,
//       end: !schedule.friday.off ? toBackendTime(schedule.friday.to) : null,
//       off: schedule.friday.off,
//     },
//     saturday: {
//       start: !schedule.saturday.off
//         ? toBackendTime(schedule.saturday.from)
//         : null,
//       end: !schedule.saturday.off ? toBackendTime(schedule.saturday.to) : null,
//       off: schedule.saturday.off,
//     },
//     sunday: {
//       start: !schedule.sunday.off ? toBackendTime(schedule.sunday.from) : null,
//       end: !schedule.sunday.off ? toBackendTime(schedule.sunday.to) : null,
//       off: schedule.sunday.off,
//     },
//   };
//   const response = await api.post("/workhours/week/", payload);
//   return response.data;
// };

export const updateSalonSchedule = async (
  id: number | string,
  schedule: IWorkSchedule,
) => {
  const payload = {
    monday: {
      start: !schedule.monday.off ? toBackendTime(schedule.monday.from) : null,
      end: !schedule.monday.off ? toBackendTime(schedule.monday.to) : null,
      off: schedule.monday.off,
    },
    tuesday: {
      start: !schedule.tuesday.off
        ? toBackendTime(schedule.tuesday.from)
        : null,
      end: !schedule.tuesday.off ? toBackendTime(schedule.tuesday.to) : null,
      off: schedule.tuesday.off,
    },
    wednesday: {
      start: !schedule.wednesday.off
        ? toBackendTime(schedule.wednesday.from)
        : null,
      end: !schedule.wednesday.off
        ? toBackendTime(schedule.wednesday.to)
        : null,
      off: schedule.wednesday.off,
    },
    thursday: {
      start: !schedule.thursday.off
        ? toBackendTime(schedule.thursday.from)
        : null,
      end: !schedule.thursday.off ? toBackendTime(schedule.thursday.to) : null,
      off: schedule.thursday.off,
    },
    friday: {
      start: !schedule.friday.off ? toBackendTime(schedule.friday.from) : null,
      end: !schedule.friday.off ? toBackendTime(schedule.friday.to) : null,
      off: schedule.friday.off,
    },
    saturday: {
      start: !schedule.saturday.off
        ? toBackendTime(schedule.saturday.from)
        : null,
      end: !schedule.saturday.off ? toBackendTime(schedule.saturday.to) : null,
      off: schedule.saturday.off,
    },
    sunday: {
      start: !schedule.sunday.off ? toBackendTime(schedule.sunday.from) : null,
      end: !schedule.sunday.off ? toBackendTime(schedule.sunday.to) : null,
      off: schedule.sunday.off,
    },
  };
  const response = await api.put(`/salon/working_hours/${id}`, payload);

  return response.data;
};

// export const createSalonSchedule = async (
//   id: number | string,
//   schedule: IWorkSchedule,
// ) => {
//   const payload = {
//     salon_id: id,
//     monday: {
//       start: !schedule.monday.off ? toBackendTime(schedule.monday.from) : null,
//       end: !schedule.monday.off ? toBackendTime(schedule.monday.to) : null,
//       off: schedule.monday.off,
//     },
//     tuesday: {
//       start: !schedule.tuesday.off
//         ? toBackendTime(schedule.tuesday.from)
//         : null,
//       end: !schedule.tuesday.off ? toBackendTime(schedule.tuesday.to) : null,
//       off: schedule.tuesday.off,
//     },
//     wednesday: {
//       start: !schedule.wednesday.off
//         ? toBackendTime(schedule.wednesday.from)
//         : null,
//       end: !schedule.wednesday.off
//         ? toBackendTime(schedule.wednesday.to)
//         : null,
//       off: schedule.wednesday.off,
//     },
//     thursday: {
//       start: !schedule.thursday.off
//         ? toBackendTime(schedule.thursday.from)
//         : null,
//       end: !schedule.thursday.off ? toBackendTime(schedule.thursday.to) : null,
//       off: schedule.thursday.off,
//     },
//     friday: {
//       start: !schedule.friday.off ? toBackendTime(schedule.friday.from) : null,
//       end: !schedule.friday.off ? toBackendTime(schedule.friday.to) : null,
//       off: schedule.friday.off,
//     },
//     saturday: {
//       start: !schedule.saturday.off
//         ? toBackendTime(schedule.saturday.from)
//         : null,
//       end: !schedule.saturday.off ? toBackendTime(schedule.saturday.to) : null,
//       off: schedule.saturday.off,
//     },
//     sunday: {
//       start: !schedule.sunday.off ? toBackendTime(schedule.sunday.from) : null,
//       end: !schedule.sunday.off ? toBackendTime(schedule.sunday.to) : null,
//       off: schedule.sunday.off,
//     },
//   };
//   const response = await api.post("/salon/working_hours/", payload);
//   return response.data;
// };

export const getOverrides = async (hairdresserId: number | string) => {
  try {
    const res = await api.get(
      `/workhours/exceptions/hairdresser/{id}?hd_id=${hairdresserId}`,
    );

    const mappedOverrides = await Promise.all(
      res.data.exceptions.map((exception: any) => {
        return {
          id: exception.id,
          date: exception.date,
          from: exception.start?.slice(0, 5),
          to: exception.end?.slice(0, 5),
          off: exception.day_off,
        };
      }),
    );
    return mappedOverrides;
  } catch (error) {
    return [];
  }
};

export const createOverride = async (
  hairdresserId: number | string,
  override: IScheduleOverride,
) => {
  const payload = {
    hairdresser_id: hairdresserId,
    date: override.date,
    start: override.from,
    end: override.to,
    day_off: override.off,
    detail: null,
  };
  const response = await api.post("/workhours/exceptions/", payload);
  return response.data;
};

export const updateOverride = async (
  override_id: number,
  data: IScheduleOverride,
) => {
  const payload = {
    start: data.from,
    end: data.to,
    day_off: data.off,
    detail: null,
  };
  const response = await api.put(
    `/workhours/exceptions/{exception_id}?id=${override_id}`,
    payload,
  );

  return response;
};

export const deleteOverride = async (override_id: number | string) => {
  const res = await api.delete(`/workhours/exceptions/${override_id}`);
  return res;
};

export const createDaysOff = async (barber_id, data) => {
  const payload = {
    hairdresser_id: barber_id,
    start: data.from,
    end: data.to,
    detail: data.reason,
  };

  const res = await api.post("/workhours/exceptions/off/", payload);

  return res.data;
};

export const getDaysOff = async (barber_id: number | string) => {
  const res = await api.get(
    `/workhours/exceptions/hairdresser/{id}/off?hd_id=${barber_id}`,
  );
  return res?.data?.days ?? [];
};
