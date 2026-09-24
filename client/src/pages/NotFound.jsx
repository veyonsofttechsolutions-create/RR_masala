import { Link } from "react-router-dom";
import { Home, ShoppingBag, ArrowRight, Compass, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="rrNotFoundPage">
      <NotFoundStyles />

      {/* Background Floating Spice Orbs */}
      <div className="bgOrb orb1" />
      <div className="bgOrb orb2" />
      <div className="bgOrb orb3" />

      <div className="nfContainer">
        <div className="nfBadge">
          <Sparkles size={14} /> 404 ERROR · PAGE LOST IN AROMA
        </div>

        <h1 className="nfGlitchTitle">404</h1>

        <h2>Oops! This spice trail went cold.</h2>
        <p>
          The page you are looking for might have been moved, renamed, or is temporarily unavailable in our pantry.
        </p>

        <div className="nfActionGroup">
          <Link to="/" className="nfPrimaryBtn">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/products" className="nfSecondaryBtn">
            <ShoppingBag size={18} /> Explore Masalas <ArrowRight size={16} />
          </Link>
        </div>

        <div className="nfQuickLinks">
          <span>Looking for something specific? Try checking:</span>
          <div className="nfPillLinks">
            <Link to="/category/biryani-masala">Biryani Masalas</Link>
            <Link to="/category/non-veg-masala">Non-Veg Blends</Link>
            <Link to="/contact">Customer Support</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function NotFoundStyles() {
  return (
    <style>{`
      .rrNotFoundPage {
        min-height: 80vh;
        background: #ffffff;
        color: #140d0b;
        font-family: "DM Sans", system-ui, sans-serif;
        display: grid;
        place-items: center;
        padding: 60px 24px;
        position: relative;
        overflow: hidden;
      }

      /* Glowing background floating particles */
      .bgOrb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
        z-index: 1;
      }
      .orb1 { width: 400px; height: 400px; background: rgba(243, 146, 0, 0.12); top: 10%; left: 10%; animation: floatOrb 8s infinite alternate; }
      .orb2 { width: 450px; height: 450px; background: rgba(158, 16, 23, 0.08); bottom: 5%; right: 10%; animation: floatOrb 10s infinite alternate-reverse; }
      .orb3 { width: 300px; height: 300px; background: rgba(251, 176, 52, 0.1); top: 40%; right: 30%; animation: floatOrb 12s infinite alternate; }

      @keyframes floatOrb {
        0% { transform: translateY(0) scale(1); }
        100% { transform: translateY(-30px) scale(1.1); }
      }

      .nfContainer {
        position: relative;
        z-index: 2;
        max-width: 600px;
        width: 100%;
        text-align: center;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(158, 16, 23, 0.1);
        border-radius: 32px;
        padding: 50px 40px;
        box-shadow: 0 20px 60px rgba(158, 16, 23, 0.08);
      }

      .nfBadge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 16px;
        background: #fbf7ef;
        border: 1px solid rgba(243, 146, 0, 0.3);
        border-radius: 99px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.5px;
        color: #9e1017;
        margin-bottom: 20px;
      }
      .nfBadge svg { color: #f39200; }

      .nfGlitchTitle {
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(90px, 18vw, 150px);
        line-height: 1;
        font-weight: 700;
        margin: 0 0 10px;
        background: linear-gradient(135deg, #9e1017, #f39200);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        letter-spacing: -4px;
        text-shadow: 0 15px 35px rgba(158, 16, 23, 0.15);
      }

      .nfContainer h2 {
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 12px;
        color: #1a1412;
      }

      .nfContainer p {
        font-size: 15px;
        color: #6a5e57;
        line-height: 1.7;
        margin: 0 auto 30px;
        max-width: 440px;
      }

      .nfActionGroup {
        display: flex;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
        margin-bottom: 36px;
      }

      .nfPrimaryBtn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 28px;
        background: #9e1017;
        color: #ffffff;
        border-radius: 99px;
        font-size: 14px;
        font-weight: 800;
        box-shadow: 0 8px 24px rgba(158, 16, 23, 0.3);
        transition: transform 0.2s, background 0.2s;
        text-decoration: none;
      }
      .nfPrimaryBtn:hover { background: #7a0c12; transform: translateY(-2px); }

      .nfSecondaryBtn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 26px;
        background: #ffffff;
        color: #1a1412;
        border: 1px solid rgba(158, 16, 23, 0.2);
        border-radius: 99px;
        font-size: 14px;
        font-weight: 800;
        transition: transform 0.2s, border-color 0.2s;
        text-decoration: none;
      }
      .nfSecondaryBtn:hover { border-color: #9e1017; color: #9e1017; transform: translateY(-2px); }

      .nfQuickLinks {
        border-top: 1px solid rgba(158, 16, 23, 0.08);
        padding-top: 24px;
      }
      .nfQuickLinks span {
        display: block;
        font-size: 12px;
        color: #8a7c75;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .nfPillLinks {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .nfPillLinks a {
        padding: 6px 14px;
        background: #fbf7ef;
        border: 1px solid rgba(158, 16, 23, 0.1);
        border-radius: 99px;
        font-size: 12px;
        font-weight: 700;
        color: #6e0c11;
        transition: background 0.2s, transform 0.2s;
      }
      .nfPillLinks a:hover {
        background: #9e1017;
        color: #fff;
        transform: translateY(-1px);
      }

      @media (max-width: 600px) {
        .nfContainer { padding: 36px 20px; border-radius: 20px; }
        .nfActionGroup { flex-direction: column; }
        .nfPrimaryBtn, .nfSecondaryBtn { width: 100%; justify-content: center; }
      }
    `}</style>
  );
}