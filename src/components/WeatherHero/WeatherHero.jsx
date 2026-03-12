import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wind,
  Droplets,
  Eye,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Waves
} from "lucide-react";

import { WeatherIcon } from "../HourlyForecast/HourlyForecast";

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const end = parseInt(value);
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{displayValue}</span>;
};

function WeatherHero({ weather, airQuality, isNight }) {
  if (!weather) return null;

  const aqi = airQuality?.main?.aqi || 1;
  const aqiLabel = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1];
  
  const textPrimary = isNight ? "text-white" : "text-slate-900";
  const textSecondary = isNight ? "text-white/60" : "text-slate-500";
  const taglineColor = isNight ? "text-white/90" : "text-slate-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-6 select-none px-1" // Margin kam kiya (mb-10 -> mb-6)
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"> {/* Gap kam kiya (gap-6 -> gap-4) */}

        {/* --- MAIN HERO CARD --- */}
        <motion.div
          whileHover={{ scale: 1.002 }}
          className={`lg:col-span-7 rounded-[35px] p-6 md:p-8 flex flex-col justify-between relative border backdrop-blur-3xl shadow-xl overflow-hidden min-h-[420px] transition-all duration-500 group
          ${isNight 
              ? "bg-white/[0.03] border-white/10 hover:border-white/30 shadow-black/40" 
              : "bg-white/30 border-white/40 hover:border-blue-400/30 shadow-blue-900/5"
            }`}
        >
          {/* Interactive Background Glow */}
          <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-colors duration-1000 
            ${isNight ? 'bg-blue-600' : 'bg-yellow-400'}`} 
          />

          {/* WEATHER ICON - Adjusted Scale for compactness */}
          <motion.div 
            animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-8 top-8 scale-[1] md:scale-[1.2] z-0 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
          >
            <WeatherIcon type={weather.icon} isCurrent={true} isNight={isNight} />
          </motion.div>

          {/* HEADER */}
          <div className="relative z-10">
            <motion.p 
              className={`text-[9px] md:text-[10px] uppercase font-black mb-2 tracking-[0.4em] drop-shadow-sm ${taglineColor}`}
            >
              SkyCast Premium Report
            </motion.p>
            <h1 className={`text-4xl md:text-5xl font-black tracking-tighter leading-none drop-shadow-md ${textPrimary}`}>
              {weather.city}
              <span className="text-blue-500 ml-1">.</span>
            </h1>
            <p className={`mt-2 text-xs font-bold flex items-center gap-2 ${textSecondary}`}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* CENTER TEMP - Font sizes reduced */}
          <div className="relative z-10 my-6">
            <div className={`flex items-start ${textPrimary}`}>
              <span className="text-[6.5rem] md:text-[8rem] font-black leading-none tracking-tighter drop-shadow-lg">
                <AnimatedNumber value={weather.temperature} />
              </span>
              <span className="text-5xl md:text-6xl font-light opacity-30 mt-4 md:mt-6">°</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
              <p className={`text-2xl md:text-3xl capitalize font-extrabold tracking-tight ${textPrimary}`}>
                {weather.description}
              </p>
            </div>
          </div>

          {/* FOOTER BADGES */}
          <div className="flex flex-wrap gap-3 relative z-10">
            <Badge icon={<ArrowUp size={12} />} label="High" value={`${weather.tempMax || weather.temperature + 2}°`} color="text-orange-500" isNight={isNight} />
            <Badge icon={<ArrowDown size={12} />} label="Low" value={`${weather.tempMin || weather.temperature - 3}°`} color="text-blue-400" isNight={isNight} />
          </div>
        </motion.div>

        {/* --- STATS GRID --- */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 md:gap-4">
          <StatCard icon={<Thermometer />} label="Feels Like" value={`${weather.feelsLike}°`} color="text-orange-400" isNight={isNight} />
          <StatCard icon={<Droplets />} label="Humidity" value={`${weather.humidity}%`} color="text-sky-400" isNight={isNight} />
          <StatCard icon={<Wind />} label="Wind" value={`${Math.round(weather.windSpeed * 3.6)}`} unit="km/h" color="text-emerald-400" isNight={isNight} />
          <StatCard icon={<Eye />} label="Visibility" value={`${Math.round((weather.visibility ?? 10000) / 1000)}`} unit="km" color="text-purple-400" isNight={isNight} />

          {/* AQI CARD - Height reduced */}
          <motion.div 
            whileHover={{ y: -3 }}
            className={`col-span-2 p-6 rounded-[30px] border backdrop-blur-3xl shadow-lg flex flex-col justify-between transition-all duration-300
            ${isNight ? "bg-white/[0.03] border-white/10 hover:border-emerald-500/30" : "bg-white/40 border-white/40 shadow-sm"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isNight ? 'bg-emerald-500/10' : 'bg-emerald-400/20'} text-emerald-500`}>
                  <Waves size={20} />
                </div>
                <div>
                  <p className={`text-[9px] uppercase font-black tracking-widest ${textSecondary}`}>Air Quality</p>
                  <p className={`text-lg font-black ${textPrimary}`}>{aqiLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-black opacity-10 ${textPrimary}`}>0{aqi}</span>
              </div>
            </div>

            <div className="mt-4 relative h-2 bg-black/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(aqi / 5) * 100}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Compact Sub-components
function Badge({ icon, label, value, color, isNight }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border backdrop-blur-xl transition-all
      ${isNight ? "bg-white/5 border-white/10 text-white" : "bg-white/60 border-white/30 text-slate-900 shadow-sm"}`}
    >
      <span className={color}>{icon}</span>
      <div className="flex flex-col">
        <span className="text-[8px] uppercase opacity-40 font-black tracking-wider">{label}</span>
        <span className="font-extrabold text-xs">{value}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, color, isNight }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className={`p-5 rounded-[30px] border backdrop-blur-3xl flex flex-col justify-between min-h-[145px] shadow-md transition-all
      ${isNight 
        ? "bg-white/[0.03] border-white/10 text-white hover:border-white/30" 
        : "bg-white/40 border-white/40 text-slate-900 hover:bg-white/60 shadow-sm"}`}
    >
      <div className={`p-2.5 w-fit rounded-xl ${isNight ? 'bg-black/20' : 'bg-white/80 shadow-sm'} ${color}`}>
        {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
      </div>

      <div className="mt-3">
        <p className={`text-[9px] opacity-40 uppercase font-black tracking-widest mb-0.5`}>
          {label}
        </p>
        <p className="text-2xl font-black tracking-tighter">
          {value}<span className="text-[10px] ml-0.5 opacity-50 font-bold">{unit}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default WeatherHero;