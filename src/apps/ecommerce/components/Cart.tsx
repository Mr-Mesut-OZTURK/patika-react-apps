import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShop } from "../contexts/ShopContext";
import {
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  IconButton,
} from "../styled/Buttons";
import styles from "./Cart.module.css";

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useShop();

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🛒</span>
        <p className={styles.emptyText}>{t("shop.cart_empty")}</p>
        <SecondaryButton onClick={() => navigate("/shop")}>
          ← {t("shop.back_to_catalog")}
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("shop.cart_title")}</h2>
        <DangerButton onClick={clearCart}>{t("shop.clear_cart")}</DangerButton>
      </div>

      <div className={styles.layout}>
        {/* Items list */}
        <ul className={styles.list}>
          {cart.map((item, idx) => (
            <li
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
              className={styles.item}
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className={styles.itemImg}
                onClick={() => navigate(`/shop/product/${item.product.id}`)}
              />
              <div className={styles.itemInfo}>
                <button
                  className={styles.itemName}
                  onClick={() => navigate(`/shop/product/${item.product.id}`)}
                >
                  {item.product.name}
                </button>
                <div className={styles.meta}>
                  <span className={styles.metaBadge}>{item.selectedSize}</span>
                  <span className={styles.metaBadge}>{item.selectedColor}</span>
                  <span className={styles.metaBadge}>
                    {item.product.category}
                  </span>
                </div>
                <div className={styles.unitPrice}>
                  {item.product.price.toLocaleString("tr-TR")} ₺{" "}
                  {t("shop.per_unit")}
                </div>
              </div>
              <div className={styles.itemRight}>
                <div className={styles.qtyRow}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity - 1,
                      )
                    }
                  >
                    −
                  </button>
                  <span className={styles.qtyVal}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity + 1,
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <div className={styles.lineTotal}>
                  {(item.product.price * item.quantity).toLocaleString("tr-TR")}{" "}
                  ₺
                </div>
                <IconButton
                  onClick={() =>
                    removeFromCart(
                      item.product.id,
                      item.selectedSize,
                      item.selectedColor,
                    )
                  }
                  title={t("shop.remove")}
                  className={styles.removeBtn}
                >
                  🗑
                </IconButton>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary panel */}
        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>{t("shop.order_summary")}</h3>
          <div className={styles.summaryRow}>
            <span>{t("shop.subtotal")}</span>
            <span>{cartTotal.toLocaleString("tr-TR")} ₺</span>
          </div>
          <div className={styles.summaryRow}>
            <span>{t("shop.shipping")}</span>
            <span className={styles.freeShipping}>{t("shop.free")}</span>
          </div>
          <div className={styles.divider} />
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>{t("shop.total")}</span>
            <span className={styles.totalPrice}>
              {cartTotal.toLocaleString("tr-TR")} ₺
            </span>
          </div>
          <PrimaryButton style={{ width: "100%", marginTop: "16px" }}>
            {t("shop.checkout")}
          </PrimaryButton>
          <SecondaryButton
            style={{ width: "100%", marginTop: "10px" }}
            onClick={() => navigate("/shop")}
          >
            ← {t("shop.continue_shopping")}
          </SecondaryButton>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
