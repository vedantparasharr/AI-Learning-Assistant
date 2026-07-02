import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    if (consent === "accepted") {
      injectAdSense();
    }
  }, []);

  function injectAdSense() {
    if (document.getElementById("adsense-script")) return;
    const script = document.createElement("script");
    script.id = "adsense-script";
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7694286647884266";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  function handleAccept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
    injectAdSense();
  }

  function handleDecline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[200] border-t border-outline-variant bg-background/95 backdrop-blur-md px-4 py-4 sm:py-5"
    >
      <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            We use cookies to serve personalised ads through{" "}
            <strong className="text-on-background">Google AdSense</strong> and to
            analyse site traffic. By clicking &ldquo;Accept&rdquo; you consent
            to our use of cookies as described in our{" "}
            <Link
              to="/privacy-policy"
              className="text-primary underline hover:no-underline"
            >
              Privacy Policy
            </Link>
            .{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              How Google uses data
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-[13px] font-medium text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-[13px] font-medium text-on-primary transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
