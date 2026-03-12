import { motion } from "framer-motion";

// --- Upgraded Premium Royal Icon Components ---
const WeatherIcon = ({ type, isCurrent, isNight }) => {
  if (!type) return null;

  const code = type.slice(0, 2);
  const isDay = type.includes("d");

  const isClear = code === "01";
  const isCloud = ["02", "03", "04"].includes(code);
  const isRain = ["09", "10"].includes(code);
  const isStorm = code === "11";
  const isSnow = code === "13";

  // Shared container style to keep icons centered
  const containerClass = "relative w-16 h-16 flex items-center justify-center";

  /* ---------- PREMIUM SUN ---------- */
  if (isClear && isDay) {
    return (
      <div className={containerClass}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 bg-gradient-to-tr from-yellow-300 via-orange-400 to-yellow-500 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.6)] z-10"
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-3 bg-orange-400/40 rounded-full"
            style={{ rotate: i * 45, translateY: -18 }}
            animate={{ opacity: [0.3, 1, 0.3], scaleY: [1, 1.3, 1] }}
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
          animate={{ y: [0, -4, 0], x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`relative ${isCurrent ? 'text-white' : 'text-slate-300'}`}
        >
          <div className={`w-12 h-6 ${isCurrent ? 'bg-white/90' : 'bg-current'} rounded-full shadow-lg relative`}>
            <div className={`absolute -top-4 left-2 w-7 h-7 ${isCurrent ? 'bg-white/90' : 'bg-current'} rounded-full`} />
            <div className={`absolute -top-2 right-1 w-6 h-6 ${isCurrent ? 'bg-white/90' : 'bg-current'} rounded-full`} />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---------- GLOSSY RAIN ---------- */
  if (isRain) {
    return (
      <div className={containerClass}>
        <div className={`w-12 h-6 ${isCurrent ? 'bg-white/80' : 'bg-slate-300'} rounded-full relative z-10 shadow-sm`}>
           <div className={`absolute -top-3 left-3 w-6 h-6 ${isCurrent ? 'bg-white/80' : 'bg-slate-300'} rounded-full`} />
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 20, opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
            className={`absolute top-8 w-[2px] h-3 ${isCurrent ? 'bg-blue-200' : 'bg-blue-400'} rounded-full`}
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
        <div className="w-12 h-6 bg-slate-500 rounded-full relative z-10" />
        <motion.path
          animate={{ opacity: [0, 1, 0, 1, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute top-8 text-yellow-400 fill-current"
          style={{ filter: "drop-shadow(0 0 8px #facc15)" }}
        >
          <svg width="20" height="24" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </motion.path>
      </div>
    );
  }

  /* ---------- CRYSTAL SNOW ---------- */
  if (isSnow) {
    return (
      <div className={containerClass}>
        <div className={`w-10 h-5 ${isCurrent ? 'bg-white/90' : 'bg-slate-200'} rounded-full`} />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, 15], rotate: 360, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            className={`absolute top-6 text-[10px] ${isCurrent ? 'text-blue-100' : 'text-blue-300'}`}
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
          className={`w-9 h-9 bg-gradient-to-tr from-indigo-300 to-white rounded-full shadow-[0_0_25px_rgba(199,210,254,0.5)] relative overflow-hidden z-10`}
        >
          <div className="absolute top-2 left-2 w-2 h-2 bg-slate-400/20 rounded-full" />
          <div className="absolute bottom-3 right-2 w-1.5 h-1.5 bg-slate-400/20 rounded-full" />
        </motion.div>
        <motion.div 
           animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.8, 0.2] }}
           transition={{ duration: 3, repeat: Infinity }}
           className="absolute top-0 right-0 text-yellow-200 text-[10px]"
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
  .filter(item => new Date(item.dt_txt).getTime() > now)
  .slice(0, 8);
  const currentHour = new Date().getHours();

  return (
    <div className="w-full py-8">
      {/* --- HEADER --- */}
      <div className="flex items-end justify-between mb-10 px-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-[3px] bg-blue-500 rounded-full" />
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] opacity-40`}>
              Chronos Timeline
            </p>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${isNight ? 'text-white' : 'text-slate-900'}`}>
            Hourly <span className="text-blue-500">Pulse</span>
          </h2>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${
          isNight ? 'bg-white/5 border-white/10 text-white/50' : 'bg-white border-slate-100 text-slate-500 shadow-sm'
        }`}>
          Next 24 Hours
        </div>
      </div>

      {/* --- SCROLLABLE TIMELINE --- */}
      <div className="flex gap-6 overflow-x-auto pb-12 pt-4 no-scrollbar scroll-smooth px-4">
        {next24.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const hour = date.getHours();
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const itemTime = new Date(item.dt_txt).getTime();
          const isCurrent = Math.abs(itemTime - Date.now()) < 3 * 60 * 60 * 1000;

          return (
            <motion.div
              key={index.dt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              // Syncing hover with other components (y lift + scale)
              whileHover={{ y: -8, scale: 1.02 }} 
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`min-w-[145px] relative transition-all duration-700 border rounded-[45px] p-8 flex flex-col items-center justify-between gap-5 shadow-xl group cursor-pointer ${
                isCurrent 
                  ? "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 text-white border-blue-400 ring-[6px] ring-blue-500/15" 
                  : isNight 
                    ? "bg-[#1a1c2e]/60 border-white/5 text-white" 
                    : "bg-white/60 backdrop-blur-3xl border-white text-slate-800"
              }`}
            >
              {/* Shimmer Effect for Active Card */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-[45px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
              )}

              {/* Time */}
              <p className={`text-[11px] font-black tracking-[0.15em] ${isCurrent ? "text-blue-100" : "text-blue-500"}`}>
                {displayHour} {ampm}
              </p>

              {/* ICON */}
              <div className="relative transform group-hover:scale-110 transition-transform duration-500 ease-out">
                <WeatherIcon type={item.weather?.[0]?.icon} isCurrent={isCurrent} isNight={isNight} />
              </div>

              {/* Temp & Condition */}
              <div className="text-center z-10">
                <p className="text-3xl font-black tracking-tighter mb-1">
                  {Math.round(item.main.temp)}°
                </p>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                  isCurrent ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {item.weather?.[0]?.main}
                </div>
              </div>

              {/* Bottom Indicator for Current */}
              {isCurrent && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute -bottom-1 w-12 h-1.5 bg-white rounded-full shadow-[0_0_20px_#fff]" 
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