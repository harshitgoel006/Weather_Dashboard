export const formatCurrentWeather = (data) => {
  return {
    city: data.name,
    country: data.sys.country,

    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),

    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,

    windSpeed: data.wind.speed,

    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,

    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,

    lat: data.coord.lat,
    lon: data.coord.lon,
  };
};


export const getWeatherAlert = (weather) => {

  if (!weather) return null

  const condition = weather.condition.toLowerCase()

  if (condition.includes("storm"))
    return "⚡ Thunderstorm warning"

  if (condition.includes("rain"))
    return "🌧 Heavy rain expected"

  if (condition.includes("snow"))
    return "❄ Snowfall expected"

  if (weather.temp > 40)
    return "🔥 Heatwave warning"

  return null

}