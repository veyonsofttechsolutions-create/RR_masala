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
import NotFound from "../pages/NotFound.jsx";

import {
  About,
  Contact,
  FAQ,
  Policy,
  Success,
  Info,
} from "../pages/Info.jsx";

import Admin from "../pages/Admin.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import AdminManager from "../pages/AdminManager.jsx";
import AdminProductForm from "../pages/AdminProductForm.jsx";
import AdminOrderDetails from "../pages/AdminOrderDetails.jsx";
import LegalCenter from "../pages/LegalCenter.jsx";

/* =========================================================
   AUTH GUARD
========================================================= */

function Guard({ children, admin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="center">
        <div className="spinner" />
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={admin ? "/admin/login" : "/login"}
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  if (admin && !["ADMIN", "STAFF"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* =========================================================
   REUSABLE POLICY CONTENT
   Keep business-specific registration/contact values blank
   until verified.
========================================================= */

const PolicySection = ({ title, children }) => (
  <section className="policySection">
    <h2>{title}</h2>
    <div>{children}</div>
  </section>
);

function ShippingPolicy() {
  return (
    <Policy title="Shipping & delivery" eyebrow="RR MASALA · CUSTOMER POLICY">
      <div className="policyIntro">
        <span>01 · DELIVERY</span>
        <h2>Getting your order to you.</h2>
        <p>
          We show applicable delivery charges and destination information during
          checkout. Delivery availability, shipping method and final charges
          can depend on the destination, order value, shipment weight and
          applicable carrier service.
        </p>
      </div>

      <PolicySection title="India deliveries">
        <p>
          For domestic orders, the checkout currently applies free delivery
          above ₹999 and a ₹50 delivery charge below that threshold, subject to
          the final order calculation shown before payment.
        </p>
      </PolicySection>

      <PolicySection title="International deliveries">
        <p>
          International shipments are handled separately from domestic
          delivery. Freight is calculated according to destination and shipment
          details. Available services may include express or economy shipping
          depending on the destination.
        </p>
        <p>
          Customs duties, import taxes, clearance fees or other destination
          charges may be payable separately by the recipient where applicable.
        </p>
      </PolicySection>

      <PolicySection title="Delivery address">
        <p>
          Customers are responsible for providing a complete and accurate
          delivery address, phone number and postal code. If an address needs
          correction after an order is placed, contact support as soon as
          possible. Changes cannot be guaranteed after shipment processing has
          started.
        </p>
      </PolicySection>

      <PolicySection title="Shipment tracking">
        <p>
          Once tracking information is available, it may be shown on the order
          details and tracking pages. Carrier scans and delivery estimates are
          controlled by the shipping provider.
        </p>
      </PolicySection>

      <PolicySection title="Delivery delays">
        <p>
          Weather, customs processing, carrier disruptions, remote-area
          service, incorrect address information and other events outside the
          store's direct control may affect delivery time.
        </p>
      </PolicySection>

      <PolicySection title="Before production">
        <p className="policyNotice">
          Exact courier partners, international rates, service areas and
          delivery commitments should be updated with verified commercial
          terms before production launch.
        </p>
      </PolicySection>
    </Policy>
  );
}

function ReturnPolicy() {
  return (
    <Policy title="Returns & refunds" eyebrow="RR MASALA · CUSTOMER POLICY">
      <div className="policyIntro">
        <span>02 · RETURNS</span>
        <h2>Clear handling for eligible returns.</h2>
        <p>
          Return eligibility depends on the condition of the product, order
          status and the applicable return window configured by the store.
        </p>
      </div>

      <PolicySection title="Return window">
        <p>
          Eligible delivered orders can request a return within the configured
          return window. The current store configuration uses a 7-day return
          window unless a product-specific rule says otherwise.
        </p>
      </PolicySection>

      <PolicySection title="Products that may require special handling">
        <p>
          Food and consumable products can have additional hygiene, safety,
          damage and opened-package considerations. The store should verify
          the final eligibility rules for each product category before
          production.
        </p>
      </PolicySection>

      <PolicySection title="Damaged or incorrect order">
        <p>
          If an order arrives damaged, incomplete or different from what was
          ordered, contact customer support with the order number and relevant
          photographs or other evidence as soon as reasonably possible.
        </p>
      </PolicySection>

      <PolicySection title="Refunds">
        <p>
          Approved refunds are processed using the applicable payment/refund
          workflow. The time taken for a refund to appear can depend on the
          payment provider and the customer's bank.
        </p>
      </PolicySection>

      <PolicySection title="How to request a return">
        <p>
          Open the relevant delivered order and use the return request option
          when it is available. The store may review the request before
          approving the return.
        </p>
      </PolicySection>

      <PolicySection title="Important">
        <p className="policyNotice">
          Replace this operational policy with the final business-approved
          return/refund terms before production.
        </p>
      </PolicySection>
    </Policy>
  );
}

function PrivacyPolicy() {
  return (
    <Policy title="Privacy policy" eyebrow="RR MASALA · DATA & PRIVACY">
      <div className="policyIntro">
        <span>03 · PRIVACY</span>
        <h2>How information is used.</h2>
        <p>
          RR MASALA uses information needed to operate accounts, process
          orders, provide delivery and support services, and maintain the
          security of the platform.
        </p>
      </div>

      <PolicySection title="Information we may collect">
        <ul>
          <li>Name and account information.</li>
          <li>Mobile number and email address where provided.</li>
          <li>Saved delivery addresses.</li>
          <li>Order, cart and wishlist information.</li>
          <li>Payment transaction references or payment status.</li>
          <li>Support messages and information you provide to us.</li>
          <li>Technical information needed to operate and secure the website.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Why we use it">
        <ul>
          <li>To create and manage customer accounts.</li>
          <li>To process and fulfil orders.</li>
          <li>To calculate delivery and destination information.</li>
          <li>To communicate order and service updates.</li>
          <li>To provide customer support.</li>
          <li>To detect misuse, fraud or security issues.</li>
          <li>To improve website performance and user experience.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Payments">
        <p>
          Payment details should be handled through the configured payment
          provider. The store should not store full card credentials or other
          sensitive payment authentication data in its own database unless
          specifically designed and authorised to do so.
        </p>
      </PolicySection>

      <PolicySection title="Sharing information">
        <p>
          Information may need to be shared with service providers involved in
          payment processing, delivery, technology hosting, communications,
          customer support or other services required to fulfil an order.
        </p>
      </PolicySection>

      <PolicySection title="Cookies and similar technologies">
        <p>
          The website may use browser storage, cookies or similar technologies
          required for authentication, cart functionality, preferences,
          security and website operation.
        </p>
      </PolicySection>

      <PolicySection title="Your requests">
        <p>
          For privacy-related questions or requests concerning information
          associated with your account, contact the configured customer-care
          channel.
        </p>
      </PolicySection>

      <PolicySection title="Business contact details">
        <p className="policyNotice">
          Customer-care email, phone, registered address and grievance contact
          should be inserted from the verified business records before
          production.
        </p>
      </PolicySection>
    </Policy>
  );
}

function TermsPolicy() {
  return (
    <Policy title="Terms & conditions" eyebrow="RR MASALA · TERMS OF USE">
      <div className="policyIntro">
        <span>04 · TERMS</span>
        <h2>Using the RR MASALA store.</h2>
        <p>
          These website terms describe the basic conditions for browsing the
          store, creating an account, placing orders and using store services.
        </p>
      </div>

      <PolicySection title="Products and information">
        <p>
          Product names, descriptions, images, ingredients, nutrition,
          availability, pricing and other product information are displayed
          for customer information and may be updated from time to time.
        </p>
      </PolicySection>

      <PolicySection title="Orders">
        <p>
          An order request is subject to product availability, successful
          order processing, address accuracy and applicable store rules. The
          final payable amount is the amount shown at checkout before order
          confirmation.
        </p>
      </PolicySection>

      <PolicySection title="Pricing">
        <p>
          Prices and applicable delivery charges are displayed in the store.
          If a technical or obvious pricing error occurs, the store should
          follow its final approved pricing and order-resolution procedure.
        </p>
      </PolicySection>

      <PolicySection title="Accounts">
        <p>
          Customers are responsible for keeping account information accurate
          and protecting access to their account credentials.
        </p>
      </PolicySection>

      <PolicySection title="Acceptable use">
        <p>
          Customers must not misuse the website, attempt unauthorised access,
          interfere with store services, submit fraudulent orders or use the
          platform for unlawful activity.
        </p>
      </PolicySection>

      <PolicySection title="Intellectual property">
        <p>
          Store branding, original content, product presentation and website
          materials belong to their respective owners or licensors and should
          not be reused without permission.
        </p>
      </PolicySection>
    </Policy>
  );
}

/* =========================================================
   FAQ
========================================================= */

function StoreFAQ() {
  const faqs = [
    [
      "Can I browse without creating an account?",
      "Yes. You can browse products and add items to your cart. Login is required when the checkout flow requires an authenticated customer account.",
    ],
    [
      "How are delivery charges calculated?",
      "For India, the current checkout configuration uses free delivery above ₹999 and ₹50 below ₹999. International freight is calculated from the destination and shipment details.",
    ],
    [
      "Do you ship internationally?",
      "The checkout is designed for domestic India and international destinations. International availability and final freight depend on the destination and applicable carrier service.",
    ],
    [
      "Can I cancel my order?",
      "Cancellation is available only for eligible order statuses. Once shipment processing has progressed, cancellation may be disabled.",
    ],
    [
      "How long is the return window?",
      "The current store configuration uses a 7-day return window for eligible delivered orders, subject to the applicable product and return conditions.",
    ],
    [
      "Where can I track my order?",
      "Open My Orders and select the relevant order. Tracking information is shown when carrier tracking becomes available.",
    ],
    [
      "What payment methods are supported?",
      "The current checkout is designed for online payment. The live payment gateway can be connected to the payment flow when production credentials and configuration are ready.",
    ],
    [
      "Do you use live location or GPS for delivery?",
      "No. The checkout uses the delivery address entered or selected by the customer and does not require live GPS location.",
    ],
    [
      "Can I save multiple addresses?",
      "Yes. Customers can save delivery addresses and select the appropriate address during checkout.",
    ],
    [
      "How can I contact customer support?",
      "Use the configured customer-care email, phone or WhatsApp channel shown by the store. Production contact details should be populated from verified business records.",
    ],
  ];

  return (
    <Info title="Frequently asked questions" eyebrow="RR MASALA · HELP CENTRE">
      <div className="faqPage">
        <div className="faqHero">
          <span>HELP CENTRE</span>
          <h2>Answers before you order.</h2>
          <p>
            Delivery, returns, payments, accounts and international ordering —
            all in one place.
          </p>
        </div>

        <div className="faqGrid">
          {faqs.map(([question, answer], index) => (
            <article className="faqCard" key={question}>
              <div className="faqNumber">{String(index + 1).padStart(2, "0")}</div>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </Info>
  );
}

/* =========================================================
   SUCCESS
========================================================= */

function PaymentReturn() {
  return (
    <main className="center">
      <div className="panel" style={{ maxWidth: 620 }}>
        <h1>Payment processing</h1>
        <p>
          We are verifying your payment. Open Orders after the payment provider
          redirects you.
        </p>
        <Link className="primary" to="/orders">
          View orders
        </Link>
      </div>
    </main>
  );
}

/* =========================================================
   ROUTES
========================================================= */

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Store */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Catalog />} />
        <Route path="/search" element={<Catalog />} />
        <Route path="/category/:slug" element={<CategoryBridge />} />
        <Route path="/product/:slug" element={<ProductDetails />} />

        {/* Customer */}
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

        {/* Brand / information */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<StoreFAQ />} />
        <Route path="*" element={<NotFound />} />

        {/* Legal centre */}
        <Route path="/legal" element={<LegalCenter />} />

        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsPolicy />} />

        {/* Payment callback */}
        <Route
          path="/payment/phonepe-return"
          element={<PaymentReturn />}
        />

        {/* 404 */}
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

      {/* Admin */}
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
      ].map((type) => (
        <Route
          key={type}
          path={`/admin/${type}`}
          element={
            <Guard admin>
              <AdminManager type={type} />
            </Guard>
          }
        />
      ))}

      <Route
        path="/admin/orders/:id"
        element={
          <Guard admin>
            <AdminOrderDetails />
          </Guard>
        }
      />

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

      {["inventory", "analytics", "settings", "homepage"].map((type) => (
        <Route
          key={type}
          path={`/admin/${type}`}
          element={
            <Guard admin>
              <AdminManager
                type={
                  type === "inventory"
                    ? "products"
                    : type === "analytics"
                    ? "orders"
                    : type
                }
              />
            </Guard>
          }
        />
      ))}
    </Routes>
  );
}

/* =========================================================
   CATEGORY BRIDGE
========================================================= */

function CategoryBridge() {
  const location = useLocation();

  return <Catalog key={location.pathname} />;
}
