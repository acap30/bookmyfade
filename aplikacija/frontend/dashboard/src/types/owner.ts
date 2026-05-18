import type { IUser } from "./auth";
import type { ISalon } from "./salon";

export interface IOwner {
  id: number;
  user: IUser;
  salon: ISalon;
}
