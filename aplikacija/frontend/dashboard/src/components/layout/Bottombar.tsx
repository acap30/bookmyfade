import { NavLink } from "react-router-dom";
import {
  CalendarClock,
  CalendarDays,
  LayoutDashboard,
  Store,
  Users,
} from "lucide-react";
import { ROLES } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

const items = [
  {
    label: "Dash",
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
    label: "Salon",
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
  {
    label: "Appointments",
    icon: <CalendarDays size={18} />,
    path: "/appointments",
    roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.BARBER],
  },
  {
    label: "S & S",
    icon: <CalendarClock size={18} />,
    path: "/schedule-services",
    roles: [ROLES.BARBER],
  },
];

const Bottombar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const allowedItems = items.filter((item) => item.roles.includes(user.role));

  return (
    <div className="fixed flex items-center justify-center px-4 rounded-lg bottom-0 left-0 right-0 pb-4 bg-transparent h-16 lg:hidden">
      {/* Floating container */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-lg">
        {allowedItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-xl px-3 py-2 text-xs transition
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-background hover:text-text"
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Bottombar;
