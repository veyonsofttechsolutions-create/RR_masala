import { useEffect, useMemo, useState } from "react";
import { API } from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  ExternalLink,
  Image as ImageIcon,
  IndianRupee,
  LayoutDashboard,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  Tags,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

/* BRAND LOGO ASSET FROM INFO PAGE */
const ASSETS = {
  logo: "/WhatsApp Image 2026-09-17 at 3.09.40 AM.jpeg"
};

/* WHITE CLOTH THEATER PRELOADER FROM INFO PAGE */
function TheaterPreloader() {
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    const removeTimer = setTimeout(() => {
      setRender(false);
    }, 2400);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!render) return null;

  return (
    <div className={`rrTheaterCurtain ${!loading ? "isOpen" : ""}`} aria-hidden="true">
      <div className="rrClothHalf rrClothLeft">
        <div className="rrClothFolds" />
      </div>
      <div className="rrClothHalf rrClothRight">
        <div className="rrClothFolds" />
      </div>
      
      <div className="rrCurtainLogoBox">
        <img src={ASSETS.logo} alt="RR MASALA" className="rrCurtainLogoImg" />
        <div className="rrCurtainLoader" />
      </div>
    </div>
  );
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function unwrap(response) {
  return response?.data?.data || response?.data || {};
}

function firstArray(...values) {
  return values.find(Array.isArray) || [];
}

function normalizeTrend(raw, recent = []) {
  const source = firstArray(
    raw?.salesTrend,
    raw?.revenueTrend,
    raw?.salesByDay,
    raw?.revenueByDay,
    raw?.dailySales,
    raw?.trend,
    raw?.charts?.sales,
    raw?.charts?.revenue
  );

  if (source.length) {
    return source.map((item, index) => ({
      label:
        item.label ||
        item.date ||
        item.day ||
        `Day ${index + 1}`,
      value: Number(
        item.value ??
          item.sales ??
          item.revenue ??
          item.total ??
          item.amount ??
          0
      ),
    }));
  }

  const buckets = {};
  recent.forEach((order) => {
    const dateValue = order.createdAt || order.orderDate;
    if (!dateValue) return;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return;

    const key = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    buckets[key] =
      (buckets[key] || 0) +
      Number(order.grandTotal || order.total || 0);
  });

  return Object.entries(buckets)
    .slice(-7)
    .map(([label, value]) => ({ label, value }));
}

function normalizeStatuses(raw, recent = []) {
  const source = firstArray(
    raw?.orderStatus,
    raw?.orderStatuses,
    raw?.ordersByStatus,
    raw?.statusBreakdown,
    raw?.charts?.orderStatus
  );

  if (source.length) {
    return source
      .map((item) => ({
        label: String(
          item.label ||
            item.status ||
            item.name ||
            "Unknown"
        ).replaceAll("_", " "),
        value: Number(
          item.value ??
            item.count ??
            item.orders ??
            0
        ),
      }))
      .filter((item) => item.value >= 0);
  }

  const map = {};
  recent.forEach((order) => {
    const status = order.orderStatus || "pending";
    map[status] = (map[status] || 0) + 1;
  });

  return Object.entries(map).map(([label, value]) => ({
    label: label.replaceAll("_", " "),
    value,
  }));
}

function normalizeTopProducts(raw) {
  const source = firstArray(
    raw?.topProducts,
    raw?.bestSellingProducts,
    raw?.products,
    raw?.charts?.topProducts
  );

  return source
    .map((item) => ({
      label:
        item.name ||
        item.productName ||
        item.label ||
        "Product",
      value: Number(
        item.value ??
          item.quantity ??
          item.unitsSold ??
          item.sales ??
          item.revenue ??
          0
      ),
    }))
    .filter((item) => item.value >= 0)
    .slice(0, 6);
}

