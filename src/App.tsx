import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";
import Home from "./pages/Home";
import WeatherApp from "./apps/weatherapp/WeatherApp";
import RickAndMortyApp from "./apps/rickandmorty/RickAndMortyApp";
import BMIApp from "./apps/bmi/BMIApp";
import EcommerceApp from "./apps/ecommerce/EcommerceApp";
import LanguageSwitcher from "./components/LanguageSwitcher";

const App: React.FC = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <BrowserRouter>
      <nav className="app-nav">
        <button
          className="app-nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
        <div
          className={`app-nav-links${menuOpen ? " app-nav-links--open" : ""}`}
        >
          <NavLink to="/" end className="app-nav-home" onClick={close}>
            🏠 <span>{t("nav.home")}</span>
          </NavLink>
          <NavLink to="/weather" onClick={close}>
            🌤 {t("nav.weather")}
          </NavLink>
          <NavLink to="/rickmorty" onClick={close}>
            🧪 {t("nav.rickmorty")}
          </NavLink>
          <NavLink to="/bmi" onClick={close}>
            📊 {t("nav.bmi")}
          </NavLink>
          <NavLink to="/shop" onClick={close}>
            👗 {t("nav.shop")}
          </NavLink>
        </div>
        <LanguageSwitcher />
      </nav>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<WeatherApp />} />
          <Route path="/rickmorty" element={<RickAndMortyApp />} />
          <Route path="/bmi/*" element={<BMIApp />} />
          <Route path="/shop/*" element={<EcommerceApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
