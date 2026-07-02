import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../components/common/Logo";
import { PrimaryLinkButton, InlineLinkButton } from "../../components/common/ui";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function animateCounter(el, target, suffix, duration) {
      if (!el) return;
      const start = Date.now();
      const isFloat = target % 1 !== 0;
      function tick() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = isFloat ? current.toFixed(0) + suffix : Math.round(current) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(document.getElementById("stat-retention"), 3, "×", 1200);
          animateCounter(document.getElementById("stat-time"), 40, "m", 1000);
          animateCounter(document.getElementById("stat-ready"), 92, "%", 1400);
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsEl = document.getElementById("hero-stats");
    if (statsEl) observer.observe(statsEl);

    return () => observer.disconnect();
  }, []);

  const features = [
    { title: "AI-structured study plans", body: "Paste your syllabus and exam date. DistillLearn breaks it down and creates a clear schedule based on how fast you want to study.", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    { title: "Active recall, not passive reading", body: "Finish your study sessions with smart flashcards. We use the FSRS algorithm to test you on topics right before you forget them.", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { title: "Deep-dive topic study", body: "Click on any topic to get clear explanations, practice problems, and follow-up questions to test your understanding.", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { title: "Retention that compounds", body: "Your review queue automatically highlights concepts you are starting to forget. You only study what you need to stay on track.", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { title: "One dashboard, everything visible", body: "See your daily targets, upcoming reviews, and topic progress on a single screen. Everything is easy to find.", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { title: "Built for exam pressure", body: "The schedule automatically adjusts as your exam gets closer so you always know if you are on track.", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
  ];

  const steps = [
    { num: "01", title: "Add your material", body: "Upload your syllabus or list of topics. It only takes a couple of minutes to set up." },
    { num: "02", title: "Follow the plan", body: "Log in every day to see exactly what you need to study. Read the material, use the AI explanations, and check off topics as you finish them." },
    { num: "03", title: "Review what matters", body: "Our flashcards only test you on concepts you are about to forget. This saves you hours of studying." }
  ];

  const testimonials = [
    { quote: "I passed my organic chemistry final after using DistillLearn for just two weeks. The spaced repetition system actually works. I didn't even have to cram the night before.", name: "Priya S.", meta: "University of Edinburgh, 3rd year Chemistry", initials: "PS" },
    { quote: "This is the first study planner that respects my limited time. It skips the busywork and gives me exactly what I need to focus on.", name: "Marcus T.", meta: "A-Level student, Physics and Maths", initials: "MT" },
    { quote: "I tried Anki, Notion, and a dozen YouTube playlists. DistillLearn is the first thing that put everything in one place and made me feel in control.", name: "Aaliya R.", meta: "First-year Engineering, IIT Delhi", initials: "AR" },
    { quote: "The dashboard is quietly brilliant. I open it, see what needs doing, do it, close it. That's the whole thing.", name: "James O.", meta: "Law student, King's College London", initials: "JO" }
  ];

  return (
    <div className="min-h-screen bg-background text-on-background font-sans overflow-x-hidden selection:bg-surface-variant selection:text-on-background transition-colors duration-200">
      
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-[100] bg-background border-b border-outline-variant transition-colors duration-200">
        <div className="h-14 flex items-center justify-between max-w-[1080px] mx-auto px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-[15px] tracking-tight hover:opacity-80 transition-opacity">
            <Logo className="h-6" />
          </Link>

          <ul className="hidden md:flex items-center gap-7">
            <li><a href="#features" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">How it works</a></li>
            <li><Link to="/blog" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Blog</Link></li>
            <li><Link to="/about" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">About</Link></li>
          </ul>

          <div className="flex items-center gap-2">
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
            <InlineLinkButton to="/login" className="hidden sm:inline-flex">Sign in</InlineLinkButton>
            <PrimaryLinkButton to="/register">Start for free</PrimaryLinkButton>
          </div>
        </div>
      </header>

      <main className="pt-[56px]">
        {/* Hero */}
        <section className="relative pt-[100px] pb-[80px] text-center px-6">
          
          <div className="max-w-[1080px] mx-auto relative z-10">
            <div className="font-mono text-[12px] font-medium text-primary tracking-[0.1em] uppercase mb-6">
              Adaptive spaced repetition
            </div>

            <h1 className="text-[clamp(36px,6vw,68px)] font-semibold tracking-tight leading-[1.07] mb-5 text-on-background">
              Study less.<br /><em className="not-italic text-primary">Remember more.</em> Actually.
            </h1>

            <p className="text-[17px] text-on-surface-variant max-w-[520px] mx-auto mb-10 leading-relaxed">
              DistillLearn takes your syllabus and turns it into a daily study plan. It uses spaced repetition to make sure you actually remember the material when exam day comes.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <PrimaryLinkButton to="/register">
                Start learning free
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </PrimaryLinkButton>
              <a href="#how-it-works" className="inline-flex min-h-11 items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                See how it works
              </a>
            </div>

            <div id="hero-stats" className="flex flex-col sm:flex-row items-center justify-center gap-0 mt-16 border border-outline-variant rounded-xl overflow-hidden max-w-[500px] mx-auto bg-surface">
              <div className="flex-1 py-5 px-6 text-center relative border-b sm:border-b-0 sm:border-r border-outline-variant last:border-0 w-full sm:w-auto">
                <div className="font-mono text-[26px] font-medium text-primary tracking-tight tabular-nums leading-none mb-1" id="stat-retention">3×</div>
                <div className="text-[11px] text-on-surface-variant tracking-widest uppercase font-mono">retention rate</div>
              </div>
              <div className="flex-1 py-5 px-6 text-center relative border-b sm:border-b-0 sm:border-r border-outline-variant last:border-0 w-full sm:w-auto">
                <div className="font-mono text-[26px] font-medium text-primary tracking-tight tabular-nums leading-none mb-1" id="stat-time">40m</div>
                <div className="text-[11px] text-on-surface-variant tracking-widest uppercase font-mono">avg. daily study</div>
              </div>
              <div className="flex-1 py-5 px-6 text-center relative w-full sm:w-auto">
                <div className="font-mono text-[26px] font-medium text-primary tracking-tight tabular-nums leading-none mb-1" id="stat-ready">92%</div>
                <div className="text-[11px] text-on-surface-variant tracking-widest uppercase font-mono">feel exam-ready</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-t border-outline-variant m-0" />

        {/* Features */}
        <section className="py-[80px] px-6" id="features">
          <div className="max-w-[1080px] mx-auto">
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Features</div>
            <h2 className="text-[clamp(26px,4vw,40px)] font-semibold tracking-tight leading-[1.15] mb-3.5 text-on-background">Just the tools you need.</h2>
            <p className="text-[16px] text-on-surface-variant max-w-[540px] leading-relaxed">A focused study workflow without any unnecessary features.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-outline-variant border border-outline-variant rounded-2xl overflow-hidden mt-12">
              {features.map((feature, i) => (
                <div key={i} className="bg-surface p-7 transition-colors hover:bg-surface-container-low relative group">
                  <div className="w-9 h-9 bg-surface border border-outline-variant rounded-lg flex items-center justify-center mb-4 shrink-0 text-primary">
                    <span className="w-4 h-4">{feature.icon}</span>
                  </div>
                  <div className="text-[14px] font-semibold text-on-background mb-1.5 tracking-tight">{feature.title}</div>
                  <div className="text-[13px] text-on-surface-variant leading-relaxed">{feature.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-t border-outline-variant m-0" />

        {/* How It Works */}
        <section className="py-[80px] px-6" id="how-it-works">
          <div className="max-w-[1080px] mx-auto">
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">How it works</div>
            <h2 className="text-[clamp(26px,4vw,40px)] font-semibold tracking-tight leading-[1.15] mb-3.5 text-on-background">From first session to exam day.</h2>
            <p className="text-[16px] text-on-surface-variant max-w-[540px] leading-relaxed">Here is what using the app looks like.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {steps.map((step, i) => (
                <div key={i} className="p-7 border border-outline-variant rounded-2xl bg-surface hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition-shadow relative">
                  <div className="font-mono text-[12px] font-medium text-primary bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 inline-block mb-4">
                    {step.num}
                  </div>
                  <div className="text-[16px] font-semibold text-on-background mb-2 tracking-tight">{step.title}</div>
                  <div className="text-[14px] text-on-surface-variant leading-relaxed">{step.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-t border-outline-variant m-0" />

        {/* Testimonials */}
        <section className="py-[80px] px-6" id="testimonials">
          <div className="max-w-[1080px] mx-auto">
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Stories</div>
            <h2 className="text-[clamp(26px,4vw,40px)] font-semibold tracking-tight leading-[1.15] mb-3.5 text-on-background">What students actually say.</h2>
            <p className="text-[16px] text-on-surface-variant max-w-[540px] leading-relaxed">Real feedback from students using the app.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {testimonials.map((t, i) => (
                <div key={i} className="p-6 border border-outline-variant rounded-xl bg-surface hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition-shadow">
                  <p className="text-[14px] text-on-surface-variant leading-relaxed mb-5 max-w-[70ch]">"{t.quote}"</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center font-mono text-[12px] font-semibold text-primary shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-on-background">{t.name}</div>
                      <div className="text-[12px] text-on-surface-variant mt-0.5">{t.meta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-t border-outline-variant m-0" />

        {/* CTA */}
        <section className="py-[80px] px-6 text-center">
          <div className="max-w-[1080px] mx-auto">
            <div className="border border-outline-variant rounded-2xl px-6 sm:px-10 py-16 bg-surface relative overflow-hidden">
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight mb-3 text-on-background relative z-10">Your next exam is coming.<br />Start before it does.</h2>
              <p className="text-[15px] text-on-surface-variant mb-9 relative z-10">Free to start. No credit card. Two minutes to your first study plan.</p>
              
              <div className="flex items-center justify-center gap-2.5 relative z-10">
                <PrimaryLinkButton to="/register">
                  Create free account
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </PrimaryLinkButton>
              </div>
              <p className="font-mono text-[11px] text-on-surface-variant mt-4 tracking-wide relative z-10">No credit card required &nbsp;·&nbsp; Free plan available</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant py-10 px-6">
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
                <h4 className="text-[12px] font-medium text-on-surface-variant uppercase tracking-widest font-mono mb-3">Product</h4>
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  <li><Link to="/register" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Get started</Link></li>
                  <li><a href="#features" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">How it works</a></li>
                  <li><Link to="/blog" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Blog</Link></li>
                  <li><Link to="/about" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">About</Link></li>
                  <li><Link to="/contact" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[12px] font-medium text-on-surface-variant uppercase tracking-widest font-mono mb-3">Account</h4>
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  <li><Link to="/login" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Sign in</Link></li>
                  <li><Link to="/register" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Register</Link></li>
                  <li><Link to="/help-center" className="text-[13px] text-on-surface-variant hover:text-on-background transition-colors">Help center</Link></li>
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
    </div>
  );
}
