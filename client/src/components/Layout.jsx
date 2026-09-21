import { Link, NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  UserRound,
  Heart,
  Menu,
  X,
  ChevronDown,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const LOGO_SRC = "/WhatsApp Image 2026-09-17 at 3.09.40 AM.jpeg";

export function Layout() {
  const { count = 0 } = useCart();
  const { items = [] } = useWishlist ? useWishlist() : { items: [] };
  const wishlistCount = items.length;

  const { user } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname, location.search, location.hash]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [q, setQ] = useState("");

  const search = (e) => {
    e.preventDefault();
    const value = q.trim();

    if (value) {
      nav(`/search?q=${encodeURIComponent(value)}`);
    }

    setOpen(false);
    setProductsOpen(false);
  };

  const closeMenu = () => {
    setOpen(false);
    setProductsOpen(false);
  };

  return (
    <div className="rrApp">
      <style>{`
        /* ================================================================
           RR MASALA GLOBAL / LAYOUT UI
        ================================================================ */

        .rrApp {
          --rr-black: #140a07;
          --rr-black-2: #1e100c;
          --rr-gold: #f08c14;
          --rr-gold-2: #ffa726;
          --rr-brown: #b51c1c;
          --rr-brown-2: #d92b2b;
          --rr-cream: #faf7f1;
          --rr-text: #241812;
          --rr-muted: #9e8d85;
          min-height: 100vh;
          background: var(--rr-cream);
          color: var(--rr-text);
        }

        .announcement {
          min-height: 28px;
          padding: 0 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          background: #0d0604;
          color: #fcefe6;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .3px;
          border: none !important;
          box-shadow: none !important;
        }

        .announceDot {
          color: var(--rr-gold);
        }

        .navbarNew {
          height: 70px;
          padding: 0 clamp(18px, 5vw, 72px);
          display: flex;
          align-items: center;
          gap: clamp(22px, 3.2vw, 52px);
          background: #140a07;
          border-bottom: 1px solid #2d1710 !important;
          position: relative;
          z-index: 1000;
          box-shadow: 0 10px 30px rgba(0,0,0,.35) !important;
          outline: none !important;
        }

        .brandLogoOnly {
          width: 112px;
          height: 70px;
          flex: 0 0 112px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .rrLogo {
          width: 104px;
          height: 62px;
          object-fit: contain;
          display: block;
        }

        .desktopNavNew {
          height: 100%;
          display: flex;
          align-items: center;
          gap: clamp(22px, 2.7vw, 42px);
          flex: 1;
        }

        .desktopNavNew > a,
        .navDropdownButton {
          height: 100%;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #f7ede5;
          background: transparent;
          border: 0;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          transition: color .2s ease;
        }

        .desktopNavNew > a::after,
        .navDropdownButton::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          border-radius: 4px 4px 0 0;
          background: #d92b2b;
          transform: scaleX(0);
          transition: transform .2s ease;
        }

        .desktopNavNew > a:hover,
        .desktopNavNew > a.active,
        .navDropdownButton:hover,
        .navDropdownButton.active {
          color: #ffa726;
        }

        .desktopNavNew > a.active::after,
        .navDropdownButton.active::after {
          transform: scaleX(1);
        }

        .navDropdown {
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
        }

        .navDropdownMenu {
          position: absolute;
          top: 64px;
          left: -16px;
          width: 220px;
          padding: 8px;
          background: #1c0e09;
          border: 1px solid #3d1c14;
          border-radius: 12px;
          box-shadow: 0 18px 45px rgba(0,0,0,.5);
        }

        .navDropdownMenu a {
          display: block;
          padding: 11px 13px;
          border-radius: 8px;
          color: #f2e7df;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .navDropdownMenu a:hover {
          background: #2a150e;
          color: #ffa726;
        }

        .rotateChevron {
          transform: rotate(180deg);
        }

        .searchNew {
          width: min(345px, 28vw);
          height: 39px;
          flex: 0 1 345px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #23120c;
          border: 1px solid #3d1c14;
          border-radius: 24px;
          color: #bbb;
        }

        .searchNew input {
          min-width: 0;
          flex: 1;
          height: 100%;
          padding: 0 10px 0 20px;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          font: inherit;
          font-size: 11px;
        }

        .searchNew input::placeholder {
          color: #9e8d85;
        }

        .searchNew button {
          width: 47px;
          height: 39px;
          flex: 0 0 47px;
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          color: #bfaea5;
          cursor: pointer;
        }
        
        .searchNew button:hover {
          color: #ffa726;
        }

        .navActionsNew {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
        }

        .accountButton,
        .wishlistButtonNew,
        .mobileMenuNew {
          position: relative;
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          color: #fff;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: color .2s ease;
        }

        .accountButton:hover,
        .wishlistButtonNew:hover {
          color: #ffa726;
        }

        .wishlistButtonNew b {
          position: absolute;
          top: -3px;
          right: -4px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d92b2b;
          color: #fff;
          font-size: 9px;
          line-height: 1;
        }

        .cartButtonNew {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px 7px 11px;
          background: #f7efe5;
          color: #24140e;
          border: 1px solid #e7d8c8;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .2px;
          cursor: pointer;
          transition: all .2s ease;
          box-shadow: 0 3px 10px rgba(0,0,0,.18);
        }

        .cartButtonNew svg {
          color: #b51c1c;
        }

        .cartButtonNew:hover {
          background: #ffffff;
          border-color: #ffa726;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0,0,0,.25);
        }

        .cartButtonNew b {
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 19px;
          height: 19px;
          padding: 0 4px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #d92b2b;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(217,43,43,.4);
        }

        .mobileMenuNew {
          display: none;
        }

        .mobileMenuPanel {
          position: absolute;
          top: 98px;
          left: 0;
          right: 0;
          z-index: 999;
          display: none;
          background: #140a07;
          border-top: 1px solid #2d1710;
          box-shadow: 0 18px 35px rgba(0,0,0,.45);
        }

        .mobileMenuPanel > a,
        .mobileProducts > button {
          width: 100%;
          min-height: 51px;
          padding: 0 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 0;
          border-bottom: 1px solid #28140e;
          background: transparent;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .mobileProductLinks {
          background: #0d0604;
        }

        .mobileProductLinks a {
          display: block;
          padding: 12px 38px;
          color: #ddd;
          text-decoration: none;
          border-bottom: 1px solid #1f0e08;
          font-size: 13px;
        }

        .footerNew {
          margin-top: 0;
          background: #140a07;
          color: #eadfd5;
          border-top: 1px solid #2d1710;
        }

        .footerGrid {
          width: min(1180px, 90%);
          margin: auto;
          padding: 58px 0 44px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 45px;
        }

        .footerBrandBlock {
          max-width: 330px;
        }

        .footerLogo img {
          width: 125px;
          height: 76px;
          object-fit: contain;
        }

        .footerBrandBlock p {
          margin: 15px 0 18px;
          color: #b39f94;
          font-size: 13px;
          line-height: 1.7;
        }

        .footerGrid h4 {
          margin: 7px 0 15px;
          color: #fff;
          font-size: 14px;
        }

        .footerGrid > div:not(.footerBrandBlock) > a {
          display: block;
          margin: 0 0 10px;
          color: #b39f94;
          text-decoration: none;
          font-size: 12px;
        }

        .footerGrid > div:not(.footerBrandBlock) > a:hover {
          color: #ffa726;
        }

        .socials {
          display: flex;
          gap: 8px;
        }

        .socials a {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid #3d1c14;
          background: #1e100c;
          border-radius: 50%;
          color: #fff;
          text-decoration: none;
        }

        .socials a:hover {
          color: #fff;
          background: #d92b2b;
          border-color: #d92b2b;
        }

        .rrApp {
          animation: rrAppIn .55s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes rrAppIn {
          from { opacity:0; }
          to { opacity:1; }
        }

        .footerGrid > div:not(.footerBrandBlock) > a {
          position:relative;
          width:max-content;
          transition:color .25s ease, transform .3s cubic-bezier(.16,1,.3,1);
        }

        .footerGrid > div:not(.footerBrandBlock) > a::after {
          content:"";
          position:absolute;
          left:0;
          bottom:-3px;
          width:100%;
          height:1px;
          background:#ffa726;
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .35s cubic-bezier(.16,1,.3,1);
        }

        .footerGrid > div:not(.footerBrandBlock) > a:hover {
          transform:translateX(4px);
        }

        .footerGrid > div:not(.footerBrandBlock) > a:hover::after {
          transform:scaleX(1);
        }

        .footerBottom {
          width: min(1180px, 90%);
          margin: auto;
          padding: 17px 0 21px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid #26130b;
          color: #8c786e;
          font-size: 10px;
        }

        @media (max-width: 1100px) {
          .navbarNew {
            gap: 22px;
            padding-left: 25px;
            padding-right: 25px;
          }

          .desktopNavNew {
            gap: 20px;
          }

          .searchNew {
            width: min(300px, 26vw);
          }

          .footerGrid {
            grid-template-columns: 1.4fr 1fr 1fr 1fr;
            gap: 25px;
          }
        }

        @media (max-width: 820px) {
          .navbarNew {
            height: 64px;
            padding: 0 18px;
          }

          .brandLogoOnly {
            width: 92px;
            height: 64px;
            flex-basis: 92px;
          }

          .rrLogo {
            width: 88px;
            height: 58px;
          }

          .desktopNavNew,
          .searchNew {
            display: none;
          }

          .navActionsNew {
            margin-left: auto;
            gap: 15px;
          }

          .mobileMenuNew {
            display: grid;
          }

          .mobileMenuPanel {
            display: block;
            top: 92px;
          }

          .footerGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rrApp,
          .footerGrid > div:not(.footerBrandBlock) > a {
            animation:none !important;
            transition:none !important;
          }
        }

        @media (max-width: 520px) {
          .announcement {
            min-height: 27px;
            gap: 7px;
            font-size: 9px;
          }

          .footerGrid {
            grid-template-columns: 1fr 1fr;
            gap: 30px 18px;
            padding: 42px 0 30px;
          }

          .footerBrandBlock {
            grid-column: 1 / -1;
            max-width: none;
          }

          .footerBottom {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>

      {/* Announcement Text */}
      <div className="announcement">
        <span>100% Authentic South Indian Spices</span>
        <span className="announceDot">•</span>
        <span>Taste the Tradition</span>
      </div>

      <header className="navbarNew">
        <Link
          to="/"
          className="brandLogoOnly"
          aria-label="RR MASALA Home"
          onClick={closeMenu}
        >
          <img
            src={LOGO_SRC}
            alt="RR MASALA"
            className="rrLogo"
          />
        </Link>

        <nav className="desktopNavNew">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Home
          </NavLink>

          <div
            className="navDropdown"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              className={`navDropdownButton ${
                productsOpen ? "active" : ""
              }`}
              onClick={() =>
                setProductsOpen((value) => !value)
              }
            >
              Products
              <ChevronDown
                size={15}
                className={
                  productsOpen ? "rotateChevron" : ""
                }
              />
            </button>

            {productsOpen && (
              <div className="navDropdownMenu">
                <Link to="/products" onClick={closeMenu}>
                  All Products
                </Link>
                <Link
                  to="/category/biryani-masala"
                  onClick={closeMenu}
                >
                  Biryani Masala
                </Link>
                <Link
                  to="/category/rasam"
                  onClick={closeMenu}
                >
                  Rasam Powder
                </Link>
                <Link
                  to="/category/sambar"
                  onClick={closeMenu}
                >
                  Sambar Powder
                </Link>
                <Link
                  to="/category/idly-podi"
                  onClick={closeMenu}
                >
                  Idly Podi
                </Link>
                <Link
                  to="/category/ready-mix"
                  onClick={closeMenu}
                >
                  Ready Mix
                </Link>
                <Link
                  to="/category/pickles"
                  onClick={closeMenu}
                >
                  Pickles
                </Link>
                <Link
                  to="/category/vadagam"
                  onClick={closeMenu}
                >
                  Vadagam
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Contact Us
          </NavLink>
        </nav>

        <form className="searchNew" onSubmit={search}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for your favourite spices..."
            aria-label="Search products"
          />

          <button type="submit" aria-label="Search">
            <Search size={18} />
          </button>
        </form>

        <div className="navActionsNew">
          <button
            type="button"
            className="accountButton"
            onClick={() =>
              nav(user ? "/profile" : "/login")
            }
            aria-label={user ? "Profile" : "Login"}
          >
            <UserRound size={22} />
          </button>

          <button
            type="button"
            className="wishlistButtonNew"
            onClick={() => nav("/wishlist")}
            aria-label="Wishlist"
          >
            <Heart size={21} />
            {wishlistCount > 0 && (
              <b>{wishlistCount}</b>
            )}
          </button>

          <button
            type="button"
            className="cartButtonNew"
            onClick={() => nav("/cart")}
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>

            {Number(count) > 0 && (
              <b>{count}</b>
            )}
          </button>

          <button
            type="button"
            className="mobileMenuNew"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="mobileMenuPanel">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <div className="mobileProducts">
            <button
              type="button"
              onClick={() =>
                setProductsOpen((value) => !value)
              }
            >
              <span>Products</span>
              <ChevronDown
                size={17}
                className={
                  productsOpen ? "rotateChevron" : ""
                }
              />
            </button>

            {productsOpen && (
              <div className="mobileProductLinks">
                <Link to="/products" onClick={closeMenu}>
                  All Products
                </Link>
                <Link
                  to="/category/biryani-masala"
                  onClick={closeMenu}
                >
                  Biryani Masala
                </Link>
                <Link
                  to="/category/rasam"
                  onClick={closeMenu}
                >
                  Rasam Powder
                </Link>
                <Link
                  to="/category/sambar"
                  onClick={closeMenu}
                >
                  Sambar Powder
                </Link>
                <Link
                  to="/category/idly-podi"
                  onClick={closeMenu}
                >
                  Idly Podi
                </Link>
                <Link
                  to="/category/ready-mix"
                  onClick={closeMenu}
                >
                  Ready Mix
                </Link>
                <Link
                  to="/category/pickles"
                  onClick={closeMenu}
                >
                  Pickles
                </Link>
                <Link
                  to="/category/vadagam"
                  onClick={closeMenu}
                >
                  Vadagam
                </Link>
              </div>
            )}
          </div>

          <Link to="/about" onClick={closeMenu}>
            About Us
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact Us
          </Link>

          <Link
            to={user ? "/profile" : "/login"}
            onClick={closeMenu}
          >
            {user ? "My Account" : "Login"}
          </Link>

          <Link to="/wishlist" onClick={closeMenu}>
            Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>

          <Link to="/cart" onClick={closeMenu}>
            Cart{Number(count) > 0 ? ` (${count})` : ""}
          </Link>
        </div>
      )}

      <Outlet />

      <footer className="footerNew">
        <div className="footerGrid">
          <div className="footerBrandBlock">
            <Link
              to="/"
              className="footerLogo"
              onClick={closeMenu}
            >
              <img
                src={LOGO_SRC}
                alt="RR MASALA"
              />
            </Link>

            <p>
              Traditional Indian pantry essentials,
              thoughtfully brought to modern kitchens.
            </p>

            <div className="socials">
              <a href="#instagram" aria-label="Instagram">
                <Instagram size={17} />
              </a>
              <a href="#whatsapp" aria-label="WhatsApp">
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          <div>
            <h4>Shop</h4>
            <Link to="/products" onClick={closeMenu}>All Products</Link>
            <Link to="/category/biryani-masala" onClick={closeMenu}>Masalas</Link>
            <Link to="/category/pickles" onClick={closeMenu}>Pickles</Link>
            <Link to="/category/ready-mix" onClick={closeMenu}>Ready Mix</Link>
            <Link to="/category/vadagam" onClick={closeMenu}>Vadagam</Link>
          </div>

          <div>
            <h4>Help</h4>
            <Link to="/shipping-policy" onClick={closeMenu}>Shipping</Link>
            <Link to="/return-policy" onClick={closeMenu}>Returns</Link>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </div>

          <div>
            <h4>Legal</h4>
            <Link to="/privacy-policy" onClick={closeMenu}>Privacy</Link>
            <Link to="/terms" onClick={closeMenu}>Terms</Link>
            <Link to="/about" onClick={closeMenu}>About RR MASALA</Link>
          </div>
        </div>

        <div className="footerBottom">
          <span>© {new Date().getFullYear()} RR MASALA</span>
          <span>Made for everyday cooking.</span>
        </div>
      </footer>
    </div>
  );
}