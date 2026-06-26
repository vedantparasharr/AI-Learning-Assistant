import { useState, useMemo } from "react";
import DayActivityModal from "./DayActivityModal";

const ActivityHeatmap = ({ heatmapData = {}, streak = 0, maxStreak = 0, totalActiveDays = 0, joinedAt = null }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const { monthName, year, days } = useMemo(() => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Day of week for 1st of month (0-6, where 0 is Sunday)
    // We want Monday as start, so adjust: (day + 6) % 7
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();
    
    const monthDays = [];
    
    // Leading empty days
    for (let i = 0; i < startDayOfWeek; i++) {
      monthDays.push(null);
    }
    
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      monthDays.push({
        day: d,
        date: dateStr,
        count: heatmapData[dateStr] || 0,
      });
    }

    return {
      monthName: viewDate.toLocaleString("default", { month: "long" }),
      year,
      days: monthDays,
    };
  }, [viewDate, heatmapData]);

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const isFutureMonth = useMemo(() => {
    const now = new Date();
    return viewDate.getFullYear() > now.getFullYear() || 
           (viewDate.getFullYear() === now.getFullYear() && viewDate.getMonth() >= now.getMonth());
  }, [viewDate]);

  const isPastMonthLimit = useMemo(() => {
    if (!joinedAt) return false;
    const joined = new Date(joinedAt);
    return viewDate.getFullYear() < joined.getFullYear() || 
           (viewDate.getFullYear() === joined.getFullYear() && viewDate.getMonth() <= joined.getMonth());
  }, [viewDate, joinedAt]);

  const getColorClass = (count) => {
    if (count === 0) return "bg-[#ebedf0] dark:bg-[#161b22]";
    if (count <= 5) return "bg-[#9be9a8] dark:bg-[#0e4429]";
    if (count <= 15) return "bg-[#40c463] dark:bg-[#006d32]";
    if (count <= 30) return "bg-[#30a14e] dark:bg-[#26a641]";
    return "bg-[#216e39] dark:bg-[#39d353]";
  };

  const isToday = (dateStr) => {
    return dateStr === new Date().toISOString().slice(0, 10);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/60 flex flex-col w-full h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Activity</h2>
        
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-on-surface font-semibold whitespace-nowrap">
            {monthName} {year}
          </span>
          <div className="flex gap-0.5">
            <button 
              onClick={() => changeMonth(-1)}
              disabled={isPastMonthLimit}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                isPastMonthLimit ? "opacity-20 cursor-not-allowed" : "hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            </button>
            <button 
              onClick={() => changeMonth(1)}
              disabled={isFutureMonth}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                isFutureMonth ? "opacity-20 cursor-not-allowed" : "hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Days of Week Labels */}
        <div className="grid grid-cols-7 gap-1 mb-1 text-center w-full">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="text-[10px] font-bold text-on-surface-variant opacity-30">
              {d}
            </span>
          ))}
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-7 gap-1 w-full">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
            
            return (
              <div
                key={day.date}
                onClick={() => day.count > 0 && setSelectedDate(day.date)}
                className={`aspect-square rounded-[2px] relative group transition-all duration-300 ${getColorClass(day.count)} ${
                  day.count > 0 ? "cursor-pointer hover:ring-1 hover:ring-primary/50" : "cursor-default"
                } ${
                  isToday(day.date) ? "ring-[1px] ring-primary ring-offset-[1px] ring-offset-surface" : ""
                }`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none whitespace-nowrap shadow-sm">
                  {day.count} • {day.date}
                </div>
              </div>
            );
            })}
            </div>
            </div>

            {/* Day Activity Modal */}
            {selectedDate && (
            <DayActivityModal 
            date={selectedDate} 
            onClose={() => setSelectedDate(null)} 
            />
            )}

            {/* Stats & Legend */}
      <div className="mt-4 pt-4 border-t border-outline-variant flex items-end justify-between">
        <div className="flex gap-6">
          <div>
            <p className="text-[9px] text-on-surface-variant uppercase font-bold opacity-50 leading-none mb-1.5">Total Active Days</p>
            <p className="text-[16px] font-bold text-on-surface leading-none">{totalActiveDays}</p>
          </div>
          <div>
            <p className="text-[9px] text-on-surface-variant uppercase font-bold opacity-50 leading-none mb-1.5">Max Streak</p>
            <p className="text-[16px] font-bold text-on-surface leading-none">{maxStreak}</p>
          </div>
          <div>
            <p className="text-[9px] text-on-surface-variant uppercase font-bold opacity-50 leading-none mb-1.5">Current Streak</p>
            <p className="text-[16px] font-bold text-on-surface leading-none">{streak}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-0.5">
          <div className="w-2 h-2 rounded-[1px] bg-[#ebedf0] dark:bg-[#161b22]" />
          <div className="w-2 h-2 rounded-[1px] bg-[#9be9a8] dark:bg-[#0e4429]" />
          <div className="w-2 h-2 rounded-[1px] bg-[#40c463] dark:bg-[#006d32]" />
          <div className="w-2 h-2 rounded-[1px] bg-[#30a14e] dark:bg-[#26a641]" />
          <div className="w-2 h-2 rounded-[1px] bg-[#216e39] dark:bg-[#39d353]" />
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
