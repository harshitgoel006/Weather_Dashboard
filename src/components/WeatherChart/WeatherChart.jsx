import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";

// --- Custom Plugin for Line Shadow ---
const lineShadowPlugin = {
  id: 'lineShadow',
  beforeDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
  },
  afterDatasetsDraw(chart) {
    chart.ctx.restore();
  }
};

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  lineShadowPlugin
);

function WeatherChart({ forecast, isNight }) {

  if (!forecast || forecast.length === 0) return null;

  const now = Date.now();
  const next24 = forecast
  .filter(item => new Date(item.dt_txt).getTime() > now)
  .slice(0, 8);

  const labels = next24.map(item => {
    const hour = new Date(item.dt_txt).getHours();
    return `${hour}:00`;
  });
  const temps = next24.map(item => Math.round(item.main?.temp ?? 0));

  const data = {
    labels,
    datasets: [
      {
        data: temps,
        tension: 0.5,
        borderColor: isNight ? "#60a5fa" : "#2563eb",
        borderWidth: 5,
        pointBackgroundColor: "#fff",
        pointBorderColor: isNight ? "#60a5fa" : "#2563eb",
        pointBorderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderWidth: 4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          if (isNight) {
            gradient.addColorStop(0, "rgba(96, 165, 250, 0.25)");
            gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
          } else {
            gradient.addColorStop(0, "rgba(37, 99, 235, 0.15)");
            gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.05)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          }
          return gradient;
        },
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isNight ? "#1e293b" : "#fff",
        titleColor: isNight ? "#fff" : "#1e293b",
        bodyColor: isNight ? "#94a3b8" : "#64748b",
        bodyFont: { weight: 'bold' },
        padding: 15,
        cornerRadius: 15,
        displayColors: false,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        callbacks: {
          label: (context) => ` ${context.parsed.y}°C`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: isNight ? "rgba(255,255,255,0.3)" : "#94a3b8",
          font: { size: 12, weight: '600' },
          padding: 10
        }
      },
      y: {
        display: false,
        grid: { display: false }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      // Standard Hover (y-lift) for consistency
      whileHover={{ y: -8 }} 
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      viewport={{ once: true }}
      // Reverted Background and Border to match Dashboard
      className={`relative p-8 rounded-[45px] border transition-all duration-700 ${
        isNight 
          ? "bg-slate-900/60 border-white/5 shadow-2xl" 
          : "bg-white/60 backdrop-blur-3xl border-white shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isNight ? 'bg-blue-400' : 'bg-blue-600'}`} />
            <p className={`text-[11px] font-black uppercase tracking-[0.25em] ${isNight ? 'text-white/30' : 'text-slate-400'}`}>
              Atmospheric Trend
            </p>
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isNight ? 'text-white' : 'text-slate-800'}`}>
            Temperature Timeline
          </h2>
        </div>
        
        {/* Only 24H Label remaining, 7D Tag removed */}
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
          isNight ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-900 text-white'
        }`}>
          Next 24 Hours
        </div>
      </div>

      <div className="h-[240px] w-full relative">
        <Line data={data} options={options} />
        <div className={`absolute bottom-0 left-0 right-0 h-10 pointer-events-none ${
            isNight ? 'bg-gradient-to-t from-transparent to-transparent' : 'bg-gradient-to-t from-transparent to-transparent'
        }`} />
      </div>

      <div className="mt-6 flex justify-between items-center opacity-40">
          <p className="text-[10px] font-bold italic">Dynamic Forecasting Engaged</p>
          <p className="text-[10px] font-bold">{Math.min(...temps)}° — {Math.max(...temps)}° Range</p>
      </div>
    </motion.div>
  );
}

export default WeatherChart;