import { useState, useRef } from "react";
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
  Camera,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Profile Picture Selection & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // preview base64
      };
      reader.readAsDataURL(file);
    }
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.patch("/users/profile", {
        name,
        mobile,
        avatar,
      });

      alert("Profile updated successfully!");
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
          <Link className="active" to="/profile" style={{ padding: "10px 20px", background: "var(--rr-maroon, #9e1017)", color: "#fff", borderRadius: 30, fontWeight: 800, fontSize: 13 }}>
            Profile
          </Link>
          <Link to="/addresses" style={{ padding: "10px 20px", background: "#fff", color: "#140d0b", border: "1px solid var(--rr-border)", borderRadius: 30, fontWeight: 800, fontSize: 13 }}>Addresses</Link>
          <Link to="/orders" style={{ padding: "10px 20px", background: "#fff", color: "#140d0b", border: "1px solid var(--rr-border)", borderRadius: 30, fontWeight: 800, fontSize: 13 }}>Orders</Link>
          <Link to="/wishlist" style={{ padding: "10px 20px", background: "#fff", color: "#140d0b", border: "1px solid var(--rr-border)", borderRadius: 30, fontWeight: 800, fontSize: 13 }}>Wishlist</Link>
        </div>

        {/* PROFILE HEADER CARD */}
        <section
          style={{
            background: "#fff",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 12px 36px rgba(158, 16, 23, 0.08)",
            marginBottom: 24,
            border: "1px solid rgba(158, 16, 23, 0.1)",
          }}
        >
          {/* COVER - Yellow and Red Gradient */}
          <div
            style={{
              height: 140,
              background: "linear-gradient(135deg, #f39200 0%, #c41a22 60%, #9e1017 100%)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 85% 20%, rgba(255,255,255,.25), transparent 40%)",
              }}
            />
          </div>

          {/* USER INFO AREA */}
          <div style={{ padding: "0 32px 28px", position: "relative" }}>
            {/* AVATAR WITH CAMERA UPLOAD */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "#fff",
                border: "4px solid #fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                marginTop: -48,
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "#f4c400",
                    display: "grid",
                    placeItems: "center",
                    color: "#140d0b",
                  }}
                >
                  <User size={40} strokeWidth={2.2} />
                </div>
              )}

              {/* Camera Badge Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "var(--rr-maroon, #9e1017)",
                  color: "#fff",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  border: "2px solid #fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <Camera size={14} />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>

            <div
              style={{
                marginTop: 16,
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
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(26px, 4vw, 36px)",
                    fontWeight: 700,
                    color: "#140d0b",
                  }}
                >
                  {name || "Your Profile"}
                </h1>
                <p style={{ margin: "6px 0 0", color: "#5e514c", fontSize: 13 }}>
                  Manage your personal information, security, and preferences seamlessly.
                </p>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#edf7f1",
                  color: "#2e7d32",
                  padding: "8px 14px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                }}
              >
                <ShieldCheck size={16} />
                VERIFIED ACCOUNT
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.8fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* EDIT PROFILE FORM */}
          <section style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid rgba(158, 16, 23, 0.08)" }}>
            <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.5, color: "var(--rr-maroon, #9e1017)" }}>ACCOUNT DETAILS</span>
              <h2 style={{ margin: "6px 0 4px", fontSize: 22, fontFamily: "'Cormorant Garamond', serif" }}>Personal Information</h2>
              <p style={{ margin: 0, color: "#5e514c", fontSize: 12 }}>Keep your contact details up to date for fast orders and hassle-free delivery.</p>
            </div>

            <form onSubmit={save} style={{ display: "grid", gap: 20 }}>
              {/* NAME */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 8, color: "#140d0b" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8a7c75" }} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: "100%",
                      height: 50,
                      paddingLeft: 46,
                      paddingRight: 16,
                      borderRadius: 14,
                      border: "1px solid #ddd",
                      background: "#faf9f4",
                      fontSize: 14,
                      outline: "none",
                      transition: "all 0.3s",
                    }}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 8, color: "#140d0b" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8a7c75" }} />
                  <input
                    value={user?.email || ""}
                    disabled
                    style={{
                      width: "100%",
                      height: 50,
                      paddingLeft: 46,
                      paddingRight: 16,
                      borderRadius: 14,
                      border: "1px solid #ddd",
                      background: "#f0eee9",
                      color: "#777",
                      fontSize: 14,
                      cursor: "not-allowed",
                    }}
                  />
                </div>
                <small style={{ display: "block", marginTop: 6, color: "#8a7c75", fontSize: 11 }}>Email is securely linked to your account and cannot be modified.</small>
              </div>

              {/* MOBILE */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 8, color: "#140d0b" }}>Mobile Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8a7c75" }} />
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10 digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    style={{
                      width: "100%",
                      height: 50,
                      paddingLeft: 46,
                      paddingRight: 16,
                      borderRadius: 14,
                      border: "1px solid #ddd",
                      background: "#faf9f4",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  height: 50,
                  background: "linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22)",
                  color: "#fff",
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(158, 16, 23, 0.25)",
                  border: "none",
                  transition: "transform 0.2s ease",
                  marginTop: 10,
                }}
              >
                <Save size={18} />
                {saving ? "Saving Changes..." : "Save Profile Changes"}
              </button>
            </form>
          </section>

          {/* QUICK SIDEBAR */}
          <aside style={{ display: "grid", gap: 20 }}>
            {/* QUICK LINKS */}
            <div style={{ background: "#fff", borderRadius: 24, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid rgba(158, 16, 23, 0.08)" }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.5, color: "var(--rr-maroon, #9e1017)" }}>QUICK ACCESS</span>
              <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
                <Link to="/orders" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#faf9f4", borderRadius: 12, fontWeight: 700, fontSize: 13, border: "1px solid #eee" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Package size={18} color="var(--rr-maroon)" /> My Orders</span>
                  <span>→</span>
                </Link>
                <Link to="/addresses" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#faf9f4", borderRadius: 12, fontWeight: 700, fontSize: 13, border: "1px solid #eee" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}><MapPin size={18} color="var(--rr-maroon)" /> Saved Addresses</span>
                  <span>→</span>
                </Link>
                <Link to="/wishlist" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#faf9f4", borderRadius: 12, fontWeight: 700, fontSize: 13, border: "1px solid #eee" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Heart size={18} color="var(--rr-maroon)" /> Wishlist</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* STATUS & LOGOUT */}
            <div style={{ background: "#fff", borderRadius: 24, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid rgba(158, 16, 23, 0.08)" }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.5, color: "var(--rr-maroon, #9e1017)" }}>ACCOUNT STATUS</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2e7d32" }} />
                <strong style={{ fontSize: 13 }}>Active Account</strong>
              </div>
              <p style={{ color: "#5e514c", fontSize: 12, lineHeight: 1.5, margin: "8px 0 20px" }}>
                Your account is fully active and ready for purchases and order tracking.
              </p>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  height: 46,
                  background: "#fff0f1",
                  color: "#9e1017",
                  border: "1px solid #ffd1d3",
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <LogOut size={16} />
                Logout Account
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}