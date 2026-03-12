import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import WeatherHero from "../components/WeatherHero/WeatherHero";
import HourlyForecast from "../components/HourlyForecast/HourlyForecast";
import WeeklyForecast from "../components/WeeklyForecast/WeeklyForecast";
import WeatherDetails from "../components/WeatherDetails/WeatherDetails";
import WeatherChart from "../components/WeatherChart/WeatherChart";
import WeatherMap from "../components/WeatherMap/WeatherMap";
import SunProgress from "../components/SunProgress/SunProgress";
import AirQuality from "../components/AQICard/AQICard";
import FavoriteCities from "../components/FavoriteCities/FavoriteCities";
import WeatherAlert from "../components/WeatherAlert/WeatherAlert";

function Home({ weather, forecast, airQuality, onSearch, isNight }) {
  if (!weather)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        <p className="mt-4 text-xs tracking-widest text-slate-400 uppercase">Syncing SkyCast...</p>
      </div>
    );

  return (
    // Removed fixed max-width, using 100% width with spacing
    <div className="w-full space-y-6 md:space-y-10 pb-10">

      {/* FAVORITES */}
      <FavoriteCities onSelect={onSearch} />

      {/* HERO */}
      <WeatherHero
        weather={weather}
        airQuality={airQuality}
        isNight={isNight}
      />

      {/* QUICK STATS - Adjusted for better mobile stacking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {airQuality && (<AirQuality airQuality={airQuality} isNight={isNight}/>)}
        <SunProgress weather={weather} isNight={isNight}/>
      </div>

      {/* WEATHER DETAILS */}
      <WeatherDetails weather={weather} isNight={isNight} />

      {/* HOURLY FORECAST */}
      <HourlyForecast forecast={forecast || []} isNight={isNight} />

      {/* WEEKLY FORECAST */}
      <WeeklyForecast forecast={forecast || []} isNight={isNight} />

      {/* CHART - Ensure it doesn't break width */}
      <div className="w-full overflow-hidden rounded-3xl">
        <WeatherChart forecast={forecast || []} isNight={isNight} />
      </div>

      {/* MAP */}
      <div className="w-full overflow-hidden rounded-3xl">
        <WeatherMap weather={weather} isNight={isNight} />
      </div>

      {/* ALERT - Responsive width */}
      <AnimatePresence>
        {weather && (
          <motion.div
            initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0}}
            className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[95%] md:max-w-xl z-[1000]"
          >
            {weather?.condition && (<WeatherAlert weather={weather}/>)}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Home;