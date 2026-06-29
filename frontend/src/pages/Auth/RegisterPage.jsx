import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { Input, PrimaryButton } from "../../components/common/ui";
import Logo from "../../components/common/Logo";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const returnTo = query.get("returnTo") || "";
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) => authService.register(username, email, password),
    onSuccess: (response, variables) => {
      toast.success(response.message || "OTP sent to your email");
      const params = new URLSearchParams({ email: variables.email });
      if (returnTo) {
        params.set("returnTo", returnTo);
      }
      navigate(`/verify-email?${params.toString()}`, {
        replace: true,
      });
    },
    onError: (error) => {
      toast.error(error.error || error.message || "Unable to create account");
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    registerMutation.mutate(form);
  };

  const submitting = registerMutation.isPending;

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
              id="name"
              name="name"
              type="text"
              placeholder="Username"
              required
              autoComplete="name"
              maxLength={50}
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            />

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
              autoComplete="new-password"
              maxLength={255}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
              autoComplete="new-password"
              maxLength={255}
              value={form.confirmPassword}
              onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            />

            <PrimaryButton
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Creating account…" : "Create Account"}
            </PrimaryButton>
          </form>

          {/* Switch */}
          <div className="pt-xs border-t border-outline-variant/30 text-center">
            <p className="text-xs text-on-surface-variant">
              Have an account?{" "}
              <Link
                className="font-semibold text-primary hover:text-primary-container hover:underline transition-colors"
                to={`/login${location.search || ""}`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
