import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Weathers from "./components/Weathers";
import { WeatherProvider } from "./contexts/WeatherContext";

const WeatherApp: React.FC = () => {
  const { t } = useTranslation();

  return (
    <WeatherProvider>
      <Box
        sx={{
          minHeight: "calc(100vh - 50px)",
          background: "linear-gradient(180deg, #e8f4fd 0%, #ffffff 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            gutterBottom
            sx={{ color: "#1a1a2e", mb: 3 }}
          >
            {t("weather.title")}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Header />
          </Box>
          <Weathers />
        </Container>
      </Box>
    </WeatherProvider>
  );
};

export default WeatherApp;
