import { motion } from "framer-motion"

function HourlyForecast({ forecast }) {

  if (!forecast) return null

  const next24 = forecast.slice(0, 8)

  return (

    <div className="w-full">

      <h2 className="text-xl font-semibold mb-4 text-white">
        24 Hour Forecast
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4">

        {next24.map((item, index) => {

          const time = new Date(item.dt_txt).getHours()

          return (

            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="min-w-[100px] bg-white/10 backdrop-blur-xl rounded-xl p-4 flex flex-col items-center"
            >

              <p className="text-sm text-slate-300">
                {time}:00
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="icon"
                className="w-10 h-10"
              />

              <p className="text-white font-semibold">
                {Math.round(item.main.temp)}°
              </p>

            </motion.div>

          )

        })}

      </div>

    </div>

  )

}

export default HourlyForecast