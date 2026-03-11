// import { getFavorites, removeFavorite } from "../../utils/storage";
// import { useState, useEffect } from "react";
// function FavoriteCities({ onSelect }) {

//   const [favorites, setFavorites] = useState([]);

//   const loadFavorites = () => {
//     setFavorites(getFavorites());
//   };

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   const handleDelete = (city) => {

//     removeFavorite(city);

//     loadFavorites();

//   };

//   useEffect(() => {

//   const loadFavorites = () => {
//     setFavorites(getFavorites())
//   }

//   loadFavorites()

//   window.addEventListener("favoritesUpdated", loadFavorites)

//   return () => window.removeEventListener("favoritesUpdated", loadFavorites)

// }, [])

//   return (

//     <div className="flex gap-3 flex-wrap">

//       {favorites.map((city) => (

//         <div
//           key={city}
//           className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg"
//         >

//           <button
//   key={city}
//   onClick={() => onSelect(city)}
//   className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
// >
//   ⭐ {city}
// </button>

//           <button
//             onClick={() => handleDelete(city)}
//             className="text-red-400 hover:text-red-500"
//           >
//             ✕
//           </button>

//         </div>

//       ))}

//     </div>

//   );

// }


// export default FavoriteCities;




import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MapPin, Navigation } from "lucide-react";
import { getFavorites, removeFavorite } from "../../utils/storage";

function FavoriteCities({ onSelect }) {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favoritesUpdated", loadFavorites);
    return () => window.removeEventListener("favoritesUpdated", loadFavorites);
  }, []);

  const handleDelete = (e, city) => {
    e.stopPropagation(); // Taaki delete click karne par onSelect trigger na ho
    removeFavorite(city);
    loadFavorites();
  };

  if (favorites.length === 0) return null;

  return (
    <section className="mt-2 mb-6">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3 px-1 text-slate-400">
        <Star size={14} className="fill-yellow-500 text-yellow-500" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Pinned Destinations</span>
      </div>

      <div className="flex gap-3 flex-wrap">
        <AnimatePresence mode="popLayout">
          {favorites.map((city) => (
            <motion.div
              key={city}
              layout
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              whileHover={{ y: -2 }}
              onClick={() => onSelect(city)}
              className="group relative flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 pl-4 pr-2 py-2 rounded-2xl cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.05)]"
            >
              {/* City Name & Icon */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <Navigation size={12} fill="currentColor" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-200 group-hover:text-white transition-colors">
                  {city}
                </span>
              </div>

              {/* Delete Button (Minimalist) */}
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.8 }}
                onClick={(e) => handleDelete(e, city)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </motion.button>

              {/* Subtle White Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-all pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FavoriteCities;