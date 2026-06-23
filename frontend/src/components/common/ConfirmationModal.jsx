import { useEffect } from "react";
import { PrimaryButton, SecondaryButton } from "./ui";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  isDestructive = false,
  isLoading = false,
}) => {
  // Prevent scrolling on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-background/40 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-[0_12px_24px_-20px_rgba(13,28,46,0.28)] animate-in fade-in zoom-in duration-200">
        <h3 className="font-h3 text-h3 text-on-background">
          {title}
        </h3>
        
        <p className="mt-md font-body-sm text-body-sm text-on-surface-variant">
          {message}
        </p>

        <div className="mt-xl flex flex-col gap-3 sm:flex-row sm:justify-end">
          <SecondaryButton
            type="button"
            className="w-full sm:w-auto"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </SecondaryButton>
          <button
            type="button"
            className={`inline-flex min-h-11 items-center justify-center gap-xs rounded-lg px-md py-2 font-label-md text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 w-full sm:w-auto ${
              isDestructive
                ? "bg-error text-on-error hover:bg-error/90 focus-visible:ring-error/20"
                : "bg-primary text-on-primary hover:bg-primary-container"
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
