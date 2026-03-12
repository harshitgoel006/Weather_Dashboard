
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

  // Logic Flags
  const isRain = cond.includes("rain") || cond.includes("drizzle");
  const isStorm = cond.includes("thunder");
  const isCloudy = cond.includes("cloud") || cond.includes("mist") || cond.includes("haze");
  const isSnow = cond.includes("snow");
  const isClear = cond.includes("clear");

  const shouldShowClouds = isCloudy || (!isNight && isClear);

  const shouldShowStars = isNight && isClear;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* ☀ SUN GLOW (DAY CLEAR ONLY) */}
      {!isNight && isClear && (
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 right-[15%] w-[120px] h-[120px] rounded-full 
          bg-yellow-300/40 blur-[80px]"
        />
      )}

      {/* 🌙 MOON GLOW (NIGHT ONLY) */}
      {isNight && (
        <div className="absolute top-16 right-[18%] w-[90px] h-[50px] 
        rounded-full bg-blue-200/30 blur-[60px]" />
      )}

      {/* ⭐ STAR FIELD (ONLY NIGHT + CLEAR) */}
      {shouldShowStars && (
        <>
          {[...Array(140)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{ opacity: Math.random() }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
              }}
              className="absolute bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9)]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
              }}
            />
          ))}
        </>
      )}

      {/* ☁ CLOUD LAYERS (CLOUDY OR DAY-CLEAR) */}
      {shouldShowClouds && (
        <div className="absolute inset-0">
          {[...Array(isCloudy ? 6 : 3)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              initial={{ x: "-30%" }}
              animate={{ x: ["-30%", "120%"] }}
              transition={{
                duration: 120 + i * 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className={`absolute rounded-full blur-[60px] ${
                isNight ? "bg-gray-800/40" : "bg-white/40"
              }`}
              style={{
                top: `${10 + i * 15}%`,
                width: `${400 + Math.random() * 300}px`,
                height: `${150 + Math.random() * 100}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* ❄ SNOW PARTICLES */}
      {isSnow && (
        <>
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={`snow-${i}`}
              animate={{ 
                y: ["-10vh", "110vh"],
                x: ["0vw", `${Math.random() * 10 - 5}vw`] 
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bg-white rounded-full blur-[1px]"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                opacity: Math.random(),
              }}
            />
          ))}
        </>
      )}

      {/* 🌧 RAIN */}
      {(isRain || isStorm) && (
        <div className="absolute inset-0">
          {[...Array(120)].map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
                animation: `rain ${0.6 + Math.random() * 0.3}s linear infinite`,
                width: "1.5px",
                height: "60px",
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))",
              }}
            />
          ))}
        </div>
      )}

      {/* ⚡ STORM LIGHTNING */}
      {isStorm && (
        <motion.div
          animate={{ opacity: [0, 0, 0, 0.6, 0, 0.4, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            times: [0, 0.7, 0.72, 0.73, 0.75, 0.77, 1]
          }}
          className="absolute inset-0 bg-blue-100"
        />
      )}
    </div>
  );
};



// 🌈 WEATHER BACKGROUND THEMES
const weatherThemes = {

  Clear:{
    day:"from-sky-400 via-sky-500 to-blue-600",
    night:"from-[#020617] via-[#0b1220] to-black"
  },

  Clouds:{
    day:"from-gray-300 via-gray-400 to-gray-500",
    night:"from-[#111827] via-[#1f2937] to-black"
  },

  Rain:{
    day:"from-slate-500 via-slate-700 to-slate-900",
    night:"from-[#020617] via-[#0f172a] to-black"
  },

  Default:{
    day:"from-sky-400 via-blue-500 to-blue-600",
    night:"from-[#020617] via-[#0b1220] to-black"
  }

}


function MainLayout({ children }) {

  const [weather,setWeather] = useState(null)
  const [unit,setUnit] = useState("metric")
  const [loading,setLoading] = useState(true)
  const [currentCity,setCurrentCity] = useState(null)


  // FETCH WEATHER BY COORDS
  const fetchWeatherByCoords = async (lat,lon)=>{
    try{

      setLoading(true)

      const [w,f,a] = await Promise.all([
        getCurrentWeather(lat,lon,unit),
        getForecast(lat,lon,unit),
        getAirQuality(lat,lon)
      ])

      setWeather({
        ...formatCurrentWeather(w),
        forecast:f,
        airQuality:a,
        lat,
        lon
      })

    }catch(err){
      console.log(err)
    }
    finally{
      setLoading(false)
    }
  }


  // FETCH WEATHER BY CITY
  const fetchWeather = async (city)=>{
    setCurrentCity(city)
    const geo = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
    )

    const data = await geo.json()

    if(data.length){
      fetchWeatherByCoords(data[0].lat,data[0].lon)
    }

  }


  // AUTO LOCATION
  useEffect(()=>{

  if(currentCity){
  fetchWeatherByCoords(weather.lat, weather.lon)
  return
}

  navigator.geolocation.getCurrentPosition(

    (pos)=>{
      fetchWeatherByCoords(
        pos.coords.latitude,
        pos.coords.longitude
      )
    },

    ()=>{
      fetchWeather("Delhi")
    }

  )

},[unit])


  // DAY / NIGHT
  const isNight = useMemo(() => {

if (!weather) return false;

const now = Date.now() / 1000;

return now < weather.sunrise || now > weather.sunset;

}, [weather]);


  const theme = weatherThemes[weather?.condition] || weatherThemes.Default


  return (


    <div className={`relative min-h-screen bg-gradient-to-br ${isNight ? theme.night : theme.day} transition-all duration-[2000ms]`}>

      <WeatherScene condition={weather?.condition} isNight={isNight}/>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col min-h-screen">

        <header className="sticky top-0 backdrop-blur-xl bg-black/20 border-b border-white/10 z-50">
          <Navbar
  onSearch={fetchWeather}
  currentCity={currentCity || weather?.city}
  unit={unit}
  setUnit={setUnit}
  weather={weather}
  isNight={isNight}
/>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-6 py-10">

          <AnimatePresence mode="wait">

            {!loading ? (

              <motion.div
                key={weather?.city}
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                exit={{opacity:0}}
                transition={{duration:0.6}}
              >
                {React.cloneElement(children,{
                  weather,
                  forecast:weather?.forecast,
                  airQuality:weather?.airQuality,
                  isNight,
                  onSearch:fetchWeather
                })}
              </motion.div>

            ) : (

              <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              </div>

            )}

          </AnimatePresence>

        </main>

        <Footer/>

      </div>


      {/* RAIN ANIMATION */}
      <style>{`
        @keyframes rain {
          0% { transform:translateY(-10vh) rotate(20deg); opacity:0 }
          10%{opacity:1}
          100%{ transform:translateY(110vh) rotate(20deg); opacity:0 }
        }
      `}</style>

    </div>

  )
}

export default MainLayout