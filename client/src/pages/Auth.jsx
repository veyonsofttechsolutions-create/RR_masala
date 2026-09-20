import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole } from 'lucide-react';

export function Login(){
  const {login}=useAuth(), nav=useNavigate(), loc=useLocation(); const [f,setF]=useState({email:'',password:''}); const [err,setErr]=useState('');
  const returnTo=new URLSearchParams(loc.search).get('returnTo') || '/checkout';
  const go=async e=>{e.preventDefault();setErr('');try{const u=await login(f);nav(u.role==='ADMIN'?'/admin':returnTo)}catch(e){setErr(e.response?.data?.message||'Login failed')}};
  return <AuthShell title="Welcome back" subtitle="Sign in when you are ready to place your order."><form onSubmit={go} className="form"><label>Email<input type="email" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label><label>Password<input type="password" required value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></label>{err&&<div className="formError">{err}</div>}<button className="primary wide">Sign in <ArrowRight size={17}/></button><p className="centerText">New here? <Link to={`/register?returnTo=${encodeURIComponent(returnTo)}`}>Create an account</Link></p></form></AuthShell>
}
export function Register(){
  const {register}=useAuth(),nav=useNavigate(),loc=useLocation(); const [f,setF]=useState({name:'',email:'',mobile:'',password:''}); const [err,setErr]=useState(''); const returnTo=new URLSearchParams(loc.search).get('returnTo')||'/checkout';
  const go=async e=>{e.preventDefault();setErr('');try{await register(f);nav(returnTo)}catch(e){setErr(e.response?.data?.message||'Registration failed')}};
  return <AuthShell title="Create your account" subtitle="You can browse and shop first. An account is needed only to place an order."><form onSubmit={go} className="form">{['name','email','mobile','password'].map(k=><label key={k}>{k[0].toUpperCase()+k.slice(1)}<input type={k==='password'?'password':k==='email'?'email':'text'} required value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>)}{err&&<div className="formError">{err}</div>}<button className="primary wide">Create account <ArrowRight size={17}/></button><p className="centerText">Already have an account? <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Sign in</Link></p></form></AuthShell>
}
function AuthShell({title,subtitle,children}){return <main className="authPage"><div className="authCard"><div className="authBrand"><span className="brandMarkNew">V</span><span><b>RR MASALA</b><small></small></span></div><div className="authLock"><LockKeyhole size={15}/> Secure checkout</div><h1>{title}</h1><p>{subtitle}</p>{children}</div></main>}
