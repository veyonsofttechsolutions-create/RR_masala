import { useEffect, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { API } from '../api/http.js';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Catalog(){
  const [params] = useSearchParams(); const route=useParams();
  const [products,setProducts]=useState([]),[cats,setCats]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const [sort,setSort]=useState('newest'); const [category,setCategory]=useState(params.get('category')||route.slug||''); const [q,setQ]=useState(params.get('q')||''); const [draftQ,setDraftQ]=useState(q);
  useEffect(()=>{API.get('/categories').then(r=>setCats(r.data?.data?.items||[])).catch(()=>{});},[]);
  useEffect(()=>{setCategory(params.get('category')||route.slug||'');setQ(params.get('q')||'');setDraftQ(params.get('q')||'');},[params,route.slug]);
  useEffect(()=>{setLoading(true);setError('');const qs=new URLSearchParams({limit:40,sort,...(q?{q}:{}),...(category?{category}:{})});API.get('/products?'+qs).then(r=>setProducts(r.data?.data?.items||[])).catch(e=>setError(e.response?.data?.message||'Could not load products.')).finally(()=>setLoading(false));},[sort,category,q]);
  const applySearch=e=>{e.preventDefault();setQ(draftQ.trim());};
  return <main className="catalogPageNew">
    <div className="catalogHero"><div><span className="eyebrow">THE RR MASALA PANTRY</span><h1>{q?<>Results for <em>“{q}”</em></>:`Everything for your pantry.`}</h1><p>{products.length ? `${products.length}+ products ready to discover` : 'Masalas, podis, pickles, vadagams and ready mixes.'}</p></div><form className="catalogSearch" onSubmit={applySearch}><Search size={19}/><input value={draftQ} onChange={e=>setDraftQ(e.target.value)} placeholder="Search products..."/>{draftQ&&<button type="button" onClick={()=>{setDraftQ('');setQ('')}}><X size={16}/></button>}</form></div>
    <div className="catalogBar"><div className="chipRow"><button className={!category?'chip active':''} onClick={()=>setCategory('')}>All</button>{cats.map(c=><button className={category===c.slug?'chip active':'chip'} key={c._id} onClick={()=>setCategory(c.slug)}>{c.name}</button>)}</div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest</option><option value="popular">Popular</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option><option value="name">Name A-Z</option></select></div>
    {loading?<div className="skeletonGrid">{Array.from({length:8}).map((_,i)=><div className="skeleton" key={i}/>)}</div>:error?<div className="errorPanel"><h3>Catalogue unavailable</h3><p>{error}</p><Link className="primary" to="/">Back to home</Link></div>:<ProductGrid products={products}/>} 
  </main>
}
