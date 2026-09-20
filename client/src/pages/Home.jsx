import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Truck,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { API } from "../api/http.js";
import ProductGrid from "../components/ProductGrid.jsx";

/*
  Product/category images are loaded from the backend.
  The hero uses a real online Indian-spice photograph.

  Replace HERO_IMAGE with your own licensed/owned image later if desired.
*/
const HERO_IMAGE=
  "https://www.pvporganics.com/spices.png";

const H3 = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80";

const categoryConfig = [
  { name: "Non-Veg Masala", subtitle: "(Chicken / Mutton / Fish)", slug: "non-veg-masala" },
  { name: "Briyani Masala", subtitle: "", slug: "biryani-masala" },
  { name: "Rasam Powder", subtitle: "", slug: "rasam" },
  { name: "Sambar Powder", subtitle: "", slug: "sambar" },
  { name: "Idly Podi", subtitle: "(Ellu / Karuvepillai / Paruppu)", slug: "idly-podi" },
  { name: "Paruppu Podi", subtitle: "", slug: "paruppu-podi" },
  { name: "Perungayam", subtitle: "(Asafoetida)", slug: "perungayam" },
  { name: "Chicken Fry Corn Powder", subtitle: "(Veg & Non-Veg)", slug: "chicken-fry-corn-powder" },
  { name: "Puliyothaai Paste", subtitle: "", slug: "puliyotharai-paste" },
];

