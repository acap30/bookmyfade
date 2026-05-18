import UserAvatar from "../ui/UserAvatar";
import Dropdown from "../ui/Dropdown";
import { LogOut, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { routeConfig } from "../../routes/routeConfig";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, user } = useAuth();

  if (!user) return null;

  const currentRoute = routeConfig.find((r) => r.match(location.pathname));

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 border-b border-border bg-card px-6">
      {/* Left */}
      <div>
        <h1 className="text-lg font-semibold text-text">
          {currentRoute?.title || ""}
        </h1>

        {currentRoute?.subtitle && (
          <p className="hidden text-sm text-muted md:block">
            {currentRoute.subtitle}
          </p>
        )}
      </div>

      {/* Right */}
      <Dropdown
        align="right"
        trigger={<UserAvatar fullName={user.fullName} />}
        header={{
          name: user.fullName,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          subtitle: user.email,
        }}
        items={[
          {
            icon: <User size={16} />,
            label: "Profile",
            onClick: () => navigate("/profile"),
          },
          {
            icon: <LogOut size={16} />,
            label: "Logout",
            onClick: logout,
            danger: true,
          },
        ]}
      />
    </header>
  );
};

export default Topbar;
