import { motion } from "framer-motion";
import React from "react";

// --- Upgraded Premium Royal Icon Components ---
export const WeatherIcon = ({ type, isCurrent, isNight }) => {
  if (!type) return null;

  const code = type.slice(0, 2);
  const isDay = type.includes("d");

  const isClear = code === "01";
  const isCloud = ["02", "03", "04"].includes(code);
  const isRain = ["09", "10"].includes(code);
  const isStorm = code === "11";
  const isSnow = code === "13";

  const containerClass = "relative w-14 h-14 flex items-center justify-center";

  /* ---------- PREMIUM SUN ---------- */
  if (isClear && isDay) {
    return (
      <div className={containerClass}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 bg-gradient-to-tr from-yellow-300 via-orange-400 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)] z-10"
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-2.5 bg-orange-400/40 rounded-full"
            style={{ rotate: i * 45, translateY: -15 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    );
  }

  /* ---------- 3D CLOUD ---------- */
  if (isCloud) {
    return (
      <div className={containerClass}>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`relative ${isCurrent ? 'text-white' : isNight ? 'text-white/40' : 'text-slate-400'}`}
        >
          <div className={`w-10 h-5 ${isCurrent ? 'bg-white/90' : 'bg-current'} rounded-full shadow-md relative`}>
            <div className={`absolute -top-3 left-1.5 w-6 h-6 ${isCurrent ? 'bg-white/90' : 'bg-current'} rounded-full`} />
            <div className={`absolute -top-1.5 right-1 w-5 h-5 ${isCurrent ? 'bg-white/90' : 'bg-current'} rounded-full`} />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---------- GLOSSY RAIN ---------- */
  if (isRain) {
    return (
      <div className={containerClass}>
        <div className={`w-10 h-5 ${isCurrent ? 'bg-white/80' : isNight ? 'bg-white/40' : 'bg-slate-300'} rounded-full relative z-10 shadow-sm`}>
           <div className={`absolute -top-2.5 left-2.5 w-5 h-5 ${isCurrent ? 'bg-white/80' : isNight ? 'bg-white/40' : 'bg-slate-300'} rounded-full`} />
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: 15, opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            className={`absolute top-6 w-[1.5px] h-2.5 ${isCurrent ? 'bg-blue-200' : 'bg-blue-400'}`}
            style={{ left: `${35 + i * 15}%` }}
          />
        ))}
      </div>
    );
  }

  /* ---------- NEON THUNDER ---------- */
  if (isStorm) {
    return (
      <div className={containerClass}>
        <div className={`w-10 h-5 ${isNight ? 'bg-slate-700' : 'bg-slate-400'} rounded-full relative z-10`} />
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute top-7 text-yellow-400"
          style={{ filter: "drop-shadow(0 0 5px #facc15)" }}
        >
          <svg width="16" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </motion.div>
      </div>
    );
  }

  /* ---------- CRYSTAL SNOW ---------- */
  if (isSnow) {
    return (
      <div className={containerClass}>
        <div className={`w-9 h-4.5 ${isCurrent ? 'bg-white/90' : isNight ? 'bg-white/20' : 'bg-slate-200'} rounded-full`} />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, 12], rotate: 360, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            className={`absolute top-5 text-[8px] ${isCurrent ? 'text-blue-100' : 'text-blue-300'}`}
            style={{ left: `${30 + i * 20}%` }}
          >
            ❄
          </motion.div>
        ))}
      </div>
    );
  }

  /* ---------- STARRY NIGHT MOON ---------- */
  if (!isDay || code === "01n") {
    return (
      <div className={containerClass}>
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`w-8 h-8 bg-gradient-to-tr from-indigo-300 to-white rounded-full shadow-[0_0_20px_rgba(199,210,254,0.4)] relative overflow-hidden z-10`}
        >
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-slate-400/20 rounded-full" />
        </motion.div>
        <motion.div 
           animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.8, 0.2] }}
           transition={{ duration: 3, repeat: Infinity }}
           className="absolute top-0 right-0 text-yellow-200 text-[8px]"
        >✦</motion.div>
      </div>
    );
  }

  return null;
};


function HourlyForecast({ forecast, isNight }) {
  if (!forecast) return null;

  const now = Date.now();
  const next24 = forecast
    .filter(item => new Date(item.dt * 1000).getTime() > (now - 3600 * 1000))
    .slice(0, 12);
  
  return (
    <div className="w-full py-6">
      {/* --- HEADER --- */}
      <div className="flex items-end justify-between mb-8 px-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-10 h-[2px] rounded-full ${isNight ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-blue-600'}`} />
            <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isNight ? 'text-white/40' : 'text-slate-500'}`}>
              Chronos Timeline
            </p>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${isNight ? 'text-white' : 'text-slate-900'}`}>
            Hourly <span className="text-blue-500">Pulse</span>
          </h2>
        </div>
        <div className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
          isNight ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-slate-100 text-slate-500 shadow-sm'
        }`}>
          Cycle Forecast
        </div>
      </div>

      {/* --- SCROLLABLE TIMELINE --- */}
      <div className="flex gap-4 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth px-4">
        {next24.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const hour = date.getHours();
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const itemTime = item.dt * 1000;
          const isCurrent = Math.abs(itemTime - Date.now()) < 60 * 60 * 1000;

          return (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6, scale: 1.02 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`min-w-[140px] relative transition-all duration-500 border rounded-[35px] p-6 flex flex-col items-center justify-between gap-4 shadow-lg group cursor-pointer ${
                isCurrent 
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-400 ring-4 ring-blue-500/10" 
                  : isNight 
                    ? "bg-white/[0.03] border-white/5 text-white hover:border-white/10" 
                    : "bg-white/40 border-slate-200/60 text-slate-800 hover:bg-white/60"
              }`}
            >
              {isCurrent && (
                <div className="absolute inset-0 rounded-[35px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
              )}

              {/* Time */}
              <p className={`text-[10px] font-black tracking-[0.1em] ${isCurrent ? "text-blue-100" : isNight ? "text-white/40" : "text-slate-400"}`}>
                {displayHour} {ampm}
              </p>

              {/* ICON */}
              <div className="relative transform group-hover:scale-110 transition-transform duration-500 ease-out">
                <WeatherIcon type={item.weather?.[0]?.icon} isCurrent={isCurrent} isNight={isNight} />
              </div>

              {/* Temp & Condition */}
              <div className="text-center z-10">
                <p className={`text-2xl font-black tracking-tighter mb-1 ${isCurrent ? 'text-white' : isNight ? 'text-white/90' : 'text-slate-900'}`}>
                  {Math.round(item.main.temp ?? 0)}°
                </p>
                <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider inline-block ${
                  isCurrent ? 'bg-white/20 text-white' : isNight ? 'bg-white/10 text-white/50' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {item.weather?.[0]?.main}
                </div>
              </div>

              {isCurrent && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute -bottom-1 w-10 h-1 bg-white rounded-full shadow-[0_0_15px_#fff]" 
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

export default HourlyForecast;