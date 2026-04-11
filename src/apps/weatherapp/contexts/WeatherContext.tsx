import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface WeatherMain {
  feels_like: number;
  humidity: number;
  temp: number;
  temp_max: number;
  temp_min: number;
  pressure: number;
}

interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherData {
  name?: string;
  weather?: WeatherDescription[];
  main?: WeatherMain;
  cod?: number | string;
  wind?: { speed: number };
  visibility?: number;
}

interface WeatherContextType {
  city: string;
  setCity: (city: string) => void;
  error: boolean;
  loading: boolean;
  weather: WeatherData;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [city, setCity] = useState("Izmir");
  const [weather, setWeather] = useState<WeatherData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`,
    )
      .then((res) => res.json())
      .then((data: WeatherData) => {
        setWeather(data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError(true);
      });
  }, [city]);

  return (
    <WeatherContext.Provider value={{ city, setCity, error, loading, weather }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used inside WeatherProvider");
  return ctx;
};
