
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Droplets, Eye, Thermometer, ArrowUp, ArrowDown, Waves } from "lucide-react";

// --- Realistic Rain Animation Component (Original) ---
const RainEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -100, x: `${Math.random() * 100}%`, opacity: 0 }}
        animate={{ y: 800, opacity: [0, 0.4, 0] }}
        transition={{
          duration: 0.6 + Math.random() * 0.4,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "linear"
        }}
        className="absolute w-[1.5px] h-[40px] bg-blue-200/40 blur-[0.5px]"
      />
    ))}
  </div>
);

// --- MODIFIED Clouds Effect (Matches your Screenshot's moody/blurry vibe) ---
const CloudsEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Dark Gradient Overlay at Top (Matches image's top dark sky) */}
    <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-slate-900/40 to-transparent blur-[60px]" />

    {/* Large Hazy Distant Cloud (Slow moving) */}
    <motion.div
      animate={{ x: [-100, 100], opacity: [0.1, 0.25, 0.1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-10 -right-20 w-[600px] h-40 bg-white/20 blur-[120px] rounded-full"
    />

    {/* Near Moving Hazy Cloud (Very Blurry like the image) */}
    <motion.div
      animate={{ x: [400, -400] }}
      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-40 -left-10 w-[700px] h-80 bg-slate-200/10 blur-[130px] rounded-full"
    />

    {/* Center Mist Cluster */}
    <motion.div
      animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity }}
      className="absolute inset-0 m-auto w-[500px] h-[300px] bg-slate-400/10 blur-[150px] rounded-full"
    />
  </div>
);

// --- Realistic Sun Flare Component (Original) ---
const SunEffect = ({ isNight }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: isNight ? [0.1, 0.15, 0.1] : [0.3, 0.5, 0.3] 
      }}
      transition={{ duration: 8, repeat: Infinity }}
      className={`absolute -right-20 -top-20 w-[450px] h-[450px] blur-[120px] rounded-full ${
        isNight ? "bg-indigo-500/30" : "bg-orange-400/40 shadow-[0_0_100px_rgba(251,146,60,0.4)]"
      }`}
    />
  </div>
);

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (value === undefined || value === null) return;
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    let timer = setInterval(() => {
      start += 1;
      setDisplayValue(end);
      if (start === end) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{displayValue}</span>;
};

function WeatherHero({ weather, airQuality, isNight }) {
  if (!weather) return null;

  const cond = weather.condition?.toLowerCase() || "";
  const aqi = airQuality?.main?.aqi || 1;
  const aqiLabel = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1] || "Good";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mb-10 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* --- MAIN HERO CARD --- */}
        <div className={`lg:col-span-7 rounded-[60px] p-12 flex flex-col justify-between overflow-hidden relative border transition-all duration-1000 min-h-[550px] shadow-2xl ${
            isNight ? "bg-slate-950/80 border-white/5 text-white" : "bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-3xl border-white/40 text-slate-900"
          }`}
        >
          {/* ATMOSPHERIC BACKGROUND LAYERS */}
          {cond.includes("rain") && <RainEffect />}
          {cond.includes("cloud") && <CloudsEffect />}
          {!cond.includes("rain") && <SunEffect isNight={isNight} />}

          <div className="relative z-10">
            <p className="text-[12px] font-black tracking-[0.5em] opacity-40 uppercase mb-3">Atmospheric Report</p>
            <h1 className="text-7xl font-black tracking-tighter drop-shadow-sm">{weather.city}</h1>
            <div className="flex items-center gap-3 mt-2 opacity-50 font-medium">
                <div className="w-10 h-[1.5px] bg-current" />
                <p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <div className="flex items-start">
              <span className="text-[12rem] font-black italic leading-[0.85] tracking-tighter transition-all hover:scale-105 duration-500">
                <AnimatedNumber value={weather.temperature} />
              </span>
              <span className="text-7xl font-light text-orange-500 mt-4 opacity-80">°</span>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <div className={`h-14 w-[5px] rounded-full shadow-lg ${isNight ? 'bg-indigo-500' : 'bg-orange-500'}`} />
              <p className="text-4xl md:text-5xl capitalize font-bold tracking-tight opacity-90">{weather.description}</p>
            </div>
          </div>

          <div className="flex gap-4 relative z-10 mt-12">
            <Badge icon={<ArrowUp size={18} className="text-orange-500" />} label="High" value={`${weather.tempMax || weather.temperature + 2}°`} isNight={isNight} />
            <Badge icon={<ArrowDown size={18} className="text-blue-500" />} label="Low" value={`${weather.tempMin || weather.temperature - 3}°`} isNight={isNight} />
          </div>
        </div>

        {/* --- STATS BENTO GRID --- */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-5">
          <StatCard icon={<Thermometer />} label="Feels Like" value={`${weather.feelsLike}°`} color="text-orange-500" isNight={isNight} />
          <StatCard icon={<Droplets />} label="Humidity" value={`${weather.humidity}%`} color="text-blue-400" isNight={isNight} />
          <StatCard icon={<Wind />} label="Wind Pressure" value={`${Math.round(weather.windSpeed * 3.6)} km/h`} color="text-emerald-400" isNight={isNight} />
          <StatCard icon={<Eye />} label="Visibility" value={`${Math.round((weather.visibility ?? 10000) / 1000)} km`} color="text-violet-400" isNight={isNight} />

          {/* AQI CARD */}
          <div className={`col-span-2 p-8 rounded-[45px] flex items-center justify-between border shadow-xl ${
            isNight ? "bg-white/5 border-white/10" : "bg-white/70 border-white"
          }`}>
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500"><Waves size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Air Quality</p>
                <p className="text-2xl font-black">{aqiLabel}</p>
              </div>
            </div>
            <div className="w-32 h-2 bg-black/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1.5 }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Badge({ icon, label, value, isNight }) {
  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all hover:translate-y-[-5px] ${isNight ? "bg-white/5 border-white/10 shadow-lg" : "bg-white border-white/60 shadow-md"}`}>
      {icon}
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{label}</span>
        <span className="font-bold text-sm">{value}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, isNight }) {
  return (
    <motion.div 
      // Movement fix: scale aur y offset bina jitter ke
      whileHover={{ y: -10, scale: 1.02 }} 
      // Smooth transition control
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-8 flex flex-col justify-between border rounded-[45px] shadow-lg relative overflow-hidden ${
        isNight 
          ? "bg-slate-900/60 border-white/5 text-white" 
          : "bg-white/60 border-white text-slate-900 backdrop-blur-3xl"
      }`}
      // Tailwind transition-all ko yahan se hata diya hai conflict rokne ke liye
    >
      {/* Icon Container */}
      <div className={`p-5 rounded-2xl w-fit mb-8 shadow-sm ${
        isNight ? "bg-white/10" : "bg-slate-50/50"
      } ${color}`}>
        {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
      </div>

      {/* Text Content */}
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
          {label}
        </p>
        <p className="text-3xl font-black tracking-tighter">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

export default WeatherHero;