import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroIllustration from "../../assets/hero-illustration.png";
import Logo from "../../components/common/Logo";

/* ─── Scroll-reveal hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ─── Reveal class helper ─── */
// Content is always visible by default; animation only enhances.
// The tiny CSS block below handles the opacity/transform transition
// and the prefers-reduced-motion override — neither is expressible
// in plain Tailwind utilities.
const reveal = (visible, delay = 0) => ({
  className: `reveal-item${visible ? " reveal-visible" : ""}`,
  style: { "--reveal-delay": `${delay}ms` },
});

/* ─── Feature data ─── */
const features = [
  {
    title: "AI-Structured Study Plans",
    body: "Paste a syllabus, topic list, or exam date. DistillLearn maps every concept into a precision-ordered plan calibrated to your pace and schedule.",
    icon: "auto_stories",
  },
  {
    title: "Active Recall, Not Passive Reading",
    body: "Every session ends with smart flashcards and spaced-repetition scheduling. The material you're about to forget surfaces at exactly the right moment.",
    icon: "psychology",
  },
  {
    title: "Deep-Dive Topic Study",
    body: "Click any topic and enter a focused reading mode with AI explanations, worked examples, and follow-up questions — no tab-switching required.",
    icon: "neurology",
  },
  {
    title: "Retention That Compounds",
    body: "Your review queue knows which concepts are drifting. Each day's session is the minimum viable set to hold everything you've already learned.",
    icon: "trending_up",
  },
  {
    title: "One Dashboard, Everything Visible",
    body: "Daily targets, upcoming reviews, progress per topic — all on one calm screen. Nothing hidden; nothing you have to hunt for.",
    icon: "dashboard",
  },
  {
    title: "Built for Exam Pressure",
    body: "Deadline-aware scheduling tightens automatically as exam day approaches. You always know whether you're on track — not after the test, before it.",
    icon: "timer",
  },
];

/* ─── How it works ─── */
const steps = [
  {
    num: "1",
    title: "Add your material",
    body: "Upload a syllabus, paste topics, or tell DistillLearn what exam you're preparing for. Takes under two minutes.",
  },
  {
    num: "2",
    title: "Follow the plan",
    body: "Each day you get a focused list of what to study. Read, engage with the AI explanations, and mark topics as you go.",
  },
  {
    num: "3",
    title: "Review what matters",
    body: "Spaced-repetition flashcards surface only the concepts at risk of being forgotten. Fifteen focused minutes beats two distracted hours.",
  },
];

/* ─── Testimonials ─── */
const testimonials = [
  {
    quote:
      "I passed my organic chemistry final after two weeks on DistillLearn. The spaced repetition actually works — I stopped cramming the night before.",
    name: "Priya S.",
    context: "University of Edinburgh, 3rd year Chemistry",
    initial: "P",
  },
  {
    quote:
      "The study plan builder is the first tool I've used that respects how little time I actually have. It doesn't pad sessions — it gives me exactly what I need.",
    name: "Marcus T.",
    context: "A-Level student, preparing for Physics & Maths",
    initial: "M",
  },
  {
    quote:
      "I tried Anki, Notion, and a dozen YouTube playlists. DistillLearn is the first thing that put everything in one place and made me feel in control.",
    name: "Aaliya R.",
    context: "First-year Engineering, IIT Delhi",
    initial: "A",
  },
  {
    quote:
      "The dashboard is quietly brilliant. I open it, see what needs doing, do it, close it. That's the whole thing.",
    name: "James O.",
    context: "Law student, King's College London",
    initial: "J",
  },
];

/* ─── Stat bar data ─── */
const stats = [
  { value: "3×", label: "faster retention" },
  { value: "40 min", label: "avg. daily study" },
  { value: "92%", label: "feel exam-ready" },
];

