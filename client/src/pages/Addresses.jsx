import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API } from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Home,
  BriefcaseBusiness,
  MapPinned,
  CheckCircle2,
  Save,
} from "lucide-react";

export default function Addresses() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [saving, setSaving] = useState(false);

  const createAddress = () => ({
    fullName: user?.name || "",
    mobile: user?.mobile || "",
    house: "",
    street: "",
    area: "",
    city: "",
    district: "",
    state: "Tamil Nadu",
    pincode: "",
    landmark: "",
    type: "Home",
    isDefault: addresses.length === 0,
  });

  const add = () => {
    setAddresses([...addresses, createAddress()]);
  };

  const updateAddress = (index, field, value) => {
    setAddresses((current) =>
      current.map((address, i) =>
        i === index
          ? {
              ...address,
              [field]: value,
            }
          : address
      )
    );
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);

    // If default address was removed, make first one default
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }

    setAddresses(updated);
  };

  const setDefault = (index) => {
    setAddresses((current) =>
      current.map((address, i) => ({
        ...address,
        isDefault: i === index,
      }))
    );
  };

  const save = async () => {
    try {
      setSaving(true);

      await API.put("/users/addresses", {
        addresses,
      });

      alert("Addresses saved successfully");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to save addresses. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type) => {
    if (type === "Work") {
      return <BriefcaseBusiness size={18} />;
    }

    if (type === "Other") {
      return <MapPinned size={18} />;
    }

    return <Home size={18} />;
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

        <Link className="active" to="/addresses">
          Addresses
        </Link>

        <Link to="/orders">Orders</Link>

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
            justifyContent: "space-between",
            alignItems: "center",
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
              Saved addresses
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "var(--muted)",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              Manage your delivery addresses for faster checkout.
            </p>
          </div>

          <button
            type="button"
            className="primary"
            onClick={add}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Plus size={17} />
            Add address
          </button>
        </div>
      </section>

      {/* EMPTY STATE */}
      {addresses.length === 0 && (
        <section
          className="panel"
          style={{
            textAlign: "center",
            padding: "55px 25px",
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: "#fff7d6",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
            }}
          >
            <MapPin size={28} />
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 20,
            }}
          >
            No saved addresses
          </h2>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 12,
              margin: "0 auto 20px",
              maxWidth: 420,
              lineHeight: 1.6,
            }}
          >
            Add your delivery address now so checkout becomes quicker and
            easier.
          </p>

          <button
            type="button"
            className="primary"
            onClick={add}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Plus size={16} />
            Add your first address
          </button>
        </section>
      )}

      {/* ADDRESS LIST */}
      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        {addresses.map((address, index) => (
          <section
            className="panel"
            key={index}
            style={{
              position: "relative",
              overflow: "hidden",
              border:
                address.isDefault
                  ? "1.5px solid rgba(103,162,94,.45)"
                  : undefined,
            }}
          >
            {/* DEFAULT TOP LINE */}
            {address.isDefault && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: "var(--green)",
                }}
              />
            )}

            {/* CARD HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 15,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: "#f7f4df",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {getTypeIcon(address.type)}
                </div>

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 15,
                    }}
                  >
                    {address.type || "Address"}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 3,
                      color: "var(--muted)",
                      fontSize: 10,
                    }}
                  >
                    Delivery address #{index + 1}
                  </span>
                </div>

                {address.isDefault && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#edf7f1",
                      color: "var(--green)",
                      borderRadius: 8,
                      padding: "6px 9px",
                      fontSize: 9,
                      fontWeight: 900,
                    }}
                  >
                    <CheckCircle2 size={12} />
                    DEFAULT
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeAddress(index)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid #f0caca",
                  color: "#b42318",
                  background: "#fff7f7",
                  borderRadius: 9,
                  padding: "8px 11px",
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>

            {/* ADDRESS FORM */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <label>
                Full name
                <input
                  value={address.fullName || ""}
                  onChange={(e) =>
                    updateAddress(index, "fullName", e.target.value)
                  }
                  placeholder="Full name"
                />
              </label>

              <label>
                Mobile number
                <input
                  value={address.mobile || ""}
                  onChange={(e) =>
                    updateAddress(
                      index,
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="10 digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                />
              </label>

              <label>
                House / Door number
                <input
                  value={address.house || ""}
                  onChange={(e) =>
                    updateAddress(index, "house", e.target.value)
                  }
                  placeholder="House / Door No."
                />
              </label>

              <label>
                Street
                <input
                  value={address.street || ""}
                  onChange={(e) =>
                    updateAddress(index, "street", e.target.value)
                  }
                  placeholder="Street name"
                />
              </label>

              <label>
                Area
                <input
                  value={address.area || ""}
                  onChange={(e) =>
                    updateAddress(index, "area", e.target.value)
                  }
                  placeholder="Area / Locality"
                />
              </label>

              <label>
                City
                <input
                  value={address.city || ""}
                  onChange={(e) =>
                    updateAddress(index, "city", e.target.value)
                  }
                  placeholder="City"
                />
              </label>

              <label>
                District
                <input
                  value={address.district || ""}
                  onChange={(e) =>
                    updateAddress(index, "district", e.target.value)
                  }
                  placeholder="District"
                />
              </label>

              <label>
                State
                <input
                  value={address.state || "Tamil Nadu"}
                  onChange={(e) =>
                    updateAddress(index, "state", e.target.value)
                  }
                  placeholder="State"
                />
              </label>

              <label>
                Pincode
                <input
                  value={address.pincode || ""}
                  onChange={(e) =>
                    updateAddress(
                      index,
                      "pincode",
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="6 digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                />
              </label>

              <label>
                Landmark
                <input
                  value={address.landmark || ""}
                  onChange={(e) =>
                    updateAddress(index, "landmark", e.target.value)
                  }
                  placeholder="Nearby landmark"
                />
              </label>

              {/* TYPE */}
              <label>
                Address type

                <select
                  value={address.type || "Home"}
                  onChange={(e) =>
                    updateAddress(index, "type", e.target.value)
                  }
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {/* DEFAULT */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <button
                  type="button"
                  className={
                    address.isDefault ? "secondary" : "secondary"
                  }
                  onClick={() => setDefault(index)}
                  disabled={address.isDefault}
                  style={{
                    width: "100%",
                    minHeight: 42,
                    opacity: address.isDefault ? 0.65 : 1,
                  }}
                >
                  {address.isDefault
                    ? "✓ Default address"
                    : "Set as default"}
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* BOTTOM ACTIONS */}
      {addresses.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 18,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="secondary"
            onClick={add}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Plus size={16} />
            Add another
          </button>

          <button
            type="button"
            className="primary"
            onClick={save}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save addresses"}
          </button>
        </div>
      )}

      {/* MOBILE */}
      <style>
        {`
          @media (max-width: 700px) {
            .accountPage {
              padding-top: 22px !important;
            }

            .accountPage .panel > div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </main>
  );
}