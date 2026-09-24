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
    // <div className={`rrTheaterCurtain ${!loading ? "isOpen" : ""}`} aria-hidden="true">
    //   <div className="rrClothHalf rrClothLeft"><div className="rrClothFolds" /></div>
    //   <div className="rrClothHalf rrClothRight"><div className="rrClothFolds" /></div>
    //   <div className="rrCurtainLogoBox">
    //     <img src="/logo.png" alt="RR MASALA" className="rrCurtainLogoImg" />
    //     <div className="rrCurtainLoader" />
    //   </div>

    //   <style>{`
    //     .rrTheaterCurtain { position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: flex; align-items: center; justify-content: center; pointer-events: none; }
    //     .rrClothHalf { position: absolute; top: 0; bottom: 0; width: 50%; background: #ffffff; box-shadow: inset 0 0 40px rgba(0,0,0,0.05); transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1) 0.3s; will-change: transform; }
    //     .rrClothLeft { left: 0; transform-origin: left; border-right: 1px solid rgba(0,0,0,0.05); }
    //     .rrClothRight { right: 0; transform-origin: right; border-left: 1px solid rgba(0,0,0,0.05); }
    //     .rrClothFolds { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.03) 10%, transparent 20%); }
    //     .rrTheaterCurtain.isOpen .rrClothLeft { transform: translateX(-100%); }
    //     .rrTheaterCurtain.isOpen .rrClothRight { transform: translateX(100%); }
    //     .rrCurtainLogoBox { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 15px; transition: opacity 0.3s ease; }
    //     .rrTheaterCurtain.isOpen .rrCurtainLogoBox { opacity: 0; }
    //     .rrCurtainLogoImg { height: 190px; object-fit: contain; }
    //     .rrCurtainLoader { width: 120px; height: 2px; background: rgba(0,0,0,0.1); position: relative; overflow: hidden; }
    //     .rrCurtainLoader::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: #fbb034; animation: rrTheaterLoad 1.2s ease-in-out forwards; }
    //     @keyframes rrTheaterLoad { 0% { left: -100%; } 100% { left: 0; } }
    //   `}</style>
    // </div>
    <div></div>
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
        setOrders((current) => current.map((item) => item._id === order._id ? order : item));
      });
      socket.on("order:cancelled", (order) => {
        setOrders((current) => current.map((item) => item._id === order._id ? order : item));
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

  const formatStatus = (status = "") => status.replaceAll("_", " ");

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
    <main className="accountPage rrOrdersPage">
      <TheaterPreloader />
      <div className="rrOrdersContainer">
        
        {/* BACK BUTTON */}
        <button type="button" onClick={() => nav(-1)} className="rrBackBtn">
          <ArrowLeft size={16} /> Back
        </button>

        {/* ACCOUNT NAV (SMOOTH HORIZONTAL SCROLL) */}
        <div className="rrAccountNavList">
          <Link to="/profile">Profile</Link>
          <Link to="/addresses">Addresses</Link>
          <Link className="active" to="/orders">Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        {/* PAGE HEADER */}
        <section className="rrPageHeaderCard">
          <div>
            <span className="rrEyebrow">ACCOUNT</span>
            <h1 className="rrPageTitle">My Orders</h1>
            <p className="rrPageSubText">
              View your purchases and track delivery status in real time.
            </p>
          </div>
          <div className="rrUpdateBadge">
            <RefreshCw size={14} /> REALTIME UPDATES
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <section className="rrLoadingCard">
            <RefreshCw size={26} className="rrSpinIcon" />
            <p>Loading your orders...</p>
          </section>
        )}

        {/* EMPTY STATE */}
        {!loading && orders.length === 0 && (
          <section className="rrEmptyCard">
            <div className="rrEmptyIconBox">
              <ShoppingBag size={30} color="var(--rr-maroon, #9e1017)" />
            </div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Explore our collection and discover your favourite traditional foods.</p>
            <Link to="/products" className="rrShopNowBtn">
              <ShoppingBag size={16} /> Shop now
            </Link>
          </section>
        )}

        {/* ORDERS LIST */}
        {!loading && orders.length > 0 && (
          <div className="rrOrdersListGrid">
            {orders.map((order) => {
              const statusClass = getStatusClass(order.orderStatus);

              return (
                <article className="bkOrderCardItem" key={order._id}>
                  
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

                  {/* MILESTONE JOURNEY TIMELINE */}
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
        .rrOrdersPage { padding-top: 32px; padding-bottom: 60px; background: #fbf7ef; min-height: 100vh; font-family: "DM Sans", sans-serif; }
        .rrOrdersContainer { width: min(1200px, 92%); margin: 0 auto; }
        
        .rrBackBtn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--rr-border, #e5b900); background: #fff; border-radius: 10px; padding: 10px 16px; font-weight: 800; font-size: 12px; cursor: pointer; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all 0.3s ease; }
        
        /* HORIZONTAL SCROLL NAV TABS FIX */
        .rrAccountNavList { display: flex; gap: 12px; margin-bottom: 24px; overflow-x: auto; white-space: nowrap; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .rrAccountNavList::-webkit-scrollbar { display: none; }
        .rrAccountNavList a { flex-shrink: 0; padding: 10px 20px; background: #fff; color: #140d0b; border: 1px solid var(--rr-border, #e5b900); border-radius: 30px; font-weight: 800; font-size: 13px; text-decoration: none; transition: all 0.2s ease; }
        .rrAccountNavList a.active { background: var(--rr-maroon, #9e1017); color: #fff; border-color: var(--rr-maroon, #9e1017); }

        /* HEADER CARD */
        .rrPageHeaderCard { background: #fff; border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
        .rrEyebrow { font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: var(--rr-maroon, #9e1017); display: block; }
        .rrPageTitle { margin: 6px 0 4px; font-family: 'Cormorant Garamond', serif; font-size: clamp(26px, 4vw, 36px); font-weight: 700; color: #140d0b; }
        .rrPageSubText { margin: 0; color: #5e514c; font-size: 13px; }
        .rrUpdateBadge { display: inline-flex; align-items: center; gap: 8px; background: #edf7f1; color: #2e7d32; padding: 8px 14px; border-radius: 20px; font-size: 11px; font-weight: 900; letter-spacing: 0.5px; }

        .rrLoadingCard { background: #fff; border-radius: 24px; padding: 55px 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); }
        .rrSpinIcon { color: var(--rr-maroon, #9e1017); animation: ordersSpin 1s linear infinite; }
        .rrLoadingCard p { margin: 14px 0 0; color: #5e514c; font-size: 13px; }

        .rrEmptyCard { background: #fff; border-radius: 24px; padding: 65px 25px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); }
        .rrEmptyIconBox { width: 68px; height: 68px; border-radius: 50%; background: #fdf3e8; display: grid; place-items: center; margin: 0 auto 17px; }
        .rrEmptyCard h2 { margin: 0 0 8px; font-size: 21px; font-family: 'Cormorant Garamond', serif; font-weight: 700; color: #140d0b; }
        .rrEmptyCard p { max-width: 390px; margin: 0 auto 22px; color: #5e514c; font-size: 13px; line-height: 1.6; }
        .rrShopNowBtn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22); color: #fff; border-radius: 14px; font-weight: 800; font-size: 14px; padding: 12px 24px; text-decoration: none; box-shadow: 0 8px 20px rgba(158, 16, 23, 0.25); transition: transform 0.2s ease; }
        .rrShopNowBtn:hover { transform: translateY(-2px); }

        .rrOrdersListGrid { display: grid; gap: 20px; }

        /* Order Card Styling */
        .bkOrderCardItem { background: #fff; border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); }
        .cardTopRow { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; }
        .orderNumberText { display: block; font-weight: 800; font-size: 18px; color: #140d0b; }
        .orderDateText { font-size: 13px; color: #5e514c; margin-top: 4px; display: block; }
        
        .statusPillBadge { padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; background: #fef3c7; color: #d97706; }
        .statusPillBadge.delivered { background: #edf7f1; color: #2e7d32; }
        .statusPillBadge.cancelled { background: #fee2e2; color: #dc2626; }
        .statusPillBadge.shipping { background: #e0f2fe; color: #0284c7; }
        .statusPillBadge.packed { background: #ede9fe; color: #7c3aed; }

        .cardItemsSection { display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: #4b5563; margin-bottom: 20px; background: #faf9f4; padding: 16px; border-radius: 14px; border: 1px solid #eee; }
        .itemRowPreview { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; color: #140d0b; }
        
        .timelineSectionBox { margin: 24px 0; overflow-x: auto; }

        .cardBottomFooter { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 20px; flex-wrap: wrap; gap: 16px; }
        .amtBlock span { display: block; font-size: 11px; color: #8a7c75; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
        .amtBlock strong { font-size: 22px; color: #140d0b; font-weight: 900; }
        
        .actionButtonsGroup { display: flex; gap: 12px; }
        .secondaryBtnItem { padding: 12px 24px; background: #faf9f4; border: 1px solid #ddd; color: #140d0b; border-radius: 12px; font-weight: 800; font-size: 13px; text-decoration: none; transition: background 0.2s; }
        .secondaryBtnItem:hover { background: #f0eee9; }
        .primaryBtnItem { padding: 12px 24px; background: linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22); color: #fff; border-radius: 12px; font-weight: 800; font-size: 13px; text-decoration: none; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(158, 16, 23, 0.2); transition: transform 0.2s; border: none; }
        .primaryBtnItem:hover { transform: translateY(-2px); }

        @keyframes ordersSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Responsive Fixes */
        @media (max-width: 600px) {
          .rrOrdersContainer { width: 95%; }
          .rrPageHeaderCard { padding: 24px; flex-direction: column; align-items: flex-start; gap: 14px; }
          .bkOrderCardItem { padding: 24px; }
          .cardTopRow { flex-direction: column; gap: 12px; }
          .cardBottomFooter { flex-direction: column; align-items: flex-start; }
          .actionButtonsGroup { width: 100%; display: flex; }
          .actionButtonsGroup a { flex: 1; justify-content: center; }
        }
      `}</style>
    </main>
  );
}