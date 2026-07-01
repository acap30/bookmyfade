import type { IDashboard } from "../types/dashboard";
import api from "./axios";

export const getDashboard = async (
  monthIncome: number,
  yearIncome: number,
  monthAppointment: number,
  yearAppointment: number,
): Promise<IDashboard> => {
  const res = await api.get("/dashboard/");
  return res.data;
};
