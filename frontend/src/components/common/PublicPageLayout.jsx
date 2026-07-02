import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Logo from "./Logo";
import CookieConsent from "./CookieConsent";

// Responsive AdSense ad unit — only renders on public content pages
function AdUnit({ slot = "auto", format = "auto" }) {
  return (
    <div className="w-full my-8 flex justify-center min-h-[90px]">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", maxWidth: "728px" }}
        data-ad-client="ca-pub-7694286647884266"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export { AdUnit };

export default function PublicPageLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background font-sans overflow-x-hidden transition-colors duration-200">

      {/* ── Header ── */}
      <header className="fixed inset-x-0 top-0 z-[100] bg-background border-b border-outline-variant transition-colors duration-200">
        <div className="h-14 flex items-center justify-between max-w-[1080px] mx-auto px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-[15px] tracking-tight hover:opacity-80 transition-opacity">
            <Logo className="h-6" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-7">
            <li><Link to="/blog" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Blog</Link></li>
            <li><Link to="/about" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Contact</Link></li>
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <span className="material-symbols-outlined text-[22px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-flex min-h-11 items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex min-h-11 items-center justify-center gap-xs rounded-lg bg-primary px-md py-2 font-label-md text-label-md text-on-primary transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              Start for free
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low"
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant bg-background px-6 py-4 flex flex-col gap-3">
            <Link to="/blog" className="text-sm text-on-surface-variant hover:text-on-background py-1 transition-colors" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/about" className="text-sm text-on-surface-variant hover:text-on-background py-1 transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="text-sm text-on-surface-variant hover:text-on-background py-1 transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/privacy-policy" className="text-sm text-on-surface-variant hover:text-on-background py-1 transition-colors" onClick={() => setMobileMenuOpen(false)}>Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm text-on-surface-variant hover:text-on-background py-1 transition-colors" onClick={() => setMobileMenuOpen(false)}>Terms of Service</Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="pt-14">
        {/* Top ad unit — between header and content */}
        <div className="max-w-[1080px] mx-auto px-6 pt-4">
          <AdUnit slot="auto" />
        </div>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-outline-variant py-10 px-6 mt-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-10">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-[14px] flex items-center gap-2 text-on-background">
                <Logo className="h-5" />
              </div>
              <div className="text-[13px] text-on-surface-variant">Focus on learning, not planning.</div>
              <div className="text-[12px] text-on-surface-variant font-mono mt-4">© 2026 DistillAI. All rights reserved.</div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div>
                <h4 className="text-[12px] font-medium text-on-surface-variant uppercase tracking-widest font-mono mb-3">Content</h4>
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  <li><Link to="/blog" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Blog</Link></li>
                  <li><Link to="/about" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">About</Link></li>
                  <li><Link to="/contact" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[12px] font-medium text-on-surface-variant uppercase tracking-widest font-mono mb-3">App</h4>
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  <li><Link to="/register" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Get started free</Link></li>
                  <li><Link to="/login" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Sign in</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[12px] font-medium text-on-surface-variant uppercase tracking-widest font-mono mb-3">Legal</h4>
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  <li><Link to="/privacy-policy" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms-of-service" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie consent banner — gates AdSense loading behind user consent */}
      <CookieConsent />
    </div>
  );
}
