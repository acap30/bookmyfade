import { LayoutDashboard, Scissors } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  to: string;
  icon: ReactNode;
  label: string;
};

const SidebarItem = ({ to, icon, label }: Props) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition
        ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted hover:bg-background hover:text-text"
        }`
      }
    >
      <span className="flex items-center justify-center">{icon}</span>

      {label}
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
      {/* Logo / App name */}
      <div className="flex flex-col h-16 items-start justify-center border-b border-border px-6">
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center p-1.5 rounded-lg bg-text text-white">
            <Scissors size={16} />
          </div>
          <h1 className="text-lg font-bold text-text">BookMyFade</h1>
        </div>
        <p className="text-xs text-muted">Manage your bookings easily</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        <SidebarItem
          to=""
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
