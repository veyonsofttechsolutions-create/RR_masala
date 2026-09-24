import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from "lucide-react";
import ProductGrid from "../components/ProductGrid.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function Wishlist() {
  const { items } = useWishlist();
  const nav = useNavigate();

  return (
    <main className="rrWishlistPage">
      <WishlistStyles />

      {/* Royal Ambient Glow Elements (Clean & Professional) */}
      <div className="rrRoyalGlowBG" aria-hidden="true">
        <div className="rrGlowOrb orb1" />
        <div className="rrGlowOrb orb2" />
        
        {/* Floating Love Particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`rrFloatingHeart hr${i + 1}`}>
            <Heart size={14} fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="rrWishlistContainer">
        {/* TOP BACK BUTTON */}
        <button
          type="button"
          onClick={() => nav(-1)}
          className="rrBackBtn"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* ACCOUNT NAVIGATION PILLS (Fully Responsive / Non-breaking wrap) */}
        <div className="rrAccountTabs">
          <Link to="/profile">Profile</Link>
          <Link to="/addresses">Addresses</Link>
          <Link to="/orders">Orders</Link>
          <Link className="active" to="/wishlist">Wishlist</Link>
        </div>

        {/* HERO BANNER */}
        <section className="rrWishlistHero">
          <div className="rrHeroTextContent">
            <div className="rrEyebrowBadge">
              <Sparkles size={13} /> ROYAL PANTRY VAULT
            </div>
            <h1>Your Saved Favourites.</h1>
            <p>
              Keep the heritage spices, royal biryani masalas, and daily essentials you love right here for rapid access.
            </p>
          </div>

          {items.length > 0 && (
            <div className="rrCountPill">
              <Heart size={15} fill="currentColor" />
              <span>{items.length} SAVED {items.length === 1 ? "ITEM" : "ITEMS"}</span>
            </div>
          )}
        </section>

        {/* PRODUCTS GRID OR EMPTY STATE */}
        {items.length > 0 ? (
          <section className="rrWishlistGridPanel">
            <div className="rrPanelHeader">
              <div>
                <span className="rrSubEyebrow">SAVED COLLECTION</span>
                <h2>The Favourites</h2>
              </div>
              <Link to="/products" className="rrContinueShopping">
                <span>Explore More</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <ProductGrid products={items} />
          </section>
        ) : (
          <section className="rrEmptyWishlistPanel">
            <div className="rrTigerHeartOrb">
              <Heart size={42} fill="currentColor" />
            </div>
            <h2>Your wishlist is currently empty</h2>
            <p>
              Tap the heart icon on any spice blend or powder across our catalogue to save it here like a true king's treasure.
            </p>
            <Link to="/products" className="rrBrowseBtn">
              <ShoppingBag size={18} />
              <span>Browse Spice Catalogue</span>
              <ArrowRight size={17} />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

function WishlistStyles() {
  return (
    <style>{`
      .rrWishlistPage {
        min-height: 85vh;
        background: #ffffff;
        color: #1a1412;
        font-family: "DM Sans", system-ui, sans-serif;
        padding: 30px 24px 80px;
        position: relative;
        overflow-x: hidden;
      }

      /* Royal Ambient Background */
      .rrRoyalGlowBG {
        position: absolute;
        top: 0; left: 0; right: 0; height: 320px;
        pointer-events: none;
        overflow: hidden;
        z-index: 1;
        background: radial-gradient(circle at center top, rgba(251, 176, 52, 0.12) 0%, transparent 70%);
      }
      .rrGlowOrb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
      }
      .orb1 { width: 350px; height: 350px; background: rgba(243, 146, 0, 0.1); top: -40px; left: 15%; }
      .orb2 { width: 400px; height: 400px; background: rgba(158, 16, 23, 0.08); top: -20px; right: 15%; }

      /* Floating Royal Hearts Animation */
      .rrFloatingHeart {
        position: absolute;
        top: 40px;
        color: rgba(196, 26, 34, 0.3);
        animation: floatHeartUp 6s infinite ease-in-out;
        z-index: 2;
      }
      .hr1 { left: 15%; animation-delay: 0s; }
      .hr2 { left: 30%; animation-delay: 1.2s; color: rgba(243, 146, 0, 0.4); }
      .hr3 { left: 45%; animation-delay: 2.4s; }
      .hr4 { left: 65%; animation-delay: 0.8s; color: rgba(243, 146, 0, 0.45); }
      .hr5 { left: 82%; animation-delay: 1.8s; }
      .hr6 { left: 90%; animation-delay: 3.2s; }
      .hr7 { left: 10%; animation-delay: 4.1s; }
      .hr8 { left: 50%; animation-delay: 2.1s; }
      .hr9 { left: 75%; animation-delay: 0.3s; }
      .hr10 { left: 22%; animation-delay: 1.9s; }

      @keyframes floatHeartUp {
        0% { transform: translateY(0px) scale(0.6) rotate(0deg); opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateY(-140px) scale(1.3) rotate(25deg); opacity: 0; }
      }

      .rrWishlistContainer {
        width: min(1280px, 100%);
        margin: 0 auto;
        position: relative;
        z-index: 10;
      }

      /* Back Button */
      .rrBackBtn {
        display: inline-flex; align-items: center; gap: 8px;
        border: 1px solid rgba(158, 16, 23, 0.15); background: #ffffff;
        border-radius: 12px; padding: 10px 16px; font-weight: 800;
        font-size: 13px; cursor: pointer; margin-bottom: 24px;
        color: #4a3f3a; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        transition: all 0.2s ease;
      }
      .rrBackBtn:hover { border-color: #9e1017; color: #9e1017; transform: translateX(-3px); }

      /* Account Navigation Tabs - Fixed Responsive Wrapping */
      .rrAccountTabs {
        display: flex; 
        gap: 10px; 
        margin-bottom: 24px;
        flex-wrap: wrap; /* Prevents unwanted horizontal scrolling on mobile */
      }
      .rrAccountTabs a {
        padding: 10px 22px; 
        border-radius: 99px; 
        background: #f7f4ec;
        color: #6a5e57; 
        font-size: 13px; 
        font-weight: 800; 
        text-decoration: none;
        border: 1px solid rgba(158, 16, 23, 0.08); 
        transition: all 0.2s ease;
      }
      .rrAccountTabs a:hover { color: #9e1017; background: #fff; }
      .rrAccountTabs a.active { background: #9e1017; color: #ffffff; border-color: #9e1017; box-shadow: 0 6px 18px rgba(158, 16, 23, 0.25); }

      /* Hero Panel */
      .rrWishlistHero {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 28px;
        padding: 44px;
        display: flex; justify-content: space-between; align-items: center;
        gap: 24px; flex-wrap: wrap; margin-bottom: 28px;
        box-shadow: 0 10px 30px rgba(158, 16, 23, 0.05);
      }
      .rrEyebrowBadge {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 11px; font-weight: 900; letter-spacing: 2px;
        color: #9e1017; text-transform: uppercase; margin-bottom: 8px;
      }
      .rrEyebrowBadge svg { color: #f39200; }
      .rrWishlistHero h1 {
        margin: 0; font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(34px, 4.5vw, 48px); font-weight: 700; color: #1a1412;
      }
      .rrWishlistHero p {
        margin: 8px 0 0; color: #6a5e57; font-size: 15px; line-height: 1.6; max-width: 600px;
      }

      .rrCountPill {
        display: inline-flex; align-items: center; gap: 8px;
        background: #fff1f1; color: #9e1017; border: 1px solid rgba(196, 26, 34, 0.2);
        border-radius: 99px; padding: 10px 18px; font-size: 11px; font-weight: 900;
        letter-spacing: 1px; box-shadow: 0 6px 16px rgba(158, 16, 23, 0.08);
      }
      .rrCountPill svg { animation: heartbeat 1.5s infinite ease-in-out; }

      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.25); }
      }

      /* Grid Panel */
      .rrWishlistGridPanel {
        background: #ffffff; border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 28px; padding: 32px; box-shadow: 0 10px 30px rgba(158, 16, 23, 0.05);
      }
      .rrPanelHeader {
        display: flex; justify-content: space-between; align-items: flex-end;
        gap: 20px; margin-bottom: 28px; flex-wrap: wrap;
      }
      .rrSubEyebrow {
        display: block; font-size: 10px; font-weight: 900; letter-spacing: 1.5px;
        color: #f39200; text-transform: uppercase; margin-bottom: 4px;
      }
      .rrPanelHeader h2 { margin: 0; font-family: "Cormorant Garamond", Georgia, serif; font-size: 32px; font-weight: 700; }
      .rrContinueShopping {
        display: inline-flex; align-items: center; gap: 6px; font-size: 13px;
        font-weight: 800; color: #9e1017; text-decoration: none; transition: gap 0.2s;
      }
      .rrContinueShopping:hover { gap: 10px; }

      /* Empty State Panel */
      .rrEmptyWishlistPanel {
        background: #ffffff; border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 28px; padding: 80px 24px; text-align: center;
        box-shadow: 0 10px 30px rgba(158, 16, 23, 0.05);
      }
      .rrTigerHeartOrb {
        width: 84px; height: 84px; border-radius: 50%; background: #fbf3e4;
        color: #9e1017; display: grid; place-items: center; margin: 0 auto 20px;
        box-shadow: 0 10px 25px rgba(243, 146, 0, 0.25);
        animation: heartbeat 2s infinite ease-in-out;
      }
      .rrEmptyWishlistPanel h2 {
        margin: 0 0 10px; font-family: "Cormorant Garamond", Georgia, serif; font-size: 36px; font-weight: 700;
      }
      .rrEmptyWishlistPanel p {
        max-width: 440px; margin: 0 auto 28px; color: #6a5e57; font-size: 15px; line-height: 1.7;
      }
      .rrBrowseBtn {
        display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px;
        background: linear-gradient(135deg, #9e1017, #c41a22); color: #ffffff;
        border-radius: 99px; font-size: 14px; font-weight: 800; text-decoration: none;
        box-shadow: 0 8px 24px rgba(158, 16, 23, 0.35); transition: transform 0.2s, box-shadow 0.2s;
      }
      .rrBrowseBtn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(158, 16, 23, 0.5); }

      /* Responsive Rules */
      @media (max-width: 768px) {
        .rrWishlistPage { padding: 20px 14px 60px; }
        .rrAccountTabs { gap: 8px; }
        .rrAccountTabs a { padding: 8px 16px; font-size: 12px; }
        .rrWishlistHero { padding: 28px; border-radius: 20px; }
        .rrWishlistGridPanel { padding: 20px; border-radius: 20px; }
        .rrEmptyWishlistPanel { padding: 50px 16px; border-radius: 20px; }
      }
    `}</style>
  );
}