import { motion } from "framer-motion"

function WeatherDetails({ weather }) {

  if (!weather) return null

  const details = [
    { label: "Humidity", value: `${weather.humidity}%` },
    { label: "Wind Speed", value: `${weather.wind} m/s` },
    { label: "Pressure", value: `${weather.pressure} hPa` },
    { label: "Visibility", value: `${weather.visibility / 1000} km` },
    { label: "Sunrise", value: weather.sunrise },
    { label: "Sunset", value: weather.sunset }
  ]

  return (

    <div className="w-full">

      <h2 className="text-xl font-semibold mb-4 text-white">
        Weather Details
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {details.map((item, index) => (

          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-4"
          >

            <p className="text-sm text-slate-400">
              {item.label}
            </p>

            <p className="text-lg font-semibold text-white">
              {item.value}
            </p>

          </motion.div>

        ))}

      </div>

    </div>

  )

}

export default WeatherDetails