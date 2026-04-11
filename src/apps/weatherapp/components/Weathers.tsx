import React from "react";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useWeather } from "../contexts/WeatherContext";
import SelectWeatherImg from "./SelectWeatherImg";

const Weathers: React.FC = () => {
  const { error, loading, weather } = useWeather();
  const { t } = useTranslation();

  if (error) {
    return (
      <Box sx={{ backgroundColor: "#d30707", borderRadius: 2, p: 2 }}>
        <Typography color="white" fontWeight={600}>
          {t("weather.error")}
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">{t("weather.loading")}</Typography>
      </Box>
    );
  }

  const desc = weather.weather?.[0];

  return (
    <Box>
      <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header band */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h4" color="#a6f080" fontWeight={700}>
              {weather.name}
            </Typography>
            {desc && (
              <Typography
                variant="body1"
                color="#d4d4d4"
                sx={{ textTransform: "capitalize", mt: 0.5 }}
              >
                {desc.description}
              </Typography>
            )}
          </Box>
          {desc && <SelectWeatherImg text={desc.description} />}
        </Box>

        {/* Temp row */}
        {weather.main && (
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: 2,
              py: 3,
            }}
          >
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={800}>
                {Math.round(weather.main.temp)}°C
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("weather.temp")}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box textAlign="center">
              <Typography variant="h5" fontWeight={600}>
                {Math.round(weather.main.feels_like)}°C
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("weather.feels_like")}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box textAlign="center">
              <Typography variant="h5" fontWeight={600}>
                {weather.main.humidity}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("weather.humidity")}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box textAlign="center">
              <Typography variant="body1">
                ↑ {Math.round(weather.main.temp_max)}° &nbsp; ↓{" "}
                {Math.round(weather.main.temp_min)}°
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("weather.max_min")}
              </Typography>
            </Box>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default Weathers;