/* ================================================================
   NAV
   ================================================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      role="banner"
      className={[
        "fixed inset-x-0 top-0 z-[100] px-[clamp(1rem,4vw,2rem)] transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-[0_1px_0_#e2e8f0]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-[1200px] mx-auto h-16 flex items-center gap-8">
        {/* Logo */}
        <Link
          to="/"
          aria-label="DistillLearn home"
          className="shrink-0 no-underline"
        >
          <Logo className="h-8" />
        </Link>

        {/* Nav links */}
        <nav
          aria-label="Site navigation"
          className="hidden sm:flex gap-8 ml-6"
        >
          {[
            ["#features", "Features"],
            ["#how-it-works", "How it works"],
            ["#testimonials", "Stories"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-on-surface-variant no-underline hover:text-primary transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:block text-sm font-medium text-on-surface-variant no-underline hover:text-primary transition-colors duration-150"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-lg no-underline hover:bg-primary-container active:scale-[0.97] transition-all duration-150"
          >
            Start for free
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-background px-[clamp(1rem,4vw,2rem)]"
      style={{ paddingTop: "calc(64px + clamp(3rem,8vw,6rem))", paddingBottom: "clamp(3rem,8vw,6rem)" }}
    >
      {/* Two-column grid */}
      <div
        className="max-w-[1200px] mx-auto grid md:grid-cols-2 items-center"
        style={{ gap: "clamp(2rem,5vw,4rem)" }}
      >
        {/* Copy */}
        <div className="max-w-[560px] reveal-item reveal-visible">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-secondary mb-5">
            AI-powered study assistant
          </p>
          <h1
            id="hero-heading"
            className="font-bold tracking-[-0.03em] text-on-background leading-[1.08] mb-6"
            style={{ fontSize: "clamp(2.5rem,5.5vw,4.5rem)", textWrap: "balance" }}
          >
            Study less.<br />
            Remember more.<br />
            <em className="italic text-primary not-italic" style={{ fontStyle: "italic" }}>Actually.</em>
          </h1>
          <p
            className="leading-[1.7] text-on-surface-variant max-w-[52ch] mb-9"
            style={{ fontSize: "clamp(1rem,1.75vw,1.125rem)" }}
          >
            DistillLearn turns your syllabus into a daily study plan — then
            keeps the right material in your head with spaced repetition.
            Built for students who take their work seriously.
          </p>
          <div className="flex flex-wrap gap-3.5 items-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 bg-primary text-white text-[15px] font-semibold px-6 py-[13px] rounded-lg no-underline hover:bg-primary-container active:scale-[0.97] transition-all duration-150"
            >
              Start learning free
              <span className="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 bg-transparent text-on-surface-variant text-[15px] font-semibold px-6 py-[13px] rounded-lg border border-outline-variant no-underline hover:bg-white hover:text-primary hover:border-primary active:scale-[0.97] transition-all duration-150"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Visual — appears above copy on mobile */}
        <div className="flex justify-center items-center order-first md:order-last reveal-item reveal-visible">
          <div className="w-full max-w-[540px] rounded-xl overflow-hidden border border-outline-variant">
            <img
              src={heroIllustration}
              alt="Abstract illustration of a book transforming into structured knowledge nodes — representing DistillLearn's AI study approach"
              className="w-full h-auto block"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        role="list"
        aria-label="Key statistics"
        className="max-w-[1200px] mx-auto flex flex-col sm:flex-row bg-white border border-outline-variant rounded-xl overflow-hidden"
        style={{ marginTop: "clamp(3rem,6vw,5rem)" }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            role="listitem"
            className={[
              "flex-1 px-8 py-6 flex flex-col gap-1.5",
              i < stats.length - 1
                ? "border-b sm:border-b-0 sm:border-r border-outline-variant"
                : "",
            ].join(" ")}
          >
            <span
              className="font-bold tracking-[-0.03em] text-primary"
              style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}
            >
              {s.value}
            </span>
            <span className="text-[13px] font-medium text-outline">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   FEATURES
   ================================================================ */
function Features() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-[clamp(5rem,10vw,8rem)]"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2rem)]">
        {/* Header */}
        <div
          ref={ref}
          {...reveal(visible)}
          className={`max-w-[600px] mb-[clamp(3rem,6vw,4.5rem)] reveal-item${visible ? " reveal-visible" : ""}`}
          style={{ "--reveal-delay": "0ms" }}
        >
          <h2
            id="features-heading"
            className="font-bold tracking-[-0.025em] text-on-background leading-[1.15] mb-4"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.625rem)", textWrap: "balance" }}
          >
            Everything you need to learn at a high level
          </h2>
          <p className="text-[17px] leading-[1.65] text-on-surface-variant max-w-[65ch]">
            No bloat. No busy features. Six tools that compound into one serious study workflow.
          </p>
        </div>

        {/* 1px-gap mosaic grid */}
        <div className="grid gap-px bg-outline-variant border border-outline-variant rounded-xl overflow-hidden"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const [ref, visible] = useReveal(0.12);
  return (
    <article
      ref={ref}
      className={`bg-white hover:bg-background transition-colors duration-200 reveal-item${visible ? " reveal-visible" : ""}`}
      style={{ padding: "clamp(1.5rem,3vw,2.25rem)", "--reveal-delay": `${index * 60}ms` }}
    >
      <span
        className="material-symbols-outlined text-[22px] text-primary block mb-4"
        aria-hidden="true"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {feature.icon}
      </span>
      <h3 className="text-base font-semibold tracking-[-0.01em] text-on-background mb-2.5">
        {feature.title}
      </h3>
      <p className="text-[14.5px] leading-[1.65] text-on-surface-variant max-w-[52ch]">
        {feature.body}
      </p>
    </article>
  );
}

