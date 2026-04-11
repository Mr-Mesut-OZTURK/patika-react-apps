import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShop } from "../contexts/ShopContext";
import { useProducts } from "../hooks/useProducts";
import {
  PrimaryButton,
  SecondaryButton,
  FavoriteButton,
} from "../styled/Buttons";
import styles from "./ProductDetail.module.css";

const StarRating: React.FC<{ rating: number; count: number }> = ({
  rating,
  count,
}) => (
  <div className={styles.ratingRow}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className={n <= Math.round(rating) ? styles.starFull : styles.starEmpty}
      >
        ★
      </span>
    ))}
    <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
    <span className={styles.reviewCount}>({count})</span>
  </div>
);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { products } = useProducts();
  const { addToCart, toggleFavorite, isFavorite } = useShop();

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [products, id],
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>🪡 {t("shop.product_not_found")}</p>
        <SecondaryButton onClick={() => navigate("/shop")}>
          ← {t("shop.back_to_catalog")}
        </SecondaryButton>
      </div>
    );
  }

  const fav = isFavorite(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const canAdd = selectedSize !== "" && selectedColor !== "";

  const COLOR_MAP: Record<string, string> = {
    white: "#f0f0f0",
    black: "#111",
    red: "#c0392b",
    navy: "#1a237e",
    gray: "#888",
    blue: "#2980b9",
    pink: "#e91e8b",
    beige: "#d4b896",
    brown: "#6d4c41",
    green: "#2e7d32",
    orange: "#e65100",
    purple: "#6a1b9a",
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate("/shop")}>
        ← {t("shop.back_to_catalog")}
      </button>

      <div className={styles.layout}>
        {/* Image */}
        <div className={styles.imageCol}>
          <div className={styles.imgWrap}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.img}
            />
            <span className={styles.categoryBadge}>{product.category}</span>
          </div>
        </div>

        {/* Info */}
        <div className={styles.infoCol}>
          <h1 className={styles.name}>{product.name}</h1>
          <StarRating rating={product.rating} count={product.reviewCount} />
          <div className={styles.price}>
            {product.price.toLocaleString("tr-TR")} ₺
          </div>
          <p className={styles.description}>{product.description}</p>

          {/* Size selector */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              {t("shop.size")}
              {selectedSize && (
                <span className={styles.selected}> — {selectedSize}</span>
              )}
            </label>
            <div className={styles.sizeGrid}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              {t("shop.color")}
              {selectedColor && (
                <span className={styles.selected}> — {selectedColor}</span>
              )}
            </label>
            <div className={styles.colorGrid}>
              {product.colors.map((color) => (
                <button
                  key={color}
                  title={color}
                  className={`${styles.colorBtn} ${selectedColor === color ? styles.colorActive : ""}`}
                  style={{ background: COLOR_MAP[color] ?? color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>{t("shop.quantity")}</label>
            <div className={styles.qtyRow}>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className={styles.qtyVal}>{quantity}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Validation hint */}
          {!canAdd && (
            <p className={styles.hint}>{t("shop.select_size_color")}</p>
          )}

          {/* CTA buttons */}
          <div className={styles.actions}>
            <PrimaryButton onClick={handleAddToCart} disabled={!canAdd}>
              🛒 {added ? t("shop.added") : t("shop.add_to_cart")}
            </PrimaryButton>
            <FavoriteButton
              $active={fav}
              onClick={() => toggleFavorite(product)}
            >
              {fav ? "♥" : "♡"}{" "}
              {fav ? t("shop.in_favorites") : t("shop.add_to_favorites")}
            </FavoriteButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
