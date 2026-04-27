import { Link } from "react-router-dom";

const HelpCenterPage = () => {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-safe">
      <div className="mb-margin max-w-3xl">
        <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-xs">
          Support
        </p>
        <h1 className="font-h1 text-h1 text-on-background">Help Center</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Quick guidance for study plans, profile management, and review
          sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_rgba(26,20,107,0.15)] p-md border-t-2 border-primary">
          <div className="flex items-center gap-3 mb-md">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">help</span>
            </div>
            <h2 className="font-h3 text-h3 text-on-background">
              Getting Started
            </h2>
          </div>
          <div className="space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <p>Upload a document or paste notes to create a new study plan.</p>
            <p>
              Review generated topics, then open a topic page to read the AI
              notes and curated videos.
            </p>
            <p>Use the flashcard review queue to study what is due today.</p>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_rgba(26,20,107,0.15)] p-md border-t-2 border-secondary">
          <div className="flex items-center gap-3 mb-md">
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">person</span>
            </div>
            <h2 className="font-h3 text-h3 text-on-background">Account Help</h2>
          </div>
          <div className="space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <p>
              Update your username, email, and profile image from the profile
              page.
            </p>
            <p>Use the Sign Out action in the sidebar to end your session.</p>
            <p>
              Resetting your password can be done from the profile page security
              section.
            </p>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_rgba(26,20,107,0.15)] p-md border-t-2 border-primary-container lg:col-span-2">
          <div className="flex items-center gap-3 mb-md">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <h2 className="font-h3 text-h3 text-on-background">
              Study Plan Tips
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
              Search study plans from the top bar using a subject name or a
              snippet from the plan.
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
              Open the three-dot menu on a plan card to delete it if it is no
              longer needed.
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
              Mark topics completed to keep plan progress and mastery data up to
              date.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenterPage;
