import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const query = new URLSearchParams(location.search);
  const returnTo = query.get("returnTo") || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await authService.login(form.email, form.password);
      login(response.data.user);
      toast.success(response.message || "Logged in successfully");
      navigate(returnTo, { replace: true });
    } catch (error) {
      toast.error(error.error || error.message || "Unable to log in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-on-surface p-md">
      <main className="w-full max-w-[440px] mx-auto">
        <div className="text-center mb-xl">
          <h1 className="font-h1 text-h1 text-primary mb-sm tracking-tight font-black">DistillLearn</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Sign in to your account</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl shadow-[0_8px_30px_rgba(26,20,107,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute inset-y-0 left-0 pl-sm flex items-center text-outline pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                  mail
                </span>
                <input
                  autoComplete="email"
                  className="block w-full pl-xl pr-sm py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-slate-600/60 outline-none transition-colors"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <Link className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors" to="/help-center">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute inset-y-0 left-0 pl-sm flex items-center text-outline pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                  lock
                </span>
                <input
                  autoComplete="current-password"
                  className="block w-full pl-xl pr-sm py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-slate-600/60 outline-none transition-colors"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label className="ml-sm block font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            <div>
              <button
                className="w-full flex justify-center items-center py-2.5 px-lg border border-transparent rounded-lg bg-primary font-label-md text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 cursor-pointer"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Signing In..." : "Sign In"}
                <span className="material-symbols-outlined ml-xs text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  arrow_forward
                </span>
              </button>
            </div>
          </form>
        </div>

        <p className="mt-xl text-center font-body-sm text-body-sm text-on-surface-variant">
          Don&apos;t have an account?
          <Link className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors ml-xs" to={`/register${location.search || ""}`}>
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
