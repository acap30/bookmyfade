export interface IIncomePoint {
  date: string;
  income: number;
}

export interface IAppointmentPoint {
  date: string;
  appointments: number;
}

export interface IDashboard {
  todayAppointments: number;
  monthlyRevenue: number;
  activeBarbers: number;
  monthAppointments: number;

  incomeData: IIncomePoint[];
  appointmentData: IAppointmentPoint[];
}
