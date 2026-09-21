import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { API } from "../api/http.js";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_META = {
  PENDING: ["Order placed", "warning"],
  CONFIRMED: ["Confirmed", "info"],
  PROCESSING: ["Processing", "info"],
  PACKED: ["Packed", "info"],
  SHIPPED: ["Shipped", "success"],
  OUT_FOR_DELIVERY: ["Out for delivery", "success"],
  DELIVERED: ["Delivered", "success"],
  CANCELLED: ["Cancelled", "danger"],
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

const dateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function StatusBadge({ status }) {
  const [label, tone] = STATUS_META[status] || [titleCase(status), "neutral"];
  return <span className={`ao-status ${tone}`}><i />{label}</span>;
}

function AddressBlock({ address }) {
  const a = address || {};
  const lines = [
    a.fullName,
    a.address,
    [a.house, a.street].filter(Boolean).join(", "),
    [a.area, a.landmark].filter(Boolean).join(", "),
    [a.city, a.district].filter(Boolean).join(", "),
    [a.state, a.pincode].filter(Boolean).join(" - "),
    a.country,
  ].filter(Boolean);

  return (
    <div className="ao-address">
      <div className="ao-icon"><MapPin size={18} /></div>
      <div>
        {lines.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}
        {a.mobile && <div className="ao-phone"><Phone size={13} /> {a.mobile}</div>}
      </div>
    </div>
  );
}

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    status: "PENDING",
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: "",
    note: "",
  });

  const loadOrder = async () => {
    try {
      setError("");
      setLoading(true);

      // Admin is allowed to use the same protected order GET endpoint.
      const response = await API.get(`/orders/${id}`);
      const payload = response?.data?.data || response?.data || {};
      const order = payload.order || payload.o || payload;

      if (!order?._id) throw new Error("Order not found.");

      setData({
        order,
        history: Array.isArray(payload.history) ? payload.history : [],
      });

      setForm({
        status: String(order.orderStatus || "PENDING").toUpperCase(),
        trackingNumber: order.trackingNumber || "",
        carrier: order.carrier || "",
        estimatedDelivery: order.estimatedDelivery
          ? new Date(order.estimatedDelivery).toISOString().slice(0, 10)
          : "",
        note: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load this order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const order = data?.order;
  const history = data?.history || [];
  const items = Array.isArray(order?.items) ? order.items : [];

  const totals = useMemo(() => {
    const subtotal =
      order?.subtotal ??
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );

    const shipping = Number(
      order?.shippingFee ??
        order?.deliveryFee ??
        order?.shippingCharge ??
        0
    );

    const discount = Number(order?.discount || order?.discountAmount || 0);
    const tax = Number(order?.tax || 0);
    const total = Number(
      order?.grandTotal ?? subtotal + shipping + tax - discount
    );

    return { subtotal, shipping, discount, tax, total };
  }, [order, items]);

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(order?.orderNumber || id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const saveStatus = async () => {
    if (!order?._id) return;

    if (
      form.status === "CANCELLED" &&
      order.orderStatus !== "CANCELLED"
    ) {
      const ok = window.confirm(
        `Cancel ${order.orderNumber || "this order"}? Stock will be restored by the server according to the existing cancellation logic.`
      );
      if (!ok) return;
    }

    if (form.status !== order.orderStatus && !window.confirm(
      `Change ${order.orderNumber || "this order"} from ${titleCase(
        order.orderStatus
      )} to ${titleCase(form.status)}?`
    )) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const response = await API.patch(`/orders/${id}/status`, {
        status: form.status,
        note: form.note.trim(),
        trackingNumber: form.trackingNumber.trim(),
        carrier: form.carrier.trim(),
        estimatedDelivery: form.estimatedDelivery || undefined,
      });

      const updated =
        response?.data?.data?.order ||
        response?.data?.order ||
        response?.data?.data;

      if (updated) {
        setData((current) => ({
          ...(current || {}),
          order: updated,
        }));
      }

      setNotice("Order updated successfully.");
      setForm((current) => ({ ...current, note: "" }));

      // Refresh so status history is always current.
      await loadOrder();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not update the order. Please check the order API route."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="ao-page">
        <div className="ao-loading">
          <RefreshCw className="ao-spin" size={30} />
          <strong>Loading order...</strong>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="ao-page">
        <div className="ao-error">
          <XCircle size={40} />
          <h2>Unable to load order</h2>
          <p>{error}</p>
          <div className="ao-actions">
            <button onClick={loadOrder} className="ao-secondary">
              <RefreshCw size={16} /> Retry
            </button>
            <Link to="/admin/orders" className="ao-primary">
              <ArrowLeft size={16} /> Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ao-page">
      <style>{`
        .ao-page{min-height:100vh;background:#f5f6f8;color:#18181b;padding:28px clamp(15px,3vw,44px) 70px}
        .ao-shell{max-width:1420px;margin:auto}
        .ao-back{display:inline-flex;align-items:center;gap:7px;color:#71747a;text-decoration:none;font-size:13px;font-weight:800;margin-bottom:17px}
        .ao-back:hover{color:#111}
        .ao-hero{background:#fff;border:1px solid #e5e7ea;border-radius:20px;padding:25px;box-shadow:0 8px 30px rgba(20,20,20,.045);margin-bottom:16px}
        .ao-hero-top{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}
        .ao-eyebrow{font-size:10px;font-weight:900;letter-spacing:1.5px;color:#9a9da2}
        .ao-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 5px}
        .ao-title-row h1{font-size:clamp(24px,3vw,34px);margin:0;letter-spacing:-.8px}
        .ao-copy{border:1px solid #e4e6e9;background:#fff;border-radius:8px;padding:7px 9px;display:inline-flex;gap:5px;align-items:center;cursor:pointer;font-weight:800;font-size:11px}
        .ao-date{margin:0;color:#85888d;font-size:12px}
        .ao-status{display:inline-flex;align-items:center;gap:7px;padding:9px 12px;border-radius:999px;font-size:11px;font-weight:900;white-space:nowrap}
        .ao-status i{width:7px;height:7px;border-radius:50%;background:currentColor}
        .ao-status.warning{color:#9a6b00;background:#fff6d8}
        .ao-status.info{color:#32699e;background:#eaf4ff}
        .ao-status.success{color:#237a4b;background:#eaf8ef}
        .ao-status.danger{color:#a33d36;background:#fff0ee}
        .ao-status.neutral{color:#666;background:#f1f2f3}
        .ao-grid{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:16px}
        .ao-main,.ao-side{display:grid;gap:16px;align-content:start}
        .ao-card{background:#fff;border:1px solid #e5e7ea;border-radius:17px;padding:21px;box-shadow:0 5px 20px rgba(20,20,20,.035)}
        .ao-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:17px}
        .ao-head h2{margin:4px 0 0;font-size:19px;letter-spacing:-.3px}
        .ao-head p{margin:5px 0 0;color:#85888d;font-size:12px}
        .ao-head svg{color:#a18a4b}
        .ao-items{display:grid;gap:0}
        .ao-item{display:grid;grid-template-columns:64px 1fr auto;gap:13px;align-items:center;padding:13px 0;border-top:1px solid #eef0f2}
        .ao-item:first-child{border-top:0;padding-top:0}
        .ao-thumb{width:64px;height:64px;border-radius:11px;background:#faf7ef;border:1px solid #ebe6dc;overflow:hidden;display:grid;place-items:center}
        .ao-thumb img{width:100%;height:100%;object-fit:cover}
        .ao-thumb svg{color:#b2a078}
        .ao-name{font-weight:850;font-size:13px;color:#26272a}
        .ao-sku{font-size:10px;color:#9a9da2;margin-top:4px}
        .ao-meta{display:flex;gap:8px;flex-wrap:wrap;color:#72757b;font-size:11px;margin-top:7px}
        .ao-line{font-weight:900;font-size:13px}
        .ao-money{display:grid;gap:9px}
        .ao-money-row{display:flex;justify-content:space-between;gap:15px;font-size:12px;color:#70737a}
        .ao-money-row strong{color:#242529}
        .ao-total{display:flex;justify-content:space-between;border-top:1px solid #e8eaed;margin-top:6px;padding-top:14px;font-size:13px}
        .ao-total strong{font-size:20px}
        .ao-address{display:flex;gap:11px;line-height:1.6;font-size:12px;color:#46494e}
        .ao-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:#fff7d8;color:#8a6a0b;flex:0 0 auto}
        .ao-phone{display:flex;align-items:center;gap:5px;margin-top:6px;font-weight:800}
        .ao-customer{display:flex;gap:12px;align-items:center}
        .ao-avatar{width:43px;height:43px;border-radius:50%;display:grid;place-items:center;background:#18181b;color:#fff;font-weight:900}
        .ao-customer strong{display:block;font-size:13px}
        .ao-customer span{display:block;color:#85888d;font-size:11px;margin-top:3px}
        .ao-fields{display:grid;gap:13px}
        .ao-field{display:grid;gap:6px}
        .ao-field label{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.8px;color:#85888d}
        .ao-field input,.ao-field select,.ao-field textarea{width:100%;box-sizing:border-box;border:1px solid #dfe2e5;background:#fafbfc;border-radius:9px;padding:10px 11px;font:inherit;font-size:12px;outline:none;color:#222}
        .ao-field textarea{min-height:78px;resize:vertical}
        .ao-field input:focus,.ao-field select:focus,.ao-field textarea:focus{border-color:#c6a52e;background:#fff;box-shadow:0 0 0 3px rgba(198,165,46,.1)}
        .ao-update{width:100%;border:0;border-radius:10px;background:#18181b;color:#fff;padding:12px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:12px;font-weight:900;cursor:pointer}
        .ao-update:disabled{opacity:.55;cursor:not-allowed}
        .ao-alert{padding:11px 13px;border-radius:10px;font-size:12px;margin-bottom:16px}
        .ao-alert.error{background:#fff0ee;border:1px solid #f0d0cb;color:#9c3d35}
        .ao-alert.success{background:#ecf9f0;border:1px solid #ccebd7;color:#247346}
        .ao-history{display:grid;gap:0}
        .ao-history-item{position:relative;padding:0 0 17px 25px;border-left:1px solid #ddd}
        .ao-history-item:last-child{border-left-color:transparent;padding-bottom:0}
        .ao-dot{position:absolute;left:-5px;top:1px;width:9px;height:9px;border-radius:50%;background:#c9a72c;border:2px solid #fff;box-shadow:0 0 0 1px #c9a72c}
        .ao-history-item strong{font-size:12px}
        .ao-history-item p{margin:4px 0;color:#74777d;font-size:11px;line-height:1.5}
        .ao-history-item time{color:#a0a3a8;font-size:10px}
        .ao-shipping-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .ao-mini{background:#fafbfc;border:1px solid #e8eaed;border-radius:10px;padding:12px}
        .ao-mini span{display:block;color:#92959a;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px}
        .ao-mini strong{display:block;margin-top:5px;font-size:12px}
        .ao-actions{display:flex;gap:9px;flex-wrap:wrap}
        .ao-primary,.ao-secondary{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:9px;padding:10px 13px;text-decoration:none;font-size:11px;font-weight:900;cursor:pointer}
        .ao-primary{background:#18181b;color:#fff;border:1px solid #18181b}
        .ao-secondary{background:#fff;color:#333;border:1px solid #e1e3e6}
        .ao-loading,.ao-error{min-height:55vh;display:grid;place-items:center;align-content:center;gap:10px;text-align:center;color:#777}
        .ao-error{background:#fff;border:1px solid #e5e7ea;border-radius:18px;max-width:560px;margin:70px auto;padding:35px}
        .ao-error h2{margin:3px 0;font-size:22px;color:#222}
        .ao-error p{margin:0 0 10px;font-size:13px}
        .ao-spin{animation:aoSpin .8s linear infinite}
        @keyframes aoSpin{to{transform:rotate(360deg)}}
        @media(max-width:900px){.ao-grid{grid-template-columns:1fr}.ao-side{grid-template-columns:1fr 1fr}.ao-hero-top{flex-direction:column}}
        @media(max-width:620px){.ao-page{padding:18px 12px 45px}.ao-card,.ao-hero{padding:16px;border-radius:14px}.ao-side{grid-template-columns:1fr}.ao-item{grid-template-columns:52px 1fr}.ao-thumb{width:52px;height:52px}.ao-line{grid-column:2}.ao-shipping-grid{grid-template-columns:1fr}.ao-title-row h1{font-size:23px}}
      `}</style>

      <div className="ao-shell">
        <Link to="/admin/orders" className="ao-back">
          <ArrowLeft size={16} /> Back to orders
        </Link>

        {error && <div className="ao-alert error">{error}</div>}
        {notice && <div className="ao-alert success">{notice}</div>}

        <section className="ao-hero">
          <div className="ao-hero-top">
            <div>
              <div className="ao-eyebrow">RR MASALA · ADMIN ORDER</div>
              <div className="ao-title-row">
                <h1>{order.orderNumber || `#${id.slice(-8).toUpperCase()}`}</h1>
                <button className="ao-copy" onClick={copyOrder}>
                  <Copy size={13} /> {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="ao-date">Placed {dateTime(order.createdAt)}</p>
            </div>
            <StatusBadge status={String(order.orderStatus || "PENDING").toUpperCase()} />
          </div>
        </section>

        <div className="ao-grid">
          <div className="ao-main">
            <section className="ao-card">
              <div className="ao-head">
                <div>
                  <div className="ao-eyebrow">ORDER ITEMS</div>
                  <h2>{items.length} {items.length === 1 ? "item" : "items"}</h2>
                </div>
                <ShoppingBag size={20} />
              </div>

              <div className="ao-items">
                {items.map((item, index) => (
                  <div className="ao-item" key={`${item.sku || item.name || "item"}-${index}`}>
                    <div className="ao-thumb">
                      {item.image ? (
                        <img src={item.image} alt={item.name || "Product"} />
                      ) : (
                        <Package size={22} />
                      )}
                    </div>
                    <div>
                      <div className="ao-name">{item.name || "Product"}</div>
                      {item.sku && <div className="ao-sku">SKU · {item.sku}</div>}
                      <div className="ao-meta">
                        <span>Qty {Number(item.quantity || 0)}</span>
                        <span>×</span>
                        <span>{money(item.price)} each</span>
                      </div>
                    </div>
                    <strong className="ao-line">
                      {money(Number(item.price || 0) * Number(item.quantity || 0))}
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="ao-card">
              <div className="ao-head">
                <div>
                  <div className="ao-eyebrow">STATUS HISTORY</div>
                  <h2>Order journey</h2>
                </div>
                <Clock3 size={20} />
              </div>

              <div className="ao-history">
                {history.length ? history.map((entry, index) => (
                  <div className="ao-history-item" key={entry._id || index}>
                    <span className="ao-dot" />
                    <strong>{titleCase(entry.newStatus || entry.status || "Updated")}</strong>
                    {entry.oldStatus && <p>{titleCase(entry.oldStatus)} → {titleCase(entry.newStatus)}</p>}
                    {entry.note && <p>{entry.note}</p>}
                    <time>{dateTime(entry.createdAt)}</time>
                  </div>
                )) : (
                  <div style={{ color: "#85888d", fontSize: 12 }}>No status history available.</div>
                )}
              </div>
            </section>

            <section className="ao-card">
              <div className="ao-head">
                <div>
                  <div className="ao-eyebrow">DELIVERY</div>
                  <h2>Shipping information</h2>
                </div>
                <Truck size={20} />
              </div>

              <div className="ao-shipping-grid">
                <div className="ao-mini"><span>Order type</span><strong>{titleCase(order.orderType || "DOMESTIC")}</strong></div>
                <div className="ao-mini"><span>Shipping method</span><strong>{titleCase(order.shippingMethod || "DOMESTIC")}</strong></div>
                <div className="ao-mini"><span>Carrier</span><strong>{order.carrier || "Not assigned"}</strong></div>
                <div className="ao-mini"><span>Tracking number</span><strong>{order.trackingNumber || "Not assigned"}</strong></div>
                <div className="ao-mini"><span>Estimated delivery</span><strong>{order.estimatedDelivery ? dateTime(order.estimatedDelivery).split(",")[0] : "Not set"}</strong></div>
                <div className="ao-mini"><span>Currency</span><strong>{order.currency || "INR"}</strong></div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="ao-eyebrow" style={{ marginBottom: 8 }}>DELIVERY ADDRESS</div>
                <AddressBlock address={order.shippingAddress} />
              </div>
            </section>
          </div>

          <aside className="ao-side">
            <section className="ao-card">
              <div className="ao-head">
                <div>
                  <div className="ao-eyebrow">CUSTOMER</div>
                  <h2>Customer details</h2>
                </div>
                <User size={20} />
              </div>

              <div className="ao-customer">
                <div className="ao-avatar">
                  {(order.customer?.name || order.shippingAddress?.fullName || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{order.customer?.name || order.shippingAddress?.fullName || "Customer"}</strong>
                  <span>{order.customer?.email || "Email not available"}</span>
                  <span>{order.customer?.mobile || order.shippingAddress?.mobile || "Mobile not available"}</span>
                </div>
              </div>
            </section>

            <section className="ao-card">
              <div className="ao-head">
                <div>
                  <div className="ao-eyebrow">PAYMENT</div>
                  <h2>Payment summary</h2>
                </div>
                <CreditCard size={20} />
              </div>

              <div className="ao-money">
                <div className="ao-money-row"><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div>
                <div className="ao-money-row"><span>Delivery</span><strong>{totals.shipping ? money(totals.shipping) : "FREE"}</strong></div>
                {totals.tax > 0 && <div className="ao-money-row"><span>Tax</span><strong>{money(totals.tax)}</strong></div>}
                {totals.discount > 0 && <div className="ao-money-row"><span>Discount</span><strong>-{money(totals.discount)}</strong></div>}
                <div className="ao-total"><span>Grand total</span><strong>{money(totals.total)}</strong></div>
              </div>

              <div style={{ marginTop: 15, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#85888d" }}>
                  {titleCase(order.paymentMethod || "Online Payment")}
                </span>
                <StatusBadge status={String(order.paymentStatus || "PENDING").toUpperCase()} />
              </div>
            </section>

            <section className="ao-card">
              <div className="ao-head">
                <div>
                  <div className="ao-eyebrow">ADMIN ACTION</div>
                  <h2>Update order</h2>
                  <p>Status changes are recorded in order history.</p>
                </div>
                <Save size={20} />
              </div>

              <div className="ao-fields">
                <div className="ao-field">
                  <label>Order status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{titleCase(status)}</option>
                    ))}
                  </select>
                </div>

                <div className="ao-field">
                  <label>Carrier</label>
                  <input
                    value={form.carrier}
                    onChange={(e) => updateField("carrier", e.target.value)}
                    placeholder="DHL, FedEx, India Post..."
                  />
                </div>

                <div className="ao-field">
                  <label>Tracking number</label>
                  <input
                    value={form.trackingNumber}
                    onChange={(e) => updateField("trackingNumber", e.target.value)}
                    placeholder="Tracking / AWB number"
                  />
                </div>

                <div className="ao-field">
                  <label>Estimated delivery</label>
                  <input
                    type="date"
                    value={form.estimatedDelivery}
                    onChange={(e) => updateField("estimatedDelivery", e.target.value)}
                  />
                </div>

                <div className="ao-field">
                  <label>Internal status note</label>
                  <textarea
                    value={form.note}
                    onChange={(e) => updateField("note", e.target.value)}
                    placeholder="Optional note for this status change"
                  />
                </div>

                <button className="ao-update" disabled={saving} onClick={saveStatus}>
                  {saving ? <RefreshCw className="ao-spin" size={15} /> : <Save size={15} />}
                  {saving ? "Updating..." : "Update order"}
                </button>
              </div>
            </section>

            <section className="ao-card" style={{ background: "#fffdf4" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <ShieldCheck size={19} color="#8a6a0b" />
                <div>
                  <strong style={{ fontSize: 12 }}>Admin-controlled order flow</strong>
                  <p style={{ margin: "5px 0 0", color: "#777", fontSize: 11, lineHeight: 1.5 }}>
                    Customer-facing order status and notifications are updated from the server after a successful status change.
                  </p>
                </div>
              </div>
            </section>

            <div className="ao-actions">
              <Link to="/admin/orders" className="ao-secondary">
                <ArrowLeft size={15} /> All orders
              </Link>
              <button onClick={loadOrder} className="ao-secondary">
                <RefreshCw size={15} /> Refresh
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
