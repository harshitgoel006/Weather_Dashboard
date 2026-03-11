import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

console.log("API KEY:", API_KEY);

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// ---------- CURRENT WEATHER ----------
export const getCurrentWeather = async (lat, lon, unit="metric") => {
  const res = await axios.get(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
  );

  return res.data;
};

// ---------- 5 DAY / 3 HOUR FORECAST ----------
export const getForecast = async (lat, lon, unit = "metric") => {

  const res = await axios.get(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
  )

  return res.data

}

// ---------- AIR QUALITY ----------
export const getAirQuality = async (lat, lon) => {

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )

  const data = await response.json()

  return data.list[0]

}

// ---------- CITY AUTOCOMPLETE ----------
export const getCitySuggestions = async (query) => {
  const res = await axios.get(
    `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
  );

  return res.data;
};