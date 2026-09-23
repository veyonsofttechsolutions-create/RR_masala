import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Wind,
  PackageCheck,
  Flame,
} from 'lucide-react';
import { API } from '../api/http.js';
import ProductGrid from '../components/ProductGrid.jsx';
import '../catalog.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'popular', label: 'Most popular' },
  { value: 'priceAsc', label: 'Price: low to high' },
  { value: 'priceDesc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
];

// Innum small cute size (cut aagaama muzhusa theriyum)
const HANGING_PACKS = [
  { id: 1, left: '5%', top: 2, size: 36, delay: '-0.3s', gustDelay: '-0.1s', idle: '4.2s', gustX: '38px', gustR: '18deg' },
  { id: 2, left: '17%', top: 8, size: 34, delay: '-1.5s', gustDelay: '-0.8s', idle: '4.8s', gustX: '46px', gustR: '22deg' },
  { id: 3, left: '30%', top: 3, size: 38, delay: '-0.8s', gustDelay: '-1.4s', idle: '4.4s', gustX: '42px', gustR: '19deg' },
  { id: 4, left: '44%', top: 9, size: 35, delay: '-2.1s', gustDelay: '-2.0s', idle: '4.9s', gustX: '52px', gustR: '24deg' },
  { id: 5, left: '58%', top: 2, size: 37, delay: '-1.0s', gustDelay: '-2.7s', idle: '4.3s', gustX: '44px', gustR: '20deg' },
  { id: 6, left: '72%', top: 8, size: 34, delay: '-2.6s', gustDelay: '-3.3s', idle: '4.7s', gustX: '54px', gustR: '25deg' },
  { id: 7, left: '84%', top: 3, size: 38, delay: '-1.7s', gustDelay: '-3.9s', idle: '4.5s', gustX: '48px', gustR: '21deg' },
  { id: 8, left: '94%', top: 7, size: 33, delay: '-2.9s', gustDelay: '-4.3s', idle: '4.8s', gustX: '56px', gustR: '26deg' },
];

function HangingPack({ item }) {
  return (
    <div
      className={`rrCatalogHangingItem rrCatalogHang${item.id}`}
      style={{
        left: item.left,
        '--idle': item.idle,
        '--delay': item.delay,
        '--gustDelay': item.gustDelay,
        '--box-size': `${item.size}px`,
        '--gust-x': item.gustX,
        '--gust-r': item.gustR,
      }}
      aria-hidden="true"
    >
      <img src="/box.png" alt="" onError={(e) => { e.currentTarget.style.opacity = '0'; }} />
    </div>
  );
}

