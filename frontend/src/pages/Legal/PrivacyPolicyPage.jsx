import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PublicPageLayout from "../../components/common/PublicPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Privacy Policy | DistillAI</title>
        <meta name="description" content="Read DistillAI's privacy policy. Learn how we collect, use, and protect your personal information, and how we use cookies and third-party advertising." />
      </Helmet>

      <div className="max-w-[720px] mx-auto px-6 py-[60px]">
        <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Legal</div>
        <h1 className="text-[clamp(26px,4vw,38px)] font-semibold tracking-tight leading-[1.2] text-on-background mb-2">Privacy Policy</h1>
        <p className="text-[13px] text-on-surface-variant font-mono mb-10">Last updated: July 2, 2026</p>

        <hr className="border-outline-variant mb-10" />

        <div className="space-y-8 text-[15px] leading-relaxed text-on-surface-variant">

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">1. Introduction</h2>
            <p>
              Welcome to DistillAI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). DistillAI is an AI-powered study planning and spaced repetition platform accessible at{" "}
              <a href="https://www.distillai.tech" className="text-primary hover:underline">www.distillai.tech</a>.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application. Please read this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-on-background">Account Information:</strong> When you register, we collect your name, email address, and password (stored as a secure hash).</li>
              <li><strong className="text-on-background">Study Content:</strong> Syllabuses, topics, study plans, and flashcard data you create within the application.</li>
              <li><strong className="text-on-background">Usage Data:</strong> Information about how you interact with the platform, including pages visited, features used, and session duration.</li>
              <li><strong className="text-on-background">Device Information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
              <li><strong className="text-on-background">Cookies and Tracking Data:</strong> We use cookies to maintain your session and to serve personalised advertising through Google AdSense. See Section 6 for details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain the DistillAI platform</li>
              <li>Generate AI-powered study plans and flashcard content personalised to your syllabus</li>
              <li>Send transactional emails such as account verification and password resets</li>
              <li>Analyse usage to improve the quality and performance of our service</li>
              <li>Comply with legal obligations</li>
              <li>Serve contextually relevant advertisements through Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">4. Sharing of Information</h2>
            <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-on-background">Service Providers:</strong> Third-party vendors who help us operate the platform (cloud hosting, email delivery, analytics). These parties process data only on our behalf and under strict confidentiality agreements.</li>
              <li><strong className="text-on-background">Google LLC:</strong> Through Google AdSense, Google may use data about your visits to this and other websites to display personalised ads. See Section 6.</li>
              <li><strong className="text-on-background">Legal Requirements:</strong> We may disclose information where required to do so by law or in response to valid requests from public authorities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">5. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymise your personal data within 30 days, except where retention is required by law. Study content (plans and flashcards) is deleted immediately upon account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">6. Cookies and Advertising (Google AdSense)</h2>
            <p className="mb-3">
              DistillAI uses Google AdSense to display advertisements on our public-facing pages. Google AdSense uses cookies to serve ads based on your prior visits to this website and other websites. These cookies allow Google and its partners to display ads based on your interests.
            </p>
            <p className="mb-3">
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet. You may opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </p>
            <p>
              For more information on how Google uses data when you use its partners' sites or apps, visit{" "}
              <a href="https://policies.google.com/technologies/partner-sites" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict certain types of processing</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:hello@distillai.tech" className="text-primary hover:underline">hello@distillai.tech</a>.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">8. Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption, hashed passwords (bcrypt), and HTTP-only authentication cookies. No system is completely secure, and we cannot guarantee absolute security. We encourage you to use a strong, unique password for your account.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">9. Children&apos;s Privacy</h2>
            <p>
              DistillAI is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us and we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:<br />
              <a href="mailto:hello@distillai.tech" className="text-primary hover:underline">hello@distillai.tech</a>
            </p>
          </section>
        </div>

        <hr className="border-outline-variant mt-12 mb-8" />
        <div className="flex gap-4 text-[13px] text-on-surface-variant">
          <Link to="/terms-of-service" className="hover:text-on-background transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-on-background transition-colors">Contact</Link>
          <span>·</span>
          <Link to="/" className="hover:text-on-background transition-colors">Home</Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
