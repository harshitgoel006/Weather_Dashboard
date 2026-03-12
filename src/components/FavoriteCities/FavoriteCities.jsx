import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Navigation } from "lucide-react";
import { getFavorites, removeFavorite } from "../../utils/storage";

function FavoriteCities({ onSelect, isNight }) {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites([...new Set(favs)]);
  };

  useEffect(() => {
    loadFavorites();
    const handler = () => loadFavorites();
    window.addEventListener("favoritesUpdated", handler);
    return () => window.removeEventListener("favoritesUpdated", handler);
  }, []);

  const handleDelete = (e, city) => {
    e.stopPropagation();
    removeFavorite(city);
    loadFavorites();
  };

  if (favorites.length === 0) return null;

  return (
    <section className="mt-6 mb-10 px-1">
      {/* --- LABEL: Match with "Instrumentation" header style --- */}
      <div className="flex items-center gap-2.5 mb-5 ml-1">
        <div className={`p-1.5 rounded-lg ${isNight ? 'bg-yellow-400/10' : 'bg-yellow-500/10'}`}>
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-[0.4em] ${isNight ? 'text-white/40' : 'text-slate-500'}`}>
          Pinned Locations
        </span>
      </div>

      {/* --- PILLS --- */}
      <div className="flex gap-4 flex-wrap">
        <AnimatePresence mode="popLayout">
          {favorites.map((city, index) => (
            <motion.div
              key={`${city}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -3 }}
              onClick={() => onSelect?.(city)}
              // Match background with your "AQI" and "Feels Like" small cards
              className={`group relative flex items-center gap-4 pl-4 pr-2 py-2.5 rounded-[22px] border transition-all duration-500 cursor-pointer ${
                isNight 
                  ? "bg-[#161b30]/40 backdrop-blur-md border-white/10 hover:border-blue-400/40 shadow-xl" 
                  : "bg-white/40 border-slate-200 hover:bg-white/60 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-all ${
                  isNight ? 'bg-blue-400/10 text-blue-400' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  <Navigation size={14} fill="currentColor" className="-rotate-45" />
                </div>
                
                {/* Font Fixed: Match main city display weight */}
                <span className={`text-sm font-bold tracking-tight ${
                  isNight ? 'text-white' : 'text-slate-900'
                }`}>
                  {city}
                </span>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => handleDelete(e, city)}
                className={`p-1.5 rounded-lg transition-all ${
                  isNight ? 'text-white/20 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <X size={14} strokeWidth={3} />
              </button>

              {/* Hover Glow Effect */}
              {isNight && (
                <div className="absolute inset-0 rounded-[22px] bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FavoriteCities;