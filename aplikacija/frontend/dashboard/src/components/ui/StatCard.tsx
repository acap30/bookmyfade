import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
};

const StatCard = ({ icon, label, value }: Props) => {
  const Icon = icon;

  return (
    <div
      key={label}
      className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div>
        <p className="text-sm text-muted">{label}</p>

        <p className="text-xl font-semibold text-text">{value}</p>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon size={18} />
      </div>
    </div>
  );
};

export default StatCard;
