import { Link } from "react-router-dom";

export const PageShell = ({ title, description, actions, breadcrumbs, children }) => (
  <div className="flex flex-col gap-xl">
    <div className="flex flex-col gap-md lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-xs flex-1 min-w-0">
        {breadcrumbs ? <div className="mb-md">{breadcrumbs}</div> : null}
        <h1 className="font-h1 text-h2 md:text-h1 text-on-surface tracking-tight break-words lg:max-w-[60%]">
          {title}
        </h1>
        {description ? (
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[65ch]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex w-full shrink-0 flex-wrap items-center gap-md lg:w-auto lg:justify-end">{actions}</div> : null}
    </div>
    {children}
  </div>
);

export const SectionCard = ({ title, description, action, children, className = "" }) => (
  <section
    className={`flex flex-col gap-lg overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg shadow-sm ${className}`.trim()}
  >
    {(title || description || action) && (
      <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-xs">
          {title ? (
            <h2 className="font-h3 text-h3 text-on-background tracking-tight">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[65ch]">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    )}
    {children}
  </section>
);

export const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg">
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
    className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-center ${compact ? "p-lg min-h-[200px]" : "p-xl min-h-[320px]"}`}
  >
    <h3 className="font-h3 text-h3 text-on-background tracking-tight">{title}</h3>
    <p className="mt-sm max-w-[65ch] font-body-sm text-body-sm text-on-surface-variant">
      {description}
    </p>
    {action ? <div className="mt-lg flex justify-center">{action}</div> : null}
  </div>
);

export const LoadingState = ({ label = "Loading", fullScreen = false }) => (
  <div
    className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-60"}`}
  >
    <div
      className="flex items-center gap-3 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-5 py-3 font-body-sm text-body-sm text-on-surface-variant"
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
    className={`inline-flex min-h-11 items-center justify-center gap-xs rounded-lg bg-primary px-md py-2 font-label-md text-label-md text-on-primary transition-colors hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
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
    className={`inline-flex min-h-11 items-center justify-center gap-xs rounded-lg bg-primary px-md py-2 font-label-md text-label-md text-on-primary transition-colors hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${className}`.trim()}
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

export const TextLink = ({ to, className = "", children, ...props }) => (
  <Link
    to={to}
    className={`font-label-md text-label-md text-primary hover:text-primary-container hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded ${className}`.trim()}
    {...props}
  >
    {children}
  </Link>
);

export const IconButton = ({ 
  icon, 
  variant = "ghost", // ghost, danger
  className = "", 
  children,
  ...props 
}) => {
  const variants = {
    ghost: "text-on-surface-variant/50 hover:bg-surface-container-high hover:text-on-surface focus-visible:ring-primary/50",
    danger: "text-on-surface-variant/50 hover:bg-error-container hover:text-error focus-visible:ring-error/50",
  };
  
  return (
    <button
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed before:absolute before:-inset-2 before:content-[''] ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      {children}
    </button>
  );
};

export const Input = ({
  id,
  label,
  error,
  icon,
  className = "",
  containerClassName = "",
  ...props
}) => {
  const inputId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`w-full ${containerClassName}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className="block font-label-md text-label-md text-on-surface mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`min-h-[44px] block w-full py-2 bg-surface-container-lowest border rounded-lg font-body-md text-[16px] md:text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:ring-2 ${icon ? "pl-11 pr-4" : "px-md"
            } ${error
              ? "border-error focus:border-error focus:ring-error/20"
              : "border-outline-variant/60 focus:border-primary focus:ring-primary/20"
            } ${className}`.trim()}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-xs font-label-sm text-label-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export const Textarea = ({
  id,
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}) => {
  const inputId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`w-full ${containerClassName}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className="block font-label-md text-label-md text-on-surface mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`block w-full px-sm py-2.5 bg-surface-container-lowest border rounded-lg font-body-md text-[16px] md:text-body-md text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors focus:ring-2 resize-y min-h-[100px] ${error
            ? "border-error focus:border-error focus:ring-error/20"
            : "border-outline-variant/60 focus:border-primary focus:ring-primary/20"
          } ${className}`.trim()}
        {...props}
      />
      {error && (
        <p className="mt-xs font-label-sm text-label-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export const Checkbox = ({
  id,
  label,
  className = "",
  containerClassName = "",
  ...props
}) => {
  const inputId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`flex items-center gap-2 ${containerClassName}`.trim()}>
      <input
        id={inputId}
        type="checkbox"
        className={`h-4 w-4 rounded border border-outline-variant/60 text-primary focus:ring-primary/20 focus:ring-2 bg-surface-container-lowest ${className}`.trim()}
        {...props}
      />
      {label && (
        <label
          htmlFor={inputId}
          className="font-label-md text-label-md text-on-surface select-none cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export { default as ConfirmationModal } from "./ConfirmationModal";

