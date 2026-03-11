function WeatherAlert({ weather, getWeatherAlert }) {

  const alert = getWeatherAlert(weather)

  if (!alert) return null

  return (

    <div className="bg-red-500/20 border border-red-400 text-red-200 px-5 py-3 rounded-xl">

      <strong>Weather Alert:</strong> {alert}

    </div>

  )

}

export default WeatherAlert