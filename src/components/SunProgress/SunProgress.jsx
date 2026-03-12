
import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

function SunProgress({ weather, isNight }) {
  if (!weather || !weather.sunrise || !weather.sunset) return null;

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

  const sunriseDate = new Date(weather.sunrise * 1000);
  const sunsetDate = new Date(weather.sunset * 1000);
  const now = new Date();

  const daylightDuration = sunsetDate - sunriseDate;
  const progress = daylightDuration > 0
      ? Math.max(0, Math.min(100, ((now - sunriseDate) / daylightDuration) * 100))
      : 0;

  // Visual constants
  const arcPath = "M 20 100 Q 150 -20 280 100";
  const textPrimary = isNight ? "text-white" : "text-slate-900";
  const textSecondary = isNight ? "text-white/60" : "text-slate-500";
  const taglineColor = isNight ? "text-white/80" : "text-slate-700";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }} 
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative p-8 min-h-[340px] flex flex-col justify-between overflow-hidden border rounded-[45px] shadow-2xl backdrop-blur-3xl transition-all duration-500 group
      ${isNight 
          ? "bg-white/[0.03] border-white/10 hover:border-white/20 shadow-black/40" 
          : "bg-white/40 border-white/40 shadow-blue-900/5 hover:border-blue-200"
        }`}
    >
      {/* Decorative Corner Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 transition-all duration-1000 ${isNight ? 'bg-indigo-600' : 'bg-amber-400'}`} />

      {/* Header Section */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${taglineColor}`}>
            Sun Path
          </p>
          <h3 className={`text-4xl font-black tracking-tighter ${textPrimary}`}>
            {now > sunsetDate ? "Night" : "Daylight"}
          </h3>
        </div>
        <div className={`p-4 rounded-[22px] border transition-all duration-300 group-hover:rotate-12 ${
          isNight 
            ? 'bg-white/5 border-white/10 text-indigo-400' 
            : 'bg-white shadow-sm border-slate-100 text-amber-500'
        }`}>
          {isNight ? <Moon size={24} strokeWidth={2.5} /> : <Sun size={24} strokeWidth={2.5} />}
        </div>
      </div>

      {/* Main Path Visualizer */}
      <div className="relative h-32 w-full flex items-end justify-center mt-12 mb-4">
        <svg viewBox="0 0 300 120" className="absolute top-0 w-full h-full overflow-visible">
          {/* Base Track */}
          <path
            d={arcPath}
            fill="none"
            stroke={isNight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
            strokeWidth="10"
            strokeLinecap="round"
          />
          
          {/* Progress Path */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 2.5, ease: "circOut" }}
            d={arcPath}
            fill="none"
            stroke="url(#sunPathGradient)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          
          <defs>
            <linearGradient id="sunPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isNight ? "#6366f1" : "#fbbf24"} />
              <stop offset="50%" stopColor={isNight ? "#818cf8" : "#f59e0b"} />
              <stop offset="100%" stopColor={isNight ? "#a5b4fc" : "#ea580c"} />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Sun/Moon Indicator */}
        <motion.div 
  className="absolute z-20"
  initial={{ left: "18%", bottom: "0px" }}
  animate={{ 
    left: `${18 + (progress * 0.64)}%`,
    bottom: progress > 0 && progress < 100
      ? `${Math.sin((progress / 100) * Math.PI) * 90}px`
      : "0px"
  }}
  transition={{ duration: 2.5, ease: "circOut" }}
  style={{ transform: 'translateX(-30%) translateY(50%)' }}
>
          <div className="relative">
            <div className={`absolute inset-0 blur-2xl opacity-60 animate-pulse ${isNight ? 'bg-indigo-500' : 'bg-amber-400'}`} />
            <div className={`relative p-3 rounded-full shadow-2xl border-2 transition-all duration-500 ${
                isNight ? 'bg-slate-900 border-indigo-500 shadow-indigo-500/20' : 'bg-white border-amber-200 shadow-amber-500/20'
            }`}>
                {isNight ? (
                    <Moon size={20} className="text-indigo-400 fill-indigo-400" />
                ) : (
                    <Sun size={20} className="text-amber-500 fill-amber-100" />
                )}
            </div>
          </div>
        </motion.div>

        {/* Labels underneath the start/end of arc */}
        <div className="flex justify-between w-full absolute -bottom-6 px-1">
          <div className="flex flex-col items-center">
            <p className={`text-xs font-black tracking-tighter ${textPrimary}`}>{formatTime(sunriseDate)}</p>
            <span className={`text-[9px] uppercase font-black tracking-widest opacity-40 ${textPrimary}`}>Sunrise</span>
          </div>
          <div className="flex flex-col items-center">
            <p className={`text-xs font-black tracking-tighter ${textPrimary}`}>{formatTime(sunsetDate)}</p>
            <span className={`text-[9px] uppercase font-black tracking-widest opacity-40 ${textPrimary}`}>Sunset</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Status Pill */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`mt-12 py-4 px-6 rounded-3xl flex items-center justify-center gap-3 transition-all border
        ${isNight 
            ? 'bg-white/[0.04] border-white/5' 
            : 'bg-white/60 border-white shadow-sm'
        }`}
      >
        <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.1)] ${now > sunsetDate ? 'bg-indigo-500' : 'bg-amber-500'}`} />
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSecondary}`}>
          {now > sunsetDate ? "Night mode active" : `${Math.round(100 - progress)}% Sunlight Left`}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default SunProgress;