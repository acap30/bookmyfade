import {
  Scissors,
  DollarSign,
  CalendarDays,
  UserCheck,
  Loader2,
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import { useEffect, useState } from "react";
import type { IDashboard } from "../types/dashboard";
import IncomeChart from "../components/ui/IncomeChart";
import AppointmentChart from "../components/ui/AppointmentChart";

const fakeDashboard: IDashboard = {
  todayAppointments: 14,
  monthlyRevenue: 12450,
  activeBarbers: 6,
  monthAppointments: 300,

  incomeData: [
    { date: "2026-06-01", income: 320 },
    { date: "2026-06-02", income: 450 },
    { date: "2026-06-03", income: 280 },
    { date: "2026-06-04", income: 510 },
    { date: "2026-06-05", income: 600 },
    { date: "2026-06-06", income: 390 },
    { date: "2026-06-07", income: 720 },
    { date: "2026-06-08", income: 480 },
    { date: "2026-06-09", income: 560 },
    { date: "2026-06-10", income: 630 },
    { date: "2026-06-11", income: null },
    { date: "2026-06-12", income: null },
    { date: "2026-06-13", income: null },
    { date: "2026-06-14", income: null },
    { date: "2026-06-15", income: null },
    { date: "2026-06-16", income: null },
    { date: "2026-06-17", income: null },
    { date: "2026-06-18", income: null },
    { date: "2026-06-19", income: null },
    { date: "2026-06-20", income: null },
    { date: "2026-06-21", income: null },
    { date: "2026-06-22", income: null },
    { date: "2026-06-23", income: null },
    { date: "2026-06-24", income: null },
    { date: "2026-06-25", income: null },
    { date: "2026-06-26", income: null },
    { date: "2026-06-27", income: null },
    { date: "2026-06-28", income: null },
    { date: "2026-06-29", income: null },
    { date: "2026-06-30", income: null },
  ],

  appointmentData: [
    { date: "2026-06-01", appointments: 8 },
    { date: "2026-06-02", appointments: 12 },
    { date: "2026-06-03", appointments: 7 },
    { date: "2026-06-04", appointments: 14 },
    { date: "2026-06-05", appointments: 16 },
    { date: "2026-06-06", appointments: 9 },
    { date: "2026-06-07", appointments: 18 },
    { date: "2026-06-08", appointments: 11 },
    { date: "2026-06-09", appointments: 13 },
    { date: "2026-06-10", appointments: 15 },
    { date: "2026-06-11", appointments: 12 },
    { date: "2026-06-12", appointments: 19 },
    { date: "2026-06-13", appointments: 10 },
    { date: "2026-06-14", appointments: 14 },
    { date: "2026-06-15", appointments: 17 },
    { date: "2026-06-16", appointments: 13 },
    { date: "2026-06-17", appointments: 18 },
    { date: "2026-06-18", appointments: 11 },
    { date: "2026-06-19", appointments: 20 },
    { date: "2026-06-20", appointments: 16 },
    { date: "2026-06-21", appointments: 9 },
    { date: "2026-06-22", appointments: null },
    { date: "2026-06-23", appointments: null },
    { date: "2026-06-24", appointments: null },
    { date: "2026-06-25", appointments: null },
    { date: "2026-06-26", appointments: null },
    { date: "2026-06-27", appointments: null },
    { date: "2026-06-28", appointments: null },
    { date: "2026-06-29", appointments: null },
    { date: "2026-06-30", appointments: null },
  ],
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<IDashboard | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      // const data = await getDashboard();
      setDashboard(fakeDashboard);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return loading ? (
    <div className="flex flex-col items-center justify-center py-12 text-muted">
      <Loader2 className="mb-3 animate-spin" size={40} />
      <p className="text-sm">Loading data...</p>
    </div>
  ) : (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Appointments Today"
          icon={CalendarDays}
          value={String(dashboard?.todayAppointments ?? 0)}
        />

        <StatCard
          label="Appointments This Month"
          icon={Scissors}
          value={String(dashboard?.monthAppointments ?? 0)}
        />

        <StatCard
          label="Revenue This Month"
          icon={DollarSign}
          value={`${dashboard?.monthlyRevenue ?? 0} RSD`}
        />

        <StatCard
          label="Active Barbers"
          icon={UserCheck}
          value={String(dashboard?.activeBarbers ?? 0)}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6">
        <IncomeChart incomeData={dashboard.incomeData} />
        <AppointmentChart appointmentData={dashboard.appointmentData} />
      </div>
    </div>
  );
};

export default Dashboard;
