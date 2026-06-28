import type { IUser } from "./auth";
import type { ISalon } from "./salon";

export interface IBarber {
  id: number;
  user: IUser;
  salon: ISalon;
  isActive: boolean;
}
