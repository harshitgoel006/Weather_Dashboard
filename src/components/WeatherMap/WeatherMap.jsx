import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Maximize2, Plus, Minus, LocateFixed, Globe } from "lucide-react";
import "leaflet/dist/leaflet.css";

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

  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const lightTiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";

  return (
    <div className="max-w-[1200px] mx-auto px-4 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        // Match standard card styling from screenshots
        className={`relative p-8 rounded-[35px] border transition-all duration-500 overflow-hidden ${
          isNight
            ? "bg-[#161b30]/50 backdrop-blur-md border-white/10 shadow-2xl"
            : "bg-white/40 backdrop-blur-xl border-white/20 shadow-sm"
        }`}
      >
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isNight ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-blue-500'}`} />
              <p className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isNight ? 'text-white/40' : 'text-slate-500'}`}>
                Instrumentation
              </p>
            </div>
            <h2 className={`text-2xl font-bold tracking-tight ${isNight ? 'text-white' : 'text-slate-900'}`}>
              Radar <span className={`${isNight ? 'text-blue-400' : 'text-blue-500'}`}>Monitoring</span>
            </h2>
          </div>
          
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${
            isNight ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-slate-100 text-slate-600 shadow-sm'
          }`}>
            <Maximize2 size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Active Feed</span>
          </div>
        </div>

        {/* --- MAP FRAME --- */}
        <div className={`relative h-[380px] w-full rounded-[30px] overflow-hidden border ${
          isNight ? 'border-white/5 shadow-2xl' : 'border-slate-200'
        }`}>
          
          {/* Tactical Zoom Controls */}
          <div className="absolute top-5 right-5 z-[1000] flex flex-col gap-2">
              {[ 
                { icon: <Plus size={18} />, action: () => setZoom(prev => Math.min(prev + 1, 12)) },
                { icon: <Minus size={18} />, action: () => setZoom(prev => Math.max(prev - 1, 4)) }
              ].map((btn, idx) => (
                <button 
                  key={idx}
                  onClick={btn.action}
                  className={`p-3 rounded-xl backdrop-blur-md border transition-all active:scale-90 ${
                      isNight 
                        ? 'bg-[#1a1c2e]/80 border-white/10 text-white/80 hover:bg-blue-500/20' 
                        : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-50 shadow-lg'
                  }`}
                >
                  {btn.icon}
                </button>
              ))}
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-5 left-5 z-[1000]">
              <motion.div 
                  className={`flex items-center gap-4 px-5 py-3 rounded-[20px] backdrop-blur-md border shadow-2xl ${
                      isNight ? 'bg-[#0f1425]/90 border-white/10 text-white' : 'bg-white/90 border-slate-100 text-slate-800'
                  }`}
              >
                  <LocateFixed size={18} className={isNight ? 'text-blue-400' : 'text-blue-500'} />
                  <div>
                      <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Station</p>
                      <p className="text-sm font-bold">{weather.city}</p>
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
              className="map-tiles"
            />

            <TileLayer
              url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY}`}
              opacity={0.3}
            />

            {/* Pulsing Center Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none">
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white/20 shadow-[0_0_15px_#60a5fa]" />
                <div className="absolute w-10 h-10 border border-blue-400/40 rounded-full animate-ping" />
              </div>
            </div>
          </MapContainer>
        </div>

        {/* --- FOOTER COORDINATES --- */}
        <div className="mt-6 flex justify-between items-center px-2">
            <div className="flex gap-8">
                {[
                  { label: "Lat", val: `${Math.abs(weather.lat).toFixed(2)}° ${weather.lat >= 0 ? "N" : "S"}` },
                  { label: "Long", val: `${Math.abs(weather.lon).toFixed(2)}° ${weather.lon >= 0 ? "E" : "W"}` }
                ].map((coord, i) => (
                  <div key={i}>
                      <p className={`text-[9px] font-bold uppercase tracking-widest opacity-30 mb-0.5 ${isNight ? 'text-white' : 'text-slate-900'}`}>
                        {coord.label}
                      </p>
                      <p className={`text-xs font-bold ${isNight ? 'text-white/80' : 'text-slate-800'}`}>{coord.val}</p>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-2 opacity-20">
                <Globe size={10} />
                <p className="text-[9px] font-bold uppercase tracking-widest">Feed 2.4 Active</p>
            </div>
        </div>

        <style jsx global>{`
          .leaflet-container { background: transparent !important; border-radius: 30px; }
          .map-tiles {
              filter: ${isNight ? 'brightness(0.85) contrast(1.1) saturate(1)' : 'grayscale(0.05)'};
          }
        `}</style>
      </motion.div>
    </div>
  );
}

export default WeatherMap;