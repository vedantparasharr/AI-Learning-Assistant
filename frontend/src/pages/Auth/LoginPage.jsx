import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { Input, PrimaryButton } from "../../components/common/ui";
import Logo from "../../components/common/Logo";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const query = new URLSearchParams(location.search);
  const returnTo = query.get("returnTo") || "/dashboard";

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (response) => {
      login(response.data.user);
      toast.success(response.message || "Logged in successfully");
      navigate(returnTo, { replace: true });
    },
    onError: (error) => {
      if (error.statusCode === 403 && error.error?.includes("Email not verified")) {
        toast.error("Please verify your email first.");
        const verifyUrl = new URLSearchParams({ email: form.email, returnTo }).toString();
        navigate(`/verify-email?${verifyUrl}`, { replace: true });
        return;
      }
      toast.error(error.error || error.message || "Unable to log in");
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate(form);
  };

  const submitting = loginMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-on-surface p-md">
      <main className="w-full max-w-[400px] mx-auto">
        {/* Card — everything inside */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-xl flex flex-col gap-md">
          {/* Brand */}
          <div className="flex justify-center pb-xs">
            <Logo className="h-10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              maxLength={255}
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              maxLength={255}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />

            <PrimaryButton
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </PrimaryButton>
          </form>

          {/* Secondary navigation row */}
          <div className="flex w-full items-center justify-between pt-xs border-t border-outline-variant/30">
            <Link
              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
              to="/help-center"
            >
              Forgot password?
            </Link>

            <p className="text-xs text-on-surface-variant">
              No account?{" "}
              <Link
                className="font-semibold text-primary hover:text-primary-container hover:underline transition-colors"
                to={`/register${location.search || ""}`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
