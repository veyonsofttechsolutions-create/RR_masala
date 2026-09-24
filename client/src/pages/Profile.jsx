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

  const currentUser = user?.user || user || {};

  // CRITICAL FIX: AuthContext-la avatar varalanaalum, namma local backup-la irunthu eduthukuvom
  const [name, setName] = useState(currentUser.name || "");
  const [mobile, setMobile] = useState(currentUser.mobile || "");
  const [avatar, setAvatar] = useState(currentUser.avatar || localStorage.getItem("rr_avatar_backup") || "");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const updateLocalCache = (freshUser) => {
    const keys = ["user", "userInfo", "userData", "auth"];
    for (let key of keys) {
      let val = localStorage.getItem(key);
      if (val) {
        try {
          let parsed = JSON.parse(val);
          if (parsed.user) {
            parsed.user = { ...parsed.user, ...freshUser };
            localStorage.setItem(key, JSON.stringify(parsed));
          } else {
            localStorage.setItem(key, JSON.stringify({ ...parsed, ...freshUser }));
          }
        } catch (e) {}
      }
    }
  };

  // AUTOMATIC IMAGE UPLOAD FUNCTION VIA CLOUDINARY
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image smaller than 2MB.");
      return;
    }

    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "rr_masala_products");
      
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dffybsye4";
      
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || "Cloudinary upload failed");
      }
      
      const secureUrl = uploadData.secure_url;
      
      // UI-la udane image update aagum, marubadi reload aagi kaanama pogathu
      setAvatar(secureUrl); 
      localStorage.setItem("rr_avatar_backup", secureUrl); // Save backup

      const res = await API.patch("/users/profile", {
        name,
        mobile,
        avatar: secureUrl,
      });
      
      if (res.data?.data?.user) {
        updateLocalCache(res.data.data.user);
      }

      alert("Profile picture updated successfully!");
      // window.location.reload(); -> Itha remove pannitom, so that state azhiyathu!
    } catch (error) {
      console.error(error);
      alert(
        error?.message || error?.response?.data?.message || 
        "Unable to save profile picture. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await API.patch("/users/profile", {
        name,
        mobile,
        avatar,
      });

      if (res.data?.data?.user) {
        updateLocalCache(res.data.data.user);
      }
      
      if (avatar) {
        localStorage.setItem("rr_avatar_backup", avatar);
      }

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
    localStorage.removeItem("rr_avatar_backup"); // Clear backup on logout
    await logout();
    nav("/");
  };

  return (
    <main className="accountPage rrProfilePage">
      <div className="rrProfileContainer">
        
        <button type="button" onClick={() => nav(-1)} className="rrBackBtn">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="rrAccountNavList">
          <Link className="active" to="/profile">Profile</Link>
          <Link to="/addresses">Addresses</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        <section className="rrProfileHeaderCard">
          <div className="rrProfileCover">
            <div className="rrCoverOverlay" />
          </div>

          <div className="rrProfileInfoArea">
            <div className="rrAvatarBox" onClick={() => fileInputRef.current.click()}>
              {avatar ? (
                <img src={avatar} alt="Profile" className="rrAvatarImg" />
              ) : (
                <div className="rrAvatarPlaceholder">
                  <User size={40} strokeWidth={2.2} />
                </div>
              )}
              <div className="rrCameraBadge">
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

            <div className="rrProfileTitleRow">
              <div>
                <h1 className="rrProfileName">{name || "Your Profile"}</h1>
                <p className="rrProfileSubText">
                  Manage your personal information, security, and preferences seamlessly.
                </p>
              </div>

              <div className="rrVerifiedBadge">
                <ShieldCheck size={16} />
                VERIFIED ACCOUNT
              </div>
            </div>
          </div>
        </section>

        <div className="rrProfileMainGrid">
          
          <section className="rrFormCard">
            <div className="rrFormHeader">
              <span className="rrEyebrow">ACCOUNT DETAILS</span>
              <h2>Personal Information</h2>
              <p>Keep your contact details up to date for fast orders and hassle-free delivery.</p>
            </div>

            <form onSubmit={save} className="rrEditForm">
              <div className="rrInputGroup">
                <label>Full Name</label>
                <div className="rrInputWrapper">
                  <User size={18} className="rrInputIcon" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="rrInputGroup">
                <label>Email Address</label>
                <div className="rrInputWrapper">
                  <Mail size={18} className="rrInputIcon" />
                  <input
                    value={currentUser.email || ""} 
                    disabled
                    className="disabledInput"
                  />
                </div>
                <small className="rrInputHint">Email is securely linked to your account and cannot be modified.</small>
              </div>

              <div className="rrInputGroup">
                <label>Mobile Number</label>
                <div className="rrInputWrapper">
                  <Phone size={18} className="rrInputIcon" />
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10 digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                  />
                </div>
              </div>

              <button type="submit" disabled={saving} className="rrSaveBtn">
                <Save size={18} />
                {saving ? "Saving Changes..." : "Save Profile Changes"}
              </button>
            </form>
          </section>

          <aside className="rrSidebarGrid">
            <div className="rrSidebarCard">
              <span className="rrEyebrow">QUICK ACCESS</span>
              <div className="rrQuickLinksWrap">
                <Link to="/orders" className="rrQuickLink">
                  <span><Package size={18} color="var(--rr-maroon, #9e1017)" /> My Orders</span>
                  <span>→</span>
                </Link>
                <Link to="/addresses" className="rrQuickLink">
                  <span><MapPin size={18} color="var(--rr-maroon, #9e1017)" /> Saved Addresses</span>
                  <span>→</span>
                </Link>
                <Link to="/wishlist" className="rrQuickLink">
                  <span><Heart size={18} color="var(--rr-maroon, #9e1017)" /> Wishlist</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="rrSidebarCard">
              <span className="rrEyebrow">ACCOUNT STATUS</span>
              <div className="rrStatusRow">
                <div className="rrStatusDot" />
                <strong>Active Account</strong>
              </div>
              <p className="rrStatusDesc">
                Your account is fully active and ready for purchases and order tracking.
              </p>
              <button type="button" onClick={handleLogout} className="rrLogoutBtn">
                <LogOut size={16} /> Logout Account
              </button>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .rrProfilePage { padding-top: 32px; padding-bottom: 60px; background: #fbf7ef; min-height: 100vh; font-family: "DM Sans", sans-serif; }
        .rrProfileContainer { width: min(1200px, 92%); margin: 0 auto; }
        
        .rrBackBtn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--rr-border, #e5b900); background: #fff; border-radius: 10px; padding: 10px 16px; font-weight: 800; font-size: 12px; cursor: pointer; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all 0.3s ease; }
        
        .rrAccountNavList { display: flex; gap: 12px; margin-bottom: 24px; overflow-x: auto; white-space: nowrap; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; max-width: 100%; }
        .rrAccountNavList::-webkit-scrollbar { display: none; }
        .rrAccountNavList a { flex-shrink: 0; padding: 10px 20px; background: #fff; color: #140d0b; border: 1px solid var(--rr-border, #e5b900); border-radius: 30px; font-weight: 800; font-size: 13px; text-decoration: none; transition: all 0.2s ease; display: inline-block; }
        .rrAccountNavList a.active { background: var(--rr-maroon, #9e1017); color: #fff; border-color: var(--rr-maroon, #9e1017); }

        .rrProfileHeaderCard { background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 36px rgba(158, 16, 23, 0.08); margin-bottom: 24px; border: 1px solid rgba(158, 16, 23, 0.1); }
        .rrProfileCover { height: 140px; background: linear-gradient(135deg, #f39200 0%, #c41a22 60%, #9e1017 100%); position: relative; }
        .rrCoverOverlay { position: absolute; inset: 0; background: radial-gradient(circle at 85% 20%, rgba(255,255,255,.25), transparent 40%); }
        .rrProfileInfoArea { padding: 0 32px 28px; position: relative; }
        
        .rrAvatarBox { width: 96px; height: 96px; border-radius: 50%; background: #fff; border: 4px solid #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); margin-top: -48px; position: relative; cursor: pointer; }
        .rrAvatarImg { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .rrAvatarPlaceholder { width: 100%; height: 100%; border-radius: 50%; background: #f4c400; display: grid; place-items: center; color: #140d0b; }
        .rrCameraBadge { position: absolute; bottom: 0; right: 0; background: var(--rr-maroon, #9e1017); color: #fff; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; border: 2px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }

        .rrProfileTitleRow { margin-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; }
        .rrProfileName { margin: 0; font-family: 'Cormorant Garamond', serif; font-size: clamp(26px, 4vw, 36px); font-weight: 700; color: #140d0b; }
        .rrProfileSubText { margin: 6px 0 0; color: #5e514c; font-size: 13px; }
        .rrVerifiedBadge { display: inline-flex; align-items: center; gap: 8px; background: #edf7f1; color: #2e7d32; padding: 8px 14px; border-radius: 20px; font-size: 11px; font-weight: 900; letter-spacing: 0.5px; }

        .rrProfileMainGrid { display: grid; grid-template-columns: 1.6fr 0.8fr; gap: 24px; align-items: start; }
        
        .rrFormCard { background: #fff; border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); }
        .rrFormHeader { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
        .rrEyebrow { font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: var(--rr-maroon, #9e1017); display: block; }
        .rrFormHeader h2 { margin: 6px 0 4px; font-size: 22px; font-family: 'Cormorant Garamond', serif; color: #140d0b; }
        .rrFormHeader p { margin: 0; color: #5e514c; font-size: 13px; }

        .rrEditForm { display: flex; flex-direction: column; gap: 20px; width: 100%; box-sizing: border-box; }
        .rrInputGroup { display: flex; flex-direction: column; width: 100%; box-sizing: border-box; }
        .rrInputGroup label { display: block; font-size: 13px; font-weight: 800; margin-bottom: 8px; color: #140d0b; }
        .rrInputWrapper { position: relative; width: 100%; box-sizing: border-box; }
        .rrInputIcon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #8a7c75; }
        .rrInputWrapper input { width: 100%; height: 50px; padding-left: 46px; padding-right: 16px; border-radius: 14px; border: 1px solid #ddd; background: #faf9f4; font-size: 14px; outline: none; transition: all 0.3s; box-sizing: border-box; font-family: "DM Sans", sans-serif; }
        .rrInputWrapper input:focus { border-color: var(--rr-maroon, #9e1017); background: #fff; }
        .rrInputWrapper input.disabledInput { background: #f0eee9; color: #777; cursor: not-allowed; border-color: #ddd; }
        .rrInputHint { display: block; margin-top: 6px; color: #8a7c75; font-size: 11px; }

        .rrSaveBtn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; height: 50px; background: linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22); color: #fff; border-radius: 14px; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 8px 20px rgba(158, 16, 23, 0.25); border: none; transition: transform 0.2s ease; margin-top: 10px; width: 100%; box-sizing: border-box; }
        .rrSaveBtn:hover:not(:disabled) { transform: translateY(-2px); }
        .rrSaveBtn:disabled { opacity: 0.7; cursor: not-allowed; }

        .rrSidebarGrid { display: grid; gap: 20px; width: 100%; box-sizing: border-box; }
        .rrSidebarCard { background: #fff; border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); width: 100%; box-sizing: border-box; }
        .rrQuickLinksWrap { display: grid; gap: 10px; margin-top: 16px; }
        .rrQuickLink { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #faf9f4; border-radius: 12px; font-weight: 700; font-size: 13px; border: 1px solid #eee; text-decoration: none; color: #140d0b; transition: all 0.2s; }
        .rrQuickLink span { display: flex; align-items: center; gap: 10px; }
        .rrQuickLink:hover { background: #f0eee9; }

        .rrStatusRow { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
        .rrStatusDot { width: 10px; height: 10px; border-radius: 50%; background: #2e7d32; }
        .rrStatusRow strong { font-size: 13px; color: #140d0b; }
        .rrStatusDesc { color: #5e514c; font-size: 12px; line-height: 1.5; margin: 8px 0 20px; }
        
        .rrLogoutBtn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 46px; background: #fff0f1; color: #9e1017; border: 1px solid #ffd1d3; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; box-sizing: border-box; }
        .rrLogoutBtn:hover { background: #fee2e2; }

        @media (max-width: 860px) {
          .rrProfilePage { padding-top: 20px; padding-bottom: 40px; }
          .rrProfileMainGrid { grid-template-columns: 1fr; }
          .rrFormCard { padding: 24px 20px; }
          .rrProfileInfoArea { padding: 0 20px 24px; }
          .rrProfileContainer { width: 95%; }
        }
      `}</style>
    </main>
  );
}