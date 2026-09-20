import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

export function Info({
  title,
  eyebrow = "RR MASALA",
  children,
  icon: Icon = BookOpen,
}) {
  const nav = useNavigate();

  return (
    <main className="infoPage" style={{ paddingTop: 32 }}>
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

      {/* HEADER */}
      <section
        className="panel"
        style={{
          padding: 0,
          overflow: "hidden",
          marginBottom: 18,
          background:
            "linear-gradient(135deg, #ffffff 0%, #faf9f4 65%, #fff8d6 100%)",
        }}
      >
        <div
          style={{
            padding: "28px 28px 26px",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: 14,
              background: "#fff7d6",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon size={25} />
          </div>

          <div>
            <span className="eyebrow">{eyebrow}</span>

            <h1
              style={{
                margin: "6px 0 0",
                fontSize: "clamp(27px, 5vw, 40px)",
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <article
        className="panel richText"
        style={{
          lineHeight: 1.8,
          fontSize: 13,
        }}
      >
        {children}
      </article>

      {/* COMMON CTA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 18,
        }}
      >
        <Link
          to="/products"
          className="primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <ShoppingBag size={16} />
          Browse products
          <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}

/* =========================================================
   ABOUT
========================================================= */

export const About = () => (
  <Info title="Our story" icon={BookOpen}>
    <div className="infoFeatureGrid">
      <div className="infoFeature">
        <ShieldCheck size={20} />
        <div>
          <strong>Traditional flavours</strong>
          <p>
            RR MASALA brings familiar Indian pantry flavours into a simple,
            modern shopping experience.
          </p>
        </div>
      </div>

      <div className="infoFeature">
        <PackageCheck size={20} />
        <div>
          <strong>Everyday pantry</strong>
          <p>
            From masalas and podis to pickles, vadagams and ready mixes,
            everything is organised in one place.
          </p>
        </div>
      </div>
    </div>

    <h2>Made for everyday kitchens</h2>

    <p>
      RR MASALA is a modern pantry destination for traditional Indian
      flavours. Our catalogue brings together products designed to make
      everyday cooking convenient while keeping the character of familiar
      Indian food traditions.
    </p>

    <h2>What you can discover</h2>

    <p>
      Explore podis, masalas, pickles, vadagams, ready mixes and other
      traditional pantry products through a clean and easy shopping
      experience.
    </p>

    <div
      style={{
        marginTop: 24,
        padding: 18,
        borderRadius: 12,
        background: "#faf9f4",
        border: "1px solid var(--line)",
      }}
    >
      <strong>Simple shopping. Traditional taste.</strong>

      <p style={{ marginBottom: 0 }}>
        Browse freely as a guest and sign in only when you're ready to place
        your order.
      </p>
    </div>
  </Info>
);

/* =========================================================
   CONTACT
========================================================= */

export const Contact = () => (
  <Info title="Contact us" icon={MessageCircle}>
    <p>
      Need help with an order, product or delivery? We're here to help.
    </p>

    <div className="infoContactGrid">
      <div className="infoContactCard">
        <MessageCircle size={21} />

        <div>
          <strong>WhatsApp support</strong>
          <p>
            Use the store's configured WhatsApp channel for order and support
            enquiries.
          </p>
        </div>
      </div>

      <div className="infoContactCard">
        <PackageCheck size={21} />

        <div>
          <strong>Order support</strong>
          <p>
            Keep your order number ready when contacting support about an
            existing order.
          </p>
        </div>
      </div>
    </div>

    <h2>How can we help?</h2>

    <p>
      For orders, product questions and support, please use the store's
      configured phone, email or WhatsApp channel.
    </p>

    <div
      style={{
        marginTop: 20,
        padding: 17,
        borderRadius: 12,
        background: "#faf9f4",
        border: "1px solid var(--line)",
      }}
    >
      <strong>Tip</strong>

      <p style={{ marginBottom: 0 }}>
        For delivery-related questions, your order number helps us identify
        the order quickly.
      </p>
    </div>
  </Info>
);

/* =========================================================
   FAQ
========================================================= */

export const FAQ = () => (
  <Info
    title="Frequently asked questions"
    icon={HelpCircle}
    eyebrow="HELP CENTRE"
  >
    <div className="faqList">
      <div className="faqItem">
        <h3>Do I need an account to browse?</h3>

        <p>
          No. You can browse products, categories, search results and your
          cart without logging in. Login is required when placing an order.
        </p>
      </div>

      <div className="faqItem">
        <h3>Can I cancel after shipping?</h3>

        <p>
          No. Cancellation is disabled once an order has been shipped.
        </p>
      </div>

      <div className="faqItem">
        <h3>Can I track my order?</h3>

        <p>
          Yes. Open your order from the My Orders section and use Track Order
          to view the current delivery status.
        </p>
      </div>

      <div className="faqItem">
        <h3>Can I save multiple addresses?</h3>

        <p>
          Yes. You can add multiple delivery addresses and set one of them as
          your default address.
        </p>
      </div>

      <div className="faqItem">
        <h3>Can I add products to my wishlist?</h3>

        <p>
          Yes. Use the heart option on products to save them for later.
        </p>
      </div>
    </div>
  </Info>
);

/* =========================================================
   POLICY
========================================================= */

export const Policy = ({ title, children }) => (
  <Info
    title={title}
    eyebrow="RR MASALA · POLICY"
    icon={ShieldCheck}
  >
    {children}
  </Info>
);

/* =========================================================
   ORDER SUCCESS
========================================================= */

export function Success() {
  return (
    <main
      className="success"
      style={{
        paddingTop: 55,
        paddingBottom: 55,
      }}
    >
      <div
        style={{
          maxWidth: 620,
          width: "100%",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 18,
          padding: "45px 28px",
          textAlign: "center",
          boxShadow: "0 15px 45px rgba(0,0,0,.06)",
        }}
      >
        {/* SUCCESS ICON */}
        <div
          className="successIcon"
          style={{
            width: 76,
            height: 76,
            margin: "0 auto 20px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontSize: 30,
            fontWeight: 900,
          }}
        >
          ✓
        </div>

        <span className="eyebrow">ORDER RECEIVED</span>

        <h1
          style={{
            margin: "9px 0 10px",
            fontSize: "clamp(30px, 6vw, 44px)",
          }}
        >
          Thank you.
        </h1>

        <p
          style={{
            maxWidth: 480,
            margin: "0 auto",
            color: "var(--muted)",
            fontSize: 12,
            lineHeight: 1.8,
          }}
        >
          Your order has been created successfully. You can follow its
          progress from your orders section as it moves through confirmation,
          processing, packing and shipment.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 25,
          }}
        >
          <Link
            className="primary"
            to="/orders"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <PackageCheck size={16} />
            My orders
            <ArrowRight size={15} />
          </Link>

          <Link
            className="secondary"
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <ShoppingBag size={16} />
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   LOCAL PAGE STYLES
========================================================= */

export function InfoStyles() {
  return (
    <style>
      {`
        .infoFeatureGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }

        .infoFeature,
        .infoContactCard {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #faf9f4;
        }

        .infoFeature svg,
        .infoContactCard svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .infoFeature strong,
        .infoContactCard strong {
          display: block;
          font-size: 13px;
        }

        .infoFeature p,
        .infoContactCard p {
          margin: 5px 0 0;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.65;
        }

        .infoContactGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin: 22px 0 28px;
        }

        .faqList {
          display: grid;
          gap: 10px;
        }

        .faqItem {
          padding: 17px 18px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #faf9f4;
        }

        .faqItem h3 {
          margin: 0 0 7px;
          font-size: 13px;
        }

        .faqItem p {
          margin: 0;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.7;
        }

        .richText h2 {
          margin-top: 28px;
          margin-bottom: 9px;
          font-size: 19px;
        }

        .richText h3 {
          margin-top: 20px;
          margin-bottom: 7px;
          font-size: 14px;
        }

        .richText p {
          color: var(--muted);
        }

        @media (max-width: 650px) {
          .infoFeatureGrid,
          .infoContactGrid {
            grid-template-columns: 1fr;
          }

          .infoPage {
            padding-top: 22px !important;
          }
        }
      `}
    </style>
  );
}