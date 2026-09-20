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

      {/* PAGE HEADER */}
      <section
        className="panel"
        style={{
          marginBottom: 18,
          background:
            "linear-gradient(135deg, #ffffff 0%, #faf9f3 65%, #fff8d6 100%)",
        }}
      >
        <span className="eyebrow">ACCOUNT</span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            marginTop: 7,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(26px, 4vw, 36px)",
              }}
            >
              My orders
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "var(--muted)",
                fontSize: 12,
              }}
            >
              View your purchases and track delivery status in real time.
            </p>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#edf7f1",
              color: "var(--green)",
              borderRadius: 9,
              padding: "8px 11px",
              fontSize: 9,
              fontWeight: 900,
            }}
          >
            <RefreshCw size={13} />
            REALTIME UPDATES
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section
          className="panel"
          style={{
            textAlign: "center",
            padding: "55px 20px",
          }}
        >
          <RefreshCw
            size={26}
            style={{
              animation: "ordersSpin 1s linear infinite",
            }}
          />

          <p
            style={{
              margin: "14px 0 0",
              color: "var(--muted)",
              fontSize: 12,
            }}
          >
            Loading your orders...
          </p>
        </section>
      )}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <section
          className="panel"
          style={{
            textAlign: "center",
            padding: "65px 25px",
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "#fff7d6",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 17px",
            }}
          >
            <ShoppingBag size={30} />
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 21,
            }}
          >
            No orders yet
          </h2>

          <p
            style={{
              maxWidth: 390,
              margin: "0 auto 22px",
              color: "var(--muted)",
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            You haven't placed any orders yet. Explore our collection and
            discover your favourite traditional foods.
          </p>

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
            Shop now
          </Link>
        </section>
      )}

      {/* ORDERS */}
      {!loading && orders.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {orders.map((order) => {
            const status = getStatusClass(order.orderStatus);

            return (
              <article
                className="panel"
                key={order._id}
                style={{
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                {/* ORDER HEADER */}
                <div
                  style={{
                    padding: "18px 20px",
                    borderBottom: "1px solid var(--line)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 11,
                        background: "#f7f4df",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Package size={20} />
                    </div>

                    <div>
                      <strong
                        style={{
                          display: "block",
                          fontSize: 14,
                        }}
                      >
                        {order.orderNumber}
                      </strong>

                      <small
                        style={{
                          display: "block",
                          marginTop: 4,
                          color: "var(--muted)",
                          fontSize: 10,
                        }}
                      >
                        Ordered on {formatDate(order.createdAt)}
                      </small>
                    </div>
                  </div>

                  <span
                    className={`statusBadge ${status}`}
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {formatStatus(order.orderStatus)}
                  </span>
                </div>

                {/* ITEMS */}
                <div
                  style={{
                    padding: "17px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 12,
                      fontSize: 11,
                      fontWeight: 900,
                    }}
                  >
                    <ShoppingBag size={14} />
                    ORDER ITEMS
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={`${item.sku || item.name}-${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 15,
                          padding: "10px 12px",
                          background: "#faf9f4",
                          borderRadius: 9,
                          fontSize: 11,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                          }}
                        >
                          {item.name}
                        </span>

                        <span
                          style={{
                            color: "var(--muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.items.length > 3 && (
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 10,
                        marginTop: 8,
                      }}
                    >
                      + {order.items.length - 3} more item
                      {order.items.length - 3 > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* TIMELINE */}
                <div
                  style={{
                    padding: "0 20px 18px",
                  }}
                >
                  <OrderTimeline status={order.orderStatus} />
                </div>

                {/* FOOTER */}
                <div
                  style={{
                    padding: "16px 20px",
                    background: "#faf9f4",
                    borderTop: "1px solid var(--line)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <small
                      style={{
                        display: "block",
                        color: "var(--muted)",
                        fontSize: 9,
                        marginBottom: 4,
                      }}
                    >
                      ORDER TOTAL
                    </small>

                    <strong
                      style={{
                        fontSize: 18,
                      }}
                    >
                      ₹{Number(order.grandTotal || 0).toFixed(2)}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      to={`/orders/${order._id}`}
                      className="secondary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      View details
                      <ChevronRight size={14} />
                    </Link>

                    <Link
                      to={`/orders/${order._id}/track`}
                      className="primary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Truck size={15} />
                      Track order
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes ordersSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
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