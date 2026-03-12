import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, BellRing } from "lucide-react";
import { useState, useEffect } from "react";
import { getWeatherAlert } from "../../utils/helpers";

function WeatherAlert({ weather, isNight }) {
  const [isVisible, setIsVisible] = useState(true);
  const alert = getWeatherAlert(weather);

  // Jab weather change ho, alert wapas dikhao
  useEffect(() => {
    if (alert) setIsVisible(true);
  }, [alert]);

  if (!alert || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        // Sticky positioning taaki scroll ke saath top par fix rahe
        className="fixed top-6 left-0 right-0 z-[9999] px-4 flex justify-center pointer-events-none"
      >
        <div className={`
          pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[28px] border backdrop-blur-2xl shadow-2xl max-w-2xl w-full
          ${isNight 
            ? "bg-red-500/10 border-red-500/30 text-red-200 shadow-red-900/20" 
            : "bg-white/90 border-red-200 text-red-600 shadow-xl"}
        `}>
          {/* Animated Icon */}
          <div className={`p-2.5 rounded-2xl ${isNight ? 'bg-red-500/20' : 'bg-red-50'}`}>
            <AlertTriangle size={20} className="animate-pulse" />
          </div>

          <div className="flex-1 font-sans">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-50`}>
                Weather Advisory
              </span>
              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
            </div>
            <p className="text-sm font-bold tracking-tight leading-tight">
              {alert}
            </p>
          </div>

          {/* Dismiss Button */}
          <button 
            onClick={() => setIsVisible(false)}
            className={`p-2 rounded-xl transition-all ${
              isNight ? 'hover:bg-white/5 text-white/40' : 'hover:bg-slate-100 text-slate-400'
            }`}
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* --- STYLING FOR PULSE EFFECT --- */}
        <style jsx>{`
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .7; transform: scale(1.05); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

export default WeatherAlert;