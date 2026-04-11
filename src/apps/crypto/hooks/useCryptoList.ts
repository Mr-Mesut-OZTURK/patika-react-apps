import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Coin } from "../types";

const BASE_URL =
  process.env.REACT_APP_COINGECKO_URL || "https://api.coingecko.com/api/v3";

const API_KEY = process.env.REACT_APP_COINGECKO_KEY || "";

export const useCryptoList = (currency = "usd") => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = API_KEY
        ? { "x-cg-demo-api-key": API_KEY }
        : {};

      const { data } = await axios.get<Coin[]>(`${BASE_URL}/coins/markets`, {
        headers,
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });
      setCoins(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError("rate_limit");
        } else {
          setError("fetch_error");
        }
      } else {
        setError("fetch_error");
      }
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    coins: filtered,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchCoins,
  };
};
