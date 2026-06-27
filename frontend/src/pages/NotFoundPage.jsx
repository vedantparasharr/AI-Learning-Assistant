import { PrimaryLinkButton, InlineLinkButton } from "../components/common/ui";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-background px-6 selection:bg-surface-variant selection:text-on-background font-sans">
      <div className="max-w-[440px] w-full text-center sm:text-left flex flex-col items-center sm:items-start">
        
        <div className="font-mono text-[12px] font-medium tracking-widest uppercase text-on-surface-variant mb-4">
          Error 404
        </div>
        
        <h1 className="text-[26px] font-semibold tracking-tight text-on-background mb-3">
          Page not found
        </h1>
        
        <p className="text-[15px] text-on-surface-variant leading-relaxed mb-10">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2">
          <PrimaryLinkButton to="/dashboard" className="w-full sm:w-auto">
            Go to dashboard
          </PrimaryLinkButton>
          <InlineLinkButton to="/study-plan/new" className="w-full sm:w-auto">
            Build a study plan
          </InlineLinkButton>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;

