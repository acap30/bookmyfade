import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className="button-primary">
      Logout
    </button>
  );
};

export default LogoutButton;
