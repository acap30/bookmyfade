import { Users, Calendar, Scissors, DollarSign } from "lucide-react";

type Props = {
  title: string;
  time: string;
};

const ActivityItem = ({ title, time }: Props) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
      <p className="text-sm text-text">{title}</p>
      <span className="text-xs text-muted">{time}</span>
    </div>
  );
};

const stats = [
  {
    label: "Total Clients",
    value: "1,240",
    icon: Users,
  },
  {
    label: "Bookings",
    value: "320",
    icon: Calendar,
  },
  {
    label: "Services",
    value: "18",
    icon: Scissors,
  },
  {
    label: "Revenue",
    value: "$4,200",
    icon: DollarSign,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div>
              <p className="text-sm text-muted">{item.label}</p>

              <p className="text-xl font-semibold text-text">{item.value}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <item.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-text">
            Recent Activity
          </h2>

          <div className="space-y-3">
            <ActivityItem title="New booking created" time="2 min ago" />

            <ActivityItem title="User registered" time="10 min ago" />

            <ActivityItem title="Payment received" time="1 hour ago" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-text">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full rounded-xl bg-primary py-2 text-sm font-medium text-primary-foreground cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
              New Booking
            </button>

            <button className="w-full rounded-xl border border-border bg-background py-2 text-sm text-text cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
              Add User
            </button>

            <button className="w-full rounded-xl border border-border bg-background py-2 text-sm text-text cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
