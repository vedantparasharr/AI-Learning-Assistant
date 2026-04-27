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
    <div className="flex min-h-screen items-center justify-center bg-surface-bright text-on-surface font-body-md antialiased">
      <div className="flex min-h-full flex-1 w-full max-w-container-max mx-auto">
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-primary items-center justify-center p-xxl">
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDWvQ_uWIkxFXb5Evt0JDW9C4W6dkgRHZLbv6rsThyi0ndR8x6dAxbLIqelvyXVgSwSuBYqZ1UZtsztx_ikxAvikE9VpZCzIitloT7anPMNBI55sske30bI-605TwIN5lAH4cCWAzfs0yMB6Pb1WgoB_gtgGqg8f9ZnXlolM8E8Q9voM8pqtPb-2_2pO14WBuTg4cCEisTyzGlFDzO-6BbeIyhkgF5TWp7UotRtJUwgYXZ3okxZ8lmcd0bzJndw5A_-GmPh7BWCzaMw')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-surface-tint/80 backdrop-blur-[2px]" />
          <div className="relative z-10 flex flex-col items-center text-center max-w-md text-on-primary">
            <div className="mb-lg p-md rounded-xl bg-surface-container-lowest/10 backdrop-blur-md border border-surface-container-lowest/20 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-display" style={{ fontVariationSettings: "'FILL' 1" }}>
                menu_book
              </span>
            </div>
            <h2 className="font-display text-display mb-md tracking-tight">DistillLearn</h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-sm mx-auto">
              Cultivate deep focus. Master complex concepts in a distraction-free environment designed for lifelong learners.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-gutter py-xxl sm:px-xxl lg:px-24 bg-surface-bright">
          <div className="mx-auto w-full max-w-sm">
            <div className="text-center mb-xl">
              <div className="lg:hidden flex justify-center mb-md">
                <span className="material-symbols-outlined text-h1 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  menu_book
                </span>
              </div>
              <h1 className="font-h1 text-h1 text-on-surface mb-xs">Create Account</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Begin your journey to intellectual mastery.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-margin">
              <div className="space-y-lg">
                <div className="space-y-xs">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-sm">
                      <span className="material-symbols-outlined text-outline text-[18px]">person</span>
                    </div>
                    <input
                      autoComplete="name"
                      className="block w-full rounded border border-outline-variant bg-surface-container-lowest py-md pl-xl pr-md font-body-md text-body-md text-on-surface shadow-sm shadow-primary/5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-200 placeholder:text-outline/60"
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

                <div className="space-y-xs">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-sm">
                      <span className="material-symbols-outlined text-outline text-[18px]">mail</span>
                    </div>
                    <input
                      autoComplete="email"
                      className="block w-full rounded border border-outline-variant bg-surface-container-lowest py-md pl-xl pr-md font-body-md text-body-md text-on-surface shadow-sm shadow-primary/5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-200 placeholder:text-outline/60"
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

                <div className="space-y-xs">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-sm">
                      <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
                    </div>
                    <input
                      autoComplete="new-password"
                      className="block w-full rounded border border-outline-variant bg-surface-container-lowest py-md pl-xl pr-md font-body-md text-body-md text-on-surface shadow-sm shadow-primary/5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-200 placeholder:text-outline/60"
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

                <div className="space-y-xs">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-sm">
                      <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
                    </div>
                    <input
                      autoComplete="new-password"
                      className="block w-full rounded border border-outline-variant bg-surface-container-lowest py-md pl-xl pr-md font-body-md text-body-md text-on-surface shadow-sm shadow-primary/5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-200 placeholder:text-outline/60"
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
              </div>

              <div>
                <button
                  className="flex w-full justify-center items-center gap-2 rounded bg-primary px-md py-md font-label-md text-label-md text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98]"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Creating Account..." : "Create Account"}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </form>

            <div className="mt-xl text-center border-t border-outline-variant/30 pt-lg">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Already a member?
                <Link className="font-label-md text-label-md text-primary hover:text-surface-tint underline decoration-primary/30 underline-offset-4 transition-colors" to={`/login${location.search || ""}`}>
                  Sign in to your account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
