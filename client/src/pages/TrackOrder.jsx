import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../api/http.js";
import OrderTimeline from "../components/OrderTimeline.jsx";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Hash,
  CalendarDays,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

export default function TrackOrder() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    API.get("/orders/" + id)
      .then((r) => {
        if (mounted) {
          setOrder(r.data?.data?.order || null);
        }
      })
      .catch(() => {
        if (mounted) setOrder(null);
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

      socket.on("order:statusChanged", ({ order: updatedOrder }) => {
        if (updatedOrder?._id === id) {
          setOrder(updatedOrder);
        }
      });

      socket.on("order:cancelled", (updatedOrder) => {
        if (updatedOrder?._id === id) {
          setOrder(updatedOrder);
        }
      });
    }

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [id, user]);

  const formatStatus = (status = "") =>
    status.replaceAll("_", " ");

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const status = order?.orderStatus || "";

  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";

  if (loading) {
    return (
      <main className="accountPage" style={{ paddingTop: 32 }}>
        <section
          className="panel"
          style={{
            minHeight: 380,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <RefreshCw
              size={28}
              style={{
                animation: "trackSpin 1s linear infinite",
              }}
            />

            <p
              style={{
                margin: "14px 0 0",
                color: "var(--muted)",
                fontSize: 12,
              }}
            >
              Loading tracking information...
            </p>
          </div>
        </section>

        <style>
          {`
            @keyframes trackSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="accountPage" style={{ paddingTop: 32 }}>
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

        <section
          className="panel"
          style={{
            textAlign: "center",
            padding: "65px 25px",
          }}
        >
          <Package size={38} />

          <h2
            style={{
              margin: "15px 0 8px",
            }}
          >
            Order not found
          </h2>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 12,
            }}
          >
            We couldn't find the order you're looking for.
          </p>

          <Link
            to="/orders"
            className="primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              marginTop: 10,
            }}
          >
            View my orders
            <ChevronRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="accountPage" style={{ paddingTop: 32 }}>
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

      {/* ACCOUNT NAV */}
      <div
        className="accountNav"
        style={{
          marginBottom: 20,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <Link to="/profile">Profile</Link>

        <Link to="/addresses">Addresses</Link>

        <Link className="active" to="/orders">
          Orders
        </Link>

        <Link to="/wishlist">Wishlist</Link>
      </div>

      {/* TRACKING HEADER */}
      <section
        className="panel"
        style={{
          marginBottom: 18,
          overflow: "hidden",
          padding: 0,
          background:
            "linear-gradient(135deg, #ffffff 0%, #faf9f4 65%, #fff8d6 100%)",
        }}
      >
        <div
          style={{
            padding: "24px 25px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <span className="eyebrow">LIVE TRACKING</span>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(25px, 4vw, 34px)",
                }}
              >
                {order.orderNumber}
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "var(--muted)",
                  fontSize: 11,
                }}
              >
                Ordered on {formatDate(order.createdAt)}
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: isCancelled
                  ? "#fff1f1"
                  : isDelivered
                    ? "#edf7f1"
                    : "#fff7d6",
                color: isCancelled
                  ? "#b42318"
                  : isDelivered
                    ? "var(--green)"
                    : "#806900",
                borderRadius: 10,
                padding: "10px 13px",
                fontSize: 10,
                fontWeight: 900,
                textTransform: "capitalize",
              }}
            >
              <Truck size={15} />
              {formatStatus(status)}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "18px 25px",
            display: "flex",
            alignItems: "center",
            gap: 9,
            color: "var(--green)",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          <RefreshCw size={14} />

          Status updates automatically — no refresh needed.
        </div>
      </section>

      {/* TIMELINE */}
      <section className="panel" style={{ marginBottom: 18 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow">DELIVERY PROGRESS</span>

          <h2
            style={{
              margin: "7px 0 0",
              fontSize: 20,
            }}
          >
            Where is my order?
          </h2>
        </div>

        <OrderTimeline status={order.orderStatus} />
      </section>

      {/* DELIVERY INFORMATION */}
      <section className="panel" style={{ marginBottom: 18 }}>
        <div style={{ marginBottom: 18 }}>
          <span className="eyebrow">DELIVERY INFORMATION</span>

          <h2
            style={{
              margin: "7px 0 0",
              fontSize: 20,
            }}
          >
            Shipment details
          </h2>
        </div>

        <div
          className="trackingGrid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {/* STATUS */}
          <div className="trackingInfoCard">
            <div className="trackingIcon">
              <Package size={18} />
            </div>

            <div>
              <span>Current status</span>
              <b style={{ textTransform: "capitalize" }}>
                {formatStatus(order.orderStatus)}
              </b>
            </div>
          </div>

          {/* CARRIER */}
          <div className="trackingInfoCard">
            <div className="trackingIcon">
              <Truck size={18} />
            </div>

            <div>
              <span>Carrier</span>
              <b>{order.carrier || "To be assigned"}</b>
            </div>
          </div>

          {/* TRACKING NUMBER */}
          <div className="trackingInfoCard">
            <div className="trackingIcon">
              <Hash size={18} />
            </div>

            <div>
              <span>Tracking number</span>
              <b>{order.trackingNumber || "To be assigned"}</b>
            </div>
          </div>

          {/* DELIVERY DATE */}
          <div className="trackingInfoCard">
            <div className="trackingIcon">
              <CalendarDays size={18} />
            </div>

            <div>
              <span>Estimated delivery</span>

              <b>
                {order.estimatedDelivery
                  ? formatDate(order.estimatedDelivery)
                  : "Will be updated"}
              </b>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY ADDRESS */}
      {order.shippingAddress && (
        <section className="panel" style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 16 }}>
            <span className="eyebrow">DELIVERY ADDRESS</span>

            <h2
              style={{
                margin: "7px 0 0",
                fontSize: 20,
              }}
            >
              Shipping to
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: 15,
              background: "#faf9f4",
              borderRadius: 11,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#fff7d6",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <MapPin size={18} />
            </div>

            <div
              style={{
                fontSize: 11,
                lineHeight: 1.7,
              }}
            >
              <strong>
                {order.shippingAddress.fullName}
              </strong>

              <div>
                {[
                  order.shippingAddress.house,
                  order.shippingAddress.street,
                  order.shippingAddress.area,
                  order.shippingAddress.city,
                  order.shippingAddress.district,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>

              <div>
                {order.shippingAddress.state}
                {order.shippingAddress.pincode
                  ? ` - ${order.shippingAddress.pincode}`
                  : ""}
              </div>

              {order.shippingAddress.mobile && (
                <div
                  style={{
                    color: "var(--muted)",
                    marginTop: 3,
                  }}
                >
                  {order.shippingAddress.mobile}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ACTIONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 9,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <Link
          to={"/orders/" + id}
          className="secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          View order details
          <ChevronRight size={15} />
        </Link>

        <Link
          to="/orders"
          className="primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Package size={15} />
          My orders
        </Link>
      </div>

      <style>
        {`
          .trackingInfoCard {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            border: 1px solid var(--line);
            border-radius: 11px;
            background: #fff;
          }

          .trackingIcon {
            width: 38px;
            height: 38px;
            flex-shrink: 0;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: #f7f4df;
          }

          .trackingInfoCard span {
            display: block;
            color: var(--muted);
            font-size: 9px;
            margin-bottom: 5px;
          }

          .trackingInfoCard b {
            display: block;
            font-size: 11px;
          }

          @media (max-width: 650px) {
            .trackingGrid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 520px) {
            .accountPage {
              padding-top: 22px !important;
            }
          }
        `}
      </style>
    </main>
  );
}