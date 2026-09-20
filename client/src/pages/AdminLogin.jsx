import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Store,
} from "lucide-react";

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({
    email: "admin@RRMASALA.com",
    password: "Admin@12345",
  });

  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const go = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const u = await login(f);

      if (u.role !== "ADMIN" && u.role !== "STAFF") {
        throw Error("Admin access only");
      }

      nav("/admin");
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          e.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="adminLoginPage">
      <div className="adminLoginShell">
        {/* LEFT BRAND PANEL */}
        <section className="adminLoginVisual">
          <div className="visualTop">
            <div className="visualBrand">
              <div className="visualLogo">RR</div>

              <div>
                <strong>RR MASALA</strong>
                <span>TRADITIONAL FOOD STORE</span>
              </div>
            </div>

            <div className="secureBadge">
              <ShieldCheck size={14} />
              Secure access
            </div>
          </div>

          <div className="visualContent">
            <span className="visualEyebrow">
              ADMINISTRATION
            </span>

            <h1>
              Everything you need
              <br />
              to run your store.
            </h1>

            <p>
              Manage products, orders, customers, inventory
              and your complete RR MASALA storefront from one
              place.
            </p>

            <div className="visualFeatures">
              <div>
                <span>01</span>
                <strong>Order management</strong>
              </div>

              <div>
                <span>02</span>
                <strong>Inventory control</strong>
              </div>

              <div>
                <span>03</span>
                <strong>Store analytics</strong>
              </div>
            </div>
          </div>

          <div className="visualBottom">
            <Store size={14} />
            <span>RR MASALA Commerce Platform</span>
          </div>
        </section>

        {/* LOGIN PANEL */}
        <section className="adminLoginFormPanel">
          <div className="adminLoginCard">
            <Link to="/" className="backStore">
              <ArrowLeft size={15} />
              Back to storefront
            </Link>

            <div className="mobileBrand">
              <div className="mobileLogo">RR</div>

              <div>
                <strong>RR MASALA</strong>
                <span>ADMIN</span>
              </div>
            </div>

            <div className="loginIcon">
              <ShieldCheck size={23} />
            </div>

            <span className="eyebrow">
              SECURE ADMIN ACCESS
            </span>

            <h2>Welcome back.</h2>

            <p className="loginSubtitle">
              Sign in to access your store control center.
            </p>

            <form className="adminLoginForm" onSubmit={go}>
              <label>
                <span>Email address</span>

                <div className="inputWrap">
                  <Mail size={17} />

                  <input
                    type="email"
                    autoComplete="email"
                    value={f.email}
                    onChange={(e) =>
                      setF({
                        ...f,
                        email: e.target.value,
                      })
                    }
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Password</span>

                <div className="inputWrap">
                  <LockKeyhole size={17} />

                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    autoComplete="current-password"
                    value={f.password}
                    onChange={(e) =>
                      setF({
                        ...f,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </label>

              {err && (
                <div className="adminLoginError">
                  <ShieldCheck size={15} />
                  <span>{err}</span>
                </div>
              )}

              <button
                className="adminLoginButton"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="loginSpinner"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to admin
                    <ArrowLeft
                      size={16}
                      className="loginArrow"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="loginSecurity">
              <ShieldCheck size={14} />

              <span>
                Protected admin area. Only authorised
                administrators and staff can continue.
              </span>
            </div>
          </div>
        </section>
      </div>

      <style>
        {`
          .adminLoginPage {
            min-height: 100vh;
            background: #f5f5ef;
            display: grid;
            place-items: center;
            padding: 25px;
          }

          .adminLoginShell {
            width: min(1050px, 100%);
            min-height: 650px;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 22px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 1fr 1fr;
            box-shadow: 0 25px 70px rgba(0,0,0,.08);
          }

          /* LEFT */

          .adminLoginVisual {
            background: #171714;
            color: #fff;
            padding: 30px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
          }

          .adminLoginVisual::before {
            content: "";
            position: absolute;
            width: 350px;
            height: 350px;
            border-radius: 50%;
            border: 1px solid rgba(244,196,0,.13);
            right: -170px;
            bottom: -130px;
          }

          .adminLoginVisual::after {
            content: "";
            position: absolute;
            width: 220px;
            height: 220px;
            border-radius: 50%;
            border: 1px solid rgba(244,196,0,.08);
            right: -90px;
            bottom: -65px;
          }

          .visualTop {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            position: relative;
            z-index: 2;
          }

          .visualBrand {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .visualLogo {
            width: 39px;
            height: 39px;
            border-radius: 11px;
            background: #f4c400;
            color: #171714;
            display: grid;
            place-items: center;
            font-size: 12px;
            font-weight: 1000;
          }

          .visualBrand strong {
            display: block;
            font-size: 11px;
            letter-spacing: .3px;
          }

          .visualBrand span {
            display: block;
            margin-top: 3px;
            color: #85857d;
            font-size: 7px;
            letter-spacing: 1px;
            font-weight: 800;
          }

          .secureBadge {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #bcbcb5;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 20px;
            padding: 7px 9px;
            font-size: 8px;
            font-weight: 800;
          }

          .visualContent {
            margin: auto 0;
            position: relative;
            z-index: 2;
            max-width: 400px;
          }

          .visualEyebrow {
            color: #f4c400;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1.6px;
          }

          .visualContent h1 {
            margin: 12px 0 15px;
            font-size: clamp(30px, 4vw, 44px);
            line-height: 1.08;
            letter-spacing: -.8px;
          }

          .visualContent p {
            color: #aaa9a1;
            font-size: 11px;
            line-height: 1.7;
            max-width: 350px;
            margin: 0;
          }

          .visualFeatures {
            display: grid;
            gap: 9px;
            margin-top: 30px;
          }

          .visualFeatures div {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .visualFeatures span {
            color: #77776f;
            font-size: 8px;
            font-weight: 900;
          }

          .visualFeatures strong {
            font-size: 10px;
            color: #dddcd4;
          }

          .visualBottom {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #707069;
            font-size: 8px;
            position: relative;
            z-index: 2;
          }

          /* FORM */

          .adminLoginFormPanel {
            display: grid;
            place-items: center;
            padding: 35px clamp(25px, 5vw, 60px);
          }

          .adminLoginCard {
            width: 100%;
            max-width: 360px;
          }

          .backStore {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--muted);
            text-decoration: none;
            font-size: 9px;
            font-weight: 800;
            margin-bottom: 35px;
          }

          .backStore:hover {
            color: var(--text);
          }

          .mobileBrand {
            display: none;
          }

          .loginIcon {
            width: 47px;
            height: 47px;
            border-radius: 14px;
            background: #f8f4d9;
            color: #7a6300;
            display: grid;
            place-items: center;
            margin-bottom: 17px;
          }

          .adminLoginCard h2 {
            margin: 7px 0 5px;
            font-size: 29px;
            letter-spacing: -.5px;
          }

          .loginSubtitle {
            color: var(--muted);
            font-size: 10px;
            line-height: 1.5;
            margin: 0 0 25px;
          }

          .adminLoginForm {
            display: grid;
            gap: 16px;
          }

          .adminLoginForm label > span {
            display: block;
            font-size: 9px;
            font-weight: 850;
            margin-bottom: 7px;
          }

          .inputWrap {
            height: 45px;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 0 12px;
            border: 1px solid var(--line);
            border-radius: 10px;
            background: #fafaf7;
            transition: .18s ease;
          }

          .inputWrap:focus-within {
            border-color: #aaa36d;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(244,196,0,.09);
          }

          .inputWrap > svg {
            color: #9a9a91;
            flex-shrink: 0;
          }

          .inputWrap input {
            border: 0;
            outline: 0;
            background: transparent;
            width: 100%;
            min-width: 0;
            font: inherit;
            font-size: 11px;
            color: var(--text);
          }

          .inputWrap input::placeholder {
            color: #aaa9a0;
          }

          .passwordToggle {
            border: 0;
            background: transparent;
            color: #999890;
            display: grid;
            place-items: center;
            padding: 3px;
            cursor: pointer;
          }

          .passwordToggle:hover {
            color: var(--text);
          }

          .adminLoginError {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 10px 11px;
            border-radius: 9px;
            background: #fff0ee;
            color: #a33d32;
            font-size: 9px;
            line-height: 1.45;
          }

          .adminLoginError svg {
            flex-shrink: 0;
            margin-top: 1px;
          }

          .adminLoginButton {
            height: 46px;
            border: 0;
            border-radius: 10px;
            background: #171714;
            color: #fff;
            font-size: 10px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: .18s ease;
            margin-top: 2px;
          }

          .adminLoginButton:hover:not(:disabled) {
            background: #292925;
            transform: translateY(-1px);
          }

          .adminLoginButton:disabled {
            opacity: .65;
            cursor: not-allowed;
          }

          .loginArrow {
            transform: rotate(180deg);
          }

          .loginSpinner {
            animation: adminSpin .8s linear infinite;
          }

          @keyframes adminSpin {
            to {
              transform: rotate(360deg);
            }
          }

          .loginSecurity {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--line);
            display: flex;
            gap: 7px;
            color: var(--muted);
            font-size: 8px;
            line-height: 1.5;
          }

          .loginSecurity svg {
            flex-shrink: 0;
          }

          @media (max-width: 760px) {
            .adminLoginPage {
              padding: 0;
            }

            .adminLoginShell {
              min-height: 100vh;
              border: 0;
              border-radius: 0;
              grid-template-columns: 1fr;
              box-shadow: none;
            }

            .adminLoginVisual {
              display: none;
            }

            .adminLoginFormPanel {
              padding: 25px 20px;
              place-items: center;
            }

            .mobileBrand {
              display: flex;
              align-items: center;
              gap: 9px;
              margin-bottom: 35px;
            }

            .mobileLogo {
              width: 38px;
              height: 38px;
              border-radius: 10px;
              background: #f4c400;
              color: #171714;
              display: grid;
              place-items: center;
              font-size: 11px;
              font-weight: 1000;
            }

            .mobileBrand strong {
              display: block;
              font-size: 11px;
            }

            .mobileBrand span {
              display: block;
              color: var(--muted);
              font-size: 7px;
              font-weight: 850;
              letter-spacing: 1px;
              margin-top: 2px;
            }

            .backStore {
              margin-bottom: 25px;
            }
          }

          @media (max-width: 400px) {
            .adminLoginFormPanel {
              padding: 22px 16px;
            }

            .adminLoginCard h2 {
              font-size: 26px;
            }
          }
        `}
      </style>
    </main>
  );
}