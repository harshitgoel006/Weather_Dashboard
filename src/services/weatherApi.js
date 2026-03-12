import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const getCurrentWeather = async (lat, lon, unit="metric") => {
  try {
    const res = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
    );
    return res.data;
  } catch (error) {
    console.error("Current Weather Error:", error);
    throw error;
  }
};

export const getForecast = async (lat, lon, unit="metric") => {
  try {
    const res = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
    );
    return res.data.list;
  } catch (error) {
    console.error("Forecast Error:", error);
    throw error;
  }
};

export const getAirQuality = async (lat, lon) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return res.data.list[0];
  } catch (error) {
    console.error("AQI Error:", error);
    throw error;
  }
};

export const getCitySuggestions = async (query) => {
  try {
    const res = await axios.get(
      `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    return res.data.map((city) => ({
      name: city.name,
      state: city.state,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    }));

  } catch (error) {
    console.error("City Search Error:", error);
    throw error;
  }
};