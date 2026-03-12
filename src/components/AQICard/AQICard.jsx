

import { motion } from "framer-motion";
import { Activity, Wind, Info } from "lucide-react";

function AirQuality({ airQuality, isNight }) {
  if (!airQuality) return null;

  const aqi = airQuality?.main?.aqi || 1;

  // Optimized colors for maximum visibility on glass backgrounds
  const levels = {
    1: { label: "Good", color: isNight ? "text-emerald-400" : "text-emerald-600", bg: "bg-emerald-500", glow: "shadow-emerald-500/40" },
    2: { label: "Fair", color: isNight ? "text-yellow-400" : "text-yellow-600", bg: "bg-yellow-500", glow: "shadow-yellow-500/40" },
    3: { label: "Moderate", color: isNight ? "text-orange-400" : "text-orange-600", bg: "bg-orange-500", glow: "shadow-orange-500/40" },
    4: { label: "Poor", color: isNight ? "text-red-400" : "text-red-600", bg: "bg-red-500", glow: "shadow-red-500/40" },
    5: { label: "Very Poor", color: isNight ? "text-purple-400" : "text-purple-700", bg: "bg-purple-500", glow: "shadow-purple-500/40" }
  };

  const current = levels[aqi] || levels[1];
  
  // High-contrast text logic
  const textPrimary = isNight ? "text-white" : "text-slate-900";
  const textSecondary = isNight ? "text-white/70" : "text-slate-600";
  const taglineColor = isNight ? "text-white/80" : "text-slate-700";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 min-h-[320px] flex flex-col justify-between overflow-hidden border rounded-[45px] shadow-2xl backdrop-blur-3xl transition-all duration-500 group
      ${isNight 
          ? "bg-white/[0.03] border-white/10 hover:border-white/20 shadow-black/40" 
          : "bg-white/50 border-white/60 shadow-blue-900/10 hover:border-blue-200"
        }`}
    >
      {/* Decorative Glow - Always visible but never distracting */}
      <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[80px] opacity-20 transition-all duration-1000 ${current.bg}`} />

      {/* --- Header Section --- */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          {/* Tagline: Optimized with font-black and tracking for readability */}
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 drop-shadow-sm ${taglineColor}`}>
            Air Quality Index
          </p>
          <div className="flex items-center gap-3">
            <h3 className={`text-4xl font-black tracking-tighter drop-shadow-md ${current.color}`}>
              {current.label}
            </h3>
            <div className={`w-3 h-3 rounded-full animate-pulse ring-4 ${current.bg} ${current.glow} ring-current/20`} />
          </div>
        </div>
        
        <div className={`p-4 rounded-[22px] border transition-all duration-300 group-hover:rotate-12 ${
          isNight 
            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
            : 'bg-white shadow-sm border-slate-100 text-blue-600'
        }`}>
          <Activity size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* --- Interactive AQI Meter --- */}
      <div className="relative py-6 z-10">
        <div className="flex justify-between mb-4 px-1 text-[9px] font-black uppercase tracking-widest">
           <span className={isNight ? "text-emerald-400" : "text-emerald-600"}>Fresh Air</span>
           <span className={isNight ? "text-red-400" : "text-red-600"}>Hazardous</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className={`w-full h-3.5 rounded-full relative overflow-hidden p-0.5 ${isNight ? 'bg-black/40' : 'bg-slate-200/60'}`}>
          <div className="absolute inset-0 flex gap-1.5 px-1.5 py-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step}
                className={`flex-1 rounded-full transition-all duration-1000 ${
                  step <= aqi 
                    ? `${current.bg} opacity-100 shadow-[0_0_12px_rgba(255,255,255,0.3)]` 
                    : isNight ? "bg-white/5" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- Bottom Pollutants Grid --- */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        {[
          { label: "PM 2.5", val: airQuality?.components?.pm2_5 ?? 0, unit: "µg/m³", icon: <Wind size={14}/> },
          { label: "NO₂", val: airQuality?.components?.no2 ?? 0, unit: "µg/m³", icon: <Info size={14}/> }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-[28px] border transition-all duration-300 group/card
            ${isNight 
                ? 'bg-white/[0.05] border-white/5 hover:bg-white/[0.1] hover:border-white/20' 
                : 'bg-white/70 border-white shadow-sm hover:shadow-md hover:bg-white/90'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
               <span className={`${current.color} opacity-80 group-hover/card:opacity-100 transition-opacity`}>
                 {stat.icon}
               </span>
               <p className={`text-[9px] font-black uppercase tracking-widest ${textSecondary}`}>
                 {stat.label}
               </p>
            </div>
            
            <div className="flex items-baseline gap-1">
               <p className={`text-3xl font-black tracking-tighter ${textPrimary}`}>
                 {Math.round(stat.val)}
               </p>
               <span className={`text-[10px] font-black uppercase opacity-40 ${textPrimary}`}>
                 {stat.unit}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Background Decor */}
      <div className={`absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-15 transition-colors duration-1000 ${current.bg}`} />
    </motion.div>
  );
}

export default AirQuality;