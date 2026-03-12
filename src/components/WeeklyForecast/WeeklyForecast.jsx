import { motion } from "framer-motion";
import { Calendar, Cloud, Droplets } from "lucide-react";

// --- Royal Icon Component (Upgraded for 3D Feel) ---
const RoyalIcon = ({ iconCode, isToday }) => {
  if (!iconCode) return null;

  const code = iconCode.slice(0, 2);
  const isDay = iconCode.includes("d");

  const isClear = code === "01";
  const isCloud = ["02", "03", "04"].includes(code);
  const isRain = ["09", "10"].includes(code);

  const containerClass = "relative w-12 h-12 flex items-center justify-center";

  /* ---------- SUN ---------- */
  if (isClear && isDay) {
    return (
      <div className={containerClass}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 bg-gradient-to-tr from-yellow-300 via-orange-400 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)] z-10"
        />
        <div className="absolute inset-0 border-2 border-dashed border-orange-300/20 rounded-full animate-spin-slow" />
      </div>
    );
  }

  /* ---------- CLOUD ---------- */
  if (isCloud) {
    return (
      <div className={containerClass}>
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Cloud size={28} className={isToday ? "text-white" : "text-blue-400/80"} fill="currentColor" fillOpacity={0.2} />
        </motion.div>
      </div>
    );
  }

  /* ---------- RAIN ---------- */
  if (isRain) {
    return (
      <div className={containerClass}>
        <Cloud size={24} className={isToday ? "text-white/80" : "text-slate-400"} />
        <motion.div
          animate={{ y: [0, 4, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-1"
        >
          <Droplets size={16} className="text-blue-300" />
        </motion.div>
      </div>
    );
  }

  /* ---------- MOON ---------- */
  if (!isDay) {
    return (
      <div className={containerClass}>
        <motion.div
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="w-6 h-6 bg-gradient-to-tr from-indigo-200 to-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10"
        />
        <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
      </div>
    );
  }

  return null;
};

function WeeklyForecast({ forecast, isNight }) {
  if (!forecast) return null;

  const daily = Object.values(
    forecast.reduce((acc, item) => {
      const date = item.dt_txt.split(" ")[0];
      
      if (!acc[date]) {
        acc[date] = 
        {
          date,
          temps: [],
          icon: item.weather?.[0]?.icon,
          condition: item.weather?.[0]?.main
        };
      }
      
      acc[date].temps.push(item.main.temp);
      return acc;
    }, 
    {}
  )).map((day) => ({
    date: day.date,
    high: Math.max(...day.temps),
    low: Math.min(...day.temps),
    icon: day.icon,
    condition: day.condition
  }));


  return (
    <div className="w-full">
      {/* --- ROYAL HEADER --- */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-[3px] bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] opacity-40`}>
              Extended Outlook
            </p>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${isNight ? 'text-white' : 'text-slate-900'}`}>
            7-Day <span className="text-blue-500">Forecast</span>
          </h2>
        </div>
        <div className={`p-3.5 rounded-2xl border transition-all ${
          isNight ? 'bg-white/5 border-white/10 text-white/50' : 'bg-white border-slate-100 shadow-sm text-slate-400'
        }`}>
          <Calendar size={22} strokeWidth={2.5} />
        </div>
      </div>

      {/* --- FORECAST LIST --- */}
      <div className="space-y-4 px-2">
        {daily.slice(0, 7).map((day, index) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const isToday = index === 0;
          const highTemp = Math.round(day.high);
          const lowTemp = Math.round(day.low);

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              // Standard Hover Sync (y-lift + subtle scale)
              whileHover={{ y: -5, scale: 1.01 }}
              className={`flex items-center justify-between px-8 py-6 rounded-[35px] border transition-all duration-700 relative overflow-hidden group ${
                isToday 
                  ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 border-blue-400 text-white shadow-2xl shadow-blue-500/30" 
                  : isNight 
                    ? "bg-[#1a1c2e]/60 border-white/5 text-white" 
                    : "bg-white/60 backdrop-blur-3xl border-white text-slate-800 shadow-sm"
              }`}
            >
              {/* Day Name */}
              <div className="w-32">
                <p className={`text-base font-black tracking-tight ${isToday ? 'text-white' : 'text-slate-800'}`}>
                  {isToday ? "Today" : dayName}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest opacity-40`}>
                  {day.condition}
                </p>
              </div>

              {/* Icon Container */}
              <div className="flex-1 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                <RoyalIcon iconCode={day.icon} isToday={isToday} />
              </div>

              {/* Temp Range & Progress Bar */}
              <div className="flex items-center gap-6 w-56 justify-end">
                <span className="text-xs font-black opacity-40 w-8 text-right">{lowTemp}°</span>
                
                {/* Visual Range Bar */}
                <div className={`h-[8px] flex-1 max-w-[100px] rounded-full relative overflow-hidden ${
                  isToday ? 'bg-white/20' : 'bg-blue-500/10'
                }`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                    className={`absolute right-0 h-full rounded-full ${
                      isToday ? 'bg-white' : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    }`} 
                  />
                </div>

                <span className="text-xl font-black tracking-tighter w-10 text-right">{highTemp}°</span>
              </div>

              {/* Shine effect for Today */}
              {isToday && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>

      <style jsx>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

export default WeeklyForecast;