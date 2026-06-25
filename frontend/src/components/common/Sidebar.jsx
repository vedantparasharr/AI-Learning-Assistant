import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";

export default function Sidebar() {
  const { logout } = useAuth();
  const navItems = [
    { icon: "dashboard", label: "Dashboard", to: "/dashboard" },
    { icon: "cloud_upload", label: "New plan", to: "/study-plan/new" },
    { icon: "menu_book", label: "Study Plans", to: "/plans" },
    { icon: "style", label: "Flashcards", to: "/flashcards" },
  ];

  // Removed navLinkClass since it's now inline in the components

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 z-50 h-screen w-64 flex-col border-r border-outline-variant/60 bg-surface-container-lowest px-4 py-6 text-on-background">
        <div className="mb-6 px-2">
          <Logo className="h-7" />
          <span className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">
            Study workspace
          </span>
        </div> 

        <div className="flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${isActive
                  ? "bg-primary-fixed text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
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
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${isActive
                ? "bg-primary-fixed text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 z-50 flex h-[calc(72px+env(safe-area-inset-bottom))] w-full flex-row items-center border-t border-outline-variant/60 bg-surface-container-lowest px-2 pb-[env(safe-area-inset-bottom)] text-on-background">
        <div className="flex flex-1 flex-row justify-around w-full items-center overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 flex-1 ${isActive ? "text-primary" : "text-on-surface-variant hover:bg-surface-container-low"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${isActive ? 'bg-primary-container/20' : ''}`}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
