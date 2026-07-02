import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input, PrimaryButton } from "../../components/common/ui";
const quickActions = [
  {
    icon: "cloud_upload",
    label: "Create a study plan",
    description: "Upload a PDF, paste notes, or start from a prompt.",
    to: "/study-plan/new",
  },
  {
    icon: "menu_book",
    label: "Find existing plans",
    description: "Search, filter, open topics, and manage old plans.",
    to: "/plans",
  },
  {
    icon: "style",
    label: "Review flashcards",
    description: "Study cards due today and finish a review session.",
    to: "/flashcards",
  },
  {
    icon: "manage_accounts",
    label: "Account settings",
    description: "Update profile details, password, and preferences.",
    to: "/profile",
  },
];

const helpSections = [
  {
    title: "Create and edit a study plan",
    icon: "post_add",
    actionLabel: "Open source material",
    to: "/study-plan/new",
    items: [
      {
        question: "A PDF will not process",
        answer:
          "Confirm the file is a PDF under 10MB. If it still fails, switch to Paste Syllabus and use the most important sections from the document.",
      },
      {
        question: "Generated topics look incomplete",
        answer:
          "Use Review Topics before creating the plan. Rename unclear topics, remove duplicates, and add missing topics while the source material is still fresh.",
      },
      {
        question: "I created the wrong plan",
        answer:
          "Open Study Plans, use the plan menu, and delete the plan only after confirming it is not the one you need.",
      },
    ],
  },
  {
    title: "Study plans and topics",
    icon: "library_books",
    actionLabel: "Open study plans",
    to: "/plans",
    items: [
      {
        question: "I cannot find a plan",
        answer:
          "Use the top search with the subject name, tag, or a phrase from the plan. Clear filters if the list looks unexpectedly empty.",
      },
      {
        question: "Progress looks stale",
        answer:
          "Open the topic and mark completed work inside the study flow. Progress updates from completed topics and review activity.",
      },
      {
        question: "A topic needs better material",
        answer:
          "Open the topic page and review the AI notes with the curated videos. Add a more specific plan later if the source was too broad.",
      },
    ],
  },
  {
    title: "Flashcard review",
    icon: "quiz",
    actionLabel: "Open review queue",
    to: "/flashcards",
    items: [
      {
        question: "No cards are due",
        answer:
          "That usually means the scheduler has no cards ready right now. Return after more study activity, or open a topic to continue learning.",
      },
      {
        question: "I picked the wrong rating",
        answer:
          "Continue the session. Future reviews will rebalance based on the next ratings, especially if you mark difficult cards as Again or Hard.",
      },
      {
        question: "A review did not sync",
        answer:
          "Keep the session open and check your connection. If the error persists, reload the queue and review the card again when it appears.",
      },
    ],
  },
  {
    title: "Account and security",
    icon: "verified_user",
    actionLabel: "Open profile",
    to: "/profile",
    items: [
      {
        question: "Profile changes are not saving",
        answer:
          "Check required fields, then save again.",
      },
      {
        question: "I need to change my password",
        answer:
          "Go to Profile Settings, use Account Security, enter your current password, then confirm the new password before updating.",
      },
      {
        question: "I am on a shared computer",
        answer:
          "Use Sign Out from the sidebar or Profile Settings when you finish studying.",
      },
    ],
  },
];

const normalize = (value) => value.toLowerCase().trim();

