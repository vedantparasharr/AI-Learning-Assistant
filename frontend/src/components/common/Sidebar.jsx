import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navItems = [
    { icon: "dashboard", label: "Dashboard", to: "/dashboard" },
    { icon: "cloud_upload", label: "New plan", to: "/study-plan/new" },
    { icon: "menu_book", label: "Study Plans", to: "/plans" },
    { icon: "style", label: "Flashcards", to: "/flashcards" },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
      isActive
        ? "bg-primary-fixed text-primary"
        : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
    }`;

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-outline-variant/60 bg-surface-container-lowest px-4 py-6 text-on-background">
      <div className="mb-6 px-2">
        <span className="block font-h3 text-h3 text-on-background">
          DistillLearn
        </span>
        <span className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">
          Study workspace
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.label} to={item.to} className={navLinkClass}>
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

      <div className="mt-auto border-t border-outline-variant/60 pt-4">
        <NavLink
          to="/help-center"
          className={navLinkClass}
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
                }}
              >
                help_outline
              </span>
              Help Center
            </>
          )}
        </NavLink>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </nav>
  );
}
