import { useState, useEffect } from "react";
import { getCurrentWeather } from "../services/weatherApi";
import { formatCurrentWeather } from "../utils/helpers";
import WeatherHero from "../components/WeatherHero/WeatherHero";
import FavoriteCities from "../components/FavoriteCities/FavoriteCities";
import HourlyForecast from "../components/HourlyForecast/HourlyForecast"
import WeeklyForecast from "../components/WeeklyForecast/WeeklyForecast"
import WeatherDetails from "../components/WeatherDetails/WeatherDetails";
import WeatherChart from "../components/WeatherChart/WeatherChart";
import WeatherMap from "../components/WeatherMap/WeatherMap"
import WeatherAlert from "../components/WeatherAlert/WeatherAlert"
import { getWeatherAlert } from "../utils/helpers"
import SunProgress from "../components/SunProgress/SunProgress"
import AirQuality from "../components/AQICard/AQICard";

function Home({ weather, forecast, onSearch ,airQuality}) {

  return (

    <div className="space-y-10">

      <FavoriteCities onSelect={onSearch} />
      <WeatherAlert weather={weather} getWeatherAlert={getWeatherAlert} />

      <WeatherHero weather={weather} />
<SunProgress weather={weather} />
      <HourlyForecast forecast={forecast} />

      <WeeklyForecast forecast={forecast}/>

      <WeatherDetails weather={weather}/>

      <WeatherChart forecast={forecast} />

      <WeatherMap weather={weather} />

<AirQuality airQuality={airQuality} />
    </div>

  )

}

export default Home;
