import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import {
  getCurrentWeather,
  getForecast,
  getAirQuality
} from "../services/weatherApi";

import { formatCurrentWeather } from "../utils/helpers";

const WeatherScene = ({ condition, isNight }) => {
  const cond = (condition || "").toLowerCase();

  const isRain = cond.includes("rain") || cond.includes("drizzle");
  const isStorm = cond.includes("thunder");
  const isCloudy = cond.includes("cloud") || cond.includes("mist") || cond.includes("haze");
  const isSnow = cond.includes("snow");
  const isClear = cond.includes("clear");

  const shouldShowStars = isNight && isClear && !isCloudy;
  const shouldShowClouds = isCloudy || (!isNight && isClear);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* ☀ ENHANCED DAYLIGHT OVERLAY */}
      {!isNight && isClear && (
        <>
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4] 
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full 
            bg-gradient-to-br from-yellow-200/20 via-orange-300/10 to-transparent blur-[140px]"
          />
        </>
      )}

      {/* ⭐ CRYSTAL CLEAR NIGHT STARS */}
      {shouldShowStars && (
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
              className="absolute bg-white rounded-full shadow-[0_0_3px_white]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 1.2 + 0.5}px`,
                height: `${Math.random() * 1.2 + 0.5}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* ☁ CLOUDY LAYERS */}
      {shouldShowClouds && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(isCloudy ? 8 : 4)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              initial={{ x: "-50%" }}
              animate={{ x: ["-50%", "150%"] }}
              transition={{ duration: 100 + i * 20, repeat: Infinity, ease: "linear" }}
              className={`absolute rounded-full blur-[100px] ${isNight ? "bg-slate-800/30" : "bg-white/40"}`}
              style={{
                top: `${(i * 15) % 85}%`,
                width: `${500 + Math.random() * 400}px`,
                height: `${200 + Math.random() * 150}px`,
                opacity: isCloudy ? 0.6 : 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* 🌧 HYPER-REALISTIC RAIN DROPS */}
      {(isRain || isStorm) && (
        <div className="absolute inset-0 overflow-hidden z-[1]">
          <div className={`absolute inset-0 ${isNight ? "bg-blue-950/20" : "bg-slate-900/10"} backdrop-blur-[1px]`} />
          {[...Array(160)].map((_, i) => {
            const duration = 0.4 + Math.random() * 0.3;
            const delay = Math.random() * 2;
            return (
              <React.Fragment key={`rain-${i}`}>
                <div
                  className="absolute bg-gradient-to-b from-transparent via-white/30 to-white/10"
                  style={{
                    left: `${Math.random() * 120 - 10}%`,
                    top: "-10%",
                    width: i % 8 === 0 ? "1.5px" : "1px",
                    height: i % 8 === 0 ? "110px" : "70px",
                    transform: "rotate(15deg)",
                    animation: `rain ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                    opacity: isNight ? 0.3 : 0.5,
                  }}
                />
                {i % 20 === 0 && (
                  <motion.div
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 0.4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: delay + duration - 0.1 }}
                    className="absolute bottom-4 w-6 h-1 bg-white/20 rounded-full blur-md"
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ⚡ THUNDER STRIKE */}
      {isStorm && (
        <motion.div
          animate={{ opacity: [0, 0, 0.3, 0, 0.7, 0.1, 0, 0] }}
          transition={{ duration: 5, repeat: Infinity, times: [0, 0.7, 0.71, 0.72, 0.74, 0.76, 0.8, 1] }}
          className="absolute inset-0 bg-blue-100/30 z-[2] backdrop-brightness-150"
        />
      )}
    </div>
  );
};

// 🌈 IMPROVED PREMIUM BACKGROUND GRADIENTS
const weatherThemes = {
  Clear: {
    day: "from-[#38bdf8] via-[#3b82f6] to-[#6366f1]", // Vibrant Sky
    night: "from-[#020617] via-[#0f172a] to-[#000000]" // Deep Midnight
  },
  Clouds: {
    day: "from-[#94a3b8] via-[#64748b] to-[#475569]", // Steel Grey
    night: "from-[#0f172a] via-[#1e293b] to-[#020617]" // Overcast Dark
  },
  Rain: {
    day: "from-[#1e293b] via-[#334155] to-[#0f172a]", // Moody Rainy Day
    night: "from-[#020617] via-[#171717] to-[#1e1b4b]" // Deep Indigo Storm
  },
  Default: {
    day: "from-[#0ea5e9] to-[#2563eb]",
    night: "from-[#020617] to-[#000000]"
  }
};

function MainLayout({ children }) {
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState(null);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const [w, f, a] = await Promise.all([
        getCurrentWeather(lat, lon, unit),
        getForecast(lat, lon, unit),
        getAirQuality(lat, lon)
      ]);
      setWeather({ ...formatCurrentWeather(w), forecast: f, airQuality: a, lat, lon });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => {
    setCurrentCity(city);
    const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
    const data = await geo.json();
    if (data.length) fetchWeatherByCoords(data[0].lat, data[0].lon);
  };

  useEffect(() => {
    if (currentCity && weather) {
      fetchWeatherByCoords(weather.lat, weather.lon);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather("Delhi")
    );
  }, [unit]);

  const isNight = useMemo(() => {
    if (!weather) return false;
    const now = Date.now() / 1000;
    return now < weather.sunrise || now > weather.sunset;
  }, [weather]);

  const theme = weatherThemes[weather?.condition] || weatherThemes.Default;

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-gradient-to-br ${isNight ? theme.night : theme.day} transition-all duration-[2000ms]`}>
      <WeatherScene condition={weather?.condition} isNight={isNight}/>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full backdrop-blur-2xl bg-black/10 border-b border-white/5 z-50">
          <Navbar 
            onSearch={fetchWeather} 
            currentCity={currentCity || weather?.city} 
            unit={unit} 
            setUnit={setUnit} 
            weather={weather} 
            isNight={isNight} 
          />
        </header>

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.div
                key={weather?.city}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                {React.cloneElement(children, { weather, forecast: weather?.forecast, airQuality: weather?.airQuality, isNight, onSearch: fetchWeather })}
              </motion.div>
            ) : (
              <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <div className="w-14 h-14 border-[3px] border-white/10 border-t-white rounded-full animate-spin shadow-2xl"/>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">Syncing Atmosphere...</p>
              </div>
            )}
          </AnimatePresence>
        </main>
        <Footer isNight={isNight}/>
      </div>

      <style>{`
        @keyframes rain {
          0% { transform: translateY(-20vh) translateX(0) rotate(15deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(-40px) rotate(15deg); opacity: 0; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
}

export default MainLayout;