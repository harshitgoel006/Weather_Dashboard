import { getWeatherAlert } from "../../utils/helpers";

function WeatherAlert({ weather }) {

  const alert = getWeatherAlert(weather);

  if (!alert) return null;

  return (
    <div className="glass-card p-4 text-red-300 border border-red-500/30">
      ⚠ {alert}
    </div>
  );
}

export default WeatherAlert;