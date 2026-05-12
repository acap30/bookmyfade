import { useState } from "react";
import { signIn } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SigninForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("Submitting:", formData);

      const data = await signIn(formData.username, formData.password);

      login(data);

      setFormData({
        username: "",
        password: "",
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl md:border md:border-border md:bg-card p-8 md:shadow-xl">
        <h1 className="mb-2 text-3xl font-bold text-text">Sign In</h1>

        <p className="mb-6 text-sm text-muted">
          Welcome back. Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-muted">Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="light-input"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="light-input"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="button-primary">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SigninForm;
