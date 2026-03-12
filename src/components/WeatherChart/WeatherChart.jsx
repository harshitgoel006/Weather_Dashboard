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

const lineShadowPlugin = {
  id: "lineShadow",
  beforeDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.shadowColor = "rgba(59,130,246,0.5)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
  },
  afterDatasetsDraw(chart) {
    chart.ctx.restore();
  },
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
    .filter((item) => new Date(item.dt_txt).getTime() > now)
    .slice(0, 8);

  const labels = next24.map((item) => {
    const date = new Date(item.dt_txt);
    const hour = date.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}${ampm}`;
  });

  const temps = next24.map((item) => Math.round(item.main?.temp ?? 0));

  const data = {
    labels,
    datasets: [
      {
        data: temps,
        tension: 0.5,
        borderColor: "#3b82f6",
        borderWidth: 4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#3b82f6",
        pointBorderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderWidth: 3,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);

          if (isNight) {
            gradient.addColorStop(0, "rgba(59,130,246,0.35)");
            gradient.addColorStop(1, "rgba(59,130,246,0)");
          } else {
            gradient.addColorStop(0, "rgba(59,130,246,0.25)");
            gradient.addColorStop(1, "rgba(255,255,255,0)");
          }

          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 10, bottom: 10 } },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isNight ? "#1e293b" : "#fff",
        titleColor: isNight ? "#fff" : "#1e293b",
        bodyColor: "#3b82f6",
        bodyFont: { weight: "900", size: 14 },
        padding: 12,
        cornerRadius: 16,
        displayColors: false,
        borderWidth: 1,
        borderColor: isNight
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.05)",
        callbacks: {
          label: (context) => ` ${context.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isNight ? "rgba(255,255,255,0.3)" : "#94a3b8",
          font: { size: 10, weight: "800" },
          padding: 10,
        },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4"> {/* WIDTH REDUCED */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        viewport={{ once: true }}
        className={`w-full p-8 rounded-[40px] border transition-all duration-500 overflow-hidden ${
          isNight
            ? "bg-[#1a1c2e]/40 backdrop-blur-xl border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            : "bg-white/40 backdrop-blur-xl border-white/60 shadow-lg hover:bg-white/60"
        }`}
      >

        {/* HEADER */}

        <div className="flex items-end justify-between mb-10">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`w-10 h-[2px] rounded-full ${
                  isNight
                    ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                    : "bg-slate-400"
                }`}
              />

              <p
                className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-40 ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Atmospheric Trend
              </p>
            </div>

            <h2
              className={`text-3xl font-black tracking-tight ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Thermal <span className="text-blue-500">Pulse</span>
            </h2>
          </div>

          <div
            className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
              isNight
                ? "bg-white/5 border-white/10 text-white/50"
                : "bg-white border-slate-100 text-slate-500 shadow-sm"
            }`}
          >
            Next 24 Hours
          </div>

        </div>

        {/* CHART */}

        <div className="h-[220px] w-full relative">
          <Line data={data} options={options} />
        </div>

        {/* FOOTER */}

        <div className="mt-8 flex justify-between items-center px-2">

          <div className="flex items-center gap-2">

            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isNight
                  ? "bg-blue-500 animate-pulse"
                  : "bg-blue-600"
              }`}
            />

            <p
              className={`text-[9px] font-black uppercase tracking-widest opacity-30 ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Dynamic Forecasting Engaged
            </p>

          </div>

          <p
            className={`text-[10px] font-black tracking-tighter ${
              isNight ? "text-blue-400/60" : "text-blue-600/60"
            }`}
          >
            {Math.min(...temps)}° — {Math.max(...temps)}° RANGE
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default WeatherChart;