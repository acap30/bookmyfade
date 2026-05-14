import { NavLink } from "react-router-dom";
import { LayoutDashboard, User } from "lucide-react";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Dash" },
  { to: "/profile", icon: User, label: "Profile" },
];

const Bottombar = () => {
  return (
    <div className="fixed flex items-center justify-center px-4 rounded-lg bottom-0 left-0 right-0 pb-4 bg-transparent h-16 lg:hidden">
      {/* Floating container */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-xl px-3 py-2 text-xs transition
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-background hover:text-text"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[10px] leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Bottombar;
