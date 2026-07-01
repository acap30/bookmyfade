import { useEffect, useState } from "react";
import type { IIncomePoint } from "../../types/dashboard";
import { ResponsiveLine } from "@nivo/line";

type ChartProps = {
  incomeData: IIncomePoint[];
};

const IncomeChart = ({ incomeData }: ChartProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const breakpoint = 768;
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  const updatedIncomeData = incomeData.map((item) => ({
    ...item,
    income: item.date > today ? null : item.income,
  }));

  const filteredIncomeData = isMobile
    ? updatedIncomeData.filter((_, i) => i % 2 === 0) // every 2nd day
    : updatedIncomeData;

  const hasData = filteredIncomeData.some(
    (item) => item.income !== null && item.income > 0,
  );

  const formattedData = [
    {
      id: "income",
      data: filteredIncomeData.map((item) => ({
        x: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        y: item.income,
      })),
    },
  ];
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Revenue</h2>
          <p className="text-sm text-muted">Daily revenue this month</p>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveLine
          data={formattedData}
          margin={{
            top: 20,
            right: 20,
            bottom: isMobile ? 60 : 40,
            left: isMobile ? 30 : 50,
          }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: hasData ? "auto" : 100,
            stacked: false,
          }}
          curve="monotoneX"
          axisBottom={{
            tickRotation: isMobile ? -60 : -45,
            tickSize: 0,
            tickPadding: 10,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
          }}
          enableGridX={false}
          enableGridY={false}
          enablePoints={false}
          colors={["#22c55e"]}
          lineWidth={3}
          useMesh={true}
          enableArea={true}
          areaOpacity={0.15}
        />
      </div>
    </div>
  );
};

export default IncomeChart;
