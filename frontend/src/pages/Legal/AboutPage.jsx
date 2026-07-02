import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PublicPageLayout from "../../components/common/PublicPageLayout";

export default function AboutPage() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>About DistillAI — AI-Powered Study Planning</title>
        <meta name="description" content="Learn about DistillAI, the AI-powered study planner that uses spaced repetition and active recall to help students study less and remember more." />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-6 py-[80px]">

        {/* Hero section */}
        <div className="max-w-[640px] mb-16">
          <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">About</div>
          <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight leading-[1.15] text-on-background mb-5">
            Built for students who are serious about actually learning.
          </h1>
          <p className="text-[17px] text-on-surface-variant leading-relaxed">
            DistillAI is an AI-powered study planning platform that turns your syllabus into a personalised daily study schedule — and uses spaced repetition to make sure you remember the material when it matters.
          </p>
        </div>

        <hr className="border-outline-variant mb-16" />

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Our mission</div>
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold tracking-tight text-on-background mb-4 leading-snug">
              Make effective studying accessible to every student.
            </h2>
            <p className="text-[15px] text-on-surface-variant leading-relaxed mb-4">
              The science of learning is well established. Spaced repetition, active recall, and distributed practice have been shown repeatedly to produce dramatically better long-term retention than traditional study methods like re-reading and highlighting.
            </p>
            <p className="text-[15px] text-on-surface-variant leading-relaxed">
              The problem is that applying these methods manually is hard. Tracking what to review and when, building a study schedule that actually covers everything in time, generating practice questions — all of this takes effort that most students spend on the wrong things.
            </p>
          </div>

          <div>
            <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">What we do</div>
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold tracking-tight text-on-background mb-4 leading-snug">
              We handle the planning. You do the learning.
            </h2>
            <p className="text-[15px] text-on-surface-variant leading-relaxed mb-4">
              DistillAI takes your syllabus and your exam date, and produces a day-by-day study plan that covers every topic with built-in review time. As you study, the FSRS spaced repetition algorithm schedules your flashcard reviews at the optimal moments — right before you would forget something.
            </p>
            <p className="text-[15px] text-on-surface-variant leading-relaxed">
              The result is a study system where you always know exactly what to work on, and nothing you learn gets left to decay.
            </p>
          </div>
        </div>

        <hr className="border-outline-variant mb-16" />

        {/* Core principles */}
        <div className="mb-16">
          <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">How we think about learning</div>
          <h2 className="text-[clamp(22px,3vw,32px)] font-semibold tracking-tight text-on-background mb-8 leading-snug max-w-[540px]">
            Every feature is grounded in cognitive science.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-outline-variant border border-outline-variant rounded-2xl overflow-hidden">
            {[
              {
                title: "Spaced repetition",
                body: "We use the FSRS algorithm — the most accurate spaced repetition scheduler available — to schedule every flashcard review at the optimal moment. You review things right before you forget them, not on a fixed schedule."
              },
              {
                title: "Active recall over passive reading",
                body: "Every study session in DistillAI ends with retrieval practice. You are tested on what you have learned, not invited to re-read it. The discomfort of retrieval is where the learning happens."
              },
              {
                title: "Distributed practice",
                body: "We build review cycles directly into your study plan. Rather than covering each topic once in a block and moving on, the plan returns to topics repeatedly over time — exploiting the spacing effect for maximum retention."
              }
            ].map((item, i) => (
              <div key={i} className="bg-surface p-7 hover:bg-surface-container-low transition-colors">
                <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-primary mb-3">0{i + 1}</div>
                <div className="text-[15px] font-semibold text-on-background mb-2 tracking-tight">{item.title}</div>
                <div className="text-[13px] text-on-surface-variant leading-relaxed">{item.body}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-outline-variant mb-16" />

        {/* Who it's for */}
        <div className="mb-16">
          <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Who uses DistillAI</div>
          <h2 className="text-[clamp(22px,3vw,32px)] font-semibold tracking-tight text-on-background mb-5 leading-snug max-w-[540px]">
            Students preparing for exams at every level.
          </h2>
          <p className="text-[15px] text-on-surface-variant leading-relaxed max-w-[640px] mb-8">
            DistillAI is used by secondary school students preparing for GCSEs and A-Levels, university students facing end-of-semester exams, and professionals studying for certification exams. If you have a list of topics and a deadline, DistillAI is designed for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { group: "University students", note: "Semester exams, dissertations, professional exams" },
              { group: "Secondary school", note: "GCSEs, A-Levels, IB, national board exams" },
              { group: "Professional learners", note: "Certifications, board exams, entrance tests" },
              { group: "Self-learners", note: "Anyone with a syllabus and a goal" }
            ].map((item, i) => (
              <div key={i} className="border border-outline-variant rounded-xl p-5 bg-surface">
                <div className="text-[14px] font-semibold text-on-background mb-1">{item.group}</div>
                <div className="text-[12px] text-on-surface-variant leading-relaxed">{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border border-outline-variant rounded-2xl px-6 sm:px-10 py-14 bg-surface text-center">
          <h2 className="text-[clamp(22px,3vw,32px)] font-semibold tracking-tight text-on-background mb-3">
            Ready to study smarter?
          </h2>
          <p className="text-[15px] text-on-surface-variant mb-7">
            Free to start. No credit card. Two minutes to your first study plan.
          </p>
          <Link
            to="/register"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-[14px] text-on-primary transition-colors hover:opacity-80"
          >
            Create free account
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
