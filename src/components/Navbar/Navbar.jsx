import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  Star,
  MapPin,
  Command,
  History,
  Cloud,
  Sparkles
} from "lucide-react";

import { getCitySuggestions } from "../../services/weatherApi";
import { saveFavorite } from "../../utils/storage";

function Navbar({ onSearch, currentCity, unit, setUnit, weather, isNight }) {
  const [city, setCity] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [saved, setSaved] = useState(false);

  /* ---------------- Shortcuts ---------------- */
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

  /* ---------------- Voice Search ---------------- */
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim();
  setCity(transcript);
  onSearch(transcript);
  setSuggestions([]);
  setIsFocused(false);
  setIsListening(false);
};
    recognition.onerror = () => setIsListening(false);recognition.onerror = () => setIsListening(false);
recognition.onend = () => setIsListening(false);
  };

  return (
    <nav className="w-full px-6 py-4 transition-all duration-500">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-8">
        
        {/* ---------------- Branding ---------------- */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-2xl border backdrop-blur-md ${
                isNight ? 'bg-indigo-500/20 border-white/20' : 'bg-white/40 border-white/60'
              }`}
            >
              <Cloud size={24} className={isNight ? "text-indigo-300" : "text-slate-800"} fill="currentColor" />
            </motion.div>
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-1 -right-1 text-yellow-400"
            >
              <Sparkles size={12} fill="currentColor" />
            </motion.div>
          </div>

          <div className="hidden md:flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
              SkyCast<span className="text-blue-400">.</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-white/60 font-bold uppercase tracking-widest">
              <MapPin size={10} className="text-blue-400" />
              {currentCity || "Locating..."}
            </div>
          </div>
        </motion.div>

        {/* ---------------- Search Bar (Fixed Visibility) ---------------- */}
        <div className="relative flex-1 max-w-xl">
          <motion.div
            animate={{
              scale: isFocused ? 1.02 : 1,
              backgroundColor: isFocused ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
              borderColor: isFocused ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"
            }}
            className="flex items-center gap-4 px-5 py-3 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-300"
          >
            {/* SEARCH ICON - Increased visibility */}
            <Search size={20} className={`${isFocused ? 'text-white' : 'text-white/60'} transition-colors`} />

            <input
              id="city-search"
              type="text"
              placeholder="Search city..."
              value={city}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onChange={async (e) => {
  const value = e.target.value;
  setCity(value);

  if (value.length > 2) {
    const results = await getCitySuggestions(value);

    if (value === e.target.value) {
      setSuggestions(results);
    }
  } else {
    setSuggestions([]);
  }
}}
              onKeyDown={(e) => {
                if (e.key === "Enter" && city.trim()) {
                  onSearch(city.trim());
                  setSuggestions([]);
                  setIsFocused(false);
                }
              }}
              className="bg-transparent outline-none flex-1 text-white text-[15px] font-semibold placeholder:text-white/40 tracking-wide"
            />

            {/* CMD + K Indicator - Fixed visibility */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border border-white/20 bg-black/20 text-[10px] font-black text-white/70">
              <Command size={10} />
              <span>K</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={startVoiceSearch}
              className={`p-2 rounded-xl transition-all ${
                isListening ? "text-white bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-white/60 hover:text-white"
              }`}
            >
              <Mic size={18} />
              {isListening && (
                <motion.span
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl bg-white/30"
                />
              )}
            </motion.button>
          </motion.div>

          {/* ---------------- Suggestions Dropdown ---------------- */}
          <AnimatePresence>
            {isFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 5, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 p-2 rounded-3xl bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
              >
                {suggestions.map((cityItem, i) => (
                  <motion.button
                    key={`${cityItem.lat}-${cityItem.lon}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      setCity(cityItem.name);
                      onSearch(cityItem.name);
                      setSuggestions([]);
                      setIsFocused(false);
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <History size={16} className="text-white/30 group-hover:text-blue-400" />
                      <span className="font-semibold text-sm">{cityItem.name}, {cityItem.country}</span>
                    </div>
                    <Star size={14} className="text-white/20 group-hover:text-yellow-400 transition-colors" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------------- Right Side Controls ---------------- */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
            className="flex items-center p-1 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl cursor-pointer hover:border-white/30 transition-all"
          >
            <div className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${unit === "metric" ? "bg-white text-slate-900 shadow-lg" : "text-white/40"}`}>
              °C
            </div>
            <div className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${unit === "imperial" ? "bg-white text-slate-900 shadow-lg" : "text-white/40"}`}>
              °F
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentCity) {
                saveFavorite(currentCity.trim());
                setSaved(true);
                window.dispatchEvent(new Event("favoritesUpdated"));
                setTimeout(() => setSaved(false), 2000);
              }
            }}
            className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all ${
              saved ? 'bg-yellow-400 border-yellow-300 text-slate-900' : 'bg-white/10 border-white/10 text-yellow-400 hover:border-yellow-400/50'
            }`}
          >
            <Star size={20} fill={saved ? "currentColor" : "none"} className="transition-transform duration-300" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;