function getProductImage(product) {
  if (!product) return "";
  return (
    product.thumbnail ||
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
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    API.get("/products?limit=8&sort=popular")
      .then((r) => {
        if (!active) return;
        setProducts(r.data?.data?.items || []);
      })
      .catch(() => {
        if (!active) return;
        setError(
          "Unable to load live products. Check that the backend is running on port 5000."
        );
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
              const response = await API.get(
                `/products?limit=1&sort=newest&category=${encodeURIComponent(
                  category.slug
                )}`
              );

              const item = response.data?.data?.items?.[0];

              return {
                slug: category.slug,
                image: getProductImage(item),
              };
            } catch {
              return {
                slug: category.slug,
                image: "",
              };
            }
          })
        );

        if (!active) return;

        const map = {};
        results.forEach((item) => {
          if (item.image) map[item.slug] = item.image;
        });

        setCategoryImages(map);
      } finally {
        if (active) setCategoriesLoading(false);
      }
    };

    loadCategoryImages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="rrHome">
      <style>{`
        .rrHome {
          --rr-black: #160c07;
          --rr-black-2: #21100a;
          --rr-gold: #f7b719;
          --rr-gold-2: #ffca3a;
          --rr-brown: #702c12;
          --rr-brown-dark: #351307;
          --rr-cream: #faf8f4;
          --rr-card: #fff;
          --rr-line: #e9ddd2;
          --rr-text: #2b170f;
          --rr-muted: #776d65;
          background: var(--rr-cream);
          color: var(--rr-text);
          overflow: hidden;
        }

        /* ================================================================
           HERO — REAL SPICE PHOTOGRAPH + SCREENSHOT-LIKE COMPOSITION
        ================================================================ */

        .rrHero {
          min-height: 475px;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          background: #2b1207;
        }

        .rrHeroPhoto {
          position: absolute;
          inset: 0;
          z-index: -4;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .rrHeroImageShade {
          position: absolute;
          inset: 0;
          z-index: -3;
          background:
            linear-gradient(
              90deg,
              rgba(12, 6, 3, .94) 0%,
              rgba(22, 9, 3, .82) 28%,
              rgba(45, 14, 4, .48) 53%,
              rgba(40, 12, 3, .13) 78%,
              rgba(20, 7, 2, .20) 100%
            );
        }

        .rrHeroWarm {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            radial-gradient(
              circle at 78% 50%,
              rgba(255, 177, 38, .28),
              transparent 35%
            ),
            linear-gradient(
              180deg,
              rgba(0,0,0,.06),
              rgba(0,0,0,.20)
            );
          pointer-events: none;
        }

        .rrHeroInner {
          width: min(1280px, 90%);
          min-height: 475px;
          margin: auto;
          display: grid;
          grid-template-columns: 48% 52%;
          align-items: center;
          position: relative;
        }

        .rrHeroContent {
          position: relative;
          z-index: 4;
          padding: 34px 0;
        }

        .rrHeroPill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding: 8px 14px;
          border-radius: 20px;
          background: rgba(255, 246, 220, .96);
          color: #9b5a11;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.7px;
          box-shadow: 0 8px 25px rgba(0,0,0,.12);
        }

        .rrHeroPill span {
          color: var(--rr-gold);
          font-size: 14px;
        }

        .rrHeroTitle {
          max-width: 640px;
          margin: 0;
          color: #fff;
          font-size: clamp(48px, 5.3vw, 77px);
          line-height: .94;
          letter-spacing: -3.4px;
          font-weight: 900;
        }

        .rrHeroTitle em {
          color: var(--rr-gold);
          font-style: normal;
        }

        .rrHeroDescription {
          max-width: 550px;
          margin: 23px 0 25px;
          color: #f6e8dc;
          font-size: 15px;
          line-height: 1.7;
        }

        .rrHeroActions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
        }

        .rrShopButton {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 22px;
          border-radius: 26px;
          background: var(--rr-gold);
          color: #251309;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 10px 25px rgba(0,0,0,.24);
          transition: transform .2s ease, background .2s ease;
        }

        .rrShopButton:hover {
          transform: translateY(-2px);
          background: var(--rr-gold-2);
        }

        .rrHeroExplore {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
        }

        .rrHeroExplore:hover {
          color: var(--rr-gold);
        }

        .rrHeroTrust {
          display: flex;
          flex-wrap: wrap;
          gap: 19px;
          margin-top: 28px;
        }

        .rrHeroTrust span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #f1ded0;
          font-size: 10px;
          font-weight: 750;
        }

        .rrHeroTrust svg {
          color: var(--rr-gold);
        }

        .rrHeroVisual {
          position: relative;
          align-self: stretch;
          min-height: 475px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .rrHeroVisual::before {
          content: "";
          position: absolute;
          right: -8%;
          width: 650px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(255, 185, 51, .25),
            rgba(141, 49, 7, .12) 46%,
            transparent 72%
          );
          filter: blur(8px);
        }

        .rrHeroVisualFrame {
          position: relative;
          width: 91%;
          max-width: 600px;
          aspect-ratio: 1.3 / 1;
          overflow: hidden;
          border-radius: 46% 46% 10% 10% / 38% 38% 10% 10%;
          box-shadow: 0 30px 65px rgba(0,0,0,.34);
          border: 1px solid rgba(255,211,112,.24);
        }

        .rrHeroVisualFrame::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(35, 12, 4, .15),
              transparent 35%,
              rgba(0,0,0,.05)
            );
        }

        .rrHeroVisualFrame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transform: scale(1.05);
        }

        .rrHeroBadge {
          position: absolute;
          top: 18%;
          right: -1%;
          width: 104px;
          height: 104px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 50%;
          background: rgba(32, 15, 7, .92);
          border: 2px solid rgba(248, 183, 25, .9);
          box-shadow: 0 12px 25px rgba(0,0,0,.28);
          transform: rotate(7deg);
        }

        .rrHeroBadge strong {
          color: var(--rr-gold);
          font-size: 27px;
          line-height: 1;
        }

        .rrHeroBadge span {
          margin-top: 5px;
          color: #f6e8dc;
          font-size: 8px;
          line-height: 1.25;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .7px;
        }

        /* ================================================================
           CATEGORY SECTION — SAME VISUAL LANGUAGE AS USER SCREENSHOT
        ================================================================ */

        .categoryExact {
          width: 100%;
          padding: 24px 20px 27px;
          background: #fbfaf8;
        }

        .exactHeading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 25px;
          margin-bottom: 24px;
        }

        .exactHeading span {
          width: 70px;
          height: 2px;
          position: relative;
          background: #93421e;
        }

        .exactHeading span::after {
          content: "";
          position: absolute;
          left: 0;
          top: -1px;
          width: 20px;
          height: 4px;
          background: #c89040;
        }

        .exactHeading h2 {
          margin: 0;
          color: #3b1c11;
          font-size: 29px;
          line-height: 1.1;
          font-weight: 900;
        }

        .categoryExactGrid {
          width: min(1480px, 100%);
          margin: auto;
          display: grid;
          grid-template-columns: repeat(9, minmax(0, 1fr));
          gap: 9px;
        }

        .categoryExactCard {
          min-width: 0;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          background: #fff;
          border: 1px solid #eee6dd;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(61,31,12,.06);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .categoryExactCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 13px 27px rgba(61,31,12,.13);
        }

        .categoryExactImage {
          aspect-ratio: 1.14 / 1;
          overflow: hidden;
          background: #f1e9df;
        }

        .categoryExactImage img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .35s ease;
        }

        .categoryExactCard:hover .categoryExactImage img {
          transform: scale(1.07);
        }

        .categoryImagePlaceholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          color: #a08370;
        }

        .categoryExactInfo {
          min-height: 59px;
          padding: 8px 5px 9px;
          text-align: center;
        }

        .categoryExactInfo h3 {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          color: #29160e;
          font-size: 11px;
          line-height: 1.3;
          font-weight: 900;
        }

        .categoryExactInfo p {
          margin: 3px 0 0;
          color: #77706b;
          font-size: 8.5px;
          line-height: 1.25;
        }

        /* ================================================================
           TRUST STRIP
        ================================================================ */

        .trustExact {
          width: min(1180px, 92%);
          margin: auto;
          padding: 25px 0;
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 20px;
        }

        .trustExactItem {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
        }

        .trustExactItem svg {
          flex: 0 0 auto;
          color: #823515;
        }

        .trustExactItem strong {
          display: block;
          color: #4b2314;
          font-size: 12px;
        }

        .trustExactItem span {
          display: block;
          margin-top: 3px;
          color: #81766e;
          font-size: 9px;
        }

        .trustExactDivider {
          width: 1px;
          height: 38px;
          background: #dfc18b;
        }

        /* ================================================================
           PRODUCTS
        ================================================================ */

        .productsSection {
          width: min(1220px, 92%);
          margin: auto;
          padding-top: 38px;
          padding-bottom: 55px;
        }

        .sectionTop {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #a05a2b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .sectionTop h2 {
          margin: 0;
          color: #351a10;
          font-size: 28px;
          line-height: 1.1;
        }

        .textLink {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #6d2d16;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
        }

        .textLink:hover {
          color: #bd651e;
        }

        .apiNotice {
          padding: 18px;
          border: 1px solid #eadbd0;
          border-radius: 12px;
          background: #fff;
          color: #705d51;
          font-size: 13px;
        }

        .apiNotice a {
          margin-left: 12px;
          color: #8a3c17;
          font-weight: 800;
        }

        .skeletonGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .skeleton {
          height: 280px;
          border-radius: 14px;
          background:
            linear-gradient(
              100deg,
              #eee8e1 25%,
              #f8f5f0 38%,
              #eee8e1 55%
            );
          background-size: 250% 100%;
          animation: rrShimmer 1.3s infinite;
        }

        @keyframes rrShimmer {
          to { background-position: -250% 0; }
        }

        /* ================================================================
           STORY
        ================================================================ */

        .storyStrip {
          width: min(1180px, 92%);
          margin: 10px auto 65px;
          padding: 45px;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 45px;
          align-items: center;
          border-radius: 22px;
          background:
            radial-gradient(circle at 80% 20%, rgba(210,113,20,.13), transparent 30%),
            #f3e9dc;
          border: 1px solid #eadbca;
        }

        .storyStrip h2 {
          margin: 0;
          max-width: 550px;
          color: #381b10;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.03;
        }

        .storyStrip p {
          max-width: 540px;
          color: #756960;
          font-size: 14px;
          line-height: 1.75;
        }

        .storyStrip .primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 19px;
          border-radius: 24px;
          background: #4a1d10;
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
        }

        .storyTiles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .storyTiles > div {
          min-height: 150px;
          padding: 20px 13px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 8px;
          background: rgba(255,255,255,.72);
          border: 1px solid #e5d7c7;
          border-radius: 15px;
        }

        .storyTiles svg {
          color: #873a18;
        }

        .storyTiles b {
          color: #3d1b0f;
          font-size: 11px;
        }

        .storyTiles span {
          color: #81766e;
          font-size: 9px;
        }

        /* ================================================================
           RESPONSIVE
        ================================================================ */

        @media (max-width: 1200px) {
          .categoryExactGrid {
            grid-template-columns: repeat(5, 1fr);
            max-width: 1000px;
          }

          .rrHeroInner {
            width: 88%;
          }

          .rrHeroVisualFrame {
            width: 96%;
          }
        }

        @media (max-width: 900px) {
          .rrHero {
            min-height: 570px;
          }

          .rrHeroInner {
            min-height: 570px;
            grid-template-columns: 1fr;
          }

          .rrHeroContent {
            padding-top: 55px;
            padding-bottom: 45px;
          }

          .rrHeroVisual {
            position: absolute;
            right: -17%;
            bottom: -50px;
            width: 68%;
            min-height: 390px;
            opacity: .42;
          }

          .rrHeroTitle {
            font-size: 57px;
          }

          .rrHeroImageShade {
            background:
              linear-gradient(
                90deg,
                rgba(12,6,3,.91),
                rgba(31,10,3,.70)
              );
          }

          .trustExact {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .trustExactDivider {
            display: none;
          }

          .storyStrip {
            grid-template-columns: 1fr;
          }

          .skeletonGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 620px) {
          .rrHero {
            min-height: 555px;
          }

          .rrHeroInner {
            min-height: 555px;
            width: 88%;
          }

          .rrHeroContent {
            padding-top: 42px;
          }

          .rrHeroTitle {
            font-size: 43px;
            letter-spacing: -1.6px;
          }

          .rrHeroDescription {
            max-width: 360px;
            font-size: 13px;
          }

          .rrHeroVisual {
            width: 95%;
            right: -55%;
            bottom: -50px;
            opacity: .25;
          }

          .rrHeroBadge {
            right: 8%;
            top: 17%;
            width: 85px;
            height: 85px;
          }

          .rrHeroBadge strong {
            font-size: 23px;
          }

          .exactHeading {
            gap: 10px;
          }

          .exactHeading h2 {
            font-size: 22px;
            white-space: nowrap;
          }

          .exactHeading span {
            width: 35px;
          }

          .categoryExact {
            padding-left: 9px;
            padding-right: 9px;
          }

          .categoryExactGrid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .categoryExactInfo h3 {
            font-size: 10px;
          }

          .categoryExactInfo p {
            font-size: 8px;
          }

          .trustExact {
            grid-template-columns: 1fr;
            gap: 17px;
            padding: 22px 0;
          }

          .sectionTop {
            align-items: start;
          }

          .sectionTop h2 {
            font-size: 23px;
          }

          .productsSection {
            padding-top: 25px;
            padding-bottom: 40px;
          }

          .storyStrip {
            padding: 28px 20px;
            border-radius: 16px;
            margin-bottom: 40px;
          }

          .storyTiles {
            grid-template-columns: 1fr;
          }

          .storyTiles > div {
            min-height: 100px;
          }

          .skeletonGrid {
            gap: 9px;
          }

          .skeleton {
            height: 220px;
          }
        }

        @media (max-width: 380px) {
          .rrHeroTitle {
            font-size: 37px;
          }

          .rrHeroActions {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      {/* ================================================================
          HERO
      ================================================================ */}

      <section className="rrHero">
        <img
          className="rrHeroPhoto"
          src={H3}
          alt="Indian spices and masala powders"
          loading="eager"
        />

        <div className="rrHeroImageShade" />
        <div className="rrHeroWarm" />

        <div className="rrHeroInner">
          <div className="rrHeroContent">
            <div className="rrHeroPill">
              <span>✦</span>
              AUTHENTIC SOUTH INDIAN PANTRY
            </div>

            <h1 className="rrHeroTitle">
              Authentic Spices
              <br />
              <em>for Every Kitchen</em>
            </h1>

            <p className="rrHeroDescription">
              Bring home the true taste of tradition with our premium
              quality spices and pantry essentials. Pure. Fresh. Full of
              flavour.
            </p>

            <div className="rrHeroActions">
              <Link className="rrShopButton" to="/products">
                Shop Now
                <ArrowRight size={18} />
              </Link>

              <Link className="rrHeroExplore" to="/category/ready-mix">
                Explore Ready Mix
                <ChevronRight size={17} />
              </Link>
            </div>

            <div className="rrHeroTrust">
              <span>
                <ShieldCheck size={15} />
                Quality-first
              </span>

              <span>
                <Truck size={15} />
                Pan-India delivery
              </span>

              <span>
                <BadgeCheck size={15} />
                COD available
              </span>
            </div>
          </div>

          <div className="rrHeroVisual" aria-hidden="true">
            <div className="rrHeroVisualFrame">
              <img
                src={HERO_IMAGE}
                alt=""
                loading="eager"
              />
            </div>

            <div className="rrHeroBadge">
              <strong>200+</strong>
              <span>
                pantry
                <br />
                essentials
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SHOP BY CATEGORY
      ================================================================ */}

      <section className="categoryExact">
        <div className="exactHeading">
          <span />
          <h2>Shop by Category</h2>
          <span />
        </div>

        <div className="categoryExactGrid">
          {categoryConfig.map((category) => {
            const image = categoryImages[category.slug];

            return (
              <Link
                to={`/category/${category.slug}`}
                className="categoryExactCard"
                key={category.slug}
              >
                <div className="categoryExactImage">
                  {image ? (
                    <img
                      src={image}
                      alt={category.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="categoryImagePlaceholder">
                      <Search size={28} />
                    </div>
                  )}
                </div>

                <div className="categoryExactInfo">
                  <h3>
                    {category.name}
                    <ArrowRight size={12} />
                  </h3>

                  {category.subtitle && (
                    <p>{category.subtitle}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          TRUST STRIP
      ================================================================ */}

      <section className="trustExact">
        <div className="trustExactItem">
          <Leaf size={31} />
          <div>
            <strong>100% Pure &amp; Natural</strong>
            <span>No Added Preservatives</span>
          </div>
        </div>

        <div className="trustExactDivider" />

        <div className="trustExactItem">
          <BadgeCheck size={31} />
          <div>
            <strong>Premium Quality</strong>
            <span>Carefully Sourced</span>
          </div>
        </div>

        <div className="trustExactDivider" />

        <div className="trustExactItem">
          <Truck size={31} />
          <div>
            <strong>Fast &amp; Safe Delivery</strong>
            <span>Across India</span>
          </div>
        </div>

        <div className="trustExactDivider" />

        <div className="trustExactItem">
          <ShieldCheck size={31} />
          <div>
            <strong>Traditional Taste</strong>
            <span>Just Like Home</span>
          </div>
        </div>
      </section>

      {/* ================================================================
          PRODUCTS
      ================================================================ */}

      <section className="productsSection">
        <div className="sectionTop">
          <div>
            <span className="eyebrow">PANTRY PICKS</span>
            <h2>Popular this week</h2>
          </div>

          <Link className="textLink" to="/products">
            Shop all
            <ChevronRight size={17} />
          </Link>
        </div>

        {error ? (
          <div className="apiNotice">
            {error}
            <Link to="/products">Open catalogue</Link>
          </div>
        ) : loading ? (
          <div className="skeletonGrid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="skeleton" key={index} />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      {/* ================================================================
          STORY
      ================================================================ */}

      <section className="storyStrip">
        <div>
          <span className="eyebrow">ROOTED IN TRADITION</span>

          <h2>The taste of a familiar kitchen.</h2>

          <p>
            Simple pantry essentials, thoughtfully presented for modern
            shopping. Discover ingredients that make everyday meals feel
            like home.
          </p>

          <Link className="primary" to="/about">
            Our story
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="storyTiles">
          <div>
            <Leaf />
            <b>Traditional flavours</b>
            <span>South Indian inspired</span>
          </div>

          <div>
            <ShieldCheck />
            <b>Careful packing</b>
            <span>Made for your pantry</span>
          </div>

          <div>
            <Truck />
            <b>Easy delivery</b>
            <span>Track every order</span>
          </div>
        </div>
      </section>
    </main>
  );
}
