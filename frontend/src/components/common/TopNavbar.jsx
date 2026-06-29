import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import dashboardService from "../../services/dashboardService";

export default function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [streak, setStreak] = useState(12);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await dashboardService.getDashboardSummary();
        if (res?.success && res.data?.streak !== undefined) {
          setStreak(res.data.streak);
        }
      } catch {
        // Fallback to mock 12
      }
    };
    fetchStreak();
  }, []);

  const currentQuery = useMemo(
    () => new URLSearchParams(location.search).get("query") || "",
    [location.search],
  );

  const avatarSrc = useMemo(
    () => user?.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuACKlPpmyUYB3rwzheva3r8QY47_0nncz_fq35yx19cpxhDn8n_dbi3L4asRO2PIRZcm5wlHF9nNdG3WmlWYLn7lApV_4M4pEzAV6EGSDxBLw9x_Z4m1Ba5cCuE1-f0vZ2FgRtp-BY1xhyHU3YIE5ITQ6OdFnJNAFlrBW7GMmAoWfilKXRbD7oMEfrdYVoUKLGO-xQugAgxAbsCEMF4EMsb3Y6-16H6quqwTJ7uLGanNyKsR7-NzyhCRCKbeC4PhB1OZcFtzvi1nYfw",
    [user?.profileImage],
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextSearch = String(formData.get("query") || "").trim();
    const params = new URLSearchParams();
    if (nextSearch) {
      params.set("query", nextSearch);
    }
    navigate(`/plans${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <header className="fixed top-0 z-40 flex h-16 left-0 md:left-64 right-0 items-center justify-between gap-4 border-b border-outline-variant/60 bg-background/90 px-4 md:px-6 lg:px-8 text-on-background backdrop-blur-md">
      <form className="flex flex-1 items-center gap-4" onSubmit={handleSearchSubmit}>
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>

          <input
            key={`${location.pathname}:${location.search}`}
            name="query"
            className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 font-body-sm text-body-sm text-on-background placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search study plans"
            defaultValue={currentQuery}
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <div className="hidden sm:flex items-center gap-1.5 border border-outline-variant bg-surface-variant text-on-surface font-label-sm text-[12px] px-3.5 py-1.5 rounded-full font-semibold select-none mr-2">
          <span className="material-symbols-outlined text-[16px] text-on-surface leading-none">local_fire_department</span>
          {streak}-day streak
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <span className="material-symbols-outlined text-[22px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>


        <Link
          to="/profile"
          aria-label="Open profile"
          className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant bg-surface-container-low transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <img src={avatarSrc} alt="profile" className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
}
