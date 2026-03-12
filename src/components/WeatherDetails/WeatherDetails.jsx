import { motion } from "framer-motion";
import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset, Activity } from "lucide-react";

function WeatherDetails({ weather, isNight }) {
  if (!weather) return null;

  const formatTime = (ts) => {
    if (typeof ts === 'string') return ts;
    return new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const details = [
    { label: "Humidity", value: weather.humidity, unit: "%", icon: <Droplets size={20} />, color: "text-blue-400" },
    { label: "Wind Speed", value: Math.round((weather.windSpeed || weather.wind) * 3.6), unit: "km/h", icon: <Wind size={20} />, color: "text-teal-400" },
    { label: "Pressure", value: weather.pressure, unit: "hPa", icon: <Gauge size={20} />, color: "text-orange-400" },
    { label: "Visibility", value: Math.round((weather.visibility ?? 1000) / 1000), unit: "km", icon: <Eye size={20} />, color: "text-purple-400" },
    { label: "Sunrise", value: formatTime(weather.sunrise), unit: "", icon: <Sunrise size={20} />, color: "text-amber-400" },
    { label: "Sunset", value: formatTime(weather.sunset), unit: "", icon: <Sunset size={20} />, color: "text-rose-400" }
  ];

  return (
    <div className="w-full py-2">
      {/* --- ROYAL HEADER --- */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-[3px] bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-40`}>
              Instrumentation
            </p>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${isNight ? 'text-white' : 'text-slate-900'}`}>
            Meteorological <span className="text-blue-500">Stats</span>
          </h2>
        </div>
      </div>

      {/* --- BENTO GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {details.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
            // Uniform Hover: lifting and slight scale match with other components
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group relative p-7 rounded-[40px] border transition-all duration-700 overflow-hidden shadow-xl ${
              isNight 
                ? "bg-[#1a1c2e]/60 border-white/5 text-white" 
                : "bg-white/60 backdrop-blur-3xl border-white text-slate-800"
            }`}
          >
            {/* Background Glow Effect - Logic remained, opacity refined for glass style */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 bg-radial-gradient ${item.color.replace('text', 'bg')}`} />

            <div className="relative z-10 flex flex-col gap-5">
              {/* Icon Pod */}
              <div className={`p-4 rounded-2xl w-fit transition-all duration-700 ${
                isNight 
                  ? 'bg-white/5 border border-white/10 group-hover:bg-white/10' 
                  : 'bg-white/80 border border-slate-100 group-hover:bg-white shadow-sm'
              } ${item.color}`}>
                {item.icon}
              </div>
              
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-40`}>
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black tracking-tighter transition-transform duration-700 group-hover:scale-110 origin-left">
                    {item.value}
                  </p>
                  <p className="text-[11px] font-black opacity-30 uppercase tracking-tighter">
                    {item.unit}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle corner accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 opacity-[0.03] pointer-events-none bg-gradient-to-bl from-current to-transparent ${item.color}`} />
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .bg-radial-gradient {
          background: radial-gradient(circle at center, currentColor 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}

export default WeatherDetails;