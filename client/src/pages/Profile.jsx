import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API } from "../api/http.js";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  Save,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.patch("/users/profile", {
        name,
        mobile,
      });

      alert("Profile updated successfully");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    nav("/");
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
        <Link className="active" to="/profile">
          Profile
        </Link>

        <Link to="/addresses">Addresses</Link>

        <Link to="/orders">Orders</Link>

        <Link to="/wishlist">Wishlist</Link>
      </div>

      {/* PROFILE HEADER */}
      <section
        className="panel"
        style={{
          padding: 0,
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        {/* COVER */}
        <div
          style={{
            height: 120,
            background:
              "linear-gradient(135deg, #171714 0%, #2d2d28 55%, #e5b900 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 85% 20%, rgba(255,255,255,.18), transparent 35%)",
            }}
          />
        </div>

        {/* USER INFO */}
        <div
          style={{
            padding: "0 26px 24px",
            position: "relative",
          }}
        >
          {/* AVATAR */}
          <div
            style={{
              width: 82,
              height: 82,
              borderRadius: "50%",
              background: "#fff",
              border: "5px solid #fff",
              boxShadow: "0 5px 20px rgba(0,0,0,.12)",
              display: "grid",
              placeItems: "center",
              marginTop: -41,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "#f4c400",
                display: "grid",
                placeItems: "center",
              }}
            >
              <User size={32} strokeWidth={2.2} />
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(25px, 4vw, 34px)",
                  lineHeight: 1.1,
                }}
              >
                {user?.name || "Your Profile"}
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "var(--muted)",
                  fontSize: 12,
                }}
              >
                Manage your personal information and account preferences.
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "#edf7f1",
                color: "var(--green)",
                padding: "8px 11px",
                borderRadius: 9,
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              <ShieldCheck size={14} />
              VERIFIED ACCOUNT
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(260px, .7fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* EDIT PROFILE */}
        <section className="panel">
          <div
            style={{
              marginBottom: 22,
              paddingBottom: 17,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span className="eyebrow">ACCOUNT DETAILS</span>

            <h2
              style={{
                margin: "7px 0 5px",
                fontSize: 21,
              }}
            >
              Personal information
            </h2>

            <p
              style={{
                margin: 0,
                color: "var(--muted)",
                fontSize: 11,
              }}
            >
              Keep your contact details up to date for orders and delivery.
            </p>
          </div>

          <form
            className="form"
            onSubmit={save}
            style={{
              maxWidth: "100%",
            }}
          >
            {/* NAME */}
            <label>
              Name

              <div
                style={{
                  position: "relative",
                  marginTop: 7,
                }}
              >
                <User
                  size={17}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted)",
                  }}
                />

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    paddingLeft: 40,
                  }}
                />
              </div>
            </label>

            {/* EMAIL */}
            <label>
              Email

              <div
                style={{
                  position: "relative",
                  marginTop: 7,
                }}
              >
                <Mail
                  size={17}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted)",
                  }}
                />

                <input
                  value={user?.email || ""}
                  disabled
                  style={{
                    paddingLeft: 40,
                    background: "#f7f6f1",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <small
                style={{
                  display: "block",
                  marginTop: 6,
                  color: "var(--muted)",
                  fontSize: 10,
                }}
              >
                Email is linked to your account and cannot be changed here.
              </small>
            </label>

            {/* MOBILE */}
            <label>
              Mobile number

              <div
                style={{
                  position: "relative",
                  marginTop: 7,
                }}
              >
                <Phone
                  size={17}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted)",
                  }}
                />

                <input
                  value={mobile}
                  onChange={(e) =>
                    setMobile(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="Enter 10 digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  style={{
                    paddingLeft: 40,
                  }}
                />
              </div>
            </label>

            {/* SAVE */}
            <button
              className="primary"
              type="submit"
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 5,
              }}
            >
              <Save size={16} />

              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>

        {/* QUICK ACCOUNT */}
        <aside
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <div className="panel">
            <span className="eyebrow">QUICK ACCESS</span>

            <div
              style={{
                display: "grid",
                gap: 9,
                marginTop: 15,
              }}
            >
              <Link
                to="/orders"
                className="secondary"
                style={{
                  justifyContent: "space-between",
                  padding: "13px 14px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <Package size={17} />
                  My orders
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/addresses"
                className="secondary"
                style={{
                  justifyContent: "space-between",
                  padding: "13px 14px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <MapPin size={17} />
                  Addresses
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/wishlist"
                className="secondary"
                style={{
                  justifyContent: "space-between",
                  padding: "13px 14px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <Heart size={17} />
                  Wishlist
                </span>

                <span>→</span>
              </Link>
            </div>
          </div>

          {/* ACCOUNT STATUS */}
          <div
            className="panel"
            style={{
              background: "#faf9f4",
            }}
          >
            <span className="eyebrow">ACCOUNT STATUS</span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--green)",
                }}
              />

              <strong
                style={{
                  fontSize: 13,
                }}
              >
                Active account
              </strong>
            </div>

            <p
              style={{
                color: "var(--muted)",
                fontSize: 11,
                lineHeight: 1.6,
                marginBottom: 0,
              }}
            >
              Your account is ready for shopping, checkout and order tracking.
            </p>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            className="dangerBtn"
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>
      </div>

      {/* MOBILE RESPONSIVE */}
      <style>
        {`
          @media (max-width: 800px) {
            .accountPage > div[style*="grid-template-columns"] {
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