import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShop } from "../contexts/ShopContext";
import { SecondaryButton, FavoriteButton } from "../styled/Buttons";
import styles from "./Favorites.module.css";

const Favorites: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useShop();

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>♡</span>
        <p className={styles.emptyText}>{t("shop.favorites_empty")}</p>
        <SecondaryButton onClick={() => navigate("/shop")}>
          ← {t("shop.back_to_catalog")}
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("shop.favorites_title")}</h2>
      <p className={styles.count}>
        {favorites.length} {t("shop.items")}
      </p>

      <div className={styles.grid}>
        {favorites.map((product) => (
          <div key={product.id} className={styles.card}>
            <div
              className={styles.imgWrap}
              onClick={() => navigate(`/shop/product/${product.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/shop/product/${product.id}`)
              }
            >
              <img
                src={product.image}
                alt={product.name}
                className={styles.img}
                loading="lazy"
              />
              <span className={styles.categoryBadge}>{product.category}</span>
            </div>
            <div className={styles.cardBody}>
              <button
                className={styles.name}
                onClick={() => navigate(`/shop/product/${product.id}`)}
              >
                {product.name}
              </button>
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
              <div className={styles.cardActions}>
                <SecondaryButton
                  onClick={() => navigate(`/shop/product/${product.id}`)}
                  style={{ flex: 1 }}
                >
                  {t("shop.view_detail")}
                </SecondaryButton>
                <FavoriteButton
                  $active
                  onClick={() => toggleFavorite(product)}
                  title={t("shop.remove_favorite")}
                >
                  ♥
                </FavoriteButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
