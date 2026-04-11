import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShop } from "../contexts/ShopContext";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types";
import { FilterButton, FavoriteButton } from "../styled/Buttons";
import styles from "./ProductCatalog.module.css";

const CATEGORIES = [
  "All",
  "Shirt",
  "Pants",
  "T-Shirt",
  "Dress",
  "Jacket",
  "Sweater",
  "Jeans",
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <span className={styles.stars} aria-label={`${rating} stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className={n <= Math.round(rating) ? styles.starFull : styles.starEmpty}
      >
        ★
      </span>
    ))}
    <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
  </span>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useShop();
  const fav = isFavorite(product.id);

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/shop/product/${product.id}`)}
    >
      <div className={styles.imgWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.img}
          loading="lazy"
        />
        <FavoriteButton
          $active={fav}
          className={styles.favBtn}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? "♥" : "♡"}
        </FavoriteButton>
        <span className={styles.categoryBadge}>{product.category}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.name}>{product.name}</h3>
        <StarRating rating={product.rating} />
        <span className={styles.reviews}>({product.reviewCount})</span>
        <div className={styles.price}>
          {product.price.toLocaleString("tr-TR")} ₺
        </div>
        <div className={styles.sizes}>
          {product.sizes.map((s) => (
            <span key={s} className={styles.sizeChip}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCatalog: React.FC = () => {
  const { t } = useTranslation();
  const { products, loading, error } = useProducts();
  const { cartCount } = useShop();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<
    "default" | "price_asc" | "price_desc" | "rating"
  >("default");

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, activeCategory, search, sortBy]);

  return (
    <div className={styles.page}>
      {/* Top toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("shop.search_placeholder")}
          />
          {search && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>
        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="default">{t("shop.sort_default")}</option>
          <option value="price_asc">{t("shop.sort_price_asc")}</option>
          <option value="price_desc">{t("shop.sort_price_desc")}</option>
          <option value="rating">{t("shop.sort_rating")}</option>
        </select>
        <button
          className={styles.cartBadgeBtn}
          onClick={() => navigate("/shop/cart")}
        >
          🛒
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>

      {/* Category filters */}
      <div className={styles.filters}>
        {CATEGORIES.map((cat) => (
          <FilterButton
            key={cat}
            $active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "All" ? t("shop.all") : cat}
          </FilterButton>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className={styles.resultCount}>
          {filtered.length} {t("shop.results")}
        </p>
      )}

      {/* Grid */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>{t("shop.loading")}</span>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && filtered.length === 0 && (
        <p className={styles.noResult}>{t("shop.no_results")}</p>
      )}
      <div className={styles.grid}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
