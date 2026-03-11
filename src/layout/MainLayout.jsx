import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { getCurrentWeather } from "../services/weatherApi";
import { formatCurrentWeather } from "../utils/helpers";
import { getCitySuggestions } from "../services/weatherApi";
import { getForecast } from "../services/weatherApi"

import { getAirQuality } from "../services/weatherApi"

const themes = {

  sunny:
    "from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc]",

  cloudy:
    "from-[#334155] via-[#475569] to-[#64748b]",

  rainy:
    "from-[#020617] via-[#0f172a] to-[#1e293b]",

  default:
    "from-[#020617] via-[#0f172a] to-[#1e293b]"

}




function MainLayout({ children, weatherType = 'default' }) {

    const [weather, setWeather] = useState(null);
    const [unit, setUnit] = useState("metric");
    const [forecast, setForecast] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    useEffect(() => {
  if (weather?.lat && weather?.lon) {
    fetchWeather(weather.lat, weather.lon);
  }
}, [unit]);

const fetchWeather = async (cityOrLat, lon = null,city) => {

  try {

    let lat = cityOrLat;

    if (typeof cityOrLat === "string") {

      const results = await getCitySuggestions(cityOrLat);

      if (!results.length) return;

      lat = results[0].lat;
      lon = results[0].lon;

    }

    const data = await getCurrentWeather(lat, lon, unit,city);

    const formatted = formatCurrentWeather(data);
    const forecastData = await getForecast(lat, lon, unit);
    const airData = await getAirQuality(lat, lon)

setAirQuality(airData)

     setForecast(forecastData.list)

    setWeather(formatted);

  } catch (error) {

    console.error("Weather fetch error:", error);

  }

};
const getWeatherTheme = () => {

  if (!weather) return "default"

  const condition = weather.condition.toLowerCase()

  if (condition.includes("rain")) return "rainy"

  if (condition.includes("cloud")) return "cloudy"

  if (condition.includes("clear")) return "sunny"

  return "default"

}

useEffect(() => {

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetchWeather(lat, lon);

    },
    () => {

      // fallback city
      fetchWeather(28.6139, 77.2090);

    }
  );

}, []);

  return (
    <div className={`relative min-h-screen w-full flex flex-col transition-colors duration-1000 bg-gradient-to-br ${themes[getWeatherTheme()]} text-slate-200 overflow-x-hidden`}>
      
      {/* 🔮 Background Glows (Modern & Subtle) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* 📄 Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar with Sharp Blur */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/30 backdrop-blur-2xl">
          <Navbar 
  onSearch={fetchWeather} 
  currentCity={weather?.city}
  unit={unit}
  setUnit={setUnit}
/>
        </header>

        {/* Main Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {React.cloneElement(children, { weather, onSearch: fetchWeather, forecast,airQuality })}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      {/* Subtle Grid Pattern for Technical Feel */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
}

export default MainLayout;
