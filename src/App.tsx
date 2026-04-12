import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import WeatherApp from "./apps/weatherapp/WeatherApp";
import RickAndMortyApp from "./apps/rickandmorty/RickAndMortyApp";
import BMIApp from "./apps/bmi/BMIApp";
import EcommerceApp from "./apps/ecommerce/EcommerceApp";
import NotesApp from "./apps/notes/NotesApp";
import ChatApp from "./apps/chat/ChatApp";
import CryptoApp from "./apps/crypto/CryptoApp";
import MemoryGame from "./apps/memory/MemoryGame";
import BooksApp from "./apps/books/BooksApp";
import RpsApp from "./apps/rps/RpsApp";
import AppShell from "./components/AppShell";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/weather"
          element={
            <AppShell>
              <WeatherApp />
            </AppShell>
          }
        />
        <Route
          path="/rickmorty"
          element={
            <AppShell>
              <RickAndMortyApp />
            </AppShell>
          }
        />
        <Route
          path="/bmi/*"
          element={
            <AppShell>
              <BMIApp />
            </AppShell>
          }
        />
        <Route
          path="/shop/*"
          element={
            <AppShell>
              <EcommerceApp />
            </AppShell>
          }
        />
        <Route
          path="/notes/*"
          element={
            <AppShell>
              <NotesApp />
            </AppShell>
          }
        />
        <Route
          path="/chat/*"
          element={
            <AppShell>
              <ChatApp />
            </AppShell>
          }
        />
        <Route
          path="/crypto"
          element={
            <AppShell>
              <CryptoApp />
            </AppShell>
          }
        />
        <Route
          path="/memory"
          element={
            <AppShell>
              <MemoryGame />
            </AppShell>
          }
        />
        <Route
          path="/books"
          element={
            <AppShell>
              <BooksApp />
            </AppShell>
          }
        />
        <Route
          path="/rps"
          element={
            <AppShell>
              <RpsApp />
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