const HelpCenterPage = () => {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query);

  const visibleSections = useMemo(() => {
    if (!normalizedQuery) return helpSections;

    return helpSections
      .map((section) => {
        const sectionMatches = normalize(section.title).includes(normalizedQuery);
        const matchingItems = section.items.filter((item) =>
          normalize(`${item.question} ${item.answer}`).includes(normalizedQuery),
        );

        if (sectionMatches || matchingItems.length > 0) {
          return {
            ...section,
            items: sectionMatches ? section.items : matchingItems,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [normalizedQuery]);

  return (
    <div className="min-h-screen bg-background pb-safe text-on-background">
      <div className="mb-lg max-w-3xl">
        <h1 className="font-h1 text-h1 text-on-background">Help Center</h1>
        <p className="mt-xs max-w-2xl font-body-md text-body-md text-on-surface-variant">
          Find the next step when study plan creation, review scheduling, or
          account settings get in the way of studying.
        </p>
      </div>

      <section className="mb-lg rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg">
        <label
          htmlFor="help-search"
          className="mb-sm block font-label-md text-label-md text-on-surface-variant"
        >
          Search help topics
        </label>
        <div className="max-w-2xl">
          <Input
            id="help-search"
            type="search"
            icon="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search uploads, flashcards, progress, password..."
          />
        </div>
      </section>

      <div className="grid gap-lg xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-lg">
          <section className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-md">
            <h2 className="mb-sm font-label-md text-label-md text-on-surface-variant">
              Continue in DistillLearn
            </h2>
            <div className="divide-y divide-outline-variant/50">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group flex min-h-16 items-center gap-sm py-sm text-on-background outline-none transition-colors hover:text-primary focus-visible:text-primary"
                >
                  <span
                    className="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-outline-variant/60 bg-surface-container-low text-[20px] text-primary transition-colors group-hover:border-primary/50"
                    aria-hidden="true"
                  >
                    {action.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-body-sm text-body-sm font-semibold">
                      {action.label}
                    </span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant">
                      {action.description}
                    </span>
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px] text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-md">
            <div className="flex items-start gap-sm">
              <span
                className="material-symbols-outlined mt-0.5 text-[20px] text-secondary"
                aria-hidden="true"
              >
                support_agent
              </span>
              <div>
                <h2 className="font-body-sm text-body-sm font-semibold text-on-background">
                  Still blocked?
                </h2>
                <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                  Copy the exact error text, retry once, then return to the
                  related page from the links above. Your study plans stay
                  available from Study Plans.
                </p>
              </div>
            </div>
          </section>
        </aside>

        <main className="space-y-lg">
          {visibleSections.length > 0 ? (
            visibleSections.map((section) => (
              <section
                key={section.title}
                className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg"
              >
                <div className="mb-md flex flex-col gap-md border-b border-outline-variant/50 pb-md sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-sm">
                    <span
                      className="material-symbols-outlined mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-[20px] text-primary"
                      aria-hidden="true"
                    >
                      {section.icon}
                    </span>
                    <div>
                      <h2 className="font-h3 text-h3 text-on-background">
                        {section.title}
                      </h2>
                      <p className="mt-xs max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
                        Quick fixes and recovery paths for this part of your
                        study workflow.
                      </p>
                    </div>
                  </div>
                  <Link
                    to={section.to}
                    className="inline-flex min-h-11 items-center justify-center gap-xs rounded-lg border border-primary px-md py-2 font-label-md text-label-md text-primary transition-colors hover:bg-primary hover:text-on-primary focus-visible:bg-primary focus-visible:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    {section.actionLabel}
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </div>

                <div className="divide-y divide-outline-variant/50">
                  {section.items.map((item) => (
                    <article
                      key={item.question}
                      className="grid gap-xs py-md md:grid-cols-[220px_minmax(0,1fr)] md:gap-lg"
                    >
                      <h3 className="font-body-sm text-body-sm font-semibold text-on-background">
                        {item.question}
                      </h3>
                      <p className="max-w-[75ch] font-body-sm text-body-sm text-on-surface-variant">
                        {item.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <section className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-xl text-center">
              <h2 className="font-h3 text-h3 text-on-background">
                No matching help topics
              </h2>
              <p className="mx-auto mt-xs max-w-xl font-body-sm text-body-sm text-on-surface-variant">
                Try a task name like upload, flashcards, password, progress, or
                study plan.
              </p>
              <PrimaryButton
                type="button"
                onClick={() => setQuery("")}
                className="mt-md"
              >
                Clear search
              </PrimaryButton>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default HelpCenterPage;
