import { Navigate } from "react-router-dom";

const RootLayout = () => {
  const isAuthenticated = true;

  return (
    <>{isAuthenticated ? <div>RootLayout</div> : <Navigate to="/sign-in" />}</>
  );
};

export default RootLayout;
