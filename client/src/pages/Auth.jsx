import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const returnTo = new URLSearchParams(loc.search).get('returnTo') || '/checkout';

  const go = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const u = await login(f);
      nav(u.role === 'ADMIN' ? '/admin' : returnTo);
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to access your authentic pantry and track orders.">
      <form onSubmit={go} className="rr-auth-form">
        <div className="rr-input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            required 
            value={f.email} 
            onChange={e => setF({ ...f, email: e.target.value })} 
            placeholder="Enter your email" 
          />
        </div>
        <div className="rr-input-group">
          <label>Password</label>
          <input 
            type="password" 
            required 
            value={f.password} 
            onChange={e => setF({ ...f, password: e.target.value })} 
            placeholder="Enter your password" 
          />
        </div>
        {err && <div className="rr-auth-error">{err}</div>}
        <button className="rr-auth-btn">Sign In <ArrowRight size={18} /></button>
        <p className="rr-auth-switch">
          New to RR MASALA? <Link to={`/register?returnTo=${encodeURIComponent(returnTo)}`}>Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ name: '', email: '', mobile: '', password: '' });
  const [err, setErr] = useState('');
  const returnTo = new URLSearchParams(loc.search).get('returnTo') || '/checkout';

  const go = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(f);
      nav(returnTo);
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthShell title="Create Account" subtitle="Join us to explore traditional stone-ground spices.">
      <form onSubmit={go} className="rr-auth-form">
        {['name', 'email', 'mobile', 'password'].map(k => (
          <div className="rr-input-group" key={k}>
            <label>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
            <input
              type={k === 'password' ? 'password' : k === 'email' ? 'email' : 'text'}
              required
              value={f[k]}
              onChange={e => setF({ ...f, [k]: e.target.value })}
              placeholder={`Enter your ${k}`}
            />
          </div>
        ))}
        {err && <div className="rr-auth-error">{err}</div>}
        <button className="rr-auth-btn">Create Account <ArrowRight size={18} /></button>
        <p className="rr-auth-switch">
          Already have an account? <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="rr-auth-page">
      <div className="rr-auth-container">
        {/* LEFT SIDE - BRANDING */}
        <div className="rr-auth-visual">
          <div className="rr-auth-overlay"></div>
          <div className="rr-auth-brand">
            <Link to="/">
              <img src="/logo.png" alt="RR MASALA" className="rr-auth-logo" />
            </Link>
            <div className="rr-auth-brand-text">
              <h2>The Roar of Authentic South Tradition</h2>
              <ul>
                <li><ShieldCheck size={18}/> 100% Native Spices</li>
                <li><ShieldCheck size={18}/> Stone Cold Ground</li>
                <li><ShieldCheck size={18}/> Zero Preservatives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="rr-auth-content">
          <div className="rr-auth-box">
            <div className="rr-secure-badge">
              <LockKeyhole size={14} /> <span>Secure Authentication</span>
            </div>
            <h1>{title}</h1>
            <p className="rr-auth-subtitle">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
      
      <style>{`
        .rr-auth-page {
          min-height: 100vh;
          background: #fbf7ef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 20px;
        }
        .rr-auth-container {
          width: 100%;
          max-width: 1000px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(158, 16, 23, 0.08);
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          overflow: hidden;
          border: 1px solid rgba(158, 16, 23, 0.1);
        }
        .rr-auth-visual {
          position: relative;
          background: linear-gradient(135deg, var(--rr-maroon, #9e1017) 0%, #c41a22 100%);
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #ffffff;
          overflow: hidden;
        }
        .rr-auth-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(243, 146, 0, 0.2), transparent 60%);
        }
        .rr-auth-brand {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
        }
        .rr-auth-logo {
          height: 100px;
          object-fit: contain;
          margin-bottom: 40px;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
        }
        .rr-auth-brand-text h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          line-height: 1.1;
          margin-bottom: 24px;
          font-weight: 700;
          color: #fbf7ef;
        }
        .rr-auth-brand-text ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .rr-auth-brand-text li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          color: var(--rr-gold, #f39200);
        }
        .rr-auth-content {
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }
        .rr-auth-box {
          width: 100%;
          max-width: 340px;
        }
        .rr-secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fbf7ef;
          color: var(--rr-maroon, #9e1017);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .rr-auth-box h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #140d0b;
          margin: 0 0 8px 0;
        }
        .rr-auth-subtitle {
          font-size: 13px;
          color: #766c64;
          margin-bottom: 32px;
          line-height: 1.5;
        }
        .rr-auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .rr-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .rr-input-group label {
          font-size: 12px;
          font-weight: 800;
          color: #140d0b;
        }
        .rr-input-group input {
          height: 48px;
          border: 1px solid #e9e0d5;
          border-radius: 12px;
          padding: 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          background: #fcfbfa;
          transition: all 0.2s ease;
        }
        .rr-input-group input:focus {
          outline: none;
          border-color: var(--rr-maroon, #9e1017);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(158, 16, 23, 0.1);
        }
        .rr-auth-btn {
          height: 50px;
          background: var(--rr-maroon, #9e1017);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.2s ease;
        }
        .rr-auth-btn:hover {
          background: #810d12;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(158, 16, 23, 0.2);
        }
        .rr-auth-error {
          background: #fee2e2;
          color: #9e1017;
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #fca5a5;
        }
        .rr-auth-switch {
          text-align: center;
          font-size: 13px;
          color: #766c64;
          margin-top: 20px;
        }
        .rr-auth-switch a {
          color: var(--rr-maroon, #9e1017);
          font-weight: 800;
          text-decoration: none;
        }
        .rr-auth-switch a:hover {
          text-decoration: underline;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 860px) {
          .rr-auth-container {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .rr-auth-visual {
            padding: 30px;
            text-align: center;
          }
          .rr-auth-brand-text ul {
            align-items: center;
          }
          .rr-auth-content {
            padding: 40px 24px;
          }
          .rr-auth-logo {
            margin: 0 auto 24px;
          }
        }
      `}</style>
    </main>
  );
}