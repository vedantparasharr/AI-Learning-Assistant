import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PublicPageLayout from "../../components/common/PublicPageLayout";

export default function ContactPage() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Contact DistillAI</title>
        <meta name="description" content="Get in touch with the DistillAI team. We'd love to hear your feedback, answer your questions, or help you get started." />
      </Helmet>

      <div className="max-w-[720px] mx-auto px-6 py-[80px]">
        <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Contact</div>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight leading-[1.15] text-on-background mb-4">
          Get in touch
        </h1>
        <p className="text-[17px] text-on-surface-variant leading-relaxed mb-12 max-w-[520px]">
          Have a question, a bug to report, or a suggestion? We would love to hear from you. We aim to respond to all messages within 48 hours.
        </p>

        <hr className="border-outline-variant mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* General contact */}
          <div className="p-7 border border-outline-variant rounded-2xl bg-surface">
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-primary mb-4">General enquiries</div>
            <h2 className="text-[16px] font-semibold text-on-background mb-2">Questions & Feedback</h2>
            <p className="text-[13px] text-on-surface-variant leading-relaxed mb-5">
              For general questions about DistillAI, feedback on the platform, or suggestions for improvement.
            </p>
            <a
              href="mailto:hello@distillai.tech"
              className="inline-flex items-center gap-2 text-[14px] text-primary font-medium hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              hello@distillai.tech
            </a>
          </div>

          {/* Support */}
          <div className="p-7 border border-outline-variant rounded-2xl bg-surface">
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-primary mb-4">Technical support</div>
            <h2 className="text-[16px] font-semibold text-on-background mb-2">Bugs & Account Issues</h2>
            <p className="text-[13px] text-on-surface-variant leading-relaxed mb-5">
              Experiencing a bug, login problem, or something that is not working as expected? Reach out and we&apos;ll help.
            </p>
            <a
              href="mailto:hello@distillai.tech"
              className="inline-flex items-center gap-2 text-[14px] text-primary font-medium hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              hello@distillai.tech
            </a>
          </div>
        </div>

        {/* FAQ quick links */}
        <div className="border border-outline-variant rounded-2xl p-7 bg-surface mb-12">
          <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-4">Before you write</div>
          <h2 className="text-[16px] font-semibold text-on-background mb-4">Common questions</h2>
          <ul className="space-y-3 text-[14px] text-on-surface-variant">
            {[
              "Is DistillAI free to use?",
              "How do I create my first study plan?",
              "What subjects does DistillAI support?",
              "How does the spaced repetition system work?",
              "How do I delete my account?"
            ].map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-on-surface-variant mt-5">
            Check the{" "}
            <Link to="/help-center" className="text-primary hover:underline">Help Center</Link>{" "}
            for answers to these and other common questions.
          </p>
        </div>

        <hr className="border-outline-variant mb-8" />

        <div className="text-[13px] text-on-surface-variant">
          <p className="mb-3">
            For privacy-related requests, please see our{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
          <p>
            For legal enquiries, please include &quot;Legal&quot; in your email subject line.
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}
