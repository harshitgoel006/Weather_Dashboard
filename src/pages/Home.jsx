import { useEffect } from "react";
import { getCurrentWeather } from "../services/weatherApi";

function Home() {

  useEffect(() => {

    const testWeather = async () => {
      try {
        const data = await getCurrentWeather("Delhi");
        console.log("Weather Data:", data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    testWeather();

  }, []);

  return (
    <div>
      SkyCast Weather Dashboard
    </div>
  );
}

export default Home;