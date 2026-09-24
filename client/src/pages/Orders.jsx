import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/http.js";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";
import OrderTimeline from "../components/OrderTimeline.jsx";
import {
  ArrowLeft,
  Package,
  Truck,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

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

export default function Orders() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    API.get("/orders/mine")
      .then((r) => {
        if (mounted) {
          setOrders(r.data?.data?.items || []);
        }
      })
      .catch(() => {
        if (mounted) setOrders([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        withCredentials: true,
      }
    );

    if (user) {
      socket.emit("join:user", user.id);

      socket.on("order:statusChanged", ({ order }) => {
        setOrders((current) =>
          current.map((item) =>
            item._id === order._id ? order : item
          )
        );
      });

      socket.on("order:cancelled", (order) => {
        setOrders((current) =>
          current.map((item) =>
            item._id === order._id ? order : item
          )
        );
      });
    }

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [user]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatStatus = (status = "") =>
    status.replaceAll("_", " ");

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();
    if (value === "delivered") return "delivered";
    if (value === "cancelled") return "cancelled";
    if (value === "out_for_delivery") return "shipping";
    if (value === "shipped") return "shipping";
    if (value === "packed") return "packed";
    return "processing";
  };

  return (
    <main className="bkOrdersPage">
      <TheaterPreloader />
      <div className="bkOrdersContainer">
        
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => nav(-1)}
          className="bkBackBtn"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* ACCOUNT NAV */}
        <div className="accountNav" style={{ marginBottom: 20, overflowX: "auto", whiteSpace: "nowrap" }}>
          <Link to="/profile">Profile</Link>
          <Link to="/addresses">Addresses</Link>
          <Link className="active" to="/orders">Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        {/* PAGE HEADER */}
        <section className="panel" style={{ marginBottom: 18, background: "linear-gradient(135deg, #ffffff 0%, #faf9f3 65%, #fff8d6 100%)" }}>
          <span className="eyebrow">ACCOUNT</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginTop: 7 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 36px)" }}>My orders</h1>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 12 }}>
                View your purchases and track delivery status in real time.
              </p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#edf7f1", color: "var(--green)", borderRadius: 9, padding: "8px 11px", fontSize: 9, fontWeight: 900 }}>
              <RefreshCw size={13} /> REALTIME UPDATES
            </div>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <section className="panel" style={{ textAlign: "center", padding: "55px 20px" }}>
            <RefreshCw size={26} style={{ animation: "ordersSpin 1s linear infinite" }} />
            <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: 12 }}>Loading your orders...</p>
          </section>
        )}

        {/* EMPTY */}
        {!loading && orders.length === 0 && (
          <section className="panel" style={{ textAlign: "center", padding: "65px 25px" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#fff7d6", display: "grid", placeItems: "center", margin: "0 auto 17px" }}>
              <ShoppingBag size={30} />
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: 21 }}>No orders yet</h2>
            <p style={{ maxWidth: 390, margin: "0 auto 22px", color: "var(--muted)", fontSize: 12, lineHeight: 1.6 }}>
              You haven't placed any orders yet. Explore our collection and discover your favourite traditional foods.
            </p>
            <Link to="/products" className="primary" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <ShoppingBag size={16} /> Shop now
            </Link>
          </section>
        )}

        {/* ORDERS LIST */}
        {!loading && orders.length > 0 && (
          <div style={{ display: "grid", gap: 16 }}>
            {orders.map((order) => {
              const statusClass = getStatusClass(order.orderStatus);

              return (
                <article className="panel bkOrderCardItem" key={order._id}>
                  
                  {/* TOP HEADER */}
                  <div className="cardTopRow">
                    <div>
                      <span className="orderNumberText">{order.orderNumber}</span>
                      <span className="orderDateText">Ordered on {formatDate(order.createdAt)}</span>
                    </div>
                    <span className={`statusPillBadge ${statusClass}`}>
                      {formatStatus(order.orderStatus)}
                    </span>
                  </div>

                  {/* ITEMS PREVIEW */}
                  <div className="cardItemsSection">
                    {order.items?.map((item, index) => (
                      <div className="itemRowPreview" key={index}>
                        <span>{item.quantity}x {item.name}</span>
                        <strong>₹{Number(item.price * item.quantity).toFixed(0)}</strong>
                      </div>
                    ))}
                  </div>

                  {/* MILESTONE JOURNEY TIMELINE (RESTORED EXACTLY) */}
                  <div className="timelineSectionBox">
                    <OrderTimeline status={order.orderStatus} />
                  </div>

                  {/* FOOTER */}
                  <div className="cardBottomFooter">
                    <div className="amtBlock">
                      <span>Total Amount</span>
                      <strong>₹{Number(order.grandTotal || 0).toFixed(2)}</strong>
                    </div>

                    <div className="actionButtonsGroup">
                      <Link to={`/orders/${order._id}`} className="secondaryBtnItem">
                        Details
                      </Link>
                      <Link to={`/orders/${order._id}/track`} className="primaryBtnItem">
                        <Truck size={14} /> Track Live
                      </Link>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .bkOrdersPage { min-height: 85vh; background: #f3f4f6; padding: 24px 16px 80px; font-family: "DM Sans", sans-serif; }
        .bkOrdersContainer { max-width: 800px; margin: 0 auto; }
        .bkBackBtn { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e5e7eb; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; margin-bottom: 20px; }
        
        .bkOrderCardItem { background: #fff; border-radius: 20px; padding: 24px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e5e7eb; margin-bottom: 16px; }
        .cardTopRow { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 14px; }
        .orderNumberText { display: block; font-weight: 800; font-size: 16px; color: #111827; }
        .orderDateText { font-size: 12px; color: #6b7280; margin-top: 2px; display: block; }
        
        .statusPillBadge { padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; background: #fef3c7; color: #d97706; }
        .statusPillBadge.delivered { background: #dcfce7; color: #16a34a; }
        .statusPillBadge.cancelled { background: #fee2e2; color: #dc2626; }
        .statusPillBadge.shipping { background: #e0f2fe; color: #0284c7; }
        .statusPillBadge.packed { background: #ede9fe; color: #7c3aed; }

        .cardItemsSection { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #4b5563; margin-bottom: 16px; background: #f9fafb; padding: 14px; border-radius: 14px; border: 1px solid #f3f4f6; }
        .itemRowPreview { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; color: #374151; }
        
        .timelineSectionBox { margin: 20px 0; overflow-x: auto; }

        .cardBottomFooter { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 16px; flex-wrap: wrap; gap: 12px; }
        .amtBlock span { display: block; font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; }
        .amtBlock strong { font-size: 20px; color: #111827; font-weight: 900; }
        
        .actionButtonsGroup { display: flex; gap: 10px; }
        .secondaryBtnItem { padding: 10px 20px; background: #f3f4f6; color: #374151; border-radius: 12px; font-weight: 700; font-size: 13px; text-decoration: none; transition: background 0.2s; }
        .secondaryBtnItem:hover { background: #e5e7eb; }
        .primaryBtnItem { padding: 10px 20px; background: #9e1017; color: #fff; border-radius: 12px; font-weight: 700; font-size: 13px; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
        .primaryBtnItem:hover { background: #7a0c12; }

        @keyframes ordersSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}