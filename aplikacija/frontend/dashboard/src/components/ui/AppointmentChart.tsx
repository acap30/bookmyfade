import { ResponsiveBar } from "@nivo/bar";
import type { IAppointmentPoint } from "../../types/dashboard";
import { useEffect, useState } from "react";

type ChartProps = {
  appointmentData: IAppointmentPoint[];
};

const AppointmentChart = ({ appointmentData }: ChartProps) => {
  const formattedData = appointmentData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    appointments: d.appointments,
  }));

  const [isMobile, setIsMobile] = useState(false);
  const breakpoint = 768;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  const visibleData = isMobile
    ? formattedData.filter((_, i) => i % 2 === 0)
    : formattedData;
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Appointmnents</h2>
          <p className="text-sm text-muted">Daily activity this month</p>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveBar
          data={visibleData}
          keys={["appointments"]}
          indexBy="date"
          margin={{ top: 20, right: 20, bottom: 60, left: isMobile ? 30 : 50 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={["#3b82f6"]}
          borderRadius={8}
          axisBottom={{
            tickRotation: isMobile ? -60 : -45,
            tickSize: 0,
            tickPadding: 10,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
          }}
          enableGridY={false}
          enableLabel={false}
          gridYValues={5}
          animate={true}
        />
      </div>
    </div>
  );
};

export default AppointmentChart;
