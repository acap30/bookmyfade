import { LayoutDashboard, Scissors, Store, Users } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ROLES } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/",
    roles: [ROLES.ADMIN, ROLES.BARBER, ROLES.OWNER],
  },
  {
    label: "Salons",
    icon: <Store size={18} />,
    path: "/salons",
    roles: [ROLES.ADMIN],
  },
  {
    label: "My Salon",
    icon: <Store size={18} />,
    path: "/my-salon",
    roles: [ROLES.OWNER],
  },
  {
    label: "Owners",
    icon: <Users size={18} />,
    path: "/owners",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Barbers",
    icon: <Users size={18} />,
    path: "/barbers",
    roles: [ROLES.ADMIN, ROLES.OWNER],
  },
];

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const allowedItems = sidebarItems.filter((item) =>
    item.roles.includes(user.role),
  );

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
        {allowedItems.map((item) => (
          <SidebarItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
  );
};

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

export default Sidebar;
