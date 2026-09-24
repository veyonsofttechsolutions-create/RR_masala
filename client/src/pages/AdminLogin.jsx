import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api/http.js";
import { ArrowLeft, ShieldCheck, CheckCircle2, Mail, Lock, ArrowRight } from "lucide-react";

/* BRAND LOGO ASSET */
const ASSETS = {
  logo: "/WhatsApp Image 2026-09-17 at 3.09.40 AM.jpeg"
};

/* THEATER PRELOADER */
function TheaterPreloader() {
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    const removeTimer = setTimeout(() => setRender(false), 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!render) return null;

  return (
    // <div className={`rrTheaterCurtain ${!loading ? "isOpen" : ""}`} aria-hidden="true">
    //   <div className="rrClothHalf rrClothLeft">
    //     <div className="rrClothFolds" />
    //   </div>
    //   <div className="rrClothHalf rrClothRight">
    //     <div className="rrClothFolds" />
    //   </div>
    //  
    // </div>
    <div></div>
  );
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      
      // FIXED ROUTE: Using standard auth login endpoint "/api/auth/login"
      const res = await API.post("/auth/login", { email, password });      
      
      const token = res.data?.token || res.data?.data?.token;
      if (token) {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("token", token);
      }
      nav("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Invalid credentials or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="splitLoginLayout">
      <TheaterPreloader />
      
      <style>{`
        .splitLoginLayout {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f8f9fa;
        }

        /* PRELOADER STYLES */
        .rrTheaterCurtain { position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .rrClothHalf { position: absolute; top: 0; bottom: 0; width: 50%; background: #ffffff; box-shadow: inset 0 0 40px rgba(0,0,0,0.05); transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1) 0.1s; will-change: transform; }
        .rrClothLeft { left: 0; transform-origin: left; border-right: 1px solid rgba(0,0,0,0.05); }
        .rrClothRight { right: 0; transform-origin: right; border-left: 1px solid rgba(0,0,0,0.05); }
        .rrClothFolds { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.03) 10%, transparent 20%); }
        .rrTheaterCurtain.isOpen .rrClothLeft { transform: translateX(-100%); }
        .rrTheaterCurtain.isOpen .rrClothRight { transform: translateX(100%); }
        .rrCurtainLogoBox { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 15px; transition: opacity 0.3s ease; }
        .rrTheaterCurtain.isOpen .rrCurtainLogoBox { opacity: 0; }
        .rrCurtainLogoImg { height: 60px; object-fit: contain; animation: rrCurtainPulse 1.5s ease-in-out infinite alternate; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1)); }
        .rrCurtainLoader { width: 120px; height: 2px; background: rgba(0,0,0,0.1); position: relative; overflow: hidden; }
        .rrCurtainLoader::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: #fbb034; animation: rrTheaterLoad 1s ease-in-out forwards; }
        @keyframes rrTheaterLoad { 0% { left: -100%; } 100% { left: 0; } }
        @keyframes rrCurtainPulse { 0% { transform: scale(0.95); opacity: 0.8; } 100% { transform: scale(1.05); opacity: 1; } }

        /* SPLIT SCREEN LAYOUT */
        .loginLeft {
          flex: 1;
          background: linear-gradient(145deg, #140d0b 0%, #2a080a 100%);
          color: #ffffff;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .loginLeft::after {
          content: "";
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(158,16,23,0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .brandTop {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .brandActualLogo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          object-fit: cover;
          background: #fff;
          padding: 4px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .brandTopText strong { display: block; font-size: 16px; letter-spacing: 0.5px; }
        .brandTopText span { display: block; font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

        .leftContent h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 56px);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          max-width: 500px;
        }

        .leftContent p {
          color: rgba(255,255,255,0.7);
          font-size: 16px;
          line-height: 1.6;
          max-width: 420px;
          margin-bottom: 40px;
        }

        .featureList {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .featureList li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
        }

        .featureList li svg {
          color: #f39200;
        }

        .leftFooter {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }

        /* RIGHT SIDE FORM */
        .loginRight {
          flex: 1;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .formContainer {
          width: 100%;
          max-width: 420px;
        }

        .backLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #5e514c;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
          margin-bottom: 40px;
          transition: color 0.2s;
        }

        .backLink:hover { color: #9e1017; }

        .formHeader { margin-bottom: 32px; }
        
        .securityIcon {
          width: 48px;
          height: 48px;
          background: #fbf7ef;
          color: #c41a22;
          border-radius: 14px;
          display: grid;
          place-items: center;
          margin-bottom: 24px;
        }

        .eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: #5e514c;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .formHeader h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 700;
          color: #140d0b;
          margin: 0 0 8px 0;
        }

        .formHeader p {
          color: #8a7c75;
          font-size: 14px;
          margin: 0;
        }

        .errorBox {
          background: #fff0f1;
          color: #9e1017;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          border: 1px solid rgba(158, 16, 23, 0.15);
        }

        .inputGroup { margin-bottom: 20px; }
        .inputGroup label { display: block; font-size: 13px; font-weight: 750; color: #140d0b; margin-bottom: 8px; }
        
        .inputWrapper { position: relative; display: flex; align-items: center; }
        .inputIcon { position: absolute; left: 16px; color: #8a7c75; pointer-events: none; }
        
        .styledInput {
          width: 100%;
          height: 52px;
          background: #faf9f4;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          padding: 0 16px 0 48px;
          font-size: 15px;
          font-family: inherit;
          color: #140d0b;
          transition: all 0.2s ease;
        }

        .styledInput:focus {
          outline: none;
          background: #ffffff;
          border-color: #f39200;
          box-shadow: 0 0 0 4px rgba(243, 146, 0, 0.1);
        }

        .submitBtn {
          width: 100%;
          height: 52px;
          background: #140d0b;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 32px;
          transition: all 0.2s ease;
        }

        .submitBtn:hover:not(:disabled) {
          background: #c41a22;
          box-shadow: 0 6px 20px rgba(158, 16, 23, 0.25);
        }

        .submitBtn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner { animation: adminSpin 1s linear infinite; }
        @keyframes adminSpin { to { transform: rotate(360deg); } }

        .formFooter {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          color: #8a7c75;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .splitLoginLayout { flex-direction: column; }
          .loginLeft { display: none; }
          .loginRight { padding: 30px 20px; }
        }
      `}</style>

      {/* LEFT SIDE - BRANDING */}
      <div className="loginLeft">
        <div className="brandTop">
          <img src={ASSETS.logo} alt="RR MASALA Logo" className="brandActualLogo" />
          <div className="brandTopText">
            <strong>RR MASALA</strong>
            <span>Traditional Food Store</span>
          </div>
        </div>

        <div className="leftContent">
          <span style={{ display: 'block', color: '#f39200', fontSize: 12, fontWeight: 800, letterSpacing: '1px', marginBottom: 16 }}>ADMINISTRATION</span>
          <h1>Everything you need<br />to run your store.</h1>
          <p>Manage products, orders, customers, inventory and your complete RR MASALA storefront from one place.</p>
          
          <ul className="featureList">
            <li><CheckCircle2 size={18} /> Order management</li>
            <li><CheckCircle2 size={18} /> Inventory control</li>
            <li><CheckCircle2 size={18} /> Store analytics</li>
          </ul>
        </div>

        <div className="leftFooter">
          RR MASALA E-Commerce Platform © {new Date().getFullYear()}
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="loginRight">
        <div className="formContainer">
          <Link to="/" className="backLink">
            <ArrowLeft size={16} /> Back to storefront
          </Link>

          <div className="formHeader">
            <div className="securityIcon">
              <ShieldCheck size={24} />
            </div>
            <span className="eyebrow">SECURE ADMIN ACCESS</span>
            <h2>Welcome back.</h2>
            <p>Sign in to access your store control center.</p>
          </div>

          {error && (
            <div className="errorBox">
              <ShieldCheck size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="inputGroup">
              <label>Email address</label>
              <div className="inputWrapper">
                <Mail size={18} className="inputIcon" />
                <input
                  type="email"
                  className="styledInput"
                  placeholder="admin@rrmasala.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Password</label>
              <div className="inputWrapper">
                <Lock size={18} className="inputIcon" />
                <input
                  type="password"
                  className="styledInput"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submitBtn" disabled={loading}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }} className="spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to admin <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="formFooter">
            <ShieldCheck size={14} />
            Protected admin area. Only authorized administrators can continue.
          </div>
        </div>
      </div>
    </main>
  );
}