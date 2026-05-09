import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/auth";

interface Props {
  allowedRoles: Role[];
}

const RoleRoute = ({ allowedRoles }: Props) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
