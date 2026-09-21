import { Link } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const PLACEHOLDER = "/products/placeholder.svg";

function getStockState(product) {
  if (!product) return false;

  if (
    product.inStock !== undefined ||
    product.stockStatus !== undefined
  ) {
    return (
      product.inStock === true ||
      product.stockStatus === "in_stock"
    );
  }

  const stock = Number(product.stock);
  return Number.isFinite(stock) && stock > 0;
}

function getProductImage(product) {
  const firstImage = Array.isArray(product?.images)
    ? product.images[0]
    : "";

  if (firstImage && typeof firstImage === "object") {
    return (
      firstImage.url ||
      firstImage.src ||
      firstImage.path ||
      product?.thumbnail ||
      product?.image ||
      product?.imageUrl ||
      PLACEHOLDER
    );
  }

  return (
    (typeof firstImage === "string" && firstImage.trim()
      ? firstImage
      : "") ||
    product?.thumbnail ||
    product?.image ||
    product?.imageUrl ||
    PLACEHOLDER
  );
}

export default function ProductCard({ product }) {
  const {
    getQty,
    setQty,
  } = useCart();

  const { has, toggle } = useWishlist();
  const [busy, setBusy] = useState(false);

  const inStock = getStockState(product);
  const current = getQty(product);

  const img = getProductImage(product);

  const discount =
    Number(product?.discountPercentage) || 0;

  const price =
    Number(product?.price) || 0;

  const compareAtPrice =
    Number(product?.compareAtPrice) || 0;

  const changeCartQuantity = async (next) => {
    if (!inStock || busy) return;

    try {
      setBusy(true);
      await setQty(product, next);
    } catch (error) {
      window.alert(
        error?.message || "Could not update cart."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await toggle(product);
    } catch {
      window.alert("Please try again.");
    }
  };

  return (
    <article className="productCard">
      <Link
        className="productVisual"
        to={`/product/${product.slug}`}
      >
        <img
          src={img}
          alt={product?.name || "Product"}
          loading="lazy"
          onError={(event) => {
            if (
              event.currentTarget.src.includes(
                PLACEHOLDER
              )
            ) {
              return;
            }

            event.currentTarget.src = PLACEHOLDER;
          }}
        />

        {discount > 0 && (
          <span className="discount">
            {Math.round(discount)}% OFF
          </span>
        )}

        {product?.isBestSeller && (
          <span className="bestSeller">
            BESTSELLER
          </span>
        )}

        <button
          type="button"
          className={`wishButton ${
            has(product) ? "liked" : ""
          }`}
          aria-label={
            has(product)
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={handleWishlist}
        >
          <Heart
            size={17}
            fill={
              has(product)
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </Link>

      <div className="productBody">
        <div className="productMeta">
          <span>
            {product?.category?.name ||
              product?.category ||
              "Pantry essential"}
          </span>

          <span>
            {product?.weight
              ? `${product.weight} ${
                  product.weightUnit || ""
                }`
              : "100 g"}
          </span>
        </div>

        <Link
          className="productName"
          to={`/product/${product.slug}`}
        >
          {product?.name}
        </Link>

        <p className="productDesc">
          {product?.shortDescription ||
            "Traditional flavour for everyday cooking."}
        </p>

        <div className="productBuy">
          <div>
            <strong>
              ₹{price.toFixed(0)}
            </strong>

            {compareAtPrice > price && (
              <del>
                ₹{compareAtPrice.toFixed(0)}
              </del>
            )}
          </div>

          {!inStock ? (
            <span className="outStock">
              Out of stock
            </span>
          ) : current > 0 ? (
            <div
              className="productQtyControl"
              aria-label={`Quantity for ${product?.name}`}
            >
              <button
                type="button"
                disabled={busy}
                aria-label="Decrease quantity"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  changeCartQuantity(current - 1);
                }}
              >
                <Minus size={14} />
              </button>

              <strong>{current}</strong>

              <button
                type="button"
                disabled={busy}
                aria-label="Increase quantity"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  changeCartQuantity(current + 1);
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="addButton"
              disabled={busy}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                changeCartQuantity(1);
              }}
              aria-label={`Add ${product?.name || "product"} to cart`}
            >
              <ShoppingBag size={15} />
              <span>ADD</span>
            </button>
          )}
        </div>

        <div
          className={`productStockStatus ${
            inStock
              ? "available"
              : "unavailable"
          }`}
          aria-live="polite"
        >
          <span className="stockDot" />

          <span>
            {inStock
              ? "In stock & ready to ship"
              : "Currently unavailable"}
          </span>
        </div>
      </div>

      <style>{`
        .productQtyControl {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          min-width: 94px;
          height: 38px;
          border: 1px solid #e4d8cd;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
        }

        .productQtyControl button {
          width: 31px;
          height: 100%;
          border: 0;
          background: transparent;
          color: #4b2113;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .productQtyControl button:hover:not(:disabled) {
          background: #f7eee6;
        }

        .productQtyControl button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .productQtyControl strong {
          min-width: 27px;
          text-align: center;
          color: #2c160d;
          font-size: 13px;
          font-weight: 900;
        }
      `}</style>
    </article>
  );
}
