import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthLayout = () => {
  const { token } = useAuth();

  if (token) return <Navigate to="/" />;

  return (
    <main className="h-screen w-full">
      <section>
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
