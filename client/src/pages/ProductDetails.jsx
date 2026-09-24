import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { API } from "../api/http.js";
import { useCart } from "../context/CartContext.jsx";

const PLACEHOLDER = "/products/placeholder.svg";

function getImageList(product) {
  if (!product) return [];

  const raw = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.thumbnail,
    product.image,
    product.imageUrl,
  ];

  return [
    ...new Set(
      raw
        .map((item) => {
          if (typeof item === "string") return item;
          return item?.url || item?.src || item?.path || "";
        })
        .map((item) => String(item).trim())
        .filter(Boolean)
    ),
  ];
}

function getProductImage(product) {
  return getImageList(product)[0] || PLACEHOLDER;
}

function getCategoryName(category) {
  if (!category) return "PANTRY ESSENTIAL";
  if (typeof category === "string") return category;
  return category.name || category.title || "PANTRY ESSENTIAL";
}

function getCategorySlug(category) {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.slug || "";
}

function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getDiscountPercent(price, compareAtPrice, existingDiscount) {
  const supplied = Number(existingDiscount);

  if (Number.isFinite(supplied) && supplied > 0) {
    return Math.round(supplied);
  }

  const priceNumber = Number(price);
  const compareNumber = Number(compareAtPrice);

  if (
    Number.isFinite(priceNumber) &&
    Number.isFinite(compareNumber) &&
    compareNumber > priceNumber
  ) {
    return Math.round(((compareNumber - priceNumber) / compareNumber) * 100);
  }

  return 0;
}

function ProductImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      {...props}
      className={className}
      src={failed ? PLACEHOLDER : src || PLACEHOLDER}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setQty: setCartQty, getQty } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");
    setProduct(null);
    setRelated([]);
    setQuantity(0);
    setActiveImage(0);
    setCartMessage("");

    API.get(`/products/${encodeURIComponent(slug)}`)
      .then((response) => {
        if (!active) return;

        const data = response?.data?.data?.product || response?.data?.product;

        if (!data) {
          setProduct(false);
          return;
        }

        setProduct(data);
      })
      .catch((requestError) => {
        if (!active) return;

        console.error("PRODUCT DETAILS ERROR:", requestError);
        setProduct(false);
        setError(
          requestError?.response?.data?.message ||
            "We could not load this product."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const images = useMemo(() => getImageList(product), [product]);

  const inStock = useMemo(() => {
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

    const value = Number(product.stock);
    return Number.isFinite(value) && value > 0;
  }, [product]);

  const price = Number(product?.price) || 0;
  const compareAtPrice = Number(product?.compareAtPrice) || 0;

  const discountPercent = getDiscountPercent(
    price,
    compareAtPrice,
    product?.discountPercentage
  );

  const categoryName = getCategoryName(product?.category);
  const categorySlug =
    getCategorySlug(product?.category) || product?.categorySlug || "";

  const currentImage = images[activeImage] || images[0] || PLACEHOLDER;

  const cartQuantity = useMemo(
    () => getQty(product),
    [getQty, product]
  );

  useEffect(() => {
    if (!product) return;

    const existingQuantity = getQty(product);
    setQuantity(existingQuantity > 0 ? existingQuantity : 0);
  }, [product, getQty]);

  useEffect(() => {
    if (!product || !categorySlug) return;

    let active = true;

    setRelatedLoading(true);

    API.get(
      `/products?limit=8&sort=popular&category=${encodeURIComponent(
        categorySlug
      )}`
    )
      .then((response) => {
        if (!active) return;

        const items =
          response?.data?.data?.items ||
          response?.data?.data?.products ||
          response?.data?.products ||
          [];

        setRelated(
          Array.isArray(items)
            ? items
                .filter(
                  (item) =>
                    String(item?._id || item?.id) !==
                    String(product?._id || product?.id)
                )
                .slice(0, 4)
            : []
        );
      })
      .catch(() => {
        if (active) setRelated([]);
      })
      .finally(() => {
        if (active) setRelatedLoading(false);
      });

    return () => {
      active = false;
    };
  }, [product, categorySlug]);

  useEffect(() => {
    if (!cartMessage) return;

    const timer = window.setTimeout(() => {
      setCartMessage("");
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [cartMessage]);

  const changeQuantity = (next) => {
    if (!inStock) return;

    let safeNext = Math.max(0, Math.floor(Number(next) || 0));

    const exactStock = Number(product?.stock);

    if (
      Number.isFinite(exactStock) &&
      exactStock >= 0
    ) {
      safeNext = Math.min(safeNext, exactStock);
    }

    setQuantity(safeNext);
  };

  const addToCart = () => {
    if (!product || !inStock || quantity <= 0) return;

    try {
      setCartQty(product, quantity);
      setCartMessage(
        `${product.name} × ${quantity} added to your cart.`
      );
    } catch (error) {
      window.alert(
        error?.message || "Could not add to cart."
      );
    }
  };

  const buyNow = () => {
    if (!product || !inStock || quantity <= 0) return;

    try {
      setCartQty(product, quantity);
      navigate("/checkout");
    } catch (error) {
      window.alert(
        error?.message || "Could not continue to checkout."
      );
    }
  };

  const moveImage = (direction) => {
    if (images.length < 2) return;

    setActiveImage((current) => {
      if (direction === "next") {
        return current === images.length - 1 ? 0 : current + 1;
      }

      return current === 0 ? images.length - 1 : current - 1;
    });
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <main className="rrpd-page rrpd-loading-page">
          <div className="rrpd-skeleton-wrap">
            <div className="rrpd-skeleton rrpd-skeleton-image" />
            <div className="rrpd-skeleton-info">
              <div className="rrpd-skeleton rrpd-skeleton-line small" />
              <div className="rrpd-skeleton rrpd-skeleton-line title" />
              <div className="rrpd-skeleton rrpd-skeleton-line medium" />
              <div className="rrpd-skeleton rrpd-skeleton-line medium" />
              <div className="rrpd-skeleton rrpd-skeleton-button" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (product === false || !product) {
    return (
      <>
        <style>{styles}</style>

        <main className="rrpd-page rrpd-error-page">
          <div className="rrpd-error-card">
            <span className="rrpd-error-code">404</span>
            <h1>Product not found</h1>
            <p>
              {error ||
                "This product may have been removed or is no longer available."}
            </p>
            <Link className="rrpd-primary-btn" to="/products">
              <ArrowLeft size={17} />
              Back to shop
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <main className="rrpd-page">
        <div className="rrpd-shell">
          {/* Breadcrumb */}
          <nav className="rrpd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products">Products</Link>
            <ChevronRight size={14} />

            {categorySlug ? (
              <>
                <Link to={`/category/${categorySlug}`}>
                  {categoryName}
                </Link>
                <ChevronRight size={14} />
              </>
            ) : null}

            <span>{product.name}</span>
          </nav>

          {/* Main product */}
          <section className="rrpd-product">
            {/* Gallery */}
            <div className="rrpd-gallery">
              <div className="rrpd-main-image">
                <ProductImage
                  src={currentImage}
                  alt={product.name}
                  className="rrpd-main-photo"
                />

                {discountPercent > 0 && (
                  <span className="rrpd-sale-badge">
                    {discountPercent}% OFF
                  </span>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="rrpd-gallery-arrow left"
                      onClick={() => moveImage("prev")}
                      aria-label="Previous product image"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      className="rrpd-gallery-arrow right"
                      onClick={() => moveImage("next")}
                      aria-label="Next product image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="rrpd-thumbnails">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`rrpd-thumb ${
                        activeImage === index ? "active" : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                      aria-label={`View product image ${index + 1}`}
                    >
                      <ProductImage
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product information */}
            <div className="rrpd-info">
              <div className="rrpd-category-row">
                <span className="rrpd-eyebrow">{categoryName}</span>

                {product.brand && (
                  <span className="rrpd-brand">{product.brand}</span>
                )}
              </div>

              <h1>{product.name}</h1>

              {product.shortDescription && (
                <p className="rrpd-short-description">
                  {product.shortDescription}
                </p>
              )}

              <div className="rrpd-rating-placeholder">
                <span className="rrpd-dot" />
                <span>
                  Authentic pantry essential from the RR MASALA collection
                </span>
              </div>

              <div className="rrpd-price-row">
                <strong>{formatMoney(price)}</strong>

                {compareAtPrice > price && (
                  <del>{formatMoney(compareAtPrice)}</del>
                )}

                {discountPercent > 0 && (
                  <span className="rrpd-save">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <div
                className={`rrpd-stock ${
                  inStock ? "available" : "unavailable"
                }`}
              >
                <span className="rrpd-stock-dot" />
                {inStock
                  ? "In stock & ready to ship"
                  : "Currently unavailable"}
              </div>

              <div className="rrpd-divider" />

              {/* Quantity */}
              <div className="rrpd-purchase-label">
                <span>Quantity</span>
                {inStock && (
                  <small>Available to order</small>
                )}
              </div>

              <div className="rrpd-purchase">
                <div
                  className={`rrpd-quantity ${
                    !inStock ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => changeQuantity(quantity - 1)}
                    disabled={!inStock || quantity <= 0}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={17} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() => changeQuantity(quantity + 1)}
                    disabled={!inStock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                <button
                  type="button"
                  className="rrpd-primary-btn rrpd-cart-btn"
                  onClick={addToCart}
                  disabled={!inStock || quantity <= 0}
                >
                  <ShoppingBag size={18} />
                  {inStock ? "Add to cart" : "Out of stock"}
                </button>
              </div>

              {inStock && (
                <button
                  type="button"
                  className="rrpd-buy-btn"
                  onClick={buyNow}
                  disabled={quantity <= 0}
                >
                  Buy it now
                  <ArrowRight size={17} />
                </button>
              )}

              {cartMessage && (
                <div className="rrpd-cart-message" role="status">
                  <span>
                    <Check size={15} />
                  </span>
                  {cartMessage}
                  <Link to="/cart">View cart</Link>
                </div>
              )}

              {/* Delivery benefits */}
              <div className="rrpd-benefits">
                <div className="rrpd-benefit">
                  <span className="rrpd-benefit-icon">
                    <Truck size={19} />
                  </span>
                  <div>
                    <strong>Reliable delivery</strong>
                    <small>
                      Free delivery on orders above ₹999
                    </small>
                  </div>
                </div>

                <div className="rrpd-benefit">
                  <span className="rrpd-benefit-icon">
                    <ShieldCheck size={19} />
                  </span>
                  <div>
                    <strong>Carefully packed</strong>
                    <small>
                      Packed for safe pantry storage and delivery
                    </small>
                  </div>
                </div>
              </div>

              {/* Product details */}
              <div className="rrpd-details">
                <details open>
                  <summary>
                    <span>Product description</span>
                    <ChevronRight size={17} />
                  </summary>

                  <div className="rrpd-detail-content">
                    <p>
                      {product.description ||
                        product.shortDescription ||
                        "Please refer to the package label for product details."}
                    </p>
                  </div>
                </details>

                <details>
                  <summary>
                    <span>Ingredients</span>
                    <ChevronRight size={17} />
                  </summary>

                  <div className="rrpd-detail-content">
                    <p>
                      {Array.isArray(product.ingredients)
                        ? product.ingredients.join(", ")
                        : product.ingredients ||
                          "See package label for the complete ingredient list."}
                    </p>
                  </div>
                </details>

                <details>
                  <summary>
                    <span>Weight & package</span>
                    <ChevronRight size={17} />
                  </summary>

                  <div className="rrpd-detail-content">
                    <p>
                      {product.weight
                        ? `${product.weight} ${
                            product.weightUnit || ""
                          }`
                        : "Refer to the selected product package."}
                      {product.sku ? ` • SKU: ${product.sku}` : ""}
                    </p>
                  </div>
                </details>

                <details>
                  <summary>
                    <span>Storage & shelf life</span>
                    <ChevronRight size={17} />
                  </summary>

                  <div className="rrpd-detail-content">
                    <p>
                      {product.storageInstructions ||
                        "Store in a cool, dry place away from direct sunlight."}
                      {product.shelfLife
                        ? ` ${product.shelfLife}`
                        : ""}
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* Trust strip */}
          <section className="rrpd-trust">
            <div>
              <span>
                <ShieldCheck size={19} />
              </span>
              <div>
                <strong>Quality focused</strong>
                <small>Carefully selected pantry products</small>
              </div>
            </div>

            <div>
              <span>
                <Truck size={19} />
              </span>
              <div>
                <strong>Safe delivery</strong>
                <small>Order tracking available after purchase</small>
              </div>
            </div>

            <div>
              <span>₹</span>
              <div>
                <strong>Secure online payment</strong>
                <small>Online payment available at checkout</small>
              </div>
            </div>
          </section>

          {/* Related products */}
          {(relatedLoading || related.length > 0) && (
            <section className="rrpd-related">
              <div className="rrpd-section-heading">
                <div>
                  <span className="rrpd-eyebrow">FROM THE SAME COLLECTION</span>
                  <h2>You may also like</h2>
                </div>

                {categorySlug && (
                  <Link to={`/category/${categorySlug}`}>
                    View category
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>

              {relatedLoading ? (
                <div className="rrpd-related-grid">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className="rrpd-related-skeleton" key={index}>
                      <div />
                      <span />
                      <span />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rrpd-related-grid">
                  {related.map((item) => {
                    const itemSlug = item?.slug;
                    if (!itemSlug) return null;

                    const itemImage = getProductImage(item);
                    const itemPrice = Number(item.price) || 0;
                    const itemCompare = Number(item.compareAtPrice) || 0;

                    return (
                      <Link
                        key={item._id || item.id || itemSlug}
                        to={`/product/${itemSlug}`}
                        className="rrpd-related-card"
                      >
                        <div className="rrpd-related-image">
                          <ProductImage
                            src={itemImage}
                            alt={item.name}
                            loading="lazy"
                          />
                        </div>

                        <div className="rrpd-related-body">
                          <span>{getCategoryName(item.category)}</span>
                          <h3>{item.name}</h3>

                          <div>
                            <strong>{formatMoney(itemPrice)}</strong>
                            {itemCompare > itemPrice && (
                              <del>{formatMoney(itemCompare)}</del>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
}

const styles = `
  .rrpd-page {
    --rrpd-bg: #faf7f1;
    --rrpd-card: #ffffff;
    --rrpd-ink: #241812;
    --rrpd-muted: #766c64;
    --rrpd-line: #e9e0d5;
    --rrpd-brown: #6e2b14;
    --rrpd-brown-dark: #3c1b10;
    --rrpd-gold: #f4b51b;
    --rrpd-gold-soft: #fff3c9;
    min-height: 100vh;
    background:
      radial-gradient(circle at 8% 4%, rgba(244,181,27,.09), transparent 24%),
      var(--rrpd-bg);
    color: var(--rrpd-ink);
    padding: 22px 0 80px;
  }

  .rrpd-shell {
    width: min(1220px, calc(100% - 36px));
    margin: 0 auto;
  }

  .rrpd-breadcrumb {
    min-height: 34px;
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 20px;
    color: #8b8179;
    font-size: 12px;
    line-height: 1.4;
    overflow: hidden;
  }

  .rrpd-breadcrumb a {
    color: #665b53;
    text-decoration: none;
    white-space: nowrap;
  }

  .rrpd-breadcrumb a:hover {
    color: var(--rrpd-brown);
  }

  .rrpd-breadcrumb svg {
    flex: 0 0 auto;
    color: #b2a69c;
  }

  .rrpd-breadcrumb span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rrpd-product {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(420px, .98fr);
    gap: clamp(38px, 6vw, 84px);
    align-items: start;
  }

  .rrpd-gallery {
    min-width: 0;
    position: sticky;
    top: 18px;
  }

  .rrpd-sale-badge {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 2;
    border-radius: 999px;
    background: var(--rrpd-gold);
    color: #241812;
    padding: 8px 12px;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .08em;
  }

  .rrpd-gallery-arrow {
    position: absolute;
    top: 50%;
    width: 42px;
    height: 42px;
    border: 1px solid rgba(255,255,255,.75);
    border-radius: 50%;
    background: rgba(255,255,255,.92);
    color: var(--rrpd-ink);
    display: grid;
    place-items: center;
    cursor: pointer;
    transform: translateY(-50%);
    box-shadow: 0 10px 25px rgba(38,22,12,.12);
    transition: .2s ease;
    z-index: 3;
  }

  .rrpd-gallery-arrow:hover {
    transform: translateY(-50%) scale(1.05);
    background: var(--rrpd-gold);
  }

  .rrpd-gallery-arrow.left {
    left: 16px;
  }

  .rrpd-gallery-arrow.right {
    right: 16px;
  }

  .rrpd-thumbnails {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    overflow-x: auto;
    padding: 2px;
    scrollbar-width: thin;
  }

  .rrpd-thumb {
    flex: 0 0 76px;
    width: 76px;
    height: 76px;
    border: 1px solid var(--rrpd-line);
    border-radius: 14px;
    padding: 5px;
    background: #fff;
    cursor: pointer;
    overflow: hidden;
    transition: .2s ease;
  }

  .rrpd-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 9px;
  }

  .rrpd-thumb:hover,
  .rrpd-thumb.active {
    border-color: var(--rrpd-brown);
    box-shadow: 0 0 0 2px rgba(110,43,20,.10);
  }

  .rrpd-info {
    padding: 8px 0 0;
  }

  .rrpd-category-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 13px;
  }

  .rrpd-eyebrow {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    color: var(--rrpd-brown);
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .rrpd-brand {
    border-left: 1px solid var(--rrpd-line);
    padding-left: 10px;
    color: #9a8e84;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .rrpd-info h1 {
    max-width: 720px;
    margin: 0;
    font-size: clamp(31px, 4vw, 52px);
    line-height: 1.03;
    letter-spacing: -.045em;
    font-weight: 950;
    color: var(--rrpd-brown-dark);
  }

  .rrpd-short-description {
    max-width: 650px;
    margin: 18px 0 0;
    color: var(--rrpd-muted);
    font-size: 15px;
    line-height: 1.75;
  }

  .rrpd-rating-placeholder {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    color: #8c8178;
    font-size: 11px;
    font-weight: 700;
  }

  .rrpd-dot {
    width: 7px;
    height: 7px;
    flex: 0 0 7px;
    border-radius: 50%;
    background: #4e9a4e;
  }

  .rrpd-price-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 11px;
    margin-top: 24px;
  }

  .rrpd-price-row strong {
    font-size: 31px;
    line-height: 1;
    letter-spacing: -.025em;
    color: var(--rrpd-ink);
  }

  .rrpd-price-row del {
    color: #9c9289;
    font-size: 15px;
  }

  .rrpd-save {
    border-radius: 999px;
    background: var(--rrpd-gold-soft);
    color: #7b4d00;
    padding: 6px 9px;
    font-size: 10px;
    font-weight: 900;
  }

  .rrpd-stock {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 13px;
    font-size: 12px;
    font-weight: 800;
  }

  .rrpd-stock.available {
    color: #39703a;
  }

  .rrpd-stock.unavailable {
    color: #a04332;
  }

  .rrpd-stock-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  .rrpd-divider {
    height: 1px;
    background: var(--rrpd-line);
    margin: 25px 0 21px;
  }

  .rrpd-purchase-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 9px;
    font-size: 12px;
    font-weight: 900;
  }

  .rrpd-purchase-label small {
    color: #988c83;
    font-size: 10px;
    font-weight: 700;
  }

  .rrpd-purchase {
    display: grid;
    grid-template-columns: 132px minmax(0, 1fr);
    gap: 10px;
  }

  .rrpd-quantity {
    height: 54px;
    border: 1px solid #d9cec2;
    border-radius: 13px;
    background: #fff;
    display: grid;
    grid-template-columns: 38px 1fr 38px;
    align-items: center;
    overflow: hidden;
  }

  .rrpd-quantity button {
    height: 100%;
    border: 0;
    background: transparent;
    color: var(--rrpd-ink);
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .rrpd-quantity button:hover:not(:disabled) {
    background: #f7efe7;
  }

  .rrpd-quantity button:disabled {
    opacity: .35;
    cursor: not-allowed;
  }

  .rrpd-quantity span {
    text-align: center;
    font-size: 14px;
    font-weight: 900;
  }

  .rrpd-primary-btn {
    min-height: 54px;
    border: 0;
    border-radius: 13px;
    background: var(--rrpd-brown);
    color: #fff;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    font-size: 13px;
    font-weight: 900;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 12px 24px rgba(110,43,20,.16);
    transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
  }

  .rrpd-primary-btn:hover:not(:disabled) {
    background: #4f1e0e;
    transform: translateY(-1px);
    box-shadow: 0 15px 28px rgba(110,43,20,.22);
  }

  .rrpd-primary-btn:disabled {
    opacity: .48;
    cursor: not-allowed;
    box-shadow: none;
  }

  .rrpd-cart-btn {
    width: 100%;
  }

  .rrpd-buy-btn {
    width: 100%;
    min-height: 48px;
    margin-top: 9px;
    border: 1px solid #d8c8bb;
    border-radius: 13px;
    background: #fff;
    color: var(--rrpd-brown);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    transition: .2s ease;
  }

  .rrpd-buy-btn:hover {
    background: #fbf2e8;
    border-color: var(--rrpd-brown);
  }

  .rrpd-cart-message {
    min-height: 42px;
    margin-top: 12px;
    padding: 8px 10px;
    border: 1px solid #d7e7d3;
    border-radius: 11px;
    background: #f4fbf1;
    color: #356433;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
  }

  .rrpd-cart-message > span {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    border-radius: 50%;
    background: #4e9a4e;
    color: #fff;
    display: grid;
    place-items: center;
  }

  .rrpd-cart-message a {
    margin-left: auto;
    color: #315c2f;
    font-weight: 900;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .rrpd-benefits {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 18px;
  }

  .rrpd-benefit {
    min-height: 68px;
    border: 1px solid var(--rrpd-line);
    border-radius: 13px;
    background: rgba(255,255,255,.7);
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .rrpd-benefit-icon {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 11px;
    background: #f7ecdf;
    color: var(--rrpd-brown);
    display: grid;
    place-items: center;
  }

  .rrpd-benefit div {
    min-width: 0;
  }

  .rrpd-benefit strong {
    display: block;
    color: var(--rrpd-ink);
    font-size: 11px;
    font-weight: 900;
  }

  .rrpd-benefit small {
    display: block;
    margin-top: 3px;
    color: #887d74;
    font-size: 10px;
    line-height: 1.45;
  }

  .rrpd-details {
    margin-top: 22px;
    border-top: 1px solid var(--rrpd-line);
  }

  .rrpd-details details {
    border-bottom: 1px solid var(--rrpd-line);
  }

  .rrpd-details summary {
    min-height: 56px;
    padding: 0 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: var(--rrpd-ink);
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    list-style: none;
  }

  .rrpd-details summary::-webkit-details-marker {
    display: none;
  }

  .rrpd-details summary svg {
    transition: transform .2s ease;
    color: #9b8f85;
  }

  .rrpd-details details[open] summary svg {
    transform: rotate(90deg);
  }

  .rrpd-detail-content {
    padding: 0 2px 17px;
  }

  .rrpd-detail-content p {
    margin: 0;
    color: #756b63;
    font-size: 12px;
    line-height: 1.75;
  }

  .rrpd-trust {
    margin-top: 60px;
    border: 1px solid var(--rrpd-line);
    border-radius: 18px;
    background: #fff;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow: hidden;
  }

  .rrpd-trust > div {
    min-height: 92px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .rrpd-trust > div + div {
    border-left: 1px solid var(--rrpd-line);
  }

  .rrpd-trust > div > span {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 11px;
    background: #f7ecdf;
    color: var(--rrpd-brown);
    display: grid;
    place-items: center;
    font-size: 15px;
    font-weight: 950;
  }

  .rrpd-trust strong {
    display: block;
    font-size: 11px;
    font-weight: 900;
  }

  .rrpd-trust small {
    display: block;
    margin-top: 4px;
    color: #8a7e75;
    font-size: 9px;
    line-height: 1.45;
  }

  .rrpd-related {
    margin-top: 68px;
  }

  .rrpd-section-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 22px;
  }

  .rrpd-section-heading h2 {
    margin: 5px 0 0;
    color: var(--rrpd-brown-dark);
    font-size: clamp(25px, 3vw, 34px);
    line-height: 1.1;
    letter-spacing: -.035em;
  }

  .rrpd-section-heading > a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--rrpd-brown);
    font-size: 11px;
    font-weight: 900;
    text-decoration: none;
    white-space: nowrap;
  }

  .rrpd-section-heading > a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .rrpd-related-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .rrpd-related-card {
    min-width: 0;
    border: 1px solid var(--rrpd-line);
    border-radius: 17px;
    background: #fff;
    overflow: hidden;
    color: inherit;
    text-decoration: none;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    display: flex;
    flex-direction: column;
  }

  .rrpd-related-card:hover {
    transform: translateY(-3px);
    border-color: #d5c2b2;
    box-shadow: 0 15px 35px rgba(55,29,15,.09);
  }

  .rrpd-related-image {
    aspect-ratio: 1 / 1;
    background: #f7f1e9;
    overflow: hidden;
    width: 100%;
  }

  /* RELATED IMAGE FIX - ALWAYS COVER */
  .rrpd-related-image img {
    width: 100%;
    height: 100%;
    object-fit: cover !important;
    padding: 0 !important;
    transition: transform .3s ease;
  }

  .rrpd-related-card:hover .rrpd-related-image img {
    transform: scale(1.04);
  }

  .rrpd-related-body {
    padding: 14px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .rrpd-related-body > span {
    display: block;
    overflow: hidden;
    color: #9b8d82;
    font-size: 8px;
    font-weight: 900;
    letter-spacing: .1em;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .rrpd-related-body h3 {
    height: 34px;
    margin: 6px 0 10px;
    overflow: hidden;
    color: var(--rrpd-ink);
    font-size: 12px;
    line-height: 1.4;
    font-weight: 900;
    flex-grow: 1;
  }

  .rrpd-related-body > div {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .rrpd-related-body strong {
    color: var(--rrpd-brown);
    font-size: 13px;
  }

  .rrpd-related-body del {
    color: #a59a91;
    font-size: 9px;
  }

  .rrpd-loading-page,
  .rrpd-error-page {
    display: grid;
    place-items: center;
  }

  .rrpd-skeleton-wrap {
    width: min(980px, calc(100% - 36px));
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }

  .rrpd-skeleton {
    position: relative;
    overflow: hidden;
    background: #eee7de;
  }

  .rrpd-skeleton::after,
  .rrpd-related-skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.55),
      transparent
    );
    animation: rrpdShimmer 1.3s infinite;
  }

  @keyframes rrpdShimmer {
    100% {
      transform: translateX(100%);
    }
  }

  .rrpd-skeleton-image {
    aspect-ratio: 1 / 1;
    border-radius: 28px;
  }

  .rrpd-skeleton-info {
    padding-top: 35px;
  }

  .rrpd-skeleton-line {
    height: 16px;
    border-radius: 7px;
    margin-bottom: 15px;
  }

  .rrpd-skeleton-line.small {
    width: 25%;
  }

  .rrpd-skeleton-line.medium {
    width: 70%;
  }

  .rrpd-skeleton-line.title {
    width: 92%;
    height: 48px;
    margin: 25px 0;
  }

  .rrpd-skeleton-button {
    width: 100%;
    height: 54px;
    border-radius: 13px;
    margin-top: 30px;
  }

  .rrpd-error-card {
    width: min(520px, calc(100% - 36px));
    padding: 48px 32px;
    border: 1px solid var(--rrpd-line);
    border-radius: 24px;
    background: #fff;
    text-align: center;
    box-shadow: 0 20px 50px rgba(49,27,15,.07);
  }

  .rrpd-error-code {
    color: var(--rrpd-gold);
    font-size: 56px;
    line-height: 1;
    font-weight: 950;
  }

  .rrpd-error-card h1 {
    margin: 15px 0 8px;
    color: var(--rrpd-brown-dark);
    font-size: 28px;
  }

  .rrpd-error-card p {
    margin: 0 auto 24px;
    max-width: 420px;
    color: var(--rrpd-muted);
    font-size: 13px;
    line-height: 1.7;
  }

  .rrpd-error-card .rrpd-primary-btn {
    display: inline-flex;
  }

  .rrpd-related-skeleton {
    position: relative;
    min-width: 0;
    height: 320px;
    border: 1px solid var(--rrpd-line);
    border-radius: 17px;
    background: #fff;
    overflow: hidden;
  }

  .rrpd-related-skeleton > div {
    height: 220px;
    background: #eee7de;
  }

  .rrpd-related-skeleton > span {
    display: block;
    width: 75%;
    height: 11px;
    margin: 13px 14px 0;
    border-radius: 6px;
    background: #eee7de;
  }

  .rrpd-related-skeleton > span:last-child {
    width: 45%;
    margin-top: 8px;
  }

  @media (max-width: 980px) {
    .rrpd-product {
      grid-template-columns: minmax(0, 1fr) minmax(360px, .9fr);
      gap: 35px;
    }

    .rrpd-related-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .rrpd-skeleton-wrap {
      gap: 35px;
    }
  }

  @media (max-width: 820px) {
    .rrpd-page {
      padding-top: 14px;
      padding-bottom: 55px;
    }

    .rrpd-shell {
      width: min(100% - 28px, 680px);
    }

    .rrpd-product {
      grid-template-columns: 1fr;
      gap: 28px;
    }

    .rrpd-gallery {
      position: static;
    }

    .rrpd-main-image {
      max-width: 680px;
      margin: 0 auto;
      border-radius: 22px;
    }

    .rrpd-main-photo {
      padding: 0;
    }

    .rrpd-info {
      padding: 0;
    }

    .rrpd-info h1 {
      font-size: clamp(30px, 7vw, 43px);
    }

    .rrpd-benefits {
      grid-template-columns: 1fr 1fr;
    }

    .rrpd-trust {
      grid-template-columns: 1fr;
    }

    .rrpd-trust > div + div {
      border-left: 0;
      border-top: 1px solid var(--rrpd-line);
    }

    .rrpd-skeleton-wrap {
      grid-template-columns: 1fr;
      gap: 25px;
    }

    .rrpd-skeleton-info {
      padding-top: 0;
    }
  }

  @media (max-width: 620px) {
    .rrpd-shell {
      width: calc(100% - 22px);
    }

    .rrpd-breadcrumb {
      margin-bottom: 12px;
      font-size: 10px;
    }

    .rrpd-main-image {
      border-radius: 18px;
    }

    .rrpd-main-photo {
      padding: 0;
    }

    .rrpd-sale-badge {
      top: 12px;
      left: 12px;
      padding: 7px 9px;
      font-size: 8px;
    }

    .rrpd-gallery-arrow {
      width: 36px;
      height: 36px;
    }

    .rrpd-gallery-arrow.left {
      left: 10px;
    }

    .rrpd-gallery-arrow.right {
      right: 10px;
    }

    .rrpd-thumb {
      flex-basis: 64px;
      width: 64px;
      height: 64px;
    }

    .rrpd-info h1 {
      font-size: 31px;
    }

    .rrpd-short-description {
      font-size: 13px;
      line-height: 1.65;
    }

    .rrpd-price-row strong {
      font-size: 27px;
    }

    .rrpd-purchase {
      grid-template-columns: 112px minmax(0, 1fr);
    }

    .rrpd-primary-btn {
      min-height: 50px;
      padding: 0 13px;
      font-size: 12px;
    }

    .rrpd-quantity {
      height: 50px;
      grid-template-columns: 31px 1fr 31px;
    }

    .rrpd-benefits {
      grid-template-columns: 1fr;
    }

    .rrpd-trust {
      margin-top: 42px;
    }

    .rrpd-trust > div {
      padding: 14px;
    }

    .rrpd-related {
      margin-top: 50px;
    }

    .rrpd-section-heading {
      align-items: flex-start;
      flex-direction: column;
      margin-bottom: 17px;
    }

    .rrpd-section-heading h2 {
      font-size: 26px;
    }

    .rrpd-related-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .rrpd-related-body {
      padding: 11px;
    }

    .rrpd-related-body h3 {
      height: 34px;
      font-size: 11px;
    }

    .rrpd-related-body strong {
      font-size: 12px;
    }

    .rrpd-related-skeleton {
      height: 250px;
    }

    .rrpd-related-skeleton > div {
      height: 165px;
    }

    .rrpd-error-card {
      padding: 38px 22px;
    }
  }

  @media (max-width: 380px) {
    .rrpd-purchase {
      grid-template-columns: 98px minmax(0, 1fr);
    }

    .rrpd-cart-btn {
      padding-inline: 8px;
    }

    .rrpd-cart-message {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .rrpd-cart-message a {
      margin-left: 32px;
      width: 100%;
    }
  }

  .rrpd-compliance {
    margin-top: 22px;
    padding: 18px;
    border: 1px solid #eadfd4;
    border-radius: 18px;
    background: linear-gradient(135deg, #fffaf2, #fff);
  }

  .rrpd-compliance-head {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #5a260f;
    margin-bottom: 14px;
  }

  .rrpd-compliance-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .rrpd-compliance-grid > div {
    padding: 11px;
    border: 1px solid #eee2d7;
    border-radius: 12px;
    background: #fff;
  }

  .rrpd-compliance-grid span {
    display: block;
    font-size: 9px;
    color: #8b7e75;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 5px;
  }

  .rrpd-compliance-grid b {
    font-size: 12px;
  }

  .rrpd-compliance p {
    margin: 13px 0 0;
    color: #786e67;
    font-size: 11px;
    line-height: 1.6;
  }

  @media (max-width: 700px) {
    .rrpd-compliance-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* RR MASALA — PRODUCT DETAILS WORLD-CLASS OVERRIDES */
  .rrpd-page{
    background:
      radial-gradient(circle at 4% 4%,rgba(169,15,25,.045),transparent 22%),
      radial-gradient(circle at 96% 16%,rgba(215,155,28,.065),transparent 25%),
      #fff!important;
    padding-top:34px!important;
    padding-bottom:100px!important;
  }
  .rrpd-shell{width:min(1320px,100%)!important}
  .rrpd-breadcrumb{font-size:13px!important;padding-bottom:22px!important}
  .rrpd-product{
    gap:52px!important;
    padding:34px!important;
    border-radius:28px!important;
    box-shadow:0 25px 75px rgba(46,20,12,.08)!important;
    background:#fff!important;
  }

  /* MAIN IMAGE OVERRIDES */
  .rrpd-main-image{
    aspect-ratio: 1 / 1 !important;
    width: 100% !important;
    height: auto !important;
    border-radius:24px!important;
    background:linear-gradient(145deg,#fff,#f8f4ed)!important;
  }
  .rrpd-main-photo{
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important; /* Changed from contain to cover */
    padding: 0 !important; /* Removed padding so image spans entire box */
    border-radius: 24px !important;
  }

  .rrpd-sale-badge{font-size:12px!important;padding:10px 13px!important}
  .rrpd-productInfo h1{
    font-size:clamp(42px,5vw,68px)!important;
    line-height:.96!important;
    letter-spacing:-.055em!important;
  }
  .rrpd-category,.rrpd-eyebrow{font-size:11px!important;letter-spacing:.14em!important}
  .rrpd-description,.rrpd-productInfo p{
    font-size:16px!important;line-height:1.85!important;
  }
  .rrpd-price,.rrpd-current-price{font-size:38px!important;font-weight:900!important}
  .rrpd-compare-price{font-size:17px!important}
  .rrpd-stock,.rrpd-stockStatus{font-size:13px!important;padding:10px 13px!important}
  .rrpd-quantity label{font-size:12px!important}
  .rrpd-quantity button{width:45px!important;height:45px!important}
  .rrpd-quantity span{font-size:17px!important}
  .rrpd-primary-btn,.rrpd-secondary-btn,.rrpd-buy-btn{
    min-height:52px!important;
    font-size:15px!important;
    font-weight:900!important;
    border-radius:13px!important;
  }
  .rrpd-section{padding:42px 0!important}
  .rrpd-section h2,.rrpd-compliance h2{
    font-size:clamp(30px,4vw,48px)!important;
    letter-spacing:-.04em!important;
  }
  .rrpd-section p,.rrpd-compliance p{font-size:15px!important;line-height:1.8!important}
  .rrpd-compliance-grid{gap:13px!important}
  .rrpd-compliance-grid>div{padding:16px!important;border-radius:14px!important}
  .rrpd-compliance-grid span{font-size:10px!important}
  .rrpd-compliance-grid b{font-size:14px!important}
  .rrpd-related h2{font-size:42px!important}
  
  @media(max-width:850px){
    .rrpd-product{padding:20px!important;gap:25px!important}
  }
  @media(max-width:600px){
    .rrpd-page{padding:18px 11px 65px!important}
    .rrpd-product{border-radius:19px!important;padding:14px!important}
    .rrpd-main-image{border-radius:16px!important}
    .rrpd-main-photo{border-radius: 16px !important}
    .rrpd-productInfo h1{font-size:39px!important}
    .rrpd-description,.rrpd-productInfo p{font-size:14px!important}
    .rrpd-price,.rrpd-current-price{font-size:31px!important}
    .rrpd-primary-btn,.rrpd-secondary-btn,.rrpd-buy-btn{font-size:14px!important}
    .rrpd-section h2,.rrpd-compliance h2{font-size:31px!important}
  }
`;

export { getImageList, getProductImage };