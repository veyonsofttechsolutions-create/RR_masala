import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../api/http.js";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";
import { ArrowLeft, Car, Truck, RefreshCw, Package, Hash, CalendarDays, MapPin, Phone, ChevronRight } from "lucide-react";
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

export default function TrackOrder() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    API.get("/orders/" + id)
      .then((r) => { if (mounted) setOrder(r.data?.data?.order || r.data?.data || null); })
      .catch(() => { if (mounted) setOrder(null); })
      .finally(() => { if (mounted) setLoading(false); });

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { withCredentials: true });
    if (user) {
      socket.emit("join:user", user.id);
      socket.on("order:statusChanged", ({ order: updatedOrder }) => {
        if (updatedOrder?._id === id) setOrder(updatedOrder);
      });
    }
    return () => { mounted = false; socket.disconnect(); };
  }, [id, user]);

  const formatStatus = (status = "") => status.replaceAll("_", " ");
  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) return <main className="bkTrackPage"><TheaterPreloader /><div className="bkLoadBox"><RefreshCw className="spin" size={28}/><p>Loading Tracker...</p></div></main>;
  if (!order) return <main className="bkTrackPage"><TheaterPreloader /><div className="bkTrackContainer"><button type="button" onClick={() => nav(-1)} className="bkBackBtn"><ArrowLeft size={16} /> Back</button><div className="bkLoadBox"><h3>Order not found</h3><Link to="/orders" className="btnSolid">View My Orders</Link></div></div></main>;

  const status = order.orderStatus || "PENDING";
  const steps = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentIdx = steps.indexOf(status);
  const progressPercent = currentIdx === -1 ? 10 : Math.min(100, Math.max(5, (currentIdx / (steps.length - 1)) * 100));

  return (
    <main className="bkTrackPage">
      <TheaterPreloader />
      <div className="bkTrackContainer">
        <button type="button" onClick={() => nav(-1)} className="bkBackBtn">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bkTrackHeader">
          <div>
            <h2>Live Order Tracking</h2>
            <span className="ordNumberTag">Order #{order.orderNumber}</span>
          </div>
          <span className={`statusPill ${status.toLowerCase()}`}>
            {formatStatus(status)}
          </span>
        </div>

        {/* LIVE CAR ANIMATION TRACKER */}
        <div className="bkLiveCard">
          <div className="statusTopTitle">
            <span className="liveDot" />
            <strong>Real-time Dispatch Status</strong>
          </div>

          <div className="trackAnimationStage">
            <div className="roadLine">
              <div className="carMovingIcon" style={{ left: `${progressPercent}%` }}>
                <Car size={30} color="#9e1017" />
                <div className="pulseRing" />
              </div>
            </div>
            <div className="stagesMarkers">
              <div className={`marker ${currentIdx >= 0 ? "done" : ""}`}><span>Placed</span></div>
              <div className={`marker ${currentIdx >= 3 ? "done" : ""}`}><span>Packed</span></div>
              <div className={`marker ${currentIdx >= 5 ? "done" : ""}`}><span>On the way</span></div>
              <div className={`marker ${currentIdx >= 6 ? "done" : ""}`}><span>Delivered</span></div>
            </div>
          </div>
        </div>

        <div className="bkCardSection">
          <h3>Milestone Journey</h3>
          <OrderTimeline status={order.orderStatus} />
        </div>

        <div className="bkCardSection">
          <h3>Shipment Details</h3>
          <div className="trackingGrid">
            <div className="trackingInfoCard">
              <div className="trackingIcon"><Package size={18} /></div>
              <div><span>Current Status</span><b style={{ textTransform: "capitalize" }}>{formatStatus(status)}</b></div>
            </div>
            <div className="trackingInfoCard">
              <div className="trackingIcon"><Truck size={18} /></div>
              <div><span>Courier Partner</span><b>{order.carrier || "Express Courier"}</b></div>
            </div>
            <div className="trackingInfoCard">
              <div className="trackingIcon"><Hash size={18} /></div>
              <div><span>Tracking Number</span><b>{order.trackingNumber || "Pending"}</b></div>
            </div>
            <div className="trackingInfoCard">
              <div className="trackingIcon"><CalendarDays size={18} /></div>
              <div><span>Estimated Arrival</span><b>{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "Soon"}</b></div>
            </div>
          </div>
        </div>

        <div className="bkTrackActions">
          <Link to={`/orders/${order._id}`} className="secondaryBtn">View Details <ChevronRight size={16} /></Link>
          <Link to="/orders" className="primaryBtn">All Orders</Link>
        </div>

      </div>

      <style>{`
        .bkTrackPage { min-height: 85vh; background: #f3f4f6; padding: 24px 16px 80px; font-family: "DM Sans", sans-serif; }
        .bkTrackContainer { max-width: 800px; margin: 0 auto; }
        .bkBackBtn { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e5e7eb; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; margin-bottom: 20px; }
        .bkTrackHeader { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; background: #fff; padding: 20px 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .bkTrackHeader h2 { margin: 0; font-size: 22px; font-weight: 800; color: #111827; }
        .ordNumberTag { font-size: 13px; font-weight: 700; color: #9e1017; margin-top: 4px; display: block; }
        
        .statusPill { padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; background: #fef3c7; color: #d97706; }
        .statusPill.delivered { background: #dcfce7; color: #16a34a; }
        .statusPill.cancelled { background: #fee2e2; color: #dc2626; }

        .bkLiveCard, .bkCardSection { background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 20px; border: 1px solid #e5e7eb; }
        .statusTopTitle { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 15px; color: #111827; }
        .liveDot { width: 10px; height: 10px; background: #16a34a; border-radius: 50%; box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.2); animation: pulseDot 1.5s infinite; }
        @keyframes pulseDot { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }

        .trackAnimationStage { margin: 50px 10px 30px; position: relative; }
        .roadLine { width: 100%; height: 6px; background: #e5e7eb; border-radius: 99px; position: relative; }
        .carMovingIcon { position: absolute; top: -17px; transform: translateX(-50%); transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; align-items: center; }
        .pulseRing { position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(158, 16, 23, 0.15); animation: pingRing 1.5s infinite; z-index: -1; }
        @keyframes pingRing { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }
        
        .stagesMarkers { display: flex; justify-content: space-between; margin-top: 16px; font-size: 12px; font-weight: 700; color: #9ca3af; }
        .stagesMarkers .marker.done { color: #111827; }

        .bkCardSection h3 { margin: 0 0 16px; font-size: 16px; font-weight: 800; color: #111827; }
        .trackingGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .trackingInfoCard { display: flex; align-items: center; gap: 14px; padding: 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb; }
        .trackingIcon { width: 38px; height: 38px; flex-shrink: 0; display: grid; place-items: center; border-radius: 10px; background: #fdf2f2; color: #9e1017; }
        .trackingInfoCard span { display: block; color: #6b7280; font-size: 11px; margin-bottom: 2px; }
        .trackingInfoCard b { display: block; font-size: 13px; color: #111827; }

        .bkTrackActions { display: flex; gap: 12px; margin-top: 24px; }
        .secondaryBtn, .primaryBtn { flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 14px; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .secondaryBtn { background: #fff; border: 1px solid #d1d5db; color: #374151; }
        .primaryBtn { background: #9e1017; color: #fff; }
        
        .bkLoadBox { background: #fff; padding: 80px 20px; border-radius: 20px; text-align: center; font-weight: 700; color: #6b7280; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media(max-width: 650px) {
          .trackingGrid { grid-template-columns: 1fr; }
          .bkTrackActions { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}