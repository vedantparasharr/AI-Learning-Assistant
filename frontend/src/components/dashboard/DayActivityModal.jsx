import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";

const DayActivityModal = ({ date, onClose }) => {
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await dashboardService.getActivityByDate(date);
        if (res?.success) {
          setActivity(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch day activity", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (date) fetchActivity();
  }, [date]);

  if (!date) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-on-background/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md border border-surface-container-high animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <header className="p-4 border-b border-surface-container-high flex justify-between items-center bg-surface-container-low shrink-0">
          <div>
            <h3 className="font-h3 text-[18px] text-on-surface">Study Breakdown</h3>
            <p className="text-[12px] text-on-surface-variant font-medium">
              {new Date(date).toLocaleDateString("default", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[12px] text-on-surface-variant animate-pulse">Analyzing logs...</p>
            </div>
          ) : activity ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-primary mb-1">Total Cards</span>
                  <span className="text-2xl font-display text-on-surface">{activity.totalReviews}</span>
                </div>
                <div className="bg-secondary/5 rounded-xl p-3 border border-secondary/10">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-secondary mb-1">New Learned</span>
                  <span className="text-2xl font-display text-on-surface">{activity.typeBreakdown.new}</span>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div>
                <h4 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">By Subject</h4>
                <div className="space-y-3">
                  {activity.subjects.length > 0 ? activity.subjects.map((subject) => {
                    // Format topic_key to Title Case
                    const formattedName = subject.name
                      ? subject.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                      : "Unknown Topic";

                    return (
                    <div key={subject.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="font-semibold text-on-surface truncate pr-2" title={formattedName}>{formattedName}</span>
                        <span className="text-on-surface-variant font-medium shrink-0">{subject.count} cards</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(subject.review / subject.count) * 100}%` }} 
                        />
                        <div 
                          className="h-full bg-secondary-container" 
                          style={{ width: `${(subject.new / subject.count) * 100}%` }} 
                        />
                      </div>
                    </div>
                  )}) : (
                    <p className="text-[13px] text-on-surface-variant italic">No subjects recorded.</p>
                  )}
                </div>
              </div>

              {/* Legend for the tiny progress bars */}
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[11px] text-on-surface-variant">Review</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-secondary-container" />
                  <span className="text-[11px] text-on-surface-variant">New</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-on-surface-variant text-[14px]">No activity recorded for this day.</p>
            </div>
          )}
        </div>

        <footer className="p-4 bg-surface-container-low border-t border-surface-container-high flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-on-surface text-surface rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DayActivityModal;
