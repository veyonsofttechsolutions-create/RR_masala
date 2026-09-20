import { useEffect, useMemo, useState } from "react";
import { API } from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
  IndianRupee,
  LayoutDashboard,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings,
  ShoppingBag,
  Tags,
  TicketPercent,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

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

  // If the analytics endpoint has no trend array, derive a small
  // historical-looking view only from real recent-order timestamps.
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
        <span>
          Connect the analytics endpoint to display historical sales.
        </span>
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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Sales trend chart"
      >
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
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              className="chartPoint"
            />
            <text
              x={point.x}
              y={height - 15}
              textAnchor="middle"
              className="chartLabel"
            >
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
        <div className="adminLoadingCard">
          <div className="adminLoadingLogo">RR</div>
          <div className="spinner" />
          <strong>Loading control center</strong>
          <span>Preparing your store analytics…</span>
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
          <button className="adminPrimary" onClick={() => load()}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="adminDashboardV2">
      <style>{`
        .adminDashboardV2 {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);
          background: #f5f6f8;
          color: #18181b;
        }

        .adminSideV2 {
          background: #111214;
          color: #fff;
          min-height: 100vh;
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 20px 13px;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .adminBrandV2 {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 6px 10px 22px;
          border-bottom: 1px solid rgba(255,255,255,.08);
          margin-bottom: 13px;
        }

        .adminBrandMarkV2 {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #f6b71c;
          color: #17120e;
          font-size: 13px;
          font-weight: 1000;
        }

        .adminBrandV2 strong {
          display: block;
          font-size: 12px;
          letter-spacing: .4px;
        }

        .adminBrandV2 span {
          display: block;
          margin-top: 3px;
          color: #85878b;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .adminNavTitle {
          color: #686b70;
          font-size: 8px;
          letter-spacing: 1.2px;
          font-weight: 900;
          padding: 13px 10px 7px;
        }

        .adminSideV2 a {
          min-height: 40px;
          margin: 2px 0;
          padding: 9px 10px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #aeb0b5;
          text-decoration: none;
          font-size: 10px;
          font-weight: 750;
          transition: .18s ease;
        }

        .adminSideV2 a:hover {
          background: rgba(255,255,255,.06);
          color: #fff;
        }

        .adminSideV2 a.active {
          background: #f6b71c;
          color: #17120e;
        }

        .adminSideBottomV2 {
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,.08);
          padding: 13px 6px 3px;
        }

        .adminSystemLive {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #9da0a5;
          font-size: 8px;
          padding: 6px 5px 10px;
        }

        .adminSystemLive i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #45d483;
          box-shadow: 0 0 0 4px rgba(69,212,131,.10);
        }

        .adminMainV2 {
          min-width: 0;
          padding: 28px clamp(18px, 3.5vw, 48px) 60px;
        }

        .adminTopV2 {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 23px;
        }

        .adminBreadcrumb {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #8b8e93;
          font-size: 8px;
          font-weight: 800;
        }

        .adminTopV2 h1 {
          margin: 8px 0 5px;
          font-size: clamp(25px, 3.2vw, 36px);
          letter-spacing: -.8px;
        }

        .adminTopV2 p {
          margin: 0;
          color: #7b7e84;
          font-size: 10px;
        }

        .adminTopActions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .adminGhost,
        .adminPrimary {
          min-height: 39px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 13px;
          font: inherit;
          font-size: 9px;
          font-weight: 850;
          text-decoration: none;
          cursor: pointer;
        }

        .adminGhost {
          background: #fff;
          color: #303238;
          border: 1px solid #e3e5e8;
        }

        .adminPrimary {
          background: #171717;
          color: #fff;
          border: 1px solid #171717;
        }

        .adminPrimary:hover {
          background: #2c2c2c;
        }

        .adminGhost:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .adminStatsV2 {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
          margin-bottom: 18px;
        }

        .adminStatV2 {
          background: #fff;
          border: 1px solid #e6e7e9;
          border-radius: 14px;
          padding: 15px;
          min-width: 0;
          box-shadow: 0 2px 9px rgba(20,20,20,.025);
        }

        .adminStatIconV2 {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
        }

        .adminStatV2.gold .adminStatIconV2 { background: #fff4d7; color: #9c6900; }
        .adminStatV2.blue .adminStatIconV2 { background: #edf4ff; color: #3b70b7; }
        .adminStatV2.green .adminStatIconV2 { background: #eaf8f0; color: #2c8a55; }
        .adminStatV2.purple .adminStatIconV2 { background: #f1edff; color: #7257b4; }
        .adminStatV2.red .adminStatIconV2 { background: #fff0ee; color: #b5483d; }

        .adminStatLabelV2 {
          display: block;
          color: #85888d;
          font-size: 8px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .adminStatValueV2 {
          display: block;
          font-size: 20px;
          letter-spacing: -.4px;
        }

        .adminStatNoteV2 {
          display: block;
          color: #9a9da2;
          font-size: 7px;
          margin-top: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .analyticsGridV2 {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(270px, .7fr);
          gap: 13px;
          margin-bottom: 13px;
        }

        .analyticsPanelV2 {
          background: #fff;
          border: 1px solid #e6e7e9;
          border-radius: 15px;
          padding: 17px;
          min-width: 0;
          box-shadow: 0 2px 9px rgba(20,20,20,.025);
        }

        .panelHeadV2 {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 15px;
        }

        .panelEyebrowV2 {
          display: block;
          color: #9a9da2;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .panelHeadV2 h2 {
          margin: 5px 0 0;
          font-size: 15px;
          letter-spacing: -.2px;
        }

        .panelHeadV2 p {
          margin: 4px 0 0;
          color: #8d9095;
          font-size: 8px;
        }

        .livePill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #effaf3;
          color: #2d8552;
          border-radius: 7px;
          padding: 6px 8px;
          font-size: 7px;
          font-weight: 900;
        }

        .livePill i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .chartCanvas {
          width: 100%;
          overflow: hidden;
        }

        .chartCanvas svg {
          display: block;
          width: 100%;
          height: auto;
          min-height: 240px;
        }

        .chartGrid {
          stroke: #eceef0;
          stroke-width: 1;
        }

        .chartArea {
          fill: rgba(246,183,28,.12);
        }

        .chartLine {
          fill: none;
          stroke: #c78d0a;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .chartPoint {
          fill: #fff;
          stroke: #c78d0a;
          stroke-width: 3;
        }

        .chartLabel {
          fill: #999ca1;
          font-size: 10px;
        }

        .chartEmpty {
          min-height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          text-align: center;
          color: #9a9da2;
        }

        .chartEmpty strong {
          color: #4b4e54;
          font-size: 10px;
        }

        .chartEmpty span {
          max-width: 260px;
          line-height: 1.5;
          font-size: 8px;
        }

        .chartEmpty.compact {
          min-height: 210px;
        }

        .statusBars,
        .productBars {
          display: grid;
          gap: 14px;
          padding: 6px 2px;
        }

        .statusRowTop,
        .productBarMeta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 6px;
        }

        .statusRowTop span,
        .productBarMeta span {
          min-width: 0;
          color: #666a70;
          font-size: 8px;
          text-transform: capitalize;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .statusRowTop strong,
        .productBarMeta strong {
          color: #26282c;
          font-size: 9px;
        }

        .statusTrack,
        .productBarTrack {
          height: 7px;
          border-radius: 99px;
          background: #f0f1f2;
          overflow: hidden;
        }

        .statusTrack span,
        .productBarTrack span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #f6b71c;
        }

        .productBarTrack span {
          background: #18181b;
        }

        .lowerGridV2 {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(300px, .9fr);
          gap: 13px;
          margin-bottom: 13px;
        }

        .quickGridV2 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .quickCardV2 {
          min-height: 92px;
          padding: 12px;
          border: 1px solid #ececee;
          border-radius: 11px;
          color: #202125;
          text-decoration: none;
          transition: .18s ease;
        }

        .quickCardV2:hover {
          transform: translateY(-2px);
          border-color: #d9dadd;
          box-shadow: 0 8px 22px rgba(0,0,0,.05);
        }

        .quickCardIcon {
          width: 31px;
          height: 31px;
          border-radius: 9px;
          background: #f7f4df;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
        }

        .quickCardV2 strong {
          display: block;
          font-size: 9px;
        }

        .quickCardV2 span {
          display: block;
          color: #8b8e93;
          font-size: 7px;
          line-height: 1.45;
          margin-top: 4px;
        }

        .recentListV2 {
          display: grid;
        }

        .recentItemV2 {
          min-width: 0;
          padding: 11px 0;
          border-top: 1px solid #eceef0;
          display: grid;
          grid-template-columns: 34px minmax(0,1fr) auto;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          color: #202125;
        }

        .recentIconV2 {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #f6f4e8;
          display: grid;
          place-items: center;
        }

        .recentItemV2 strong {
          display: block;
          font-size: 9px;
        }

        .recentItemV2 span {
          display: block;
          color: #92959a;
          font-size: 7px;
          margin-top: 3px;
        }

        .recentAmountV2 {
          text-align: right;
        }

        .recentAmountV2 strong {
          font-size: 9px;
        }

        .recentAmountV2 span {
          color: #3a8a59;
          text-transform: capitalize;
        }

        .emptyRecent {
          min-height: 150px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #979aa0;
          font-size: 9px;
        }

        .adminErrorV2 {
          margin-bottom: 13px;
          padding: 11px 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          background: #fff1ef;
          border: 1px solid #f1d0cb;
          border-radius: 10px;
          color: #a44238;
        }

        .adminErrorV2 span {
          flex: 1;
          font-size: 8px;
        }

        .adminErrorV2 button {
          border: 0;
          background: #fff;
          border-radius: 7px;
          padding: 6px 9px;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .adminLoadingPage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f5f6f8;
        }

        .adminLoadingCard {
          width: min(360px, calc(100% - 30px));
          padding: 35px 25px;
          background: #fff;
          border: 1px solid #e6e7e9;
          border-radius: 18px;
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 9px;
          text-align: center;
        }

        .adminLoadingLogo {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: #f6b71c;
          font-weight: 1000;
        }

        .adminLoadingCard strong {
          font-size: 13px;
        }

        .adminLoadingCard span {
          color: #8a8d92;
          font-size: 9px;
        }

        @media (max-width: 1200px) {
          .adminStatsV2 {
            grid-template-columns: repeat(3, 1fr);
          }
          .analyticsGridV2,
          .lowerGridV2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .adminDashboardV2 {
            grid-template-columns: 1fr;
          }
          .adminSideV2 {
            position: relative;
            height: auto;
            min-height: 0;
          }
          .adminSideBottomV2 {
            margin-top: 15px;
          }
        }

        @media (max-width: 620px) {
          .adminMainV2 {
            padding: 22px 14px 45px;
          }
          .adminTopV2 {
            align-items: flex-start;
            flex-direction: column;
          }
          .adminTopActions {
            width: 100%;
          }
          .adminTopActions > * {
            flex: 1;
          }
          .adminStatsV2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .adminStatV2:last-child {
            grid-column: 1 / -1;
          }
          .quickGridV2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .chartCanvas svg {
            min-height: 190px;
          }
        }

        @media (max-width: 420px) {
          .adminStatsV2 {
            grid-template-columns: 1fr;
          }
          .adminStatV2:last-child {
            grid-column: auto;
          }
          .quickGridV2 {
            grid-template-columns: 1fr;
          }
          .adminTopActions {
            flex-direction: column;
          }
        }
      `}</style>

      <aside className="adminSideV2">
        <div className="adminBrandV2">
          <div className="adminBrandMarkV2">RR</div>
          <div>
            <strong>RR MASALA</strong>
            <span>COMMERCE CONTROL</span>
          </div>
        </div>

        <div className="adminNavTitle">OVERVIEW</div>
        <Link className="active" to="/admin">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link to="/admin/analytics">
          <BarChart3 size={16} /> Analytics
        </Link>

        <div className="adminNavTitle">CATALOG</div>
        <Link to="/admin/products">
          <Package size={16} /> Products
        </Link>
        <Link to="/admin/categories">
          <Tags size={16} /> Categories
        </Link>
        <Link to="/admin/inventory">
          <Boxes size={16} /> Inventory
        </Link>

        <div className="adminNavTitle">COMMERCE</div>
        <Link to="/admin/orders">
          <ShoppingBag size={16} /> Orders
        </Link>
        <Link to="/admin/customers">
          <Users size={16} /> Customers
        </Link>
        <Link to="/admin/returns">
          <RotateCcw size={16} /> Returns
        </Link>
        <Link to="/admin/coupons">
          <TicketPercent size={16} /> Coupons
        </Link>
        <Link to="/admin/banners">
          <ImageIcon size={16} /> Banners
        </Link>

        <div className="adminNavTitle">SYSTEM</div>
        <Link to="/admin/settings">
          <Settings size={16} /> Settings
        </Link>
        <Link to="/admin/audit-logs">
          <Activity size={16} /> Audit logs
        </Link>

        <div className="adminSideBottomV2">
          <div className="adminSystemLive">
            <i /> System operational
          </div>
          <Link to="/">
            <ExternalLink size={14} /> View storefront
          </Link>
        </div>
      </aside>

      <section className="adminMainV2">
        {error && (
          <div className="adminErrorV2">
            <AlertTriangle size={16} />
            <span>{error}</span>
            <button onClick={() => load()}>Retry</button>
            <button
              aria-label="Dismiss"
              onClick={() => setError("")}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <header className="adminTopV2">
          <div>
            <div className="adminBreadcrumb">
              <LayoutDashboard size={11} />
              <ChevronRight size={10} />
              Control center
            </div>
            <h1>Business overview</h1>
            <p>
              Monitor revenue, orders, customers, inventory and product
              performance from one place.
            </p>
          </div>

          <div className="adminTopActions">
            <button
              className="adminGhost"
              onClick={() => load(true)}
              disabled={refreshing}
            >
              <RefreshCw
                size={14}
                className={refreshing ? "refreshSpin" : ""}
              />
              Refresh
            </button>
            <Link className="adminPrimary" to="/admin/products/new">
              <Plus size={14} />
              Add product
            </Link>
          </div>
        </header>

        <section className="adminStatsV2">
          {stats.map(({ icon: Icon, label, value, note, tone }) => (
            <div className={`adminStatV2 ${tone}`} key={label}>
              <div className="adminStatIconV2">
                <Icon size={17} />
              </div>
              <span className="adminStatLabelV2">{label}</span>
              <strong className="adminStatValueV2">{value}</strong>
              <span className="adminStatNoteV2">{note}</span>
            </div>
          ))}
        </section>

        <div className="analyticsGridV2">
          <section className="analyticsPanelV2">
            <div className="panelHeadV2">
              <div>
                <span className="panelEyebrowV2">BUSINESS ANALYTICS</span>
                <h2>Sales trend</h2>
                <p>Revenue movement from available analytics data</p>
              </div>
              <span className="livePill">
                <i /> Live data
              </span>
            </div>
            <LineChart data={trend} />
          </section>

          <section className="analyticsPanelV2">
            <div className="panelHeadV2">
              <div>
                <span className="panelEyebrowV2">OPERATIONS</span>
                <h2>Order status</h2>
                <p>Current order distribution</p>
              </div>
            </div>
            <StatusBars data={statuses} />
          </section>
        </div>

        <div className="lowerGridV2">
          <section className="analyticsPanelV2">
            <div className="panelHeadV2">
              <div>
                <span className="panelEyebrowV2">PRODUCT PERFORMANCE</span>
                <h2>Top products</h2>
                <p>Best-performing products returned by analytics</p>
              </div>
            </div>
            <ProductBars data={topProducts} />
          </section>

          <section className="analyticsPanelV2">
            <div className="panelHeadV2">
              <div>
                <span className="panelEyebrowV2">SHORTCUTS</span>
                <h2>Manage your business</h2>
              </div>
            </div>

            <div className="quickGridV2">
              {[
                [Package, "Products", "Catalogue", "/admin/products"],
                [ShoppingBag, "Orders", "Fulfilment", "/admin/orders"],
                [Users, "Customers", "Accounts", "/admin/customers"],
                [Boxes, "Inventory", "Stock", "/admin/inventory"],
                [ImageIcon, "Banners", "Storefront", "/admin/banners"],
                [Tags, "Categories", "Organisation", "/admin/categories"],
              ].map(([Icon, title, text, to]) => (
                <Link className="quickCardV2" to={to} key={title}>
                  <div className="quickCardIcon">
                    <Icon size={15} />
                  </div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="analyticsPanelV2">
          <div className="panelHeadV2">
            <div>
              <span className="panelEyebrowV2">RECENT ACTIVITY</span>
              <h2>Recent orders</h2>
              <p>Latest orders returned by the dashboard API</p>
            </div>
            <Link
              className="adminGhost"
              style={{ textDecoration: "none" }}
              to="/admin/orders"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recent.length ? (
            <div className="recentListV2">
              {recent.slice(0, 7).map((order) => (
                <Link
                  className="recentItemV2"
                  to={`/admin/orders/${order._id}`}
                  key={order._id}
                >
                  <div className="recentIconV2">
                    <ShoppingBag size={15} />
                  </div>
                  <div>
                    <strong>
                      {order.orderNumber || order._id}
                    </strong>
                    <span>
                      {order.customer?.name ||
                        order.user?.name ||
                        "Customer"}
                    </span>
                  </div>
                  <div className="recentAmountV2">
                    <strong>
                      {money(order.grandTotal || order.total)}
                    </strong>
                    <span>
                      {String(order.orderStatus || "pending").replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="emptyRecent">
              <ShoppingBag size={25} />
              No recent orders available.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
