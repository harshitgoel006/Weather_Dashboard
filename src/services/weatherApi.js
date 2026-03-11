import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

console.log("API KEY:", API_KEY);

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// ---------- CURRENT WEATHER ----------
export const getCurrentWeather = async (city) => {
  const res = await axios.get(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  return res.data;
};

// ---------- 5 DAY / 3 HOUR FORECAST ----------
export const getForecast = async (city) => {
  const res = await axios.get(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  return res.data;
};

// ---------- AIR QUALITY ----------
export const getAirQuality = async (lat, lon) => {
  const res = await axios.get(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

  return res.data;
};

// ---------- CITY AUTOCOMPLETE ----------
export const getCitySuggestions = async (query) => {
  const res = await axios.get(
    `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
  );

  return res.data;
};