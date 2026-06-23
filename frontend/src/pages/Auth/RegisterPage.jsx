import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

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

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl shadow-[0_8px_30px_rgba(26,20,107,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute inset-y-0 left-0 pl-sm flex items-center text-outline pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                  person
                </span>
                <input
                  autoComplete="name"
                  className="block w-full pl-xl pr-sm py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-slate-600/60 outline-none transition-colors"
                  id="name"
                  name="name"
                  placeholder="Jane Doe"
                  required
                  type="text"
                  value={form.username}
                  onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">
                Email Address
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
                  placeholder="jane@example.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute inset-y-0 left-0 pl-sm flex items-center text-outline pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                  lock
                </span>
                <input
                  autoComplete="new-password"
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
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Must be at least 8 characters long.</p>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute inset-y-0 left-0 pl-sm flex items-center text-outline pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                  lock
                </span>
                <input
                  autoComplete="new-password"
                  className="block w-full pl-xl pr-sm py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-slate-600/60 outline-none transition-colors"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <button
                className="w-full flex justify-center items-center py-2.5 px-lg border border-transparent rounded-lg bg-primary font-label-md text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 cursor-pointer"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Creating Account..." : "Create Account"}
                <span className="material-symbols-outlined ml-xs text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  arrow_forward
                </span>
              </button>
            </div>
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
