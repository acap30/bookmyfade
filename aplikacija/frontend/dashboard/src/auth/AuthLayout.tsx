import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="h-screen w-full">
      <section>
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
