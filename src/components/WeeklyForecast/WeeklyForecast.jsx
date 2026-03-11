import { motion } from "framer-motion"

function WeeklyForecast({ forecast }) {

  if (!forecast) return null

  const daily = forecast.filter((item) =>
    item.dt_txt.includes("12:00:00")
  )

  return (

    <div className="w-full">

      <h2 className="text-xl font-semibold mb-4 text-white">
        7 Day Forecast
      </h2>

      <div className="space-y-3">

        {daily.slice(0,7).map((day, index) => {

          const date = new Date(day.dt_txt)

          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
          })

          return (

            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3"
            >

              <p className="text-slate-200 w-12">
                {dayName}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                className="w-8"
              />

              <p className="text-white font-semibold">
                {Math.round(day.main.temp)}°
              </p>

            </motion.div>

          )

        })}

      </div>

    </div>

  )

}

export default WeeklyForecast