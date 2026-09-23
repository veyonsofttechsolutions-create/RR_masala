import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Truck,
  Sparkles,
  Award,
  Search,
  Flame,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { API } from "../api/http.js";
import ProductGrid from "../components/ProductGrid.jsx";

// Public folder-la irukka ungaloda 4 real images
const LOCAL_CHILLI = "/hero-chilli.webp";
const LOCAL_TOMATO = "/hero-tomoto.png";
const LOCAL_ANISE = "/hero-anise.png";
const LOCAL_CINNAMON = "/hero-cinnamon.webp";

const CINEMATIC_SCENES = [
  { src: "/video-1.mp4", label: "TEMPLE" },
  { src: "/video-2.mp4", label: "SPICE FIELDS" },
  { src: "/video-3.mp4", label: "WHOLE SPICES" },
  { src: "/video-4.mp4", label: "MASALA" },
  { src: "/video-5.mp4", label: "RR MASALA" },
];

const CINEMATIC_SCENE_MS = 4200;


const categoryConfig = [
  { name: "Non-Veg Masala", subtitle: "Mutton / Chicken / Meen", slug: "non-veg-masala" },
  { name: "Biryani Masala", subtitle: "Royal Ambur & Dindigul", slug: "biryani-masala" },
  { name: "Chettinad Rasam", subtitle: "Black Pepper & Cumin", slug: "rasam" },
  { name: "Heritage Sambar", subtitle: "Coriander & Fenugreek", slug: "sambar" },
  { name: "Podi Varieties", subtitle: "Ellu / Karuveppilai / Paruppu", slug: "idly-podi" },
  { name: "Paruppu Podi", subtitle: "Ghee Rice Perfection", slug: "paruppu-podi" },
  { name: "Pure Asafoetida", subtitle: "Natural Compounded", slug: "perungayam" },
  { name: "Crispy Fry Powder", subtitle: "Golden Crunch Batter", slug: "chicken-fry-corn-powder" },
  { name: "Puliyotharai Paste", subtitle: "Temple Feast Tamarind", slug: "puliyotharai-paste" },
];

