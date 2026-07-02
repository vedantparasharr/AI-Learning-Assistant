import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PublicPageLayout from "../../components/common/PublicPageLayout";

export default function TermsOfServicePage() {
  return (
    <PublicPageLayout>
      <Helmet>
        <title>Terms of Service | DistillAI</title>
        <meta name="description" content="Read the Terms of Service for DistillAI. By using our platform you agree to these terms governing your access to and use of the service." />
      </Helmet>

      <div className="max-w-[720px] mx-auto px-6 py-[60px]">
        <div className="font-mono text-[11px] font-medium tracking-widest uppercase text-on-surface-variant mb-3">Legal</div>
        <h1 className="text-[clamp(26px,4vw,38px)] font-semibold tracking-tight leading-[1.2] text-on-background mb-2">Terms of Service</h1>
        <p className="text-[13px] text-on-surface-variant font-mono mb-10">Last updated: July 2, 2026</p>

        <hr className="border-outline-variant mb-10" />

        <div className="space-y-8 text-[15px] leading-relaxed text-on-surface-variant">

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using DistillAI (&quot;the Service&quot;) at{" "}
              <a href="https://www.distillai.tech" className="text-primary hover:underline">www.distillai.tech</a>,
              you agree to be bound by these Terms of Service and our{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">2. Description of Service</h2>
            <p>
              DistillAI is an AI-powered educational platform that helps students create personalised study plans and use spaced repetition flashcards to improve long-term retention. The Service generates study content using artificial intelligence based on materials provided by the user.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 13 years of age to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You must provide accurate and complete information when registering.</li>
              <li>You must notify us immediately of any unauthorised use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable law or regulation</li>
              <li>Upload harmful, offensive, or illegal content</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its related systems</li>
              <li>Use automated tools (bots, scrapers) to access or extract data from the Service</li>
              <li>Interfere with the proper working of the Service</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">5. User Content</h2>
            <p>
              You retain ownership of any content you submit to the Service (such as syllabuses and topic lists). By submitting content, you grant DistillAI a non-exclusive, worldwide, royalty-free licence to use, process, and store that content solely for the purpose of providing the Service to you.
            </p>
            <p className="mt-3">
              You represent and warrant that you have the right to submit any content you provide, and that doing so does not violate any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">6. AI-Generated Content</h2>
            <p>
              DistillAI uses artificial intelligence to generate study plans, explanations, and flashcard content. While we strive for accuracy, AI-generated content may contain errors. You should verify important information against authoritative sources. We do not guarantee the accuracy, completeness, or suitability of AI-generated content for any particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">7. Third-Party Advertising</h2>
            <p>
              The Service may display advertisements served by Google AdSense and other third-party advertising networks. These third parties may use cookies to serve ads based on your prior visits to this website and other websites. We are not responsible for the content of third-party advertisements. Your interactions with advertisers are governed by the advertisers&apos; own terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">8. Intellectual Property</h2>
            <p>
              The DistillAI platform, including its design, features, and underlying code, is owned by DistillAI and protected by applicable intellectual property laws. You may not copy, reproduce, or create derivative works from any part of the Service without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">9. Disclaimers</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components. Your use of the Service is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, DistillAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or loss of study progress, arising out of or in connection with your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">11. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, if we reasonably believe you have violated these Terms. You may delete your account at any time through the account settings.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of material changes by posting an updated version on this page and updating the &quot;Last updated&quot; date. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-on-background mb-3">14. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:hello@distillai.tech" className="text-primary hover:underline">hello@distillai.tech</a>.
            </p>
          </section>
        </div>

        <hr className="border-outline-variant mt-12 mb-8" />
        <div className="flex gap-4 text-[13px] text-on-surface-variant">
          <Link to="/privacy-policy" className="hover:text-on-background transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-on-background transition-colors">Contact</Link>
          <span>·</span>
          <Link to="/" className="hover:text-on-background transition-colors">Home</Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
