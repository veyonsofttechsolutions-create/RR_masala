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
  ArrowUpRight,
  Globe,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const LOGO_SRC = "/WhatsApp Image 2026-09-17 at 3.09.40 AM.jpeg";

const PRODUCT_LINKS = [
  ["/products", "All Products"],
  ["/category/biryani-masala", "Biryani Masala"],
  ["/category/rasam", "Rasam Powder"],
  ["/category/sambar", "Sambar Powder"],
  ["/category/idly-podi", "Idly Podi"],
  ["/category/ready-mix", "Ready Mix"],
  ["/category/pickles", "Pickles"],
  ["/category/vadagam", "Vadagam"],
];

export function Layout() {
  const { count = 0 } = useCart();
  const { items = [] } = useWishlist();
  const { user } = useAuth();

  const nav = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const wishlistCount = Array.isArray(items) ? items.length : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMobileOpen(false);
    setProductsOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setProductsOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    nav(`/search?q=${encodeURIComponent(value)}`);
    closeMenus();
  };

  return (
    <div className="rrApp">
      {/* Red Announcement Header is completely omitted as requested */}

      {/* Modern High-End Clean Header */}
      <header className={`rrHeader ${scrolled ? "isScrolled" : ""}`}>
        <div className="rrHeaderInner">
          <Link
            to="/"
            className="rrBrand"
            aria-label="RR MASALA Home"
            onClick={closeMenus}
          >
            <img src={LOGO_SRC} alt="RR MASALA" />
          </Link>

          <nav className="rrDesktopNav" aria-label="Primary navigation">
            <NavLink to="/" end onClick={closeMenus}>
              Home
            </NavLink>

            <div
              className="rrNavDropdown"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                type="button"
                className={`rrNavButton ${productsOpen ? "isOpen" : ""}`}
                onClick={() => setProductsOpen((v) => !v)}
                aria-expanded={productsOpen}
              >
                Products
                <ChevronDown size={15} />
              </button>

              {productsOpen && (
                <div className="rrProductsMenu">
                  <div className="rrProductsMenuHead">
                    <span>TRADITIONAL PANTRY</span>
                    <small>100% PURE SOUTH INDIAN FLAVOURS</small>
                  </div>

                  {PRODUCT_LINKS.map(([href, label]) => (
                    <Link key={href} to={href} onClick={closeMenus}>
                      <span>{label}</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/about" onClick={closeMenus}>
              About Us
            </NavLink>
            <NavLink to="/contact" onClick={closeMenus}>
              Contact
            </NavLink>
          </nav>

          <form className="rrHeaderSearch" onSubmit={submitSearch}>
            <Search size={17} className="rrSearchIcon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search spices, masalas, podis..."
              aria-label="Search products"
            />
            <button type="submit" aria-label="Submit search">
              <ArrowUpRight size={16} />
            </button>
          </form>

          <div className="rrHeaderActions">
            <button
              type="button"
              className="rrIconAction"
              onClick={() => nav(user ? "/profile" : "/login")}
              aria-label={user ? "My account" : "Login"}
            >
              <UserRound size={20} />
            </button>

            <button
              type="button"
              className="rrIconAction rrWishlistAction"
              onClick={() => nav("/wishlist")}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && <b>{wishlistCount}</b>}
            </button>

            <button
              type="button"
              className="rrCartAction"
              onClick={() => nav("/cart")}
              aria-label="Open cart"
            >
              <span className="rrCartIcon">
                <ShoppingCart size={19} />
                {Number(count) > 0 && <b>{count}</b>}
              </span>
              <span className="rrCartLabel">Cart</span>
            </button>

            <button
              type="button"
              className="rrMobileMenuButton"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="rrMobilePanel">
            <div className="rrMobileSearchWrap">
              <form className="rrMobileSearch" onSubmit={submitSearch}>
                <Search size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search spices, masalas..."
                  aria-label="Search products"
                />
                <button type="submit" aria-label="Submit search">
                  <ArrowUpRight size={17} />
                </button>
              </form>
            </div>

            <NavLink to="/" end onClick={closeMenus}>
              Home
            </NavLink>

            <button
              type="button"
              className="rrMobileProductsToggle"
              onClick={() => setProductsOpen((v) => !v)}
            >
              <span>Products</span>
              <ChevronDown
                size={18}
                className={productsOpen ? "isRotated" : ""}
              />
            </button>

            {productsOpen && (
              <div className="rrMobileProductLinks">
                {PRODUCT_LINKS.map(([href, label]) => (
                  <Link key={href} to={href} onClick={closeMenus}>
                    <span>{label}</span>
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
              </div>
            )}

            <NavLink to="/about" onClick={closeMenus}>
              About Us
            </NavLink>
            <NavLink to="/contact" onClick={closeMenus}>
              Contact Us
            </NavLink>
            <NavLink to={user ? "/profile" : "/login"} onClick={closeMenus}>
              {user ? "My Account" : "Login"}
            </NavLink>
            <NavLink to="/wishlist" onClick={closeMenus}>
              Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
            </NavLink>
            <NavLink to="/cart" onClick={closeMenus}>
              Cart {Number(count) > 0 ? `(${count})` : ""}
            </NavLink>
          </div>
        )}
      </header>

      <main className="rrPageFrame">
        <Outlet />
      </main>

      {/* World-Class Footer with Tamil Nadu Quality Stamp */}
      <footer className="rrFooter">
        <div className="rrFooterTop">
          <div className="rrFooterBrand">
            <Link to="/" className="rrFooterLogo" onClick={closeMenus}>
              <img src={LOGO_SRC} alt="RR MASALA" />
            </Link>
            <p>
              Born from the rich heritage of Tamil Nadu’s culinary masters.
              Pure, fresh spices roasted and ground traditionally to preserve
              authentic aroma and natural therapeutic oils.
            </p>
            <div className="rrFooterPromise">
              <span />
              <b>AUTHENTIC TAMIL NADU PANTRY · 100% PURE</b>
            </div>
            <div className="rrSocials">
              <a href="#instagram" aria-label="Instagram">
                <Instagram size={17} />
              </a>
              <a href="#whatsapp" aria-label="WhatsApp">
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          <div className="rrFooterColumn">
            <h4>Traditional Blends</h4>
            <Link to="/products">All Products</Link>
            <Link to="/category/biryani-masala">Biryani Masala</Link>
            <Link to="/category/rasam">Chettinad Rasam</Link>
            <Link to="/category/sambar">Traditional Sambar</Link>
            <Link to="/category/idly-podi">Gunpowder Idly Podi</Link>
            <Link to="/category/ready-mix">Puliyotharai Mix</Link>
            <Link to="/category/pickles">Home Pickles</Link>
            <Link to="/category/vadagam">Crispy Vadagam</Link>
          </div>

          <div className="rrFooterColumn">
            <h4>Customer Care</h4>
            <Link to="/faq">Frequently Asked Questions</Link>
            <Link to="/shipping-policy">Shipping & Delivery</Link>
            <Link to="/return-policy">Returns & Refunds</Link>
            <Link to="/contact">Direct Support</Link>
            <Link to="/compliance">FSSAI & Quality Standards</Link>
          </div>

          <div className="rrFooterColumn">
            <h4>Global Export</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <div className="rrFooterExportBadge">
              <Globe size={16} />
              <span>Worldwide Air Delivery Ready</span>
            </div>
          </div>
        </div>

        <div className="rrFooterBottom">
          <span>© {new Date().getFullYear()} RR MASALA. Crafted with pride in Tamil Nadu.</span>
          <span>Pan-India & Global Express Dispatch</span>
        </div>
      </footer>
    </div>
  );
}