function getProductImage(product) {
  if (!product) return "";
  return (
    product.thumbnail ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.image ||
    product.imageUrl ||
    ""
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cinematicScene, setCinematicScene] = useState(0);
  const cinematicVideoRefs = useRef([]);


  useEffect(() => {
    const timer = window.setInterval(() => {
      setCinematicScene((current) => (current + 1) % CINEMATIC_SCENES.length);
    }, CINEMATIC_SCENE_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    cinematicVideoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === cinematicScene) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise?.catch) playPromise.catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [cinematicScene]);

  useEffect(() => {
    let active = true;

    API.get("/products?limit=8&sort=popular")
      .then((r) => {
        if (!active) return;
        setProducts(r.data?.data?.items || []);
      })
      .catch(() => {
        if (!active) return;
        setError("Live productgalannu load maadalagilla. Backend-annu check maadi.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadCategoryImages = async () => {
      try {
        const results = await Promise.all(
          categoryConfig.map(async (category) => {
            try {
              const res = await API.get(
                `/products?limit=1&sort=newest&category=${encodeURIComponent(category.slug)}`
              );
              const item = res.data?.data?.items?.[0];
              return {
                slug: category.slug,
                image: getProductImage(item),
              };
            } catch {
              return { slug: category.slug, image: "" };
            }
          })
        );

        if (!active) return;

        const map = {};
        results.forEach((item) => {
          if (item.image) map[item.slug] = item.image;
        });
        setCategoryImages(map);
      } catch {
        // Safe fallback
      }
    };

    loadCategoryImages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rrHome">
      {/* ================================================================
          1. CINEMATIC HD HERO — 5 REAL VIDEO SCENES
      ================================================================ */}
      <section className="rrMultiRainHero">
        <div className="rrCinematicSequence" aria-hidden="true">
          {CINEMATIC_SCENES.map((scene, index) => (
            <div
              className={`rrCinematicFrame ${index === cinematicScene ? "isActive" : ""}`}
              key={scene.desktop}
            >
              <video
                ref={(node) => {
                  cinematicVideoRefs.current[index] = node;
                }}
                className="rrCinematicVideo"
                muted
                playsInline
                loop
                preload={index === 0 ? "auto" : "metadata"}
                poster={index === 0 ? "/hero-chilli.webp" : undefined}
              >
                <source src={scene.src} type="video/mp4" />
              </video>
            </div>
          ))}

          {/* Only a controlled dark readability layer — no blur layer. */}
          <div className="rrCinematicSceneTint" />
          <div className="rrCinematicWarmLight" />
          <div className="rrCinematicVignette" />
          <div className="rrCinematicEdgeFade" />
        </div>

        {/* Kinetic Heat & Glow Layers */}
        <div className="rrKineticAura rrKineticAura--one" />
        <div className="rrKineticAura rrKineticAura--two" />
        <div className="rrAromaDustCloud" />

        {/* Dense Rain Drops of All 4 Assets: Chilli, Tomato, Anise, Cinnamon */}
        <div className="rrRainDrop rrDrop--chilli1">
          <img src={LOCAL_CHILLI} alt="Guntur Chilli" />
        </div>
        <div className="rrRainDrop rrDrop--tomato1">
          <img src={LOCAL_TOMATO} alt="Fresh Tomato" />
        </div>
        <div className="rrRainDrop rrDrop--anise1">
          <img src={LOCAL_ANISE} alt="Star Anise" />
        </div>
        <div className="rrRainDrop rrDrop--cinnamon1">
          <img src={LOCAL_CINNAMON} alt="Ceylon Cinnamon" />
        </div>

        <div className="rrRainDrop rrDrop--chilli2">
          <img src={LOCAL_CHILLI} alt="Guntur Chilli" />
        </div>
        <div className="rrRainDrop rrDrop--tomato2">
          <img src={LOCAL_TOMATO} alt="Fresh Tomato" />
        </div>
        <div className="rrRainDrop rrDrop--anise2">
          <img src={LOCAL_ANISE} alt="Star Anise" />
        </div>
        <div className="rrRainDrop rrDrop--cinnamon2">
          <img src={LOCAL_CINNAMON} alt="Ceylon Cinnamon" />
        </div>

        <div className="rrRainDrop rrDrop--chilli3">
          <img src={LOCAL_CHILLI} alt="Guntur Chilli" />
        </div>
        <div className="rrRainDrop rrDrop--tomato3">
          <img src={LOCAL_TOMATO} alt="Fresh Tomato" />
        </div>
        <div className="rrRainDrop rrDrop--anise3">
          <img src={LOCAL_ANISE} alt="Star Anise" />
        </div>
        <div className="rrRainDrop rrDrop--cinnamon3">
          <img src={LOCAL_CINNAMON} alt="Ceylon Cinnamon" />
        </div>

        {/* Masala Podi Splashes / Ground Impact Bursts */}
        <div className="rrImpactBurst rrBurst1" />
        <div className="rrImpactBurst rrBurst2" />
        <div className="rrImpactBurst rrBurst3" />
        <div className="rrImpactBurst rrBurst4" />

        {/* Flame Spark Embers */}
        <div className="rrFireSpark rrSpark1" />
        <div className="rrFireSpark rrSpark2" />
        <div className="rrFireSpark rrSpark3" />
        <div className="rrFireSpark rrSpark4" />
        <div className="rrFireSpark rrSpark5" />

        <div className="rrHeroInner">
          <div className="rrHeroContent">
            <div className="rrHeroPill">
              <Flame size={15} className="rrFlameIcon" />
              <span>THE ROAR OF AUTHENTIC SOUTH TRADITION</span>
            </div>

            <h1 className="rrHeroTitle">
              <span className="rrTitleLine1">THUNDER OF PURE</span>
              <span className="rrTitleLine2">TAMIL FLAVOUR</span>
            </h1>

            <p className="rrHeroDescription">
              Zero preservatives. Zero artificial red colours. Pure Guntur chillies,
              Salem golden turmeric, and hand-roasted spices exploded into micro-fine
              stone-ground heritage power for your kitchen.
            </p>

            <div className="rrHeroActions">
              <Link className="rrShopButton" to="/products">
                <ShoppingBag size={18} />
                <span>EXPLORE ALL MASALAS</span>
                <ArrowRight size={18} className="rrBtnArrow" />
              </Link>
              <Link className="rrHeroExplore" to="/category/biryani-masala">
                <span>Biryani Master Blends</span>
                <ChevronRight size={17} />
              </Link>
            </div>

            <div className="rrHeroTrust">
              <div className="rrTrustCapsule">
                <Leaf size={15} /> <span>100% Native Spices</span>
              </div>
              <div className="rrTrustCapsule">
                <Award size={15} /> <span>Stone Cold Ground</span>
              </div>
              <div className="rrTrustCapsule">
                <ShieldCheck size={15} /> <span>Zero Preservatives</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rrHeroBottomFade" />
      </section>

      {/* ================================================================
          2. SHOP BY CATEGORY
      ================================================================ */}
      <section className="categorySection">
        <div className="sectionHeadingCenter">
          <span className="eyebrowText">FIRE ROASTED HERITAGE</span>
          <h2>Shop by Category</h2>
          <div className="headingRule">
            <span />
            <i />
            <span />
          </div>
        </div>

        <div className="categoryGrid">
          {categoryConfig.map((cat) => {
            const img = categoryImages[cat.slug];
            return (
              <Link
                to={`/category/${cat.slug}`}
                className="categoryCard"
                key={cat.slug}
              >
                <div className="categoryImageFrame">
                  {img ? (
                    <img src={img} alt={cat.name} loading="lazy" />
                  ) : (
                    <div className="categoryImagePlaceholder">
                      <Search size={24} />
                    </div>
                  )}
                </div>
                <div className="categoryCardContent">
                  <h3>
                    <span>{cat.name}</span>
                    <ArrowRight size={13} />
                  </h3>
                  {cat.subtitle && <p>{cat.subtitle}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          3. TRUST STRIP
      ================================================================ */}
      <section className="rrTrustBar">
        <div className="trustContainer">
          <div className="trustItem">
            <div className="trustIconWrap">
              <Leaf size={24} />
            </div>
            <div>
              <strong>100% Pure &amp; Chemical Free</strong>
              <span>Zero added MSG, synthetic colour, or wax</span>
            </div>
          </div>

          <div className="trustItem">
            <div className="trustIconWrap">
              <Award size={24} />
            </div>
            <div>
              <strong>Traditional Stone Grinding</strong>
              <span>Retaining high volatile spice aroma oils</span>
            </div>
          </div>

          <div className="trustItem">
            <div className="trustIconWrap">
              <Truck size={24} />
            </div>
            <div>
              <strong>Pan-India Fast Dispatch</strong>
              <span>Direct mill dispatched safely to your pin code</span>
            </div>
          </div>

          <div className="trustItem">
            <div className="trustIconWrap">
              <BadgeCheck size={24} />
            </div>
            <div>
              <strong>Vacuum Aromalock Seal</strong>
              <span>Bursting freshness every time you unpack</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. POPULAR PRODUCTS (REAL BACKEND API)
      ================================================================ */}
      <section className="productsSection">
        <div className="sectionTop">
          <div>
            <span className="eyebrowText">FRESH FROM TODAY'S ROAST</span>
            <h2>Popular Blends This Week</h2>
          </div>
          <Link className="textLink" to="/products">
            <span>View Full Catalogue</span>
            <ChevronRight size={17} />
          </Link>
        </div>

        {error ? (
          <div className="apiNotice">
            <span>{error}</span>
            <Link to="/products">Browse Catalogue</Link>
          </div>
        ) : loading ? (
          <div className="skeletonGrid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton" key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      {/* ================================================================
          5. HERITAGE STORY
      ================================================================ */}
      <section className="rrStorySection">
        <div className="storyContainer">
          <div className="storyText">
            <span className="eyebrowText">GENERATIONS OF PASSION</span>
            <h2>Real Spices Do Not Need Added Chemicals.</h2>
            <p>
              RR MASALA produces spices with uncompromised integrity. High-yield
              Tamil Nadu chillies roasted on wood-fire, blended with dry ginger,
              cumin, and black pepper produce an explosive aroma that commercial
              machines can never match.
            </p>
            <p>
              From Chettinad feasts to daily pepper rasams, we deliver real
              unadulterated spice mastery straight to your kitchen table.
            </p>
            <Link className="storyButton" to="/about">
              <span>Read Our Full Story</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="storyPillars">
            <div className="pillarCard">
              <Leaf size={28} />
              <h4>Hand-Selected Harvest</h4>
              <p>Direct farm sourcing with rigorous batch purity analysis.</p>
            </div>
            <div className="pillarCard">
              <ShieldCheck size={28} />
              <h4>Aroma Lock Metal Pouch</h4>
              <p>Moisture barrier preserving essential oils for up to 12 months.</p>
            </div>
            <div className="pillarCard">
              <BadgeCheck size={28} />
              <h4>Export Standard Compliant</h4>
              <p>Hygienically packaged meeting domestic and global food safety norms.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}