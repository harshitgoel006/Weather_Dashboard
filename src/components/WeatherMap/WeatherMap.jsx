
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Maximize2, Plus, Minus, LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";

// --- Custom View Logic ---
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function WeatherMap({ weather, isNight }) {
  const [zoom, setZoom] = useState(8);

  if (!weather || weather.lat == null || weather.lon == null) return null;
  const center = [weather.lat, weather.lon];

  // Map Tile Styles
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const lightTiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      // Standard Hover (y-lift + scale) added for consistency
      whileHover={{ y: -8, scale: 1.005 }} 
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      // Background and Glass effect updated to match your dashboard style
      className={`relative p-8 rounded-[45px] border transition-all duration-700 shadow-xl ${
        isNight 
          ? "bg-[#1a1c2e]/60 border-white/5 text-white" 
          : "bg-white/60 backdrop-blur-3xl border-white text-slate-800"
      }`}
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40`}>
              Global Satellite
            </p>
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isNight ? 'text-white' : 'text-slate-800'}`}>
            Radar Monitoring
          </h2>
        </div>
        <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${isNight ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-white border-slate-100 text-blue-600 shadow-sm'}`}>
          <Maximize2 size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Active Radar</span>
        </div>
      </div>

      {/* --- MAP FRAME --- */}
      <div className={`relative h-[450px] w-full rounded-[35px] overflow-hidden border-4 ${isNight ? 'border-white/5' : 'border-white shadow-inner'}`}>
        
        {/* Custom Zoom Controls */}
        <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
            <button 
                onClick={() => setZoom(prev => Math.min(prev + 1, 12))}
                className={`p-3 rounded-2xl backdrop-blur-xl border transition-all active:scale-90 ${
                    isNight ? 'bg-black/40 border-white/10 text-white hover:bg-white/10' : 'bg-white/80 border-slate-200 text-slate-800 hover:bg-white shadow-lg'
                }`}
            >
                <Plus size={20} strokeWidth={3} />
            </button>
            <button 
                onClick={() => setZoom(prev => Math.max(prev - 1, 4))}
                className={`p-3 rounded-2xl backdrop-blur-xl border transition-all active:scale-90 ${
                    isNight ? 'bg-black/40 border-white/10 text-white hover:bg-white/10' : 'bg-white/80 border-slate-200 text-slate-800 hover:bg-white shadow-lg'
                }`}
            >
                <Minus size={20} strokeWidth={3} />
            </button>
        </div>

        {/* City Label Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000]">
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-2xl border shadow-2xl ${
                    isNight ? 'bg-indigo-950/40 border-white/10 text-white' : 'bg-white/90 border-slate-100 text-slate-800'
                }`}
            >
                <LocateFixed size={18} className="text-blue-500" />
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Focused on</p>
                    <p className="text-sm font-black">{weather.city}</p>
                </div>
            </motion.div>
        </div>

        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          attributionControl={false}
        >
          <ChangeView center={center} zoom={zoom} />
          
          <TileLayer
            url={isNight ? darkTiles : lightTiles}
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Cloud Layer */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY}`}
            opacity={0.5}
          />

          {/* Radar Pulse Effect at Center */}
          <div className="radar-pulse-container" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
             <div className="radar-pulse" />
          </div>
        </MapContainer>

        {/* Inner Vignette for depth */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.2)] rounded-[35px]" />
      </div>

      {/* --- FOOTER INFO --- */}
      <div className="mt-6 flex justify-between items-center px-2">
          <div className="flex gap-6">
              <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">Latitude</span>
                  <span className="text-xs font-bold">
  {Math.abs(weather.lat).toFixed(2)}° {weather.lat >= 0 ? "N" : "S"}
</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">Longitude</span>
                  <span className="text-xs font-bold">
  {Math.abs(weather.lon).toFixed(2)}° {weather.lon >= 0 ? "E" : "W"}
</span>
              </div>
          </div>
          <p className="text-[10px] font-bold italic opacity-30">Real-time Satellite Feed v2.4</p>
      </div>

      <style jsx global>{`
        .leaflet-container { background: transparent !important; }
        
        /* The Pulsing Center Point */
        .radar-pulse {
            width: 20px;
            height: 20px;
            background: rgba(59, 130, 246, 0.5);
            border: 2px solid #3b82f6;
            border-radius: 50%;
            position: relative;
        }
        .radar-pulse::after {
            content: '';
            position: absolute;
            top: -20px; left: -20px; right: -20px; bottom: -20px;
            border: 2px solid #3b82f6;
            border-radius: 50%;
            animation: radar-ripple 2s linear infinite;
            opacity: 0;
        }
        @keyframes radar-ripple {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        
        .leaflet-tile {
            filter: ${isNight ? 'brightness(0.6) contrast(1.2) hue-rotate(10deg)' : 'saturate(0.8) contrast(1.1)'};
        }
      `}</style>
    </motion.div>
  );
}

export default WeatherMap;