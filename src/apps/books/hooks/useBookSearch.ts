import { useState, useCallback } from "react";
import axios from "axios";
import { BookVolume, GoogleBooksResponse } from "../types";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const MAX_RESULTS = 20;

export function useBookSearch() {
  const [books, setBooks] = useState<BookVolume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setLastQuery(trimmed);

    try {
      const { data } = await axios.get<GoogleBooksResponse>(BASE_URL, {
        params: {
          q: trimmed,
          maxResults: MAX_RESULTS,
          printType: "books",
        },
      });
      setBooks(data.items ?? []);
      setTotalItems(data.totalItems ?? 0);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.status === 429 ? "rate_limit" : "fetch_error");
      } else {
        setError("fetch_error");
      }
      setBooks([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setBooks([]);
    setTotalItems(0);
    setError(null);
    setLastQuery("");
  }, []);

  return { books, loading, error, totalItems, lastQuery, search, clear };
}
