import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { Input, PrimaryButton } from "../../components/common/ui";
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const response = await authService.register(form.username, form.email, form.password);
      toast.success(response.message || "OTP sent to your email");
      const params = new URLSearchParams({ email: form.email });
      if (returnTo) {
        params.set("returnTo", returnTo);
      }
      navigate(`/verify-email?${params.toString()}`, {
        replace: true,
      });
    } catch (error) {
      toast.error(error.error || error.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-on-surface p-md">
      <main className="w-full max-w-[440px] mx-auto">
        <div className="text-center mb-xl">
          <h1 className="font-h1 text-h1 text-primary mb-sm tracking-tight font-black">DistillLearn</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Create your account</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <Input
              id="name"
              name="name"
              type="text"
              label="Full Name"
              icon="person"
              placeholder="Jane Doe"
              required
              autoComplete="name"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              icon="mail"
              placeholder="jane@example.com"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />

            <div>
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                icon="lock"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Must be at least 8 characters long.</p>
            </div>

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              icon="lock"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            />

            <PrimaryButton
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center"
            >
              {submitting ? "Creating Account..." : "Create Account"}
              <span className="material-symbols-outlined ml-xs text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                arrow_forward
              </span>
            </PrimaryButton>
          </form>
        </div>

        <p className="mt-xl text-center font-body-sm text-body-sm text-on-surface-variant">
          Already a member?
          <Link className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors ml-xs" to={`/login${location.search || ""}`}>
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
};

export default RegisterPage;