function LineChart({ data }) {
  if (!data.length) {
    return (
      <div className="chartEmpty">
        <TrendingUp size={22} />
        <strong>No sales trend data</strong>
        <span>Connect analytics endpoint to display historical sales.</span>
      </div>
    );
  }

  const width = 760;
  const height = 260;
  const pad = { top: 20, right: 20, bottom: 40, left: 48 };
  const max = Math.max(...data.map((item) => item.value), 1);
  const step =
    data.length === 1
      ? 0
      : (width - pad.left - pad.right) / (data.length - 1);

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? width / 2
        : pad.left + step * index;
    const y =
      height -
      pad.bottom -
      (item.value / max) *
        (height - pad.top - pad.bottom);

    return { ...item, x, y };
  });

  const line = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const area =
    `${line} L ${points.at(-1).x} ${height - pad.bottom}` +
    ` L ${points[0].x} ${height - pad.bottom} Z`;

  return (
    <div className="chartCanvas">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Sales trend chart">
        {[0, 1, 2, 3, 4].map((row) => {
          const y =
            pad.top +
            ((height - pad.top - pad.bottom) / 4) * row;

          return (
            <line
              key={row}
              x1={pad.left}
              x2={width - pad.right}
              y1={y}
              y2={y}
              className="chartGrid"
            />
          );
        })}

        <path d={area} className="chartArea" />
        <path d={line} className="chartLine" />

        {points.map((point) => (
          <g key={`${point.label}-${point.x}`}>
            <circle cx={point.x} cy={point.y} r="4" className="chartPoint" />
            <text x={point.x} y={height - 15} textAnchor="middle" className="chartLabel">
              {String(point.label).slice(0, 9)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function StatusBars({ data }) {
  if (!data.length) {
    return (
      <div className="chartEmpty compact">
        <BarChart3 size={21} />
        <strong>No order-status data</strong>
      </div>
    );
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="statusBars">
      {data.slice(0, 7).map((item) => (
        <div className="statusRow" key={item.label}>
          <div className="statusRowTop">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="statusTrack">
            <span
              style={{
                width: `${Math.max(
                  3,
                  (item.value / max) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductBars({ data }) {
  if (!data.length) {
    return (
      <div className="chartEmpty compact">
        <Package size={21} />
        <strong>No product analytics data</strong>
      </div>
    );
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="productBars">
      {data.map((item) => (
        <div className="productBarRow" key={item.label}>
          <div className="productBarMeta">
            <span title={item.label}>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="productBarTrack">
            <span
              style={{
                width: `${Math.max(
                  4,
                  (item.value / max) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const load = async (refresh = false) => {
    try {
      setError("");
      refresh ? setRefreshing(true) : setLoading(true);

      const [dashboardResponse, analyticsResponse] =
        await Promise.all([
          API.get("/admin/dashboard"),
          API.get("/admin/analytics").catch(() => ({
            data: { data: {} },
          })),
        ]);

      setDashboard(unwrap(dashboardResponse));
      setAnalytics(unwrap(analyticsResponse));
    } catch (requestError) {
      console.error("ADMIN DASHBOARD ERROR:", requestError);
      setError(
        requestError?.response?.data?.message ||
          "Unable to load the admin dashboard."
      );

      if (
        requestError?.response?.status === 401 ||
        requestError?.response?.status === 403
      ) {
        nav("/admin/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const recent = useMemo(
    () => firstArray(dashboard?.recent, dashboard?.recentOrders),
    [dashboard]
  );

  const trend = useMemo(
    () => normalizeTrend(analytics, recent),
    [analytics, recent]
  );

  const statuses = useMemo(
    () => normalizeStatuses(analytics, recent),
    [analytics, recent]
  );

  const topProducts = useMemo(
    () => normalizeTopProducts(analytics),
    [analytics]
  );

  const stats = [
    {
      icon: IndianRupee,
      label: "Revenue",
      value: money(
        dashboard?.sales ??
          dashboard?.revenue ??
          analytics?.totalSales ??
          0
      ),
      note: "Recorded sales",
      tone: "gold",
    },
    {
      icon: ShoppingBag,
      label: "Orders",
      value: Number(
        dashboard?.orders ??
          dashboard?.totalOrders ??
          0
      ).toLocaleString("en-IN"),
      note: "Total orders",
      tone: "blue",
    },
    {
      icon: Users,
      label: "Customers",
      value: Number(
        dashboard?.customers ??
          dashboard?.totalCustomers ??
          0
      ).toLocaleString("en-IN"),
      note: "Registered customers",
      tone: "green",
    },
    {
      icon: Package,
      label: "Products",
      value: Number(
        dashboard?.products ??
          dashboard?.totalProducts ??
          0
      ).toLocaleString("en-IN"),
      note: "Catalogue products",
      tone: "purple",
    },
    {
      icon: AlertTriangle,
      label: "Low stock",
      value: Number(dashboard?.lowStock || 0).toLocaleString("en-IN"),
      note:
        Number(dashboard?.lowStock || 0) > 0
          ? "Needs attention"
          : "Stock looks healthy",
      tone: "red",
    },
  ];

  if (loading) {
    return (
      <main className="adminLoadingPage">
        <TheaterPreloader />
        <div className="adminLoadingCard">
          <img src={ASSETS.logo} alt="RR MASALA" className="adminLoadingLogoImg" />
          <div className="spinner" />
          <strong>Loading control center</strong>
          <span>Preparing your store analytics...</span>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="adminLoadingPage">
        <div className="adminLoadingCard">
          <AlertTriangle size={28} />
          <strong>Dashboard unavailable</strong>
          <span>{error || "Please try again."}</span>
          <button className="adminPrimaryBtn" onClick={() => load()}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="adminDashboardModern">
      <TheaterPreloader />
      <style>{`
        .adminDashboardModern {
          min-height: 100vh;
          background: #f8f9fa;
          color: #140d0b;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 60px;
        }

        /* THEATER PRELOADER STYLES FROM INFO PAGE */
        .rrTheaterCurtain {
          position: fixed !important;
          inset: 0 !important;
          z-index: 999999 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .rrClothHalf {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          background: #ffffff;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.05);
          transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1) 0.2s;
          will-change: transform;
        }

        .rrClothLeft {
          left: 0;
          transform-origin: left;
          border-right: 1px solid rgba(0,0,0,0.05);
        }

        .rrClothRight {
          right: 0;
          transform-origin: right;
          border-left: 1px solid rgba(0,0,0,0.05);
        }

        .rrClothFolds {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0%,
            rgba(0,0,0,0.03) 10%,
            transparent 20%
          );
        }

        .rrTheaterCurtain.isOpen .rrClothLeft {
          transform: translateX(-100%);
        }

        .rrTheaterCurtain.isOpen .rrClothRight {
          transform: translateX(100%);
        }

        .rrCurtainLogoBox {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          transition: opacity 0.3s ease;
        }

        .rrTheaterCurtain.isOpen .rrCurtainLogoBox {
          opacity: 0;
        }

        .rrCurtainLogoImg {
          height: 60px;
          object-fit: contain;
          animation: rrCurtainPulse 1.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
        }

        .rrCurtainLoader {
          width: 120px;
          height: 2px;
          background: rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        .rrCurtainLoader::before {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: #fbb034;
          animation: rrTheaterLoad 1.5s ease-in-out forwards;
        }

        @keyframes rrTheaterLoad {
          0% { left: -100%; }
          100% { left: 0; }
        }
        @keyframes rrCurtainPulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          100% { transform: scale(1.05); opacity: 1; }
        }

        .adminHeaderModern {
          background: #fff;
          border-bottom: 1px solid rgba(158,16,23,0.1);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .adminBrandModern {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .adminBrandBadge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f39200, #c41a22);
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 16px;
        }

        .adminBrandModern strong {
          display: block;
          font-size: 15px;
          letter-spacing: 0.5px;
          color: #140d0b;
        }

        .adminBrandModern span {
          display: block;
          font-size: 11px;
          color: #5e514c;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .adminHeaderNav {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
        }

        .adminHeaderNav a {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 750;
          color: #5e514c;
          text-decoration: none;
          transition: all 0.2s ease;
          background: #fbf7ef;
        }

        .adminHeaderNav a:hover,
        .adminHeaderNav a.active {
          background: #9e1017;
          color: #fff;
        }

        .adminContainerModern {
          width: min(1400px, 94%);
          margin: 32px auto 0;
        }

        .adminTopSection {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .adminTopSection h1 {
          margin: 6px 0 4px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 700;
        }

        .adminTopSection p {
          margin: 0;
          color: #5e514c;
          font-size: 14px;
        }

        .adminActionButtons {
          display: flex;
          gap: 12px;
        }

        .adminGhostBtn, .adminPrimaryBtn {
          height: 44px;
          padding: 0 20px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .adminGhostBtn {
          background: #fff;
          border: 1px solid #ddd;
          color: #140d0b;
        }

        .adminPrimaryBtn {
          background: linear-gradient(135deg, #9e1017, #c41a22);
          border: none;
          color: #fff;
          box-shadow: 0 6px 20px rgba(158,16,23,0.25);
        }

        .adminStatsGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }

        .adminStatCard {
          background: #fff;
          border-radius: 20px;
          padding: 22px;
          border: 1px solid rgba(158,16,23,0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          position: relative;
          overflow: hidden;
        }

        .adminStatIcon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
        }

        .adminStatCard.gold .adminStatIcon { background: #fff8e8; color: #b86b00; }
        .adminStatCard.blue .adminStatIcon { background: #edf4ff; color: #1e88e5; }
        .adminStatCard.green .adminStatIcon { background: #edf7f1; color: #2e7d32; }
        .adminStatCard.purple .adminStatIcon { background: #f3eefd; color: #7e57c2; }
        .adminStatCard.red .adminStatIcon { background: #fff0f1; color: #9e1017; }

        .adminStatCard span.label {
          display: block;
          color: #5e514c;
          font-size: 12px;
          font-weight: 750;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .adminStatCard strong.value {
          display: block;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #140d0b;
        }

        .adminStatCard span.note {
          display: block;
          color: #8a7c75;
          font-size: 11px;
          margin-top: 6px;
        }

        .analyticsGridModern {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .adminPanelModern {
          background: #fff;
          border-radius: 24px;
          padding: 28px;
          border: 1px solid rgba(158,16,23,0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        .panelHeaderModern {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 22px;
        }

        .panelHeaderModern h2 {
          margin: 4px 0 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 700;
        }

        .panelHeaderModern p {
          margin: 2px 0 0;
          color: #5e514c;
          font-size: 13px;
        }

        .eyebrowModern {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: #9e1017;
          text-transform: uppercase;
        }

        .livePillModern {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #edf7f1;
          color: #2e7d32;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 900;
        }

        .livePillModern i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2e7d32;
        }

        .chartCanvas { width: 100%; overflow: hidden; }
        .chartCanvas svg { display: block; width: 100%; height: auto; min-height: 260px; }
        .chartGrid { stroke: #f0eee9; stroke-width: 1; }
        .chartArea { fill: rgba(243,146,0,0.12); }
        .chartLine { fill: none; stroke: #f39200; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
        .chartPoint { fill: #fff; stroke: #f39200; stroke-width: 3.5; }
        .chartLabel { fill: #8a7c75; font-size: 11px; font-weight: 700; }

        .statusBars, .productBars { display: grid; gap: 16px; }
        .statusRowTop, .productBarMeta { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; font-weight: 700; color: #5e514c; }
        .statusTrack, .productBarTrack { height: 8px; border-radius: 999px; background: #fbf7ef; overflow: hidden; }
        .statusTrack span { display: block; height: 100%; background: #f39200; border-radius: inherit; }
        .productBarTrack span { display: block; height: 100%; background: #9e1017; border-radius: inherit; }

        .lowerGridModern {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .quickGridModern {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 16px;
        }

        .quickCardModern {
          background: #faf9f4;
          border: 1px solid rgba(158,16,23,0.06);
          border-radius: 16px;
          padding: 18px 14px;
          text-decoration: none;
          color: #140d0b;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quickCardModern:hover {
          transform: translateY(-3px);
          border-color: #f39200;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
        }

        .quickCardIcon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #fff;
          display: grid;
          place-items: center;
          color: #9e1017;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          margin-bottom: 4px;
        }

        .quickCardModern strong { font-size: 14px; font-weight: 800; }
        .quickCardModern span { font-size: 11px; color: #8a7c75; }

        .recentListModern { display: grid; gap: 12px; }
        .recentItemModern {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #faf9f4;
          border-radius: 14px;
          text-decoration: none;
          color: #140d0b;
          border: 1px solid rgba(158,16,23,0.05);
          transition: all 0.2s;
        }
        .recentItemModern:hover { background: #fff; border-color: #f39200; transform: translateX(4px); }
        .recentItemLeft { display: flex; align-items: center; gap: 14px; }
        .recentIconBox { width: 40px; height: 40px; border-radius: 10px; background: #fff; display: grid; place-items: center; color: #9e1017; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .recentItemLeft strong { display: block; font-size: 14px; }
        .recentItemLeft span { display: block; font-size: 12px; color: #8a7c75; margin-top: 2px; }
        .recentAmountModern { text-align: right; }
        .recentAmountModern strong { display: block; font-size: 15px; color: #9e1017; }
        .recentAmountModern span { display: block; font-size: 11px; font-weight: 700; color: #2e7d32; text-transform: capitalize; margin-top: 2px; }

        /* LOADING PAGE & LOGO */
        .adminLoadingPage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #ffffff;
        }

        .adminLoadingCard {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          z-index: 10;
        }

        .adminLoadingLogoImg {
          height: 60px;
          object-fit: contain;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
        }

        .adminLoadingCard .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(158,16,23,0.1);
          border-top-color: #9e1017;
          border-radius: 50%;
          animation: adminSpin 0.75s linear infinite;
        }

        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }

        .adminLoadingCard strong {
          font-size: 18px;
          font-weight: 800;
          color: #140d0b;
        }

        .adminLoadingCard span {
          color: #5e514c;
          font-size: 13px;
        }

        @media (max-width: 1200px) {
          .adminStatsGrid { grid-template-columns: repeat(3, 1fr); }
          .analyticsGridModern, .lowerGridModern { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .adminHeaderModern { padding: 14px 18px; }
          .adminStatsGrid { grid-template-columns: repeat(2, 1fr); }
          .quickGridModern { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* MODERN TOP NAVIGATION BAR */}
      <header className="adminHeaderModern">
        <div className="adminBrandModern">
          <div className="adminBrandBadge">RR</div>
          <div>
            <strong>RR MASALA</strong>
            <span>COMMERCE CONTROL</span>
          </div>
        </div>

        <nav className="adminHeaderNav">
          <Link className="active" to="/admin"><LayoutDashboard size={14} /> Dashboard</Link>
          <Link to="/admin/products"><Package size={14} /> Products</Link>
          <Link to="/admin/orders"><ShoppingBag size={14} /> Orders</Link>
          <Link to="/admin/customers"><Users size={14} /> Customers</Link>
          <Link to="/admin/inventory"><Boxes size={14} /> Inventory</Link>
          <Link to="/admin/settings"><SettingsIcon size={14} /> Settings</Link>
          <Link to="/"><ExternalLink size={14} /> Storefront</Link>
        </nav>
      </header>

      <div className="adminContainerModern">
        {error && (
          <div style={{ marginBottom: 20, padding: 14, background: "#fff0f1", border: "1px solid #ffd1d3", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, color: "#9e1017" }}>
            <AlertTriangle size={18} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{error}</span>
            <button onClick={() => load()} style={{ background: "#fff", border: "1px solid #ffd1d3", padding: "6px 12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Retry</button>
            <button onClick={() => setError("")} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={16} /></button>
          </div>
        )}

        <header className="adminTopSection">
          <div>
            <span className="eyebrowModern">ADMIN CONTROL PANEL</span>
            <h1>Business Overview</h1>
            <p>Monitor real-time revenue, orders, customers, inventory and store performance seamlessly.</p>
          </div>

          <div className="adminActionButtons">
            <button className="adminGhostBtn" onClick={() => load(true)} disabled={refreshing}>
              <RefreshCw size={15} className={refreshing ? "refreshSpin" : ""} />
              Refresh Data
            </button>
            <Link className="adminPrimaryBtn" to="/admin/products/new">
              <Plus size={16} />
              Add New Product
            </Link>
          </div>
        </header>

        {/* STATS OVERVIEW CARDS */}
        <section className="adminStatsGrid">
          {stats.map(({ icon: Icon, label, value, note, tone }) => (
            <div className={`adminStatCard ${tone}`} key={label}>
              <div className="adminStatIcon">
                <Icon size={20} />
              </div>
              <span className="label">{label}</span>
              <strong className="value">{value}</strong>
              <span className="note">{note}</span>
            </div>
          ))}
        </section>

        {/* ANALYTICS & STATUS */}
        <div className="analyticsGridModern">
          <section className="adminPanelModern">
            <div className="panelHeaderModern">
              <div>
                <span className="eyebrowModern">PERFORMANCE METRICS</span>
                <h2>Sales Trend</h2>
                <p>Revenue movement from historical store analytics</p>
              </div>
              <span className="livePillModern">
                <i /> Live Data
              </span>
            </div>
            <LineChart data={trend} />
          </section>

          <section className="adminPanelModern">
            <div className="panelHeaderModern">
              <div>
                <span className="eyebrowModern">FULFILLMENT</span>
                <h2>Order Status</h2>
                <p>Current distribution of orders</p>
              </div>
            </div>
            <StatusBars data={statuses} />
          </section>
        </div>

        {/* LOWER GRID: TOP PRODUCTS & SHORTCUTS */}
        <div className="lowerGridModern">
          <section className="adminPanelModern">
            <div className="panelHeaderModern">
              <div>
                <span className="eyebrowModern">CATALOG INSIGHTS</span>
                <h2>Top Products</h2>
                <p>Best-selling products based on sales performance</p>
              </div>
            </div>
            <ProductBars data={topProducts} />
          </section>

          <section className="adminPanelModern">
            <div className="panelHeaderModern">
              <div>
                <span className="eyebrowModern">QUICK ACTIONS</span>
                <h2>Manage Store</h2>
                <p>Quick shortcuts for fast store management</p>
              </div>
            </div>

            <div className="quickGridModern">
              {[
                [Package, "Products", "Catalogue", "/admin/products"],
                [ShoppingBag, "Orders", "Fulfilment", "/admin/orders"],
                [Users, "Customers", "Accounts", "/admin/customers"],
                [Boxes, "Inventory", "Stock", "/admin/inventory"],
                [ImageIcon, "Banners", "Storefront", "/admin/banners"],
                [Tags, "Categories", "Organize", "/admin/categories"],
              ].map(([Icon, title, text, to]) => (
                <Link className="quickCardModern" to={to} key={title}>
                  <div className="quickCardIcon">
                    <Icon size={18} />
                  </div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* RECENT ORDERS */}
        <section className="adminPanelModern">
          <div className="panelHeaderModern">
            <div>
              <span className="eyebrowModern">RECENT ACTIVITY</span>
              <h2>Recent Orders</h2>
              <p>Latest customer transactions received by the store</p>
            </div>
            <Link className="adminGhostBtn" to="/admin/orders" style={{ height: 38, padding: "0 14px" }}>
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          {recent.length ? (
            <div className="recentListModern">
              {recent.slice(0, 6).map((order) => (
                <Link className="recentItemModern" to={`/admin/orders/${order._id}`} key={order._id}>
                  <div className="recentItemLeft">
                    <div className="recentIconBox">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <strong>{order.orderNumber || order._id}</strong>
                      <span>{order.customer?.name || order.user?.name || "Customer"}</span>
                    </div>
                  </div>
                  <div className="recentAmountModern">
                    <strong>{money(order.grandTotal || order.total)}</strong>
                    <span>{String(order.orderStatus || "pending").replaceAll("_", " ")}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#8a7c75" }}>
              <ShoppingBag size={32} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
              No recent orders found.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SettingsIcon(props) {
  return <Boxes {...props} />;
}