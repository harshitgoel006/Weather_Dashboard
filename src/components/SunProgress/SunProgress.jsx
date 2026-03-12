import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

function SunProgress({ weather, isNight }) {
  if (!weather) return null;

  const formatTime = (ts) => 
    new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  
  const sunrise = weather.sunrise;
  const sunset = weather.sunset;
  const now = Math.floor(Date.now() / 1000) + (weather.timezone || 0);
  
  // Logic: 0 at sunrise, 100 at sunset.
  const daylightDuration = sunset - sunrise;

const progress = daylightDuration > 0
  ? Math.max(0, Math.min(100, ((now - sunrise) / daylightDuration) * 100))
  : 0;

  // SVG Path constants
  const arcPath = "M 20 100 Q 150 -20 280 100";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      // Hover updated to match other components (y lift + subtle scale)
      whileHover={{ y: -8, scale: 1.01 }} 
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      // Background and Glass effect updated to match your dashboard style
      className={`relative p-8 min-h-[320px] flex flex-col justify-between overflow-hidden border rounded-[45px] shadow-xl ${
        isNight 
          ? "bg-[#1a1c2e]/60 border-white/5 text-white" 
          : "bg-white/60 backdrop-blur-3xl border-white text-slate-800"
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-40`}>
            Sun Path
          </p>
          <p className="text-xl font-black">{now > sunset ? "Night" : "Daylight"}</p>
        </div>
        <div className={`p-3 rounded-2xl ${isNight ? 'bg-white/5' : 'bg-slate-50'}`}>
            {isNight ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500" />}
        </div>
      </div>

      {/* Main Path Visualizer */}
      <div className="relative h-32 w-full flex items-end justify-center mt-6">
        <svg viewBox="0 0 300 120" className="absolute top-0 w-full h-full overflow-visible">
          {/* Base Track */}
          <path
            d={arcPath}
            fill="none"
            stroke={isNight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Progress Path with Glow */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 2.5, ease: "circOut" }}
            d={arcPath}
            fill="none"
            stroke="url(#sunPathGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.4))" }}
          />
          
          <defs>
            <linearGradient id="sunPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Sun Indicator */}
        <motion.div 
          className="absolute z-20"
          initial={{ left: "0%", bottom: "0px" }}
          animate={{ 
            left: `${progress}%`,
            bottom: progress > 0 && progress < 100
  ? `${Math.sin((progress / 100) * Math.PI) * 95}px`
  : "0px"
          }}
          transition={{ duration: 2.5, ease: "circOut" }}
          style={{ transform: 'translateX(-50%) translateY(50%)' }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-50 animate-pulse" />
            <div className={`relative p-2 rounded-full shadow-2xl border-2 ${
                isNight ? 'bg-slate-800 border-indigo-400' : 'bg-white border-amber-200'
            }`}>
                {isNight ? (
                    <Moon size={18} className="text-indigo-300 fill-indigo-300" />
                ) : (
                    <Sun size={18} className="text-amber-500 fill-amber-100 animate-spin-slow" />
                )}
            </div>
          </div>
        </motion.div>

        {/* Labels underneath the start/end of arc */}
        <div className="flex justify-between w-full absolute -bottom-4 px-1">
          <div className="flex flex-col items-center">
            <p className="text-[11px] font-black tracking-tighter">{formatTime(sunrise)}</p>
            <span className="text-[8px] uppercase font-bold opacity-40">Sunrise</span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[11px] font-black tracking-tighter">{formatTime(sunset)}</p>
            <span className="text-[8px] uppercase font-bold opacity-40">Sunset</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Status Pill (Screenshot Style) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-10 py-3 px-6 rounded-full flex items-center justify-center gap-3 transition-all border ${
            isNight 
              ? 'bg-white/5 border-white/10' 
              : 'bg-slate-50 border-slate-100 shadow-inner'
        }`}
      >
        <div className={`w-2 h-2 rounded-full animate-pulse ${now > sunset ? 'bg-indigo-400' : 'bg-amber-400'}`} />
        <p className={`text-[10px] font-black uppercase tracking-widest ${isNight ? 'text-indigo-200' : 'text-slate-600'}`}>
          {now > sunset ? "Night mode active" : `${Math.round(100 - progress)}% Sunlight Left`}
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}

export default SunProgress;