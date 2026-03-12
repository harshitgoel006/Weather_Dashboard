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
        <p className="mt-4 text-xs tracking-widest text-slate-400 uppercase">
          Syncing SkyCast...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 space-y-10">

      {/* FAVORITES */}
      <FavoriteCities onSelect={onSearch} />

      {/* HERO */}
      <WeatherHero
        weather={weather}
        airQuality={airQuality}
        isNight={isNight}
      />

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {airQuality && (<AirQuality airQuality={airQuality} isNight={isNight}/>)}
        <SunProgress weather={weather} isNight={isNight}/>
      </div>

      {/* WEATHER DETAILS */}
      <WeatherDetails
        weather={weather}
        isNight={isNight}
      />

      {/* HOURLY FORECAST */}
      <HourlyForecast
        forecast={forecast || []}
        isNight={isNight}
      />

      {/* WEEKLY FORECAST */}
      <WeeklyForecast
        forecast={forecast || []}
        isNight={isNight}
      />

      {/* CHART */}
      <WeatherChart
        forecast={forecast || []}
        isNight={isNight}
      />

      {/* MAP */}
      <WeatherMap
        weather={weather}
        isNight={isNight}
      />

      {/* ALERT */}
      <AnimatePresence>
        {weather && (
          <motion.div
            initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0}}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-[1000]"
          >
            {weather?.condition && (<WeatherAlert weather={weather}/>)}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Home;