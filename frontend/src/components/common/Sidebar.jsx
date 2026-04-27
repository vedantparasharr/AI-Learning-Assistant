import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navItems = [
    { icon: "dashboard", label: "Dashboard", to: "/dashboard" },
    { icon: "cloud_upload", label: "Upload", to: "/study-plan/new" },
    { icon: "menu_book", label: "Study Plans", to: "/plans" },
    { icon: "style", label: "Flashcards", to: "/flashcards" },
  ];

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 z-50 border-r border-slate-200 shadow-[10px_0_15px_-3px_rgba(49,46,129,0.05)] bg-white text-indigo-900 text-sm tracking-wide flex flex-col py-8">
      
      {/* Header */}
      <div className="px-6 mb-8 flex flex-col gap-1">
        <span className="text-lg font-black text-indigo-900">
          DistillLearn
        </span>
        <span className="text-slate-500 text-xs">
          AI Mentor
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto w-full pr-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-r-lg mb-1 transition-all duration-200 hover:translate-x-1 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700 font-bold"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive
                      ? '"FILL" 1'
                      : '"FILL" 0',
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pr-4 pt-4 border-t border-slate-100">
        <Link
          to="/help-center"
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 transition-all hover:bg-slate-50 hover:translate-x-1 duration-200 rounded-r-lg mb-1"
        >
          <span className="material-symbols-outlined">help_outline</span>
          Help Center
        </Link>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 transition-all hover:bg-slate-50 hover:translate-x-1 duration-200 rounded-r-lg"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </nav>
  );
}
