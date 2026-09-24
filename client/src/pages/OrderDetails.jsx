import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { API } from "../api/http.js";
import OrderTimeline from "../components/OrderTimeline.jsx";

/* =========================================================
   WHITE CLOTH THEATER PRELOADER
========================================================= */
function TheaterPreloader() {
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    const removeTimer = setTimeout(() => setRender(false), 2400);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, []);

  if (!render) return null;

  return (
    <div className={`rrTheaterCurtain ${!loading ? "isOpen" : ""}`} aria-hidden="true">
      <div className="rrClothHalf rrClothLeft"><div className="rrClothFolds" /></div>
      <div className="rrClothHalf rrClothRight"><div className="rrClothFolds" /></div>
      <div className="rrCurtainLogoBox">
        <img src="/logo.png" alt="RR MASALA" className="rrCurtainLogoImg" />
        <div className="rrCurtainLoader" />
      </div>

      <style>{`
        .rrTheaterCurtain { position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .rrClothHalf { position: absolute; top: 0; bottom: 0; width: 50%; background: #ffffff; box-shadow: inset 0 0 40px rgba(0,0,0,0.05); transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1) 0.3s; will-change: transform; }
        .rrClothLeft { left: 0; transform-origin: left; border-right: 1px solid rgba(0,0,0,0.05); }
        .rrClothRight { right: 0; transform-origin: right; border-left: 1px solid rgba(0,0,0,0.05); }
        .rrClothFolds { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.03) 10%, transparent 20%); }
        .rrTheaterCurtain.isOpen .rrClothLeft { transform: translateX(-100%); }
        .rrTheaterCurtain.isOpen .rrClothRight { transform: translateX(100%); }
        .rrCurtainLogoBox { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 15px; transition: opacity 0.3s ease; }
        .rrTheaterCurtain.isOpen .rrCurtainLogoBox { opacity: 0; }
        .rrCurtainLogoImg { height: 190px; object-fit: contain; }
        .rrCurtainLoader { width: 120px; height: 2px; background: rgba(0,0,0,0.1); position: relative; overflow: hidden; }
        .rrCurtainLoader::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: #fbb034; animation: rrTheaterLoad 1.2s ease-in-out forwards; }
        @keyframes rrTheaterLoad { 0% { left: -100%; } 100% { left: 0; } }
      `}</style>
    </div>
  );
}

const STATUS_META = {
  PENDING: { label: "Order placed", tone: "amber", icon: Clock3, text: "We have received your order and it is waiting for confirmation." },
  CONFIRMED: { label: "Confirmed", tone: "blue", icon: CheckCircle2, text: "Your order has been confirmed." },
  PROCESSING: { label: "Processing", tone: "blue", icon: Package, text: "Your items are being prepared for dispatch." },
  PACKED: { label: "Packed", tone: "blue", icon: Package, text: "Your order has been packed and is ready." },
  SHIPPED: { label: "Shipped", tone: "green", icon: Truck, text: "Your parcel has left our facility." },
  OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "green", icon: Truck, text: "Your parcel is on the way." },
  DELIVERED: { label: "Delivered", tone: "green", icon: CheckCircle2, text: "Successfully delivered." },
  CANCELLED: { label: "Cancelled", tone: "red", icon: XCircle, text: "This order has been cancelled." },
  RETURN_REQUESTED: { label: "Return requested", tone: "amber", icon: RotateCcw, text: "Your return request has been received." },
  RETURNED: { label: "Returned", tone: "amber", icon: RotateCcw, text: "This order has been returned." },
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const titleCase = (value = "") =>
  String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());

