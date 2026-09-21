import { Link } from "react-router-dom"; 
import { Heart, Plus, Minus, ShoppingBag } from "lucide-react"; 
import { useState } from "react"; 
 
import { useCart } from "../context/CartContext.jsx"; 
import { useWishlist } from "../context/WishlistContext.jsx"; 
import { productImageMap } from "../constants/productImageMap.js"; 
 
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
  const mapped = productImageMap?.[product?.name]; 
  const firstImage = Array.isArray(product?.images) ? product.images[0] : ""; 
 
  if (typeof firstImage === "object") { 
    return ( 
      mapped || 
      firstImage?.url || 
      firstImage?.src || 
      firstImage?.path || 
      product?.thumbnail || 
      "/products/placeholder.svg" 
    ); 
  } 
  return ( 
    mapped || 
    firstImage || 
    product?.thumbnail || 
    product?.image || 
    product?.imageUrl || 
    "/products/placeholder.svg" 
  ); 
} 
 
export default function ProductCard({ product }) { 
  const { setQty, items } = useCart(); 
  const { has, toggle } = useWishlist(); 
  const [busy, setBusy] = useState(false); 
  const inStock = getStockState(product); 
 
  const current = items.find((item) => {
    const cartId = item?.product?._id || item?.product?.id;
    const cardId = product?._id || product?.id;
    return cartId && cardId && String(cartId) === String(cardId);
  })?.quantity || 0;
 
  const img = getProductImage(product); 
  const discount = Number(product?.discountPercentage) || 0; 
  const price = Number(product?.price) || 0; 
  const compareAtPrice = Number(product?.compareAtPrice) || 0; 
 
  const add = async (event) => { 
    event.preventDefault(); 
    event.stopPropagation(); 
    if (!inStock || busy) return; 
    try { 
      setBusy(true); 
      await setQty(product, current + 1); 
    } catch (error) { 
      window.alert(error?.message || "Could not add to cart"); 
    } finally { 
      setBusy(false); 
    } 
  }; 

  const decrease = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (busy || current <= 0) return;
    try {
      setBusy(true);
      await setQty(product, current - 1);
    } catch (error) {
      window.alert(error?.message || "Could not update cart");
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
      window.alert("Please try again"); 
    } 
  }; 
 
  return ( 
    <article className="productCard"> 
      <Link className="productVisual" to={`/product/${product.slug}`}> 
        <img 
          src={img} 
          alt={product.name} 
          loading="lazy" 
          onError={(event) => { 
            event.currentTarget.src = "/products/placeholder.svg"; 
          }} 
        /> 
        {discount > 0 && <span className="discount">{Math.round(discount)}% OFF</span>} 
        {product?.isBestSeller && <span className="bestSeller">BESTSELLER</span>} 
 
        <button 
          type="button" 
          className={`wishButton ${has(product) ? "liked" : ""}`} 
          aria-label={has(product) ? "Remove from wishlist" : "Add to wishlist"} 
          onClick={handleWishlist} 
        > 
          <Heart size={17} fill={has(product) ? "currentColor" : "none"} /> 
        </button> 
      </Link> 
 
      <div className="productBody"> 
        <div className="productMeta"> 
          <span>{product?.category?.name || product?.category || "Pantry essential"}</span> 
          <span>{product?.weight ? `${product.weight} ${product.weightUnit || ""}` : "100 g"}</span> 
        </div> 
 
        <Link className="productName" to={`/product/${product.slug}`}> 
          {product.name} 
        </Link> 
 
        <p className="productDesc"> 
          {product?.shortDescription || "Traditional flavour for everyday cooking."} 
        </p> 
 
        <div className="productBuy"> 
          <div> 
            <strong>₹{price.toFixed(0)}</strong> 
            {compareAtPrice > price && <del>₹{compareAtPrice.toFixed(0)}</del>} 
          </div> 
 
          {inStock ? ( 
            current > 0 ? (
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  border: "1px solid #e9ddd2", 
                  borderRadius: "8px", 
                  background: "#fafaf7",
                  height: "34px",
                  overflow: "hidden"
                }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <button 
                  type="button" 
                  onClick={decrease} 
                  disabled={busy}
                  style={{ 
                    width: "32px", 
                    height: "100%", 
                    background: "transparent", 
                    border: "none", 
                    color: "inherit", 
                    cursor: busy ? "not-allowed" : "pointer", 
                    display: "grid",
                    placeItems: "center",
                    opacity: busy ? 0.5 : 1
                  }}
                >
                  <Minus size={14} />
                </button>
                <b style={{ minWidth: "24px", textAlign: "center", fontSize: "12px", color: "var(--rr-text, #2b170f)" }}>
                  {current}
                </b>
                <button 
                  type="button" 
                  onClick={add} 
                  disabled={busy}
                  style={{ 
                    width: "32px", 
                    height: "100%", 
                    background: "transparent", 
                    border: "none", 
                    color: "inherit", 
                    cursor: busy ? "not-allowed" : "pointer", 
                    display: "grid",
                    placeItems: "center",
                    opacity: busy ? 0.5 : 1
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
                onClick={add} 
                aria-label={`Add ${product.name} to cart`} 
              > 
                <ShoppingBag size={15} /> 
                <span>ADD</span> 
              </button> 
            )
          ) : ( 
            <span className="outStock">Out of stock</span> 
          )} 
        </div> 
 
        <div className={`productStockStatus ${inStock ? "available" : "unavailable"}`} aria-live="polite"> 
          <span className="stockDot" /> 
          <span style={{ fontSize: "10.5px" }}> 
            {inStock ? "In stock & ready to ship" : "Currently unavailable"} 
          </span> 
        </div> 
      </div> 
    </article> 
  ); 
}