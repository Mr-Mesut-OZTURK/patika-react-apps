import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShopProvider, useShop } from "./contexts/ShopContext";
import ProductCatalog from "./components/ProductCatalog";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Favorites from "./components/Favorites";
import Contact from "./components/Contact";
import styles from "./EcommerceApp.module.css";

const ShopNav: React.FC = () => {
  const { t } = useTranslation();
  const { cartCount, favorites } = useShop();
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/shop/product/");

  return (
    <nav className={styles.shopNav}>
      <NavLink
        to="/shop"
        end
        className={({ isActive }) =>
          `${styles.navItem} ${isActive || isDetail ? styles.navActive : ""}`
        }
      >
        👗 {t("shop.tab_catalog")}
      </NavLink>
      <NavLink
        to="/shop/favorites"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.navActive : ""}`
        }
      >
        ♥ {t("shop.tab_favorites")}
        {favorites.length > 0 && (
          <span className={styles.tabBadge}>{favorites.length}</span>
        )}
      </NavLink>
      <NavLink
        to="/shop/cart"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.navActive : ""}`
        }
      >
        🛒 {t("shop.tab_cart")}
        {cartCount > 0 && <span className={styles.tabBadge}>{cartCount}</span>}
      </NavLink>
      <NavLink
        to="/shop/contact"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.navActive : ""}`
        }
      >
        📬 {t("shop.tab_contact")}
      </NavLink>
    </nav>
  );
};

const EcommerceInner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <div className={styles.brandRow}>
            <span className={styles.brandEmoji}>👗</span>
            <div>
              <h1 className={styles.brandName}>{t("shop.brand_name")}</h1>
              <p className={styles.brandTagline}>{t("shop.brand_tagline")}</p>
            </div>
          </div>
        </div>
        <ShopNav />
      </header>

      <main className={styles.main}>
        <Routes>
          <Route index element={<ProductCatalog />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="cart" element={<Cart />} />
          <Route path="contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
};

const EcommerceApp: React.FC = () => (
  <ShopProvider>
    <EcommerceInner />
  </ShopProvider>
);

export default EcommerceApp;