function AddressCard({ address }) {
  const a = address || {};
  const lines = [
    [a.house, a.street].filter(Boolean).join(", "),
    [a.area, a.landmark].filter(Boolean).join(", "),
    [a.city, a.district].filter(Boolean).join(", "),
    [a.state, a.pincode].filter(Boolean).join(" - "),
    a.country,
  ].filter(Boolean);

  return (
    <div className="od-addressCard">
      <div className="od-iconBox">
        <MapPin size={19} />
      </div>
      <div className="od-addressText">
        <div className="od-cardEyebrow">DELIVERY ADDRESS</div>
        {lines.length ? (
          lines.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)
        ) : (
          <div>Delivery address unavailable</div>
        )}
        {a.mobile && (
          <div className="od-addressPhone">
            <Phone size={13} /> {a.mobile}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    API.get(`/orders/${id}`)
      .then((response) => {
        if (!mounted) return;
        setData(response.data?.data || null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.response?.data?.message || "Unable to load this order.");
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const order = data?.order || data?.o || data;

  const meta = useMemo(() => {
    const status = String(order?.orderStatus || "PENDING").toUpperCase();
    return STATUS_META[status] || {
      label: titleCase(status),
      tone: "blue",
      icon: Package,
      text: "Your order status has been updated.",
    };
  }, [order?.orderStatus]);

  if (error) {
    return (
      <main className="od-page">
        <TheaterPreloader />
        <div className="od-error">
          <XCircle size={38} />
          <h2>We couldn't load this order</h2>
          <p>{error}</p>
          <button className="od-primary" onClick={() => nav("/orders")}>
            Back to orders
          </button>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="od-page">
        <TheaterPreloader />
        <div className="od-loading">
          <RefreshCw className="od-spin" size={30} />
          <span>Loading order details...</span>
        </div>
      </main>
    );
  }

  const status = String(order.orderStatus || "PENDING").toUpperCase();
  const StatusIcon = meta.icon;
  const items = Array.isArray(order.items) ? order.items : [];

  const subtotal =
    order.subtotal ??
    items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

  const delivery =
    order.shippingFee ??
    order.deliveryFee ??
    order.shippingCharge ??
    0;

  const grandTotal = order.grandTotal ?? subtotal + Number(delivery || 0);
  const paymentStatus = String(
    order.paymentStatus || order.payment?.status || ""
  ).toUpperCase();

  const canCancel = ["PENDING", "CONFIRMED", "PROCESSING"].includes(status);
  const canReturn = status === "DELIVERED";

  const cancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setBusy(true);
    try {
      const response = await API.post(`/orders/${id}/cancel`);
      const updated = response.data?.data?.order || response.data?.data;
      if (updated) setData((current) => ({ ...(current || {}), order: updated }));
      else nav("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel this order.");
    } finally {
      setBusy(false);
    }
  };

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber || id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <main className="od-page">
      <TheaterPreloader />
      <div className="od-shell">
        <button className="od-back" onClick={() => nav("/orders")}>
          <ArrowLeft size={17} />
          <span>Back to orders</span>
        </button>

        {/* HERO */}
        <section className={`od-hero od-${meta.tone}`}>
          <div className="od-heroTop">
            <div>
              <div className="od-eyebrow">RR MASALA · ORDER DETAILS</div>
              <div className="od-numberRow">
                <h1>{order.orderNumber || `#${id.slice(-8).toUpperCase()}`}</h1>
                <button className="od-copy" onClick={copyOrderNumber} title="Copy order number">
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="od-date">
                Placed on{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>

            <div className="od-statusPill">
              <StatusIcon size={17} />
              <span>{meta.label}</span>
            </div>
          </div>

          <div className="od-statusMessage">
            <StatusIcon size={17} />
            <span>{meta.text}</span>
          </div>
        </section>

        {/* TRACKING / MILESTONE JOURNEY */}
        <section className="od-card od-trackingCard">
          <div className="od-sectionHead">
            <div>
              <div className="od-cardEyebrow">DELIVERY JOURNEY</div>
              <h2>Milestone journey</h2>
            </div>

            {order.trackingNumber ? (
              <div className="od-trackingNumber">
                <span>TRACKING ID</span>
                <strong>{order.trackingNumber}</strong>
              </div>
            ) : (
              <span className="od-neutralTag">
                <Truck size={14} />
                Tracking updates
              </span>
            )}
          </div>

          <div className="od-timelineWrap">
            <OrderTimeline status={order.orderStatus} />
          </div>

          {order.trackingNumber && (
            <div className="od-trackRow">
              <div>
                <Truck size={17} />
                <div>
                  <strong>Shipment tracking available</strong>
                  <small>Your tracking number is linked to this order.</small>
                </div>
              </div>
              <button
                className="od-secondary"
                onClick={() => navigator.clipboard?.writeText(order.trackingNumber)}
              >
                Copy tracking ID
              </button>
            </div>
          )}
        </section>

        <div className="od-mainGrid">
          {/* ITEMS */}
          <section className="od-card od-itemsCard">
            <div className="od-sectionHead compact">
              <div>
                <div className="od-cardEyebrow">YOUR PURCHASE</div>
                <h2>{items.length} {items.length === 1 ? "item" : "items"}</h2>
              </div>
              <ShoppingBag size={20} />
            </div>

            <div className="od-items">
              {items.map((item, index) => {
                const qty = Number(item.quantity || 0);
                const price = Number(item.price || 0);
                const image = item.image || "/products/placeholder.svg";

                return (
                  <div className="od-item" key={`${item.sku || item.name || "item"}-${index}`}>
                    <div className="od-productImage">
                      <img src={image} alt={item.name || "Product"} />
                    </div>

                    <div className="od-productInfo">
                      <div className="od-productName">{item.name}</div>
                      {item.sku && <div className="od-sku">SKU · {item.sku}</div>}
                      <div className="od-itemMeta">
                        <span>Qty {qty}</span>
                        <span>×</span>
                        <span>{money(price)} each</span>
                      </div>
                    </div>

                    <strong className="od-lineTotal">{money(price * qty)}</strong>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIGHT SUMMARY */}
          <aside className="od-side">
            <section className="od-card od-summaryCard">
              <div className="od-cardEyebrow">PAYMENT SUMMARY</div>
              <h2>Order total</h2>

              <div className="od-moneyRows">
                <div>
                  <span>Items subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>
                    {Number(delivery) > 0 ? money(delivery) : "FREE"}
                  </strong>
                </div>
                {order.discountAmount > 0 && (
                  <div className="od-discount">
                    <span>Discount</span>
                    <strong>-{money(order.discountAmount)}</strong>
                  </div>
                )}
              </div>

              <div className="od-total">
                <span>Total paid / payable</span>
                <strong>{money(grandTotal)}</strong>
              </div>

              <div className="od-paymentMethod">
                <div className="od-paymentIcon">
                  <CreditCard size={18} />
                </div>
                <div>
                  <span>Payment method</span>
                  <strong>{titleCase(order.paymentMethod || "Online Payment")}</strong>
                </div>
                {paymentStatus && (
                  <span className={`od-paymentStatus ${paymentStatus.toLowerCase()}`}>
                    {titleCase(paymentStatus)}
                  </span>
                )}
              </div>
            </section>

            {/* ADDRESS */}
            <section className="od-card">
              <div className="od-cardEyebrow">SHIP TO</div>
              <h2>Delivery destination</h2>
              <AddressCard address={order.shippingAddress} />
            </section>

            {/* TRUST */}
            <section className="od-trust">
              <div>
                <ShieldCheck size={19} />
                <div>
                  <strong>Secure order information</strong>
                  <span>Your delivery and payment details are protected.</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* ACTIONS */}
        <section className="od-card od-actions">
          <div>
            <div className="od-cardEyebrow">ORDER ACTIONS</div>
            <h2>Need to manage this order?</h2>
            <p>
              Available actions change automatically as your order moves through fulfilment.
            </p>
          </div>

          <div className="od-actionButtons">
            <Link className="od-secondary" to="/orders">
              <ArrowLeft size={16} />
              All orders
            </Link>

            {order.trackingNumber && (
              <Link className="od-secondary" to={`/orders/${id}/track`}>
                <Truck size={16} />
                Track shipment
                <ChevronRight size={15} />
              </Link>
            )}

            {canCancel && (
              <button className="od-danger" disabled={busy} onClick={cancel}>
                <XCircle size={16} />
                {busy ? "Cancelling..." : "Cancel order"}
              </button>
            )}

            {["SHIPPED", "OUT_FOR_DELIVERY"].includes(status) && (
              <div className="od-disabledNote">
                {/* <Truck size={15} /> */}
                   Cancellation is unavailable after shipment.
              </div>
            )}

            {canReturn && (
              <Link className="od-primary" to={`/orders/${id}/return`}>
                <RotateCcw size={16} />
                Request return
                <ExternalLink size={14} />
              </Link>
            )}
          </div>
        </section>

        {/* SUPPORT STRIP */}
        <div className="od-support">
          <Package size={18} />
          <div>
            <strong>Need help with this order?</strong>
            <span>Keep your order number ready when contacting support.</span>
          </div>
          <Link to="/contact">
            Contact support <ChevronRight size={15} />
          </Link>
        </div>
      </div>

      <style>{`
        .od-page { min-height: 100vh; background: #fff; padding: 34px 18px 90px; }
        .od-shell { width: min(1100px, 100%); margin: 0 auto; }
        .od-back { display: inline-flex; align-items: center; gap: 8px; border: 0; background: transparent; color: #55584f; font-size: 13px; font-weight: 800; cursor: pointer; padding: 11px 0 20px; }
        .od-hero, .od-card { border: 1px solid #e8e5da; border-radius: 20px; background: rgba(255,255,255,.94); box-shadow: 0 10px 35px rgba(31, 32, 24, .055); margin-bottom: 16px; }
        .od-hero { padding: 32px; position: relative; overflow: hidden; }
        .od-amber { background: linear-gradient(135deg, #fffdf3, #fff7d0); }
        .od-blue { background: linear-gradient(135deg, #fbfdff, #eef6ff); }
        .od-green { background: linear-gradient(135deg, #fbfffc, #eefaf2); }
        .od-red { background: linear-gradient(135deg, #fffafa, #fff0f0); }
        .od-heroTop { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
        .od-eyebrow, .od-cardEyebrow { font-size: 10px; letter-spacing: .15em; font-weight: 950; color: #85877f; margin-bottom: 4px; text-transform: uppercase; }
        .od-numberRow { display: flex; align-items: center; gap: 10px; margin-top: 7px; flex-wrap: wrap; }
        .od-numberRow h1 { margin: 0; font-size: clamp(28px, 4vw, 42px); letter-spacing: -.04em; }
        .od-copy { display: inline-flex; align-items: center; gap: 5px; border: 1px solid #dedbd0; background: rgba(255,255,255,.72); border-radius: 8px; padding: 7px 9px; font-size: 10px; font-weight: 850; cursor: pointer; }
        .od-date { margin: 8px 0 0; color: #777a72; font-size: 13px; }
        .od-statusPill { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(0,0,0,.08); background: rgba(255,255,255,.78); border-radius: 999px; padding: 10px 14px; font-size: 12px; font-weight: 900; white-space: nowrap; }
        .od-statusMessage { display: flex; align-items: center; gap: 8px; margin-top: 18px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,.07); font-size: 13px; color: #55584f; }
        
        .od-card { padding: 24px; }
        .od-sectionHead { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; margin-bottom: 18px; }
        .od-sectionHead.compact { align-items: center; }
        .od-sectionHead h2, .od-card h2 { margin: 5px 0 0; font-size: 20px; letter-spacing: -.025em; }
        .od-neutralTag { display: inline-flex; align-items: center; gap: 6px; background: #f5f5f1; color: #666960; border-radius: 999px; padding: 8px 10px; font-size: 10px; font-weight: 850; }
        .od-trackingNumber { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .od-trackingNumber span { font-size: 8px; color: #96988f; font-weight: 900; letter-spacing: .12em; }
        .od-trackingNumber strong { font-size: 12px; letter-spacing: .04em; }
        .od-timelineWrap { padding: 5px 0; overflow-x: auto; }
        .od-trackRow { margin-top: 16px; border-top: 1px solid #eeece4; padding-top: 15px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .od-trackRow > div { display: flex; align-items: center; gap: 10px; }
        .od-trackRow strong { font-size: 11px; }
        .od-trackRow small { margin-top: 3px; color: #85877f; font-size: 10px; }

        .od-mainGrid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(300px, .9fr); gap: 16px; align-items: start; }
        .od-side { display: grid; gap: 16px; }

        .od-itemsCard { padding: 0!important; overflow: hidden; }
        .od-itemsCard .od-sectionHead { padding: 20px 24px; margin: 0; border-bottom: 1px solid #eceae2; }
        .od-items { padding: 0 24px; }
        .od-item { display: grid; grid-template-columns: 64px minmax(0,1fr) auto; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid #efede7; }
        .od-item:last-child { border-bottom: 0; }
        .od-productImage { width: 64px; height: 64px; border-radius: 12px; background: #f6f3e7; overflow: hidden; display: grid; place-items: center; border: 1px solid #ebe8dd; }
        .od-productImage img { width: 100%; height: 100%; object-fit: cover; }
        .od-productName { font-size: 14px; font-weight: 900; }
        .od-sku { margin-top: 3px; font-size: 9px; color: #999b93; letter-spacing: .06em; }
        .od-itemMeta { display: flex; align-items: center; gap: 6px; margin-top: 6px; color: #73766d; font-size: 12px; }
        .od-lineTotal { font-size: 14px; white-space: nowrap; }

        .od-moneyRows { display: grid; gap: 8px; margin-top: 16px; }
        .od-moneyRows > div { display: flex; justify-content: space-between; gap: 12px; color: #70736a; font-size: 13px; }
        .od-moneyRows strong { color: #23251f; }
        .od-discount strong { color: #23824e; }
        .od-total { display: flex; justify-content: space-between; align-items: flex-end; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px dashed #dedbd1; }
        .od-total span { font-size: 13px; color: #666960; }
        .od-total strong { font-size: 20px; letter-spacing: -.03em; }

        .od-paymentMethod { display: flex; align-items: center; gap: 10px; margin-top: 14px; padding: 12px; background: #f8f8f4; border: 1px solid #ecebe3; border-radius: 12px; }
        .od-paymentIcon { width: 34px; height: 34px; display: grid; place-items: center; background: #fff; border: 1px solid #e7e5dc; border-radius: 9px; }
        .od-paymentMethod > div:nth-child(2) { min-width: 0; flex: 1; }
        .od-paymentMethod span, .od-paymentMethod strong { display: block; }
        .od-paymentMethod span { color: #8a8d84; font-size: 9px; }
        .od-paymentMethod strong { margin-top: 2px; font-size: 11px; }
        .od-paymentStatus { padding: 4px 6px; border-radius: 6px; font-size: 8px !important; font-weight: 900; background: #eef7f0; color: #277849 !important; }

        .od-addressCard { display: flex; gap: 11px; margin-top: 14px; padding: 12px; border: 1px solid #ebe9e1; border-radius: 12px; background: #fafaf7; font-size: 12px; line-height: 1.5; color: #4e514a; }
        .od-iconBox { width: 34px; height: 34px; flex: 0 0 34px; display: grid; place-items: center; background: #fff7cf; border-radius: 8px; }
        .od-addressText { min-width: 0; }
        .od-addressPhone { display: flex; align-items: center; gap: 5px; margin-top: 6px; font-weight: 800; }

        .od-trust { padding: 14px; border-radius: 14px; background: #eff8f1; border: 1px solid #dceee0; }
        .od-trust > div { display: flex; align-items: flex-start; gap: 10px; color: #286541; }
        .od-trust strong, .od-trust span { display: block; }
        .od-trust strong { font-size: 11px; }
        .od-trust span { margin-top: 2px; font-size: 9px; color: #5f7e69; }

        .od-actions { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .od-actions p { margin: 4px 0 0; color: #80837a; font-size: 12px; }
        .od-actionButtons { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
        .od-primary, .od-secondary, .od-danger { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 38px; border-radius: 10px; padding: 0 14px; text-decoration: none; font-size: 12px; font-weight: 900; cursor: pointer; }
        .od-primary { border: 1px solid #1b1d18; background: #1b1d18; color: #fff; }
        .od-secondary { border: 1px solid #dedbd2; background: #fff; color: #30322c; }
        .od-danger { border: 1px solid #f0cccc; background: #fff5f5; color: #a73838; }

        .od-support { margin-top: 12px; padding: 14px 16px; border: 1px solid #e5e3da; border-radius: 14px; background: rgba(255,255,255,.65); display: flex; align-items: center; gap: 10px; color: #64675f; }
        .od-support > div { flex: 1; }
        .od-support strong, .od-support span { display: block; }
        .od-support strong { color: #30322c; font-size: 11px; }
        .od-support span { margin-top: 2px; font-size: 10px; }
        .od-support a { display: inline-flex; align-items: center; gap: 4px; color: #22241f; font-size: 11px; font-weight: 900; text-decoration: none; }

        .od-loading, .od-error { width: min(500px, calc(100% - 20px)); margin: 80px auto; border: 1px solid #e7e4da; border-radius: 20px; background: #fff; padding: 40px 20px; text-align: center; }
        .od-spin { animation: odSpin 1s linear infinite; }
        @keyframes odSpin { to { transform: rotate(360deg); } }

        /* RESPONSIVE LANDSCAPE & PORTRAIT RULES */
        @media (max-width: 900px) {
          .od-mainGrid { grid-template-columns: 1fr; }
          .od-actions { flex-direction: column; align-items: stretch; text-align: center; }
          .od-actionButtons { justify-content: center; }
        }
      `}</style>
    </main>
  );
}