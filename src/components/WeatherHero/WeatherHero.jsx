// function WeatherHero({ weather }) {

//   if (!weather) return null;

//   return (
//     <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">

//       <h2 className="text-2xl font-semibold">
//         {weather.city}
//       </h2>

//       <p className="text-6xl font-bold mt-2">
//         {weather.temperature}°
//       </p>

//       <p className="opacity-80 mt-2">
//         {weather.description}
//       </p>

//       <div className="flex gap-6 mt-6 text-sm opacity-80">

//         <span>Humidity: {weather.humidity}%</span>
//         <span>Wind: {weather.windSpeed} m/s</span>
//         <span>Pressure: {weather.pressure}</span>

//       </div>

//     </div>
//   );
// }

// export default WeatherHero;


import { motion } from "framer-motion";
import { Wind, Droplets, Gauge, Thermometer, CloudLightning } from "lucide-react";

function WeatherHero({ weather }) {
  if (!weather) return null;

  return (
    <div className="relative w-full mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Main Temperature Card (Big & Bold) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 relative overflow-hidden premium-card p-10 flex flex-col justify-between min-h-[350px]"
        >
          {/* Decorative Weather Icon (Animated feel) */}
          <div className="absolute top-[-20px] right-[-20px] opacity-20 rotate-12">
             <CloudLightning size={280} className="text-white" />
          </div>

          <div>
            <motion.div 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="flex items-center gap-2 text-blue-400 font-bold tracking-[0.3em] uppercase text-xs mb-2"
            >
              <div className="h-1 w-8 bg-blue-500 rounded-full" />
              Current Weather
            </motion.div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              {weather.city}
            </h2>
            <p className="text-slate-400 font-medium mt-1 text-lg capitalize tracking-wide">
              {weather.description}
            </p>
          </div>

          <div className="flex items-end justify-between relative z-10">
            <h1 className="text-[120px] font-black leading-none tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
              {Math.round(weather.temperature)}<span className="text-blue-500">°</span>
            </h1>
            
            <div className="flex flex-col items-end pb-4">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Feels Like</span>
              <span className="text-3xl font-bold text-white italic">{Math.round(weather.temperature - 2)}°</span>
            </div>
          </div>
        </motion.div>

        {/* --- Quick Stats Bento Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          
          {/* Humidity Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="premium-card p-6 flex items-center justify-between group"
          >
            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors">Humidity</p>
              <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Droplets size={24} />
            </div>
          </motion.div>

          {/* Wind Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="premium-card p-6 flex items-center justify-between group"
          >
            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover:text-teal-400 transition-colors">Wind Speed</p>
              <p className="text-2xl font-bold text-white">{weather.windSpeed} <span className="text-sm font-normal text-slate-500 tracking-normal">km/h</span></p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
              <Wind size={24} />
            </div>
          </motion.div>

          {/* Pressure Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="premium-card p-6 flex items-center justify-between group"
          >
            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover:text-purple-400 transition-colors">Pressure</p>
              <p className="text-2xl font-bold text-white">{weather.pressure} <span className="text-sm font-normal text-slate-500 tracking-normal">hPa</span></p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <Gauge size={24} />
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}

export default WeatherHero;