import type { IDashboard } from "../types/dashboard";
import api from "./axios";

export const getDashboard = async (): Promise<IDashboard> => {
  const res = await api.get("/dashboard/");
  return res.data;
};
