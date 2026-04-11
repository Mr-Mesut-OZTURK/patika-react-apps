import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "../types";
import { MOCKAPI_BASE_URL } from "../config";
import { MOCK_PRODUCTS } from "../mockData";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!MOCKAPI_BASE_URL) {
      // No API URL configured — use local mock data
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get<Product[]>(`${MOCKAPI_BASE_URL}/products`, {
        signal: controller.signal,
      })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("MockAPI fetch failed, falling back to mock data:", err);
        setProducts(MOCK_PRODUCTS);
        setError(null); // silently fall back
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { products, loading, error };
};
