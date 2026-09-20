import { createContext, useContext, useEffect, useState } from 'react';
import { API } from '../api/http.js';
import { useAuth } from './AuthContext.jsx';
const C=createContext(null); const KEY='RR MASALA_guest_wishlist';
export function WishlistProvider({children}){const{user}=useAuth();const[items,setItems]=useState(()=>JSON.parse(localStorage.getItem(KEY)||'[]'));
useEffect(()=>{if(user)API.get('/wishlist').then(r=>setItems(r.data?.data?.products||[])).catch(()=>{});else localStorage.setItem(KEY,JSON.stringify(items));},[user]);
const has=p=>items.some(x=>x?._id===p._id); const toggle=async p=>{if(user){const r=await API.post(`/wishlist/${p._id}/toggle`);setItems(r.data?.data?.products||[]);}else setItems(x=>has(p)?x.filter(i=>i._id!==p._id):[...x,p]);};
return <C.Provider value={{items,has,toggle}}>{children}</C.Provider>}
export const useWishlist=()=>useContext(C);