export default function Catalog() {
  const [params] = useSearchParams();
  const route = useParams();

  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('newest');
  const [category, setCategory] = useState(params.get('category') || route.slug || '');
  const [q, setQ] = useState(params.get('q') || '');
  const [draftQ, setDraftQ] = useState(q);

  useEffect(() => {
    API.get('/categories')
      .then((r) => setCats(r.data?.data?.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const nextCategory = params.get('category') || route.slug || '';
    const nextQ = params.get('q') || '';
    setCategory(nextCategory);
    setQ(nextQ);
    setDraftQ(nextQ);
  }, [params, route.slug]);

  useEffect(() => {
    setLoading(true);
    setError('');

    const qs = new URLSearchParams({
      limit: 40,
      sort,
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
    });

    API.get(`/products?${qs}`)
      .then((r) => setProducts(r.data?.data?.items || []))
      .catch((e) => setError(e.response?.data?.message || 'Could not load products.'))
      .finally(() => setLoading(false));
  }, [sort, category, q]);

  const activeCategoryName = useMemo(() => {
    if (!category) return 'All products';
    return cats.find((item) => item.slug === category)?.name || category;
  }, [category, cats]);

  const applySearch = (e) => {
    e.preventDefault();
    setQ(draftQ.trim());
  };

  const clearSearch = () => {
    setDraftQ('');
    setQ('');
  };

  return (
    <main className="rrCatalogPage">
      {/* -------------------------------------------------------------
          CANOPY SCENE (BALANCED CINEMATIC PUYAL & MINI BOXES)
      ------------------------------------------------------------- */}
      <section className="rrCatalogHangingScene" aria-hidden="true">
        <div className="rrCatalogTsunamiBlast" />
        <div className="rrCatalogTopVine" />

        {/* Small Cute Hanging Boxes */}
        {HANGING_PACKS.map((item) => (
          <HangingPack key={item.id} item={item} />
        ))}

        {/* Floating Leaves */}
        <span className="rrCatalogLeaf rrCatalogLeaf1" />
        <span className="rrCatalogLeaf rrCatalogLeaf2" />
        <span className="rrCatalogLeaf rrCatalogLeaf3" />
        <span className="rrCatalogLeaf rrCatalogLeaf4" />
        <span className="rrCatalogLeaf rrCatalogLeaf5" />
        <span className="rrCatalogLeaf rrCatalogLeaf6" />

        {/* Smooth Wind Streaks */}
        <span className="rrCatalogWind w1" />
        <span className="rrCatalogWind w2" />
        <span className="rrCatalogWind w3" />

        {/* Balanced Timing Boom Text */}
        <div className="rrCatalogWindMessage">
          <p className="en">
            <Wind size={15} className="rrBoomIcon" />
            PURE FLAVOUR TSUNAMI
            <span>நல்ல சுவை நல்ல தேர்வில் தொடங்கும் · 100% PURE RR MASALA</span>
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------
          TOP BAR & NAVIGATION
      ------------------------------------------------------------- */}
      <div className="rrCatalogShell">
        <div className="rrCatalogHeaderBar">
          <div className="rrCatalogTitleWrap">
            <span className="rrCatalogPill">
              <Flame size={13} />
              RR MASALA PANTRY
            </span>
            <h1>
              {q ? (
                <>Search results for <em>“{q}”</em></>
              ) : (
                <>Our <em>Heritage Collection</em></>
              )}
            </h1>
          </div>

          <Link className="rrCatalogBack" to="/">
            Back to RR MASALA
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* -------------------------------------------------------------
            CONTROLS: SEARCH & SORT
        ------------------------------------------------------------- */}
        <section className="rrCatalogControlBar" aria-label="Product filters">
          <form className="rrCatalogSearch" onSubmit={applySearch}>
            <Search size={19} aria-hidden="true" />
            <input
              value={draftQ}
              onChange={(e) => setDraftQ(e.target.value)}
              placeholder="Search spices, masalas, podis, pickles..."
              aria-label="Search products"
            />
            {draftQ && (
              <button type="button" className="rrCatalogClear" onClick={clearSearch} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
            <button className="rrCatalogSearchButton" type="submit" aria-label="Search">
              <ArrowRight size={19} />
            </button>
          </form>

          <div className="rrCatalogFilter">
            <SlidersHorizontal size={17} />
            <select
              id="rr-catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="rrCatalogFilterChevron" />
          </div>
        </section>

        {/* -------------------------------------------------------------
            CATEGORY HORIZONTAL SCROLLER
        ------------------------------------------------------------- */}
        <section className="rrCatalogCategoryBar" aria-label="Shop by category">
          <div className="rrCatalogCategories">
            <button
              type="button"
              className={`rrCatalogChip ${!category ? 'active' : ''}`}
              onClick={() => setCategory('')}
            >
              All products
            </button>

            {cats.map((cat) => (
              <button
                type="button"
                className={`rrCatalogChip ${category === cat.slug ? 'active' : ''}`}
                key={cat._id || cat.slug}
                onClick={() => setCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------
            PRODUCTS GRID OR SKELETON
        ------------------------------------------------------------- */}
        <div className="rrCatalogResultHead">
          <div>
            <h2>{q ? `Results for “${q}”` : activeCategoryName}</h2>
            <p>Fresh stone-ground spices roasted and packed traditionally.</p>
          </div>
          {!loading && !error && (
            <span className="rrCatalogCount">
              <PackageCheck size={16} />
              {products.length} products
            </span>
          )}
        </div>

        <section className="rrCatalogProductArea">
          {loading ? (
            <div className="rrCatalogLoading">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="rrCatalogSkeleton" key={i}>
                  <div className="rrCatalogSkeletonImage" />
                  <div className="rrCatalogSkeletonBody">
                    <div className="rrCatalogSkeletonLine medium" />
                    <div className="rrCatalogSkeletonLine short" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rrCatalogEmpty">
              <div className="rrCatalogEmptyIcon">
                <PackageCheck size={26} />
              </div>
              <h3>Unable to load collection</h3>
              <p>{error}</p>
              <Link className="rrCatalogHomeButton" to="/">
                Back to home
              </Link>
            </div>
          ) : products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rrCatalogEmpty">
              <div className="rrCatalogEmptyIcon">
                <Search size={26} />
              </div>
              <h3>No products found</h3>
              <p>Try another search or choose a different category blend.</p>
              <button
                type="button"
                className="rrCatalogHomeButton"
                onClick={() => { setCategory(''); clearSearch(); }}
              >
                View all products
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}