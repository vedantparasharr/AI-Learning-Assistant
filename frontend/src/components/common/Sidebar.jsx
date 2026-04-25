import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { icon: "dashboard", label: "Dashboard", to: "/dashboard" },
    { icon: "cloud_upload", label: "Upload", to: "/study-plan/new" },
    { icon: "auto_stories", label: "Study Plans", to: "/study-plans" },
    { icon: "style", label: "Flashcards", to: "/flashcards" },
  ];

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 z-50 border-r border-slate-200 dark:border-slate-800 shadow-[10px_0_15px_-3px_rgba(49,46,129,0.05)] dark:shadow-none bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 text-sm tracking-wide flex flex-col py-8">
      
      {/* Header */}
      <div className="px-6 mb-8 flex flex-col gap-1">
        <span className="text-lg font-black text-indigo-900 dark:text-indigo-400">
          DistillLearn
        </span>
        <span className="text-on-surface-variant text-label-sm">
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
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-700 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-1 duration-200 rounded-r-lg mb-1"
        >
          <span className="material-symbols-outlined">help_outline</span>
          Help Center
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-1 duration-200 rounded-r-lg"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </a>
      </div>
    </nav>
  );
}