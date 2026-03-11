import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, Star, MapPin, Command, History, Cloud } from "lucide-react";
import { getCitySuggestions } from "../../services/weatherApi";
import { saveFavorite } from "../../utils/storage";

function Navbar({ onSearch, currentCity, unit, setUnit }) {
  const [city, setCity] = useState("");
const [isFocused, setIsFocused] = useState(false);
const [isListening, setIsListening] = useState(false);
const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("city-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startVoiceSearch = () => {

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert("Voice search not supported in this browser")
    return
  }

  const recognition = new SpeechRecognition()

  recognition.lang = "en-US"
  recognition.start()

  setIsListening(true)

  recognition.onresult = (event) => {

    const transcript = event.results[0][0].transcript

    setCity(transcript)

    onSearch(transcript)

    setIsListening(false)

  }

  recognition.onerror = () => {
    setIsListening(false)
  }

}

  return (
    <nav className="w-full px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
        
        {/* --- 1. Branding (With White Glow) --- */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative h-11 w-11 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500">
             <Cloud size={24} className="text-slate-900" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-white leading-none">
              SkyCast<span className="text-blue-400">.</span>
            </span>
            <span className="text-[10px] font-medium text-blue-400/80 tracking-[0.2em] uppercase mt-1">Intelligence</span>
          </div>
        </motion.div>

        {/* --- 2. Smart Search (With Interior Glow) --- */}
        <div className="relative flex-1 max-w-2xl">
          <motion.div
            animate={{ 
              backgroundColor: isFocused ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.06)",
              borderColor: isFocused ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.1)",
              boxShadow: isFocused ? "0 0 25px rgba(255, 255, 255, 0.1)" : "0 0 0px rgba(255,255,255,0)"
            }}
            className="flex items-center gap-4 px-6 py-3.5 rounded-2xl border backdrop-blur-2xl transition-all duration-500"
          >
            <Search size={20} className={isFocused ? "text-white" : "text-slate-500"} />
            
            <input
              id="city-search"
              type="text"
              placeholder="Explore your city..."
              value={city}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onChange={async (e) => {
  const value = e.target.value;
  setCity(value);

  if (value.length > 2) {
    const results = await getCitySuggestions(value);
    setSuggestions(results);
  } else {
    setSuggestions([]);
  }
}}
              onKeyDown={(e) => {
  if (e.key === "Enter" && city.trim()) {
    onSearch(city);
    setSuggestions([]);
    setIsFocused(false);
  }
}}
              className="bg-transparent outline-none flex-1 text-base font-light text-white placeholder:text-slate-500 tracking-wide"
            />

            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
               <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startVoiceSearch}
                className={`p-2 rounded-xl transition-all ${
                  isListening ? "text-white bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-slate-400 hover:text-white"
                }`}
              >
                {isListening && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-xl bg-blue-400/30 animate-ping" 
                  />
                )}
                <Mic size={19} />
              </motion.button>
              
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black text-slate-400">
                <Command size={11} /> K
              </div>
            </div>
          </motion.div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-[120%] left-0 right-0 p-4 rounded-[24px] bg-slate-900/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.05)] z-[100]"
              >
                <div className="flex items-center justify-between px-3 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                   <span>Recent Destinations</span>
                   <button className="hover:text-white transition-colors">Reset</button>
                </div>
                {suggestions.map((city, i) => (
                  <motion.button 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={`${city.lat}-${city.lon}`}
                    onClick={() => {
  setCity(city.name);
  onSearch(city.name);
  setSuggestions([]);
  setIsFocused(false);
}}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-white/10 text-slate-300 transition-all group mb-1"
                  >
                    <div className="flex items-center gap-4 font-medium">
                      <History size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                      {city.name},{city.country}
                    </div>
                    <Star size={16} className="text-slate-700 group-hover:text-yellow-400 transition-all" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- 3. Right Controls --- */}
        <div className="flex items-center gap-5">
          
          {/* Futuristic Unit Switcher */}
          <div 
            onClick={() => {
  const newUnit = unit === "metric" ? "imperial" : "metric";
  setUnit(newUnit);
}}
            className="flex items-center p-1 bg-white/5 rounded-[18px] border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300"
          >
            <motion.div 
              layout
              className={`px-4 py-2 rounded-[14px] text-xs font-bold transition-all ${unit === "metric" ? "bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "text-slate-500"}`}
            >°C</motion.div>
            <motion.div 
              layout
              className={`px-4 py-2 rounded-[14px] text-xs font-bold transition-all ${unit === "imperial" ? "bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "text-slate-500"}`}
            >°F</motion.div>
          </div>

          {/* Fav Button with Halo */}
          <motion.button 
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {

  if (currentCity) {

    saveFavorite(currentCity)
window.dispatchEvent(new Event("favoritesUpdated"))

  }

}}
            className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-yellow-500 transition-all"
          >
            <Star size={22} fill="currentColor" />
          </motion.button>
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;