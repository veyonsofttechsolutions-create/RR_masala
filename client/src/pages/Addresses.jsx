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
  User,
  Phone,
  Building,
  Map,
  Navigation,
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
    if (type === "Work") return <BriefcaseBusiness size={20} />;
    if (type === "Other") return <MapPinned size={20} />;
    return <Home size={20} />;
  };

  // Common Input Style for cleaner code
  const inputStyle = {
    width: "100%",
    height: 50,
    paddingLeft: 46,
    paddingRight: 16,
    borderRadius: 14,
    border: "1px solid #ddd",
    background: "#faf9f4",
    fontSize: 14,
    outline: "none",
    color: "#140d0b",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 8,
    color: "#140d0b",
  };

  const iconWrapperStyle = {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8a7c75",
    pointerEvents: "none",
  };

  return (
    <main className="accountPage" style={{ paddingTop: 32, paddingBottom: 60, background: "#fbf7ef", minHeight: "100vh" }}>
      <div style={{ width: "min(1200px, 92%)", margin: "0 auto" }}>
        
        {/* BACK */}
        <button
          type="button"
          onClick={() => nav(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--rr-border, #e5b900)",
            background: "#fff",
            borderRadius: 10,
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: 12,
            cursor: "pointer",
            marginBottom: 22,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.3s ease",
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* ACCOUNT NAV */}
        <div
          className="accountNav"
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: 6,
          }}
        >
          <Link to="/profile" style={{ padding: "10px 20px", background: "#fff", color: "#140d0b", border: "1px solid var(--rr-border, #e5b900)", borderRadius: 30, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>Profile</Link>
          <Link className="active" to="/addresses" style={{ padding: "10px 20px", background: "var(--rr-maroon, #9e1017)", color: "#fff", borderRadius: 30, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>Addresses</Link>
          <Link to="/orders" style={{ padding: "10px 20px", background: "#fff", color: "#140d0b", border: "1px solid var(--rr-border, #e5b900)", borderRadius: 30, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>Orders</Link>
          <Link to="/wishlist" style={{ padding: "10px 20px", background: "#fff", color: "#140d0b", border: "1px solid var(--rr-border, #e5b900)", borderRadius: 30, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>Wishlist</Link>
        </div>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, color: "#140d0b" }}>
              Saved Addresses
            </h1>
            <p style={{ margin: "6px 0 0", color: "#5e514c", fontSize: 13 }}>
              Manage your delivery addresses for faster checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={add}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#9e1017", padding: "12px 20px", borderRadius: 14, fontWeight: 800, fontSize: 13, border: "2px solid #9e1017", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>

        {/* EMPTY STATE */}
        {addresses.length === 0 && (
          <section
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid rgba(158, 16, 23, 0.08)"
            }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%", background: "#fff0f1", color: "#9e1017", display: "grid", placeItems: "center", margin: "0 auto 20px",
              }}
            >
              <MapPin size={32} />
            </div>
            <h2 style={{ margin: "0 0 10px", fontSize: 22, fontFamily: "'Cormorant Garamond', serif", color: "#140d0b" }}>
              No saved addresses
            </h2>
            <p style={{ color: "#5e514c", fontSize: 14, margin: "0 auto 24px", maxWidth: 420, lineHeight: 1.6 }}>
              Add your delivery address now so checkout becomes quicker and easier for your next spice order.
            </p>
            <button
              type="button"
              onClick={add}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22)", color: "#fff", padding: "14px 28px", borderRadius: 14, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 8px 20px rgba(158, 16, 23, 0.25)"
              }}
            >
              <Plus size={18} /> Add Your First Address
            </button>
          </section>
        )}

        {/* ADDRESS LIST */}
        <div style={{ display: "grid", gap: 24 }}>
          {addresses.map((address, index) => (
            <section
              key={index}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: "clamp(20px, 4vw, 32px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                border: address.isDefault ? "2px solid #2e7d32" : "1px solid rgba(158, 16, 23, 0.08)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* CARD HEADER */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #eee", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: address.isDefault ? "#edf7f1" : "#fff0f1", display: "grid", placeItems: "center", color: address.isDefault ? "#2e7d32" : "#9e1017" }}>
                    {getTypeIcon(address.type)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#140d0b" }}>
                      {address.type || "Address"}
                      <span style={{ fontWeight: 500, fontSize: 12, color: "#8a7c75", marginLeft: 8 }}>#{index + 1}</span>
                    </h3>
                    {address.isDefault && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 900, color: "#2e7d32", marginTop: 4 }}>
                        <CheckCircle2 size={14} /> DEFAULT ADDRESS
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeAddress(index)}
                  style={{ display: "flex", alignItems: "center", gap: 6, color: "#d32f2f", background: "#fff7f7", border: "1px solid #f0caca", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>

              {/* ADDRESS FORM */}
              <div className="address-grid" style={{ display: "grid", gap: 20 }}>
                
                {/* Full name */}
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><User size={18} /></div>
                    <input
                      value={address.fullName || ""}
                      onChange={(e) => updateAddress(index, "fullName", e.target.value)}
                      placeholder="Enter full name"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label style={labelStyle}>Mobile Number</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><Phone size={18} /></div>
                    <input
                      value={address.mobile || ""}
                      onChange={(e) => updateAddress(index, "mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10 digit mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* House/Door No */}
                <div>
                  <label style={labelStyle}>House / Door Number</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><Home size={18} /></div>
                    <input
                      value={address.house || ""}
                      onChange={(e) => updateAddress(index, "house", e.target.value)}
                      placeholder="House / Door No."
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Street */}
                <div>
                  <label style={labelStyle}>Street Name</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><Navigation size={18} /></div>
                    <input
                      value={address.street || ""}
                      onChange={(e) => updateAddress(index, "street", e.target.value)}
                      placeholder="Street name"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label style={labelStyle}>Area / Locality</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><MapPin size={18} /></div>
                    <input
                      value={address.area || ""}
                      onChange={(e) => updateAddress(index, "area", e.target.value)}
                      placeholder="Area / Locality"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label style={labelStyle}>City</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><Building size={18} /></div>
                    <input
                      value={address.city || ""}
                      onChange={(e) => updateAddress(index, "city", e.target.value)}
                      placeholder="City"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label style={labelStyle}>District</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><Building size={18} /></div>
                    <input
                      value={address.district || ""}
                      onChange={(e) => updateAddress(index, "district", e.target.value)}
                      placeholder="District"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label style={labelStyle}>State</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><Map size={18} /></div>
                    <input
                      value={address.state || "Tamil Nadu"}
                      onChange={(e) => updateAddress(index, "state", e.target.value)}
                      placeholder="State"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label style={labelStyle}>Pincode</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><MapPin size={18} /></div>
                    <input
                      value={address.pincode || ""}
                      onChange={(e) => updateAddress(index, "pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6 digit pincode"
                      inputMode="numeric"
                      maxLength={6}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label style={labelStyle}>Landmark</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapperStyle}><Navigation size={18} /></div>
                    <input
                      value={address.landmark || ""}
                      onChange={(e) => updateAddress(index, "landmark", e.target.value)}
                      placeholder="Nearby landmark"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Address Type Select */}
                <div>
                  <label style={labelStyle}>Address Type</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={address.type || "Home"}
                      onChange={(e) => updateAddress(index, "type", e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 16, cursor: "pointer", appearance: "auto" }}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Set Default Button */}
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setDefault(index)}
                    disabled={address.isDefault}
                    style={{
                      width: "100%", height: 50, borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: address.isDefault ? "default" : "pointer",
                      background: address.isDefault ? "#edf7f1" : "#fff",
                      color: address.isDefault ? "#2e7d32" : "#140d0b",
                      border: address.isDefault ? "none" : "1px solid #ddd",
                      transition: "all 0.2s"
                    }}
                  >
                    {address.isDefault ? "✓ Currently Default" : "Set as Default Address"}
                  </button>
                </div>

              </div>
            </section>
          ))}
        </div>

        {/* BOTTOM ACTIONS */}
        {addresses.length > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 24, flexWrap: "wrap", position: "sticky", bottom: 20, zIndex: 10 }}>
            
            <button
              type="button"
              onClick={add}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#140d0b", padding: "14px 24px", borderRadius: 14, fontWeight: 800, fontSize: 14, border: "1px solid #ddd", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
            >
              <Plus size={18} /> Add Another
            </button>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22)", color: "#fff", padding: "14px 28px", borderRadius: 14, fontWeight: 800, fontSize: 14, border: "none", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 8px 25px rgba(158, 16, 23, 0.3)", opacity: saving ? 0.8 : 1 }}
            >
              <Save size={18} />
              {saving ? "Saving Changes..." : "Save Addresses"}
            </button>
          </div>
        )}

        {/* MOBILE RESPONSIVE CSS */}
        <style>
          {`
            .address-grid {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            }
            @media (max-width: 600px) {
              .accountNav {
                padding-bottom: 12px !important;
              }
              .address-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
      </div>
    </main>
  );
}