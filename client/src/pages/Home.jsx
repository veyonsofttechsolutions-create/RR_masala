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

/* =========================================================
   WHITE CLOTH THEATER PRELOADER WITH AUDIO GREETING
========================================================= */
function TheaterPreloader() {
  // 1. Check if user is visiting for the first time in this browser session
  const [isFirstVisit] = useState(() => !sessionStorage.getItem("rr_home_visited"));
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(isFirstVisit);

  useEffect(() => {
    // If not first visit, exit immediately. No delay, no sound.
    if (!isFirstVisit) {
      setRender(false);
      return;
    }

    // Set storage so next time it skips
    sessionStorage.setItem("rr_home_visited", "true");

    // --- SAFE AUDIO & VOICE GREETING LOGIC ---
    try {
      const bgMusic = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=ambient-piano-amp-strings-10711.mp3");
      bgMusic.volume = 0.2; 
      const playPromise = bgMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => console.log("Autoplay blocked:", error));
      }

      // Voice Greeting
      if ('speechSynthesis' in window) {
        const speakGreeting = () => {
          const greeting = new SpeechSynthesisUtterance("Welcome to R R Masala da!");
          const voices = window.speechSynthesis.getVoices();
          const massVoice = voices.find(v => 
            v.lang === 'ta-IN' || 
            v.name.includes('Valluvar') || 
            v.name.includes('Ravi') || 
            (v.lang === 'en-IN' && v.name.includes('Male'))
          );

          if (massVoice) greeting.voice = massVoice;
          greeting.volume = 1;
          greeting.rate = 0.85; 
          greeting.pitch = 0.6; 
          
          window.speechSynthesis.speak(greeting);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
          speakGreeting();
        } else {
          window.speechSynthesis.onvoiceschanged = speakGreeting;
        }
      }

      setTimeout(() => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }, 4500);
    } catch (err) {
      console.log("Audio init failed, skipping...", err);
    }
    // --- END SAFE AUDIO LOGIC ---

    // Timers for curtain animation
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setRender(false);
    }, 2800);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isFirstVisit]);

  // If not rendering, return null immediately (Zero delay for returning users)
  if (!render) return null;

  return (
    <div className={`rrTheaterCurtain ${isOpen ? "isOpen" : ""}`} aria-hidden="true">
      <div className="rrClothHalf rrClothLeft">
        <div className="rrClothFolds" />
      </div>
      <div className="rrClothHalf rrClothRight">
        <div className="rrClothFolds" />
      </div>
      
      <div className="rrCurtainLogoBox">
        <img src="/logo.png" alt="RR MASALA" className="rrCurtainLogoImg" />
        <div className="rrCurtainLoader" />
      </div>

      <style>{`
        .rrTheaterCurtain {
          position: fixed !important;
          inset: 0 !important;
          z-index: 999999 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .rrClothHalf {
          position: absolute;
          top: 0; bottom: 0; width: 50%;
          background: #ffffff;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.05);
          transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1) 0.4s;
          will-change: transform;
        }
        .rrClothLeft { left: 0; transform-origin: left; border-right: 1px solid rgba(0,0,0,0.05); }
        .rrClothRight { right: 0; transform-origin: right; border-left: 1px solid rgba(0,0,0,0.05); }
        .rrClothFolds {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.03) 10%, transparent 20%);
        }
        .rrTheaterCurtain.isOpen .rrClothLeft { transform: translateX(-100%); }
        .rrTheaterCurtain.isOpen .rrClothRight { transform: translateX(100%); }
        .rrCurtainLogoBox {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 15px;
          transition: opacity 0.4s ease;
        }
        .rrTheaterCurtain.isOpen .rrCurtainLogoBox { opacity: 0; }
        .rrCurtainLogoImg { height: 190px; object-fit: contain; }
        .rrCurtainLoader { width: 120px; height: 2px; background: rgba(0,0,0,0.1); position: relative; overflow: hidden; }
        .rrCurtainLoader::before {
          content: ""; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%; background: #fbb034;
          animation: rrTheaterLoad 1.5s ease-in-out forwards;
        }
        @keyframes rrTheaterLoad { 0% { left: -100%; } 100% { left: 0; } }
      `}</style>
    </div>
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
        setError("Live products could not be loaded.");
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
      <TheaterPreloader />

      {/* ================================================================
          1. CINEMATIC HD HERO — 5 REAL VIDEO SCENES (CLEANED)
      ================================================================ */}
      <section className="rrMultiRainHero">
        <div className="rrCinematicSequence" aria-hidden="true">
          {CINEMATIC_SCENES.map((scene, index) => (
            <div
              className={`rrCinematicFrame ${index === cinematicScene ? "isActive" : ""}`}
              key={scene.label}
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
              >
                <source src={scene.src} type="video/mp4" />
              </video>
            </div>
          ))}

          <div className="rrCinematicSceneTint" />
          <div className="rrCinematicWarmLight" />
          <div className="rrCinematicVignette" />
          <div className="rrCinematicEdgeFade" />
        </div>

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