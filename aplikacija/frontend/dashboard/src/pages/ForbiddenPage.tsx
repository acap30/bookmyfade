import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <ShieldAlert size={32} />
        </div>

        <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>

        <p className="mb-6 text-muted">
          You do not have permission to view this page. Please sign in with an
          account that has access.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              logout();
              navigate("/sign-in");
            }}
            className="rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-80 cursor-pointer"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
