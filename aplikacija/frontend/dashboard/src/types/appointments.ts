import type { IBarber } from "./barber";

export interface IAppointment {
  id: number;
  clientName: string;
  clientPhone: string;
  barber: IBarber;
  date: string;
  startTime: string;
  endTime: string;
}
