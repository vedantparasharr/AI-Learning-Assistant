import { Link } from "react-router-dom";

export const PageShell = ({ title, description, actions, children }) => (
  <div className="space-y-lg">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-xs">
        <h1 className="font-h1 text-h1 text-on-background">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex w-full flex-wrap gap-3 lg:w-auto">{actions}</div> : null}
    </div>
    {children}
  </div>
);

export const SectionCard = ({ title, description, action, children, className = "" }) => (
  <section
    className={`overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg shadow-[0_12px_24px_-20px_rgba(13,28,46,0.28)] ${className}`.trim()}
  >
    {(title || description || action) && (
      <div className="mb-md flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title ? (
            <h2 className="font-h3 text-h3 text-on-background">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    )}
    {children}
  </section>
);

export const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg shadow-[0_12px_24px_-20px_rgba(13,28,46,0.22)]">
    <p className="font-body-sm text-body-sm text-on-surface-variant">{label}</p>
    <p className="mt-sm font-h2 text-h2 text-on-background">{value}</p>
    {hint ? <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{hint}</p> : null}
  </div>
);

export const StatusBadge = ({ status }) => {
  const toneMap = {
    ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    generating: "bg-amber-50 text-amber-700 ring-amber-200",
    failed: "bg-rose-50 text-rose-700 ring-rose-200",
    pending: "bg-slate-100 text-slate-700 ring-slate-200",
    completed: "bg-sky-50 text-sky-700 ring-sky-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    locked: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-label-sm text-label-sm ring-1 ${toneMap[status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}
    >
      {status}
    </span>
  );
};

export const EmptyState = ({
  title,
  description,
  action,
  compact = false,
}) => (
  <div
    className={`rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-center ${compact ? "p-lg" : "p-xl"}`}
  >
    <h3 className="font-h3 text-h3 text-on-background">{title}</h3>
    <p className="mx-auto mt-xs max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
      {description}
    </p>
    {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
  </div>
);

export const LoadingState = ({ label = "Loading", fullScreen = false }) => (
  <div
    className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-60"}`}
  >
    <div
      className="flex items-center gap-3 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-5 py-3 font-body-sm text-body-sm text-on-surface-variant shadow-[0_8px_18px_-16px_rgba(13,28,46,0.28)]"
      aria-live="polite"
    >
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary motion-reduce:animate-none" />
      {label}
    </div>
  </div>
);

export const ErrorState = ({ title = "Something went wrong", description, action }) => (
  <div className="rounded-xl border border-error/20 bg-error-container p-lg text-on-error-container" role="alert">
    <h3 className="font-h3 text-h3">{title}</h3>
    {description ? <p className="mt-xs font-body-sm text-body-sm">{description}</p> : null}
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);

export const PrimaryButton = ({ className = "", children, ...props }) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center gap-xs rounded-lg bg-primary px-md py-2 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ className = "", children, ...props }) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
);

export const PrimaryLinkButton = ({ to, className = "", children }) => (
  <Link
    to={to}
    className={`inline-flex min-h-11 items-center justify-center gap-xs rounded-lg bg-primary px-md py-2 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${className}`.trim()}
  >
    {children}
  </Link>
);

export const InlineLinkButton = ({ to, className = "", children }) => (
  <Link
    to={to}
    className={`inline-flex min-h-11 items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${className}`.trim()}
  >
    {children}
  </Link>
);

export { default as ConfirmationModal } from "./ConfirmationModal";

