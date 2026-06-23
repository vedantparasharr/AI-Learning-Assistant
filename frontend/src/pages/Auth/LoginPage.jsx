import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { Input, Checkbox, PrimaryButton } from "../../components/common/ui";

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

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              icon="mail"
              placeholder="you@example.com"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />

            <div>
              <div className="flex items-center justify-between mb-xs">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                  Password
                </label>
                <Link className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors" to="/help-center">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                icon="lock"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </div>

            <Checkbox
              id="remember-me"
              name="remember-me"
              label="Remember me"
            />

            <PrimaryButton
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center"
            >
              {submitting ? "Signing In..." : "Sign In"}
              <span className="material-symbols-outlined ml-xs text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                arrow_forward
              </span>
            </PrimaryButton>
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
