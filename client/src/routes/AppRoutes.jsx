import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Layout } from "../components/Layout.jsx";
import Home from "../pages/Home.jsx";
import Catalog from "../pages/Catalog.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import { Login, Register } from "../pages/Auth.jsx";
import AuthRecovery from "../pages/AuthRecovery.jsx";
import Cart from "../pages/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import Orders from "../pages/Orders.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import OrderDetails from "../pages/OrderDetails.jsx";
import TrackOrder from "../pages/TrackOrder.jsx";
import Profile from "../pages/Profile.jsx";
import Addresses from "../pages/Addresses.jsx";
import { About, Contact, FAQ, Policy, Success, Info } from "../pages/Info.jsx";
import Admin from "../pages/Admin.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import AdminManager from "../pages/AdminManager.jsx";
import AdminProductForm from "../pages/AdminProductForm.jsx";
import LegalCenter from "../pages/LegalCenter.jsx";
function Guard({ children, admin = false }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <main className="center">
        <div className="spinner" />
      </main>
    );
  if (!user)
    return (
      <Navigate
        to={admin ? "/admin/login" : "/login"}
        state={{ from: window.location.pathname }}
        replace
      />
    );
  if (admin && !["ADMIN", "STAFF"].includes(user.role))
    return <Navigate to="/" replace />;
  return children;
}
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Catalog />} />
        <Route path="/search" element={<Catalog />} />
        <Route path="/category/:slug" element={<CategoryBridge />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<AuthRecovery />} />
        <Route path="/reset-password" element={<AuthRecovery reset />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/order-success"
          element={
            <Guard>
              <Success />
            </Guard>
          }
        />
        <Route
          path="/orders"
          element={
            <Guard>
              <Orders />
            </Guard>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <Guard>
              <OrderDetails />
            </Guard>
          }
        />
        <Route
          path="/orders/:id/track"
          element={
            <Guard>
              <TrackOrder />
            </Guard>
          }
        />
        <Route
          path="/profile"
          element={
            <Guard>
              <Profile />
            </Guard>
          }
        />
        <Route
          path="/addresses"
          element={
            <Guard>
              <Addresses />
            </Guard>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Guard>
              <Wishlist />
            </Guard>
          }
        />
        <Route path="/legal" element={<LegalCenter />} />
        <Route path="/payment/phonepe-return" element={<PaymentReturn />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route
          path="/shipping-policy"
          element={
            <Policy title="Shipping policy">
              <p>
                Delivery charges and free-shipping thresholds are shown at
                checkout and are controlled by store settings.
              </p>
            </Policy>
          }
        />
        <Route
          path="/return-policy"
          element={
            <Policy title="Return policy">
              <p>
                Eligible delivered orders can request a return within the
                configured return window.
              </p>
            </Policy>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Policy title="Privacy policy">
              <p>
                We store only the information needed to provide account, order
                and support services.
              </p>
            </Policy>
          }
        />
        <Route
          path="/terms"
          element={
            <Policy title="Terms & conditions">
              <p>
                Orders are subject to product availability, address accuracy and
                store policies.
              </p>
            </Policy>
          }
        />
        <Route
          path="*"
          element={
            <main className="center">
              <h1>404</h1>
              <Link className="primary" to="/">
                Back to home
              </Link>
            </main>
          }
        />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <Guard admin>
            <Admin />
          </Guard>
        }
      />
      {[
        "products",
        "orders",
        "customers",
        "categories",
        "banners",
        "coupons",
        "returns",
        "audit-logs",
      ].map((t) => (
        <Route
          key={t}
          path={"/admin/" + t}
          element={
            <Guard admin>
              <AdminManager type={t} />
            </Guard>
          }
        />
      ))}
      <Route
        path="/admin/products/new"
        element={
          <Guard admin>
            <AdminProductForm />
          </Guard>
        }
      />
      <Route
        path="/admin/products/:id/edit"
        element={
          <Guard admin>
            <AdminProductForm />
          </Guard>
        }
      />
      {["inventory", "analytics", "settings", "homepage"].map((t) => (
        <Route
          key={t}
          path={"/admin/" + t}
          element={
            <Guard admin>
              <AdminManager type={t === "inventory" ? "products" : "orders"} />
            </Guard>
          }
        />
      ))}
    </Routes>
  );
}
function PaymentReturn(){ return <main className="center"><div className="panel" style={{maxWidth:620}}><h1>Payment processing</h1><p>We are verifying your PhonePe payment. Open Orders after the payment provider redirects you.</p><Link className="primary" to="/orders">View orders</Link></div></main>; }
function CategoryBridge() {
  const loc = useLocation();
  return <Catalog key={loc.pathname} />;
}
