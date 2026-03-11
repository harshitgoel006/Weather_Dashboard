import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
} from "chart.js"

import { Line } from "react-chartjs-2"

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
)

function WeatherChart({ forecast }) {

  if (!forecast) return null

  const next24 = forecast.slice(0, 8)

  const labels = next24.map(item =>
    new Date(item.dt_txt).getHours() + ":00"
  )

  const temps = next24.map(item =>
    Math.round(item.main.temp)
  )

  const data = {
    labels,
    datasets: [
      {
        data: temps,
        tension: 0.4,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.3)",
        fill: true,
        pointRadius: 3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#cbd5f5" }
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#cbd5f5" }
      }
    }
  }

  return (

    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5">

      <h2 className="text-xl font-semibold mb-4 text-white">
        Temperature Trend
      </h2>

      <Line data={data} options={options} />

    </div>

  )

}

export default WeatherChart