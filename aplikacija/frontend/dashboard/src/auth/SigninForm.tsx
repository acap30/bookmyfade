import { useState } from "react";
import { signIn } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
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

      // const data = await signIn(formData.email, formData.password);

      // login(data);

      setFormData({
        email: "",
        password: "",
      });
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
            <label className="mb-2 block text-sm text-muted">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
