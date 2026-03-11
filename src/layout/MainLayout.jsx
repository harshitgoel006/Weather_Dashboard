import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const themes = {
  sunny: "from-[#0082c8] via-[#667db6] to-[#0082c8]", // Bright Blue Ocean
  rainy: "from-[#1e3c72] via-[#2a5298] to-[#0f2027]", // Deep Stormy Blue
  cloudy: "from-[#606c88] via-[#3f4c6b] to-[#2c3e50]", // Moody Gray
  night: "from-[#000428] via-[#004e92] to-[#000000]", // Midnight Blue
};

// --- Weather Visual Effects Layer ---
const WeatherVFX = ({ type }) => {
  if (type === 'rainy') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="rain-drop" 
            style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, opacity: Math.random() }} 
          />
        ))}
      </div>
    );
  }
  if (type === 'sunny') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-[120px] animate-pulse" />
      </div>
    );
  }
  if (type === 'cloudy') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="absolute top-20 w-96 h-40 bg-white/20 blur-[80px] rounded-full" style={{ animation: 'drift 30s linear infinite' }} />
            <div className="absolute bottom-40 w-[500px] h-60 bg-slate-400/20 blur-[100px] rounded-full" style={{ animation: 'drift 45s linear infinite reverse' }} />
        </div>
      )
  }
  return null;
};

function MainLayout({ children, weatherType = 'sunny' }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col text-white font-sans overflow-x-hidden">
      
      {/* 🌌 Base Animated Background */}
      <motion.div 
        key={weatherType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className={`fixed inset-0 z-0 bg-gradient-to-br transition-all duration-1000 ${themes[weatherType] || themes.sunny}`}
      />

      {/* 🎭 Weather VFX Layer (Rain, Sun Glow, Clouds) */}
      <WeatherVFX type={weatherType} />

      {/* 🌫️ Glass Overlay for Depth */}
      <div className="fixed inset-0 z-[1] bg-black/10 backdrop-blur-[1px]" />

      {/* 📄 Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={children.key} // Animation trigger on content change
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      {/* Noise Texture for Premium Finish */}
      <div className="fixed inset-0 z-[2] opacity-[0.02] pointer-events-none bg-[url('https://res.cloudinary.com/dzf9rq9p8/image/upload/v1680516104/noise_fdyz8u.png')]" />
    </div>
  );
}

export default MainLayout;