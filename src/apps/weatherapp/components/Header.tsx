import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import citiesData from "../cities.json";
import { useWeather } from "../contexts/WeatherContext";

interface CityInfo {
  plaka: number;
  sehir: string;
}

const Header: React.FC = () => {
  const { city, setCity } = useWeather();
  const { t } = useTranslation();
  const [cities, setCities] = useState<CityInfo[]>([]);

  useEffect(() => {
    setCities(citiesData.cities.map((item) => item["Sehir-Bilgileri"]));
  }, []);

  const handleChange = (e: SelectChangeEvent) => setCity(e.target.value);

  return (
    <FormControl fullWidth>
      <FormLabel id="cities" htmlFor="cities">
        {t("weather.cities_label")}
      </FormLabel>
      <Select
        labelId="cities"
        name="cities"
        value={city || ""}
        onChange={handleChange}
      >
        {cities.map((item) => (
          <MenuItem key={item.plaka} value={item.sehir}>
            {item.sehir}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Header;
