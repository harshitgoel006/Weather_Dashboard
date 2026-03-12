import React from "react";
import { Sun, Moon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

function SunProgress({ weather, isNight }) {
  if (!weather || !weather.sunrise || !weather.sunset) return null;

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  const sunriseDate = new Date(weather.sunrise * 1000);
  const sunsetDate = new Date(weather.sunset * 1000);
  const now = new Date();
  
  const daylightDuration = sunsetDate - sunriseDate;
  const progress = daylightDuration > 0 ? Math.max(0, Math.min(100, ((now - sunriseDate) / daylightDuration) * 100)) : 0;
  const safeProgress = Math.max(0, Math.min(100, progress));

  // Style Config based on your strict feedback
  const textPrimary = isNight ? "text-white" : "text-black";
  const textSecondary = isNight ? "text-white/30" : "text-slate-500";
  const borderStyle = isNight ? "border-white/10" : "border-black/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 min-h-[360px] flex flex-col justify-between overflow-hidden border rounded-[40px] backdrop-blur-3xl transition-all duration-500 ${
        isNight ? "bg-white/[0.02]" : "bg-white/50"
      } ${borderStyle}`}
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start z-10">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${textSecondary}`}>
            Solar Position
          </p>
          <h3 className={`text-4xl font-black tracking-tighter uppercase ${textPrimary}`}>
            {now > sunsetDate ? "Night" : "Daylight"}
          </h3>
        </div>

        <div className={`p-4 rounded-2xl border transition-all shadow-sm ${
          isNight ? "bg-white/5 border-white/10 text-blue-400" : "bg-white border-black/5 text-orange-500"
        }`}>
          {isNight ? <Moon size={20} /> : <Sun size={20} className="animate-spin-slow" />}
        </div>
      </div>

      {/* COMPACT ARC VISUAL */}
      <div className="relative h-32 w-full flex items-center justify-center mt-4">
        <svg viewBox="0 0 300 120" className="w-full overflow-visible">
          <path
            d="M 20 110 Q 150 -10 280 110"
            fill="none"
            stroke={isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: safeProgress / 100 }}
            transition={{ duration: 2, ease: "circOut" }}
            d="M 20 110 Q 150 -10 280 110"
            fill="none"
            stroke={isNight ? "#6366f1" : "#f59e0b"}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        {/* TIME LABELS */}
        <div className="flex justify-between w-full absolute -bottom-4 px-1">
          <div className="flex flex-col">
            <span className={`text-[10px] font-black tracking-tighter ${textPrimary}`}>{formatTime(sunriseDate)}</span>
            <span className={`text-[8px] uppercase tracking-widest opacity-40 font-bold ${textPrimary}`}>Rise</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[10px] font-black tracking-tighter ${textPrimary}`}>{formatTime(sunsetDate)}</span>
            <span className={`text-[8px] uppercase tracking-widest opacity-40 font-bold ${textPrimary}`}>Set</span>
          </div>
        </div>
      </div>

      {/* FOOTER STATS BAR */}
      <div className={`mt-10 p-4 rounded-3xl border ${isNight ? 'bg-white/5 border-white/5' : 'bg-black/5 border-transparent'}`}>
        <div className="flex justify-between items-center mb-2 px-1">
          <span className={`text-[9px] font-black uppercase tracking-widest ${textSecondary}`}>Cycle</span>
          <span className={`text-xs font-black ${textPrimary}`}>{Math.round(safeProgress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safeProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full rounded-full ${isNight ? "bg-indigo-500" : "bg-orange-500"}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default SunProgress;