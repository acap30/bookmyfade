import type { IBarber } from "./barber";
import type { IService } from "./service";

export interface IAppointment {
  id: number;
  clientName: string;
  clientPhone: string;
  barber: IBarber;
  service: IService;
  date: string;
  startTime: string;
  endTime: string;
  canceled: boolean;
}
