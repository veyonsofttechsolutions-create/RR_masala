import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import ProductGrid from "../components/ProductGrid.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function Wishlist() {
  const { items } = useWishlist();
  const nav = useNavigate();

  return (
    <main className="accountPage" style={{ paddingTop: 32 }}>
      {/* BACK */}
      <button
        type="button"
        onClick={() => nav(-1)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--line)",
          background: "#fff",
          borderRadius: 10,
          padding: "10px 14px",
          fontWeight: 800,
          fontSize: 12,
          cursor: "pointer",
          marginBottom: 22,
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* ACCOUNT NAV */}
      <div
        className="accountNav"
        style={{
          marginBottom: 20,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <Link to="/profile">Profile</Link>

        <Link to="/addresses">Addresses</Link>

        <Link to="/orders">Orders</Link>

        <Link className="active" to="/wishlist">
          Wishlist
        </Link>
      </div>

      {/* HEADER */}
      <section
        className="panel"
        style={{
          marginBottom: 18,
          background:
            "linear-gradient(135deg, #ffffff 0%, #faf9f4 65%, #fff8d6 100%)",
        }}
      >
        <span className="eyebrow">YOUR FAVOURITES</span>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            marginTop: 7,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(26px, 4vw, 36px)",
              }}
            >
              Wishlist.
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "var(--muted)",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              Keep the pantry products you love and come back to them anytime.
            </p>
          </div>

          {items.length > 0 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "#fff1f1",
                color: "#b42318",
                borderRadius: 9,
                padding: "9px 12px",
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              <Heart size={14} fill="currentColor" />
              {items.length} SAVED{" "}
              {items.length === 1 ? "ITEM" : "ITEMS"}
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTS */}
      {items.length > 0 ? (
        <section
          className="panel"
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 15,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div>
              <span className="eyebrow">SAVED PRODUCTS</span>

              <h2
                style={{
                  margin: "6px 0 0",
                  fontSize: 20,
                }}
              >
                Your favourites
              </h2>
            </div>

            <Link
              to="/products"
              className="secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Continue shopping
              <ArrowRight size={15} />
            </Link>
          </div>

          <ProductGrid products={items} />
        </section>
      ) : (
        /* EMPTY STATE */
        <section
          className="panel"
          style={{
            textAlign: "center",
            padding: "70px 25px",
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "#fff7d6",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 18px",
            }}
          >
            <Heart size={34} />
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 22,
            }}
          >
            Your wishlist is empty
          </h2>

          <p
            style={{
              maxWidth: 400,
              margin: "0 auto 23px",
              color: "var(--muted)",
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            Tap the heart on any product you love and it will appear here for
            quick access later.
          </p>

          <Link
            className="primary"
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShoppingBag size={16} />
            Browse products
            <ArrowRight size={16} />
          </Link>
        </section>
      )}
    </main>
  );
}