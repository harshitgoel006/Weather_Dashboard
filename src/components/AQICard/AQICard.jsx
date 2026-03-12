import { motion } from "framer-motion";
import { Activity } from "lucide-react";

function AirQuality({ airQuality, isNight }) {
  if (!airQuality) return null;

 const aqi = airQuality?.main?.aqi || 1
  
  const levels = {
    1: { label: "Good", color: "text-emerald-500", dot: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
    2: { label: "Fair", color: "text-amber-500", dot: "bg-amber-500", shadow: "shadow-amber-500/20" },
    3: { label: "Moderate", color: "text-orange-500", dot: "bg-orange-500", shadow: "shadow-orange-500/20" },
    4: { label: "Poor", color: "text-red-500", dot: "bg-red-500", shadow: "shadow-red-500/20" },
    5: { label: "Very Poor", color: "text-purple-600", dot: "bg-purple-600", shadow: "shadow-purple-500/20" }
  };

  const current = levels[aqi] || levels[1];

  return (
    <motion.div 
      // Bug Fix: transition-all class hata di hai conflict rokne ke liye
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative p-8 min-h-[300px] flex flex-col justify-between overflow-hidden border rounded-[45px] shadow-xl ${
        isNight 
          ? "bg-slate-900/40 border-white/5 text-white" 
          : "bg-white/60 backdrop-blur-3xl border-white text-slate-900"
      }`}
    >
      {/* --- Top Header --- */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40`}>
            Air Quality Index
          </p>
          <div className="flex items-center gap-2">
            <h3 className={`text-3xl font-black tracking-tighter ${current.color}`}>
              {current.label}
            </h3>
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${current.dot} ${current.shadow}`} />
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${isNight ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
          <Activity size={22} className={isNight ? "text-white" : "text-blue-500"} />
        </div>
      </div>

      {/* --- Modern AQI Meter (Matches Dashboard Feel) --- */}
      <div className="relative py-4">
        <div className="flex justify-between mb-3 px-1 opacity-40 text-[10px] font-black uppercase tracking-widest">
           <span>Clean</span>
           <span>Hazardous</span>
        </div>
        <div className={`w-full h-2.5 p-1 rounded-full flex gap-2 ${isNight ? 'bg-black/20' : 'bg-slate-100'}`}>
          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step}
              className={`flex-1 rounded-full transition-all duration-700 ${
                step <= aqi 
                  ? current.dot 
                  : (isNight ? 'bg-white/5' : 'bg-slate-200')
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- Bottom Stats (Refined Mini Bento) --- */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        {[
          { label: "PM 2.5", val: airQuality?.components?.pm2_5 ?? 0, unit: "µg/m³" },
          { label: "NO₂", val: airQuality?.components?.no2 ?? 0, unit: "µg/m³" }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-[24px] border transition-all ${
              isNight 
                ? 'bg-white/5 border-white/5' 
                : 'bg-white/80 border-slate-50 shadow-sm'
            }`}
          >
            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 opacity-40`}>
              {stat.label}
            </p>
            <div className="flex items-baseline gap-1">
               <p className="text-2xl font-black tracking-tighter">{Math.round(stat.val)}</p>
               <span className="text-[9px] font-bold opacity-30 uppercase">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Background Decor (Subtle Glow) */}
      <div className={`absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-[60px] opacity-10 ${current.dot}`} />
    </motion.div>
  );
}

export default AirQuality;