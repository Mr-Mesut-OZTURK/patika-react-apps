import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Product, CartItem } from "../types";

interface ShopContextValue {
  cart: CartItem[];
  favorites: Product[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    delta: number,
  ) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  cartCount: number;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ec_cart") || "[]");
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ec_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ec_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ec_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = useCallback(
    (product: Product, size: string, color: string) => {
      setCart((prev) => {
        const existing = prev.find(
          (i) =>
            i.product.id === product.id &&
            i.selectedSize === size &&
            i.selectedColor === color,
        );
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id &&
            i.selectedSize === size &&
            i.selectedColor === color
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        return [
          ...prev,
          { product, quantity: 1, selectedSize: size, selectedColor: color },
        ];
      });
    },
    [],
  );

  const removeFromCart = useCallback(
    (productId: string, size: string, color: string) => {
      setCart((prev) =>
        prev.filter(
          (i) =>
            !(
              i.product.id === productId &&
              i.selectedSize === size &&
              i.selectedColor === color
            ),
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((i) =>
            i.product.id === productId &&
            i.selectedSize === size &&
            i.selectedColor === color
              ? { ...i, quantity: Math.max(0, i.quantity + delta) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product],
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((p) => p.id === productId),
    [favorites],
  );

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextValue => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