/* ================================================================
   HOW IT WORKS
   ================================================================ */
function HowItWorks() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section
      id="how-it-works"
      aria-labelledby="hiw-heading"
      className="py-[clamp(5rem,10vw,8rem)] bg-surface-container-low"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2rem)]">
        {/* Header */}
        <div
          ref={ref}
          className={`max-w-[600px] mb-[clamp(3rem,6vw,4.5rem)] reveal-item${visible ? " reveal-visible" : ""}`}
          style={{ "--reveal-delay": "0ms" }}
        >
          <h2
            id="hiw-heading"
            className="font-bold tracking-[-0.025em] text-on-background leading-[1.15] mb-4"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.625rem)", textWrap: "balance" }}
          >
            From first session to exam day in three steps
          </h2>
          <p className="text-[17px] leading-[1.65] text-on-surface-variant max-w-[65ch]">
            A real sequence: each step depends on the last. The numbers mean something here.
          </p>
        </div>

        {/* Steps */}
        <ol className="list-none p-0 m-0 flex flex-col max-w-[720px]" aria-label="How DistillLearn works">
          {steps.map((step, i) => (
            <StepItem key={step.num} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepItem({ step, index }) {
  const [ref, visible] = useReveal(0.15);
  const isLast = step.num === steps[steps.length - 1].num;
  return (
    <li
      ref={ref}
      className={[
        "grid items-start py-8",
        !isLast ? "border-b border-surface-container-high" : "",
        `reveal-item${visible ? " reveal-visible" : ""}`,
      ].join(" ")}
      style={{ gridTemplateColumns: "3rem 1fr", gap: "1.5rem", "--reveal-delay": `${index * 100}ms` }}
    >
      {/* Number badge */}
      <div className="w-11 h-11 flex items-center justify-center text-[13px] font-bold tracking-[0.02em] text-primary border-[1.5px] border-[#c3c0ff] rounded-full shrink-0">
        {step.num}
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-[-0.015em] text-on-background mb-2">
          {step.title}
        </h3>
        <p className="text-[15px] leading-[1.7] text-on-surface-variant max-w-[58ch]">
          {step.body}
        </p>
      </div>
    </li>
  );
}

/* ================================================================
   TESTIMONIALS
   ================================================================ */
function Testimonials() {
  const [ref, visible] = useReveal(0.08);
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-[clamp(5rem,10vw,8rem)]"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2rem)]">
        {/* Header */}
        <div
          ref={ref}
          className={`max-w-[600px] mb-[clamp(3rem,6vw,4.5rem)] reveal-item${visible ? " reveal-visible" : ""}`}
          style={{ "--reveal-delay": "0ms" }}
        >
          <h2
            id="testimonials-heading"
            className="font-bold tracking-[-0.025em] text-on-background leading-[1.15] mb-4"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.625rem)", textWrap: "balance" }}
          >
            From students who used to cram
          </h2>
          <p className="text-[17px] leading-[1.65] text-on-surface-variant max-w-[65ch]">
            No curated success stories. What students actually say after a few weeks.
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }) {
  const [ref, visible] = useReveal(0.12);
  return (
    <figure
      ref={ref}
      className={`m-0 flex flex-col gap-5 bg-white border border-outline-variant rounded-xl hover:shadow-[0_4px_16px_rgba(26,20,107,0.07)] transition-shadow duration-200 reveal-item${visible ? " reveal-visible" : ""}`}
      style={{ padding: "clamp(1.5rem,3vw,2rem)", "--reveal-delay": `${index * 80}ms` }}
    >
      <blockquote className="flex-1 text-[15px] leading-[1.75] text-on-background m-0 p-0">
        <p className="m-0">"{testimonial.quote}"</p>
      </blockquote>
      <figcaption className="flex items-center gap-3.5">
        <div
          aria-hidden="true"
          className="w-9 h-9 rounded-full bg-primary text-[#c3c0ff] text-[13px] font-bold flex items-center justify-center shrink-0"
        >
          {testimonial.initial}
        </div>
        <div>
          <div className="text-sm font-semibold text-on-background">{testimonial.name}</div>
          <div className="text-xs text-outline mt-0.5">{testimonial.context}</div>
        </div>
      </figcaption>
    </figure>
  );
}

/* ================================================================
   FINAL CTA
   ================================================================ */
function FinalCTA() {
  const [ref, visible] = useReveal(0.15);
  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="bg-primary text-center px-[clamp(1rem,4vw,2rem)] py-[clamp(5rem,10vw,8rem)]"
    >
      <div className={`max-w-[640px] mx-auto reveal-item${visible ? " reveal-visible" : ""}`}
        style={{ "--reveal-delay": "0ms" }}>
        <h2
          id="cta-heading"
          className="font-bold tracking-[-0.03em] text-[#e2dfff] leading-[1.12] mb-5"
          style={{ fontSize: "clamp(2rem,4vw,3.25rem)", textWrap: "balance" }}
        >
          Your next exam is coming.
          <br />
          <span className="text-secondary-container">Start before it does.</span>
        </h2>
        <p className="text-base leading-[1.65] text-[#9c9af4] mb-10 max-w-[52ch] mx-auto">
          Free to start. No credit card. Takes two minutes to set up your first study plan.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 bg-white text-primary text-[15px] font-semibold px-6 py-[13px] rounded-lg no-underline hover:bg-[#e2dfff] active:scale-[0.97] transition-all duration-150"
        >
          Create your free account
          <span className="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer() {
  return (
    <footer role="contentinfo" className="bg-on-background text-[#9c9af4] pt-[clamp(3rem,6vw,5rem)]">
      {/* Main footer content */}
      <div className="max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2rem)] flex flex-wrap gap-16 pb-12 border-b border-[rgba(195,192,255,0.12)]">
        {/* Brand */}
        <div className="flex-1 min-w-[200px]">
          <Link
            to="/"
            className="block no-underline mb-3"
          >
            <Logo className="h-8" />
          </Link>
          <p className="text-sm text-[#9c9af4] leading-relaxed">
            Serious learning, without the chaos.
          </p>
        </div>

        {/* Nav columns */}
        <nav className="flex gap-12 flex-wrap" aria-label="Footer navigation">
          {[
            {
              title: "Product",
              links: [
                { to: "/register", label: "Get started", isRouter: true },
                { to: "#features", label: "Features", isRouter: false },
                { to: "#how-it-works", label: "How it works", isRouter: false },
              ],
            },
            {
              title: "Account",
              links: [
                { to: "/login", label: "Sign in", isRouter: true },
                { to: "/register", label: "Register", isRouter: true },
                { to: "/help-center", label: "Help center", isRouter: true },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant mb-1">
                {col.title}
              </p>
              {col.links.map(({ to, label, isRouter }) =>
                isRouter ? (
                  <Link
                    key={label}
                    to={to}
                    className="text-sm text-[#9c9af4] no-underline hover:text-[#e2dfff] transition-colors duration-150"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={to}
                    className="text-sm text-[#9c9af4] no-underline hover:text-[#e2dfff] transition-colors duration-150"
                  >
                    {label}
                  </a>
                )
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2rem)] py-6">
        <p className="text-[13px] text-on-surface-variant">
          © {new Date().getFullYear()} DistillLearn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function LandingPage() {
  return (
    <>
      {/*
        Minimal style block for scroll-reveal.
        These 3 rules cannot be expressed in Tailwind utilities:
          1. opacity/transform transition with CSS var delay
          2. initial hidden state (only before JS fires)
          3. prefers-reduced-motion override
      */}
      <style>{`
        .reveal-item {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 0.55s cubic-bezier(0.25, 1, 0.5, 1),
            transform 0.55s cubic-bezier(0.25, 1, 0.5, 1);
          transition-delay: var(--reveal-delay, 0ms);
        }
        .reveal-item:not(.reveal-visible) {
          opacity: 0;
          transform: translateY(20px);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-item, .reveal-item:not(.reveal-visible) {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Nav />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
