import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { WeatherIcon } from "../HourlyForecast/HourlyForecast";

function WeeklyForecast({ forecast, isNight }) {
  if (!forecast) return null;

  const daily = Object.values(
    forecast.reduce((acc, item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!acc[date]) {
        acc[date] = {
          date,
          temps: [],
          icon: item.weather?.[0]?.icon,
          condition: item.weather?.[0]?.main
        };
      }

      acc[date].temps.push(item.main.temp);
      return acc;
    }, {})
  ).map(day => ({
    date: day.date,
    high: Math.max(...day.temps),
    low: Math.min(...day.temps),
    icon: day.icon,
    condition: day.condition
  }));

  return (
    <div className="w-full mx-auto py-8">

      {/* --- HEADER --- */}
      <div className="flex items-end justify-between mb-10 px-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-12 h-[2px] rounded-full ${isNight ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]' : 'bg-blue-600'}`} />
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isNight ? 'text-white/40' : 'text-slate-500'}`}>
              Extended Outlook
            </p>
          </div>

          <h2 className={`text-4xl font-black tracking-tighter ${isNight ? 'text-white' : 'text-slate-900'}`}>
            7-Day <span className="text-blue-500">Forecast</span>
          </h2>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isNight
            ? 'bg-white/5 border-white/10 text-white/30'
            : 'bg-white border-slate-100 shadow-sm text-slate-400'
        }`}>
          <Calendar size={20} strokeWidth={2.5} />
        </div>
      </div>


      {/* --- CARD LIST --- */}
      <div className="space-y-4 max-w-[1200px] mx-auto px-4">
        {daily.slice(0, 7).map((day, index) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const isToday = index === 0;

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.01, x: 5 }}
              className={`flex items-center justify-between px-10 py-6 rounded-[36px] border backdrop-blur-xl transition-all duration-500 relative overflow-hidden ${
                isNight
                  ? "bg-white/[0.03] border-white/5 text-white hover:border-white/20"
                  : "bg-white/40 border-slate-200/60 text-slate-800 hover:bg-white/60"
              }`}
            >

              {/* Day Info */}
              <div className="w-40">
                <p className={`text-xl font-black tracking-tight ${isNight ? 'text-white/90' : 'text-slate-900'}`}>
                  {isToday ? "Today" : dayName}
                </p>

                <div className={`mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                  isNight ? 'bg-white/10 text-white/50' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {day.condition}
                </div>
              </div>


              {/* Icon Container */}
              <div className="flex-1 flex justify-center transform hover:scale-110 transition duration-400">
                <WeatherIcon type={day.icon} isCurrent={isToday} isNight={isNight} />
              </div>


              {/* Temperature Display */}
              <div className="flex items-center gap-8 w-72 justify-end">
                <span className={`text-sm font-black w-12 text-right ${isNight ? 'text-white/30' : 'text-slate-400'}`}>
                  {Math.round(day.low)}°
                </span>


                {/* Animated Range Bar */}
                <div className={`h-[6px] flex-1 max-w-[140px] rounded-full relative overflow-hidden ${
                  isNight ? 'bg-white/5' : 'bg-slate-200/50'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                    className="absolute right-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>

                <span className={`text-3xl font-black tracking-tighter w-16 text-right ${isNight ? 'text-white' : 'text-slate-900'}`}>
                  {Math.round(day.high)}°
                </span>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyForecast;