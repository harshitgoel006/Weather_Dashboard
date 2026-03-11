import { MapContainer, TileLayer } from "react-leaflet"

function WeatherMap({ weather }) {

  if (!weather) return null

  return (

    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5">

      <h2 className="text-xl font-semibold mb-4 text-white">
        Weather Map
      </h2>

      <MapContainer
        center={[weather.lat, weather.lon]}
        zoom={6}
        style={{ height: "400px", borderRadius: "12px" }}
      >

        {/* Base Map */}

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Weather Layer */}

        <TileLayer
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY}`}
          opacity={0.5}
        />

      </MapContainer>

    </div>

  )

}

export default WeatherMap