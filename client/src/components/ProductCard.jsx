import { Link } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const PLACEHOLDER = "/products/placeholder.svg";

function getStockState(product) {
  if (!product) return false;
  if (product.inStock !== undefined || product.stockStatus !== undefined) {
    return product.inStock === true || product.stockStatus === "in_stock";
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
    (typeof firstImage === "string" && firstImage.trim() ? firstImage : "") ||
    product?.thumbnail ||
    product?.image ||
    product?.imageUrl ||
    PLACEHOLDER
  );
}

function getCategoryName(category) {
  if (!category) return "PANTRY ESSENTIAL";
  if (typeof category === "string") return category;
  return category.name || category.title || "PANTRY ESSENTIAL";
}

export default function ProductCard({ product, index = 0 }) {
  const { getQty, setQty } = useCart();
  const { has, toggle } = useWishlist();
  const [busy, setBusy] = useState(false);

  const inStock = getStockState(product);
  const current = getQty(product);
  const image = getProductImage(product);
  const liked = has(product);

  const price = Number(product?.price) || 0;
  const compareAtPrice = Number(product?.compareAtPrice) || 0;
  const suppliedDiscount = Number(product?.discountPercentage) || 0;

  const discount =
    suppliedDiscount > 0
      ? Math.round(suppliedDiscount)
      : compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const category = getCategoryName(product?.category);

  const changeQuantity = async (next) => {
    if (!inStock || busy || next < 0) return;
    try {
      setBusy(true);
      await setQty(product, next);
    } catch (error) {
      window.alert(error?.message || "Could not update cart.");
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
    <article
      className={`rrProductCard ${!inStock ? "isOutOfStock" : ""}`}
      style={{ "--card-index": index }}
    >
      <Link
        className="rrProductVisual"
        to={`/product/${product?.slug || ""}`}
        aria-label={`View ${product?.name || "product"}`}
      >
        <img
          src={image}
          alt={product?.name || "RR MASALA product"}
          loading={index < 4 ? "eager" : "lazy"}
          onError={(event) => {
            if (!event.currentTarget.src.includes(PLACEHOLDER)) {
              event.currentTarget.src = PLACEHOLDER;
            }
          }}
        />

        <div className="rrProductTopRow">
          {discount > 0 ? (
            <span className="rrDiscountBadge">-{discount}% OFF</span>
          ) : (
            <span className="rrCollectionBadge">RR AUTHENTIC</span>
          )}

          <button
            type="button"
            className={`rrWishButton ${liked ? "isLiked" : ""}`}
            onClick={handleWishlist}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>

        {product?.isBestSeller && (
          <span className="rrBestSeller">
            <Sparkles size={11} />
            BESTSELLER
          </span>
        )}

        <span className="rrViewProduct">
          View Details
          <ArrowUpRight size={14} />
        </span>

        {!inStock && (
          <div className="rrOutOfStockOverlay">
            <span>Currently Unavailable</span>
          </div>
        )}
      </Link>

      <div className="rrProductBody">
        <div className="rrProductMeta">
          <span>{category}</span>
          {product?.weight && (
            <span>
              {product.weight}
              {product.weightUnit || "g"}
            </span>
          )}
        </div>

        <Link
          to={`/product/${product?.slug || ""}`}
          className="rrProductName"
          title={product?.name || "RR MASALA Product"}
        >
          {product?.name || "RR MASALA Product"}
        </Link>

        <p className="rrProductDescription">
          {product?.shortDescription ||
            product?.description ||
            "Traditional Indian pantry essential, stone-ground and packed fresh for pure everyday flavour."}
        </p>

        <div className="rrProductBottom">
          <div className="rrPriceBlock">
            <strong>₹{price.toLocaleString("en-IN")}</strong>
            {compareAtPrice > price && (
              <del>₹{compareAtPrice.toLocaleString("en-IN")}</del>
            )}
          </div>

          {!inStock ? (
            <span className="rrUnavailablePill">Out of Stock</span>
          ) : current > 0 ? (
            <div
              className="rrQtyControl"
              aria-label={`Quantity for ${product?.name || "product"}`}
            >
              <button
                type="button"
                disabled={busy}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  changeQuantity(current - 1);
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <strong>{current}</strong>

              <button
                type="button"
                disabled={busy}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  changeQuantity(current + 1);
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="rrAddButton"
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                changeQuantity(1);
              }}
            >
              <ShoppingBag size={15} />
              <span>{busy ? "ADDING" : "ADD"}</span>
            </button>
          )}
        </div>

        <div
          className={`rrStockStatus ${inStock ? "isAvailable" : "isUnavailable"}`}
          aria-live="polite"
        >
          <span className="rrStockDot" />
          <span>
            {inStock ? "In stock · Ready to dispatch" : "Currently unavailable"}
          </span>
        </div>
      </div>
    </article>
  );
}