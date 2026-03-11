function AirQuality({ airQuality }) {

  if (!airQuality) return null

  const aqi = airQuality.main.aqi

  const levels = {
    1: { label: "Good", color: "text-green-400" },
    2: { label: "Fair", color: "text-yellow-400" },
    3: { label: "Moderate", color: "text-orange-400" },
    4: { label: "Poor", color: "text-red-400" },
    5: { label: "Very Poor", color: "text-purple-400" }
  }

  return (

    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">

      <h2 className="text-lg font-semibold mb-4">Air Quality</h2>

      <div className="text-3xl font-bold">

        AQI:
        <span className={`ml-2 ${levels[aqi].color}`}>
          {levels[aqi].label}
        </span>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">

        <div>PM2.5: {airQuality.components.pm2_5}</div>
        <div>PM10: {airQuality.components.pm10}</div>
        <div>CO: {airQuality.components.co}</div>
        <div>NO₂: {airQuality.components.no2}</div>

      </div>

    </div>

  )

}

export default AirQuality