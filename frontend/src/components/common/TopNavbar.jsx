import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get("query") || "");

  const avatarSrc = useMemo(
    () => user?.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuACKlPpmyUYB3rwzheva3r8QY47_0nncz_fq35yx19cpxhDn8n_dbi3L4asRO2PIRZcm5wlHF9nNdG3WmlWYLn7lApV_4M4pEzAV6EGSDxBLw9x_Z4m1Ba5cCuE1-f0vZ2FgRtp-BY1xhyHU3YIE5ITQ6OdFnJNAFlrBW7GMmAoWfilKXRbD7oMEfrdYVoUKLGO-xQugAgxAbsCEMF4EMsb3Y6-16H6quqwTJ7uLGanNyKsR7-NzyhCRCKbeC4PhB1OZcFtzvi1nYfw",
    [user?.profileImage],
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("query", search.trim());
    }
    navigate(`/plans${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 border-b border-slate-200 shadow-sm bg-slate-50/80 backdrop-blur-md text-indigo-900 text-sm font-medium flex justify-between items-center px-8 h-16">
      <form className="flex items-center gap-4 flex-1" onSubmit={handleSearchSubmit}>
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>

          <input
            className="w-full bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
            placeholder="Search study plans..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        <button type="button" className="p-2 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95 duration-150 rounded-full hover:bg-slate-100">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <button type="button" className="p-2 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95 duration-150 rounded-full hover:bg-slate-100 mr-2">
          <span className="material-symbols-outlined">settings</span>
        </button>

        <Link to="/profile" className="h-8 w-8 rounded-full bg-indigo-100 overflow-hidden border border-indigo-200 cursor-pointer active:scale-95 duration-150">
          <img src={avatarSrc} alt="profile" className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
}