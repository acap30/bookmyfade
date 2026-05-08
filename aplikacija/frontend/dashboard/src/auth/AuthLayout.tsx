import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <main className="h-screen w-full">
          <section>
            <Outlet />
          </section>
        </main>
      )}
    </>
  );
};

export default AuthLayout;
