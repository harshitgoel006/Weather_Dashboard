import { useEffect, useState } from "react"

function SunProgress({ weather }) {

  if (!weather) return null

  const sunrise = new Date(weather.sunrise * 1000)
  const sunset = new Date(weather.sunset * 1000)
  const now = new Date()

  const total = sunset - sunrise
  const passed = now - sunrise

  let progress = (passed / total) * 100
  if (progress < 0) progress = 0
  if (progress > 100) progress = 100

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (

    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">

      <h2 className="text-lg font-semibold mb-4">
        Sunrise & Sunset
      </h2>

      <div className="flex justify-between text-sm mb-2">
        <span>🌅 {formatTime(sunrise)}</span>
        <span>🌇 {formatTime(sunset)}</span>
      </div>

      <div className="w-full h-2 bg-white/20 rounded-full relative">

        <div
          className="absolute h-2 bg-yellow-400 rounded-full"
          style={{ width: `${progress}%` }}
        />

        <div
          className="absolute -top-2 text-xl"
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
        >
          ☀
        </div>

      </div>

    </div>

  )
}

export default SunProgress