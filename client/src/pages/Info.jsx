import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Globe2,
  HelpCircle,
  LockKeyhole,
  Mail,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
  Flame,
} from "lucide-react";
import { useEffect, useState } from "react";

/* =========================================================
   REAL SPICE PHOTOGRAPHY ASSETS (ENCODED FOR BROWSER URLS)
========================================================= */
const ASSETS = {
  chilli: "/hero-chilli.webp",
  tomato: "/hero-tomoto.png",
  anise: "/hero-anise.png",
  cinnamon: "/hero-cinnamon.webp",
  dishReal: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  box: "/box.png",
  logo: "/logo.png",
  idliPodi: encodeURI("/2-Minute Idli Podi Recipe _ Spicy South Indian Chutney Powder 🌶️.jpg"),
  puttu: encodeURI("/15 Platos de Sri Lanka_ Sabores y Recetas Emblemáticas.jpg"),
  ariUnda: encodeURI("/Ari unda.jpg"),
  biryaniMasala: encodeURI("/Biryani Masala.jpg"),
  chickenFry: encodeURI("/Delhi Jama Masjid Style Chicken Fry _ दिल्ली जैसा फ्राइड चिकन _ Shaadi Wala Chicken Fry.jpg"),
  spiceThali: encodeURI("/download.jpg"),
  sambarPodi: encodeURI("/download (2).jpg"),
  paruppuPodi: encodeURI("/download (3).jpg"),
  moringaPodi: encodeURI("/download (4).jpg"),
  sujatha: encodeURI("/WhatsApp Image 2026-09-18 at 9.48.35 AM.jpeg"),
};

/* =========================================================
   0. PRELOADER
========================================================= */
function TheaterPreloader() {
  return <div></div>;
}

/* =========================================================
   1. PRODUCT NEWS TICKER / SLIDER (WITH YOUR IMAGES & FALLBACK)
========================================================= */
const TICKER_PRODUCTS = [
  { name: "Madurai Idli Podi", img: ASSETS.idliPodi, fallback: ASSETS.idliPodi, tag: "TRADITIONAL RECIPE" },
  { name: "Chettinad Biryani Masala", img: ASSETS.biryaniMasala, fallback: ASSETS.anise, tag: "ROYAL AROMA" },
  { name: "Saurashtra Sambar Podi", img: ASSETS.sambarPodi, fallback: ASSETS.chilli, tag: "STONE GROUND" },
  { name: "Crispy Fry Masala", img: ASSETS.chickenFry, fallback: ASSETS.tomato, tag: "CHETTI HEAT" },
  { name: "Heritage Paruppu Podi", img: ASSETS.paruppuPodi, fallback: ASSETS.cinnamon, tag: "PURE NATIVE" },
  { name: "Organic Moringa Podi", img: ASSETS.moringaPodi, fallback: ASSETS.dishReal, tag: "FARM FRESH" },
  { name: "Traditional Ari Unda", img: ASSETS.ariUnda, fallback: ASSETS.box, tag: "VILLAGE SWEET" },
  { name: "Traditional Puttu Podi", img: ASSETS.puttu, fallback: ASSETS.dishReal, tag: "HOMESTYLE" },
  { name: "Tamil Nadu Spice Blend", img: ASSETS.spiceThali, fallback: ASSETS.anise, tag: "WHOLE SPICES" },
];

function ProductTickerSkyway() {
  const marqueeItems = [...TICKER_PRODUCTS, ...TICKER_PRODUCTS];

  return (
    <div className="rrTopSkyBackground" aria-label="Featured Spices Showcase">
      <div className="rrTickerTrack">
        {marqueeItems.map((item, idx) => (
          <div className="rrTickerItem" key={idx}>
            <div className="rrTickerImgBox">
              <img
                src={item.img}
                alt={item.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = item.fallback;
                }}
              />
            </div>
            <div className="rrTickerInfo">
              <span className="rrTickerTag">{item.tag}</span>
              <span className="rrTickerName">{item.name}</span>
            </div>
            <span className="rrTickerDot">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SHARED INFO SHELL
========================================================= */
export function Info({ title, eyebrow = "RR MASALA HERITAGE", description, icon: Icon = FileText, children }) {
  const nav = useNavigate();

  useEffect(() => {
    const root = document.querySelector(".rrInfoPage");
    if (!root) return;
    const nodes = root.querySelectorAll(
      ".rrPageHeader, .rrAboutHero, .rrNumberStrip, .rrStoryBlock, .rrSujathaStory, .rrIngredientSection, .rrHeritage, .rrQuote, .rrContact, .rrFaqPremium, .rrPolicy, .rrSuccess"
    );
    nodes.forEach((node) => node.classList.add("rrReveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("rrRevealVisible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [title]);

  return (
    <>
      <TheaterPreloader />
      
      <main className="rrInfoPage">
        <InfoStyles />

        {/* Top 120px Smooth Continuous Product News Slide */}
        <ProductTickerSkyway />

        <div className="rrInfoShell">
          <button className="rrBack" type="button" onClick={() => nav(-1)}>
            <ArrowLeft size={16} />
            <span>Back to previous page</span>
          </button>

          <header className="rrPageHeader">
            <div className="rrPageHeaderTop">
              <div className="rrHeaderIconBox">
                <Icon size={24} strokeWidth={2} />
              </div>
              <div className="rrHeaderMeta">
                <span className="rrEyebrow">{eyebrow}</span>
                <h1>{title}</h1>
              </div>
            </div>
            {description && <p className="rrHeaderDesc">{description}</p>}
          </header>

          {children}

          <div className="rrBottomShop">
            <Link to="/products" className="rrShopBtn">
              <ShoppingBag size={18} />
              <span>Explore All Authentic Masalas</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

/* =========================================================
   ABOUT US PAGE (POSITIVE PHRASING & SUJATHA PHOTO + ARTICLE)
========================================================= */
export const About = () => (
  <Info
    title="Our Heritage & Food Story"
    eyebrow="RR MASALA · CRAFTED IN TAMIL NADU"
    description="Carrying the sacred flavours of stone-ground Tamil Nadu spices, temple-style seasonings, and generations of ancestral kitchen memories to the world."
    icon={Utensils}
  >
    <div className="rrAbout">
      <section className="rrAboutHero">
        <div className="rrAboutHeroText">
          <span className="rrSectionEyebrow">MADURAI & CHETTINAD TRADITION</span>
          <h2>
            Food is pure emotion.
            <br />
            <em>It is sacred memory.</em>
          </h2>
          <p>
            Puliyodarai and sambar are shaped by sun-drenched Salem turmeric,
            cold-pressed gingelly oil, hand-picked Guntur chillies, and stone-ground
            traditions perfected over generations in South Indian family homes.
          </p>
          <div className="rrTrustPills">
            <span><Sparkles size={14} /> 100% Natural Colours</span>
            <span><Flame size={14} /> Woodfire Slow Roasting</span>
            <span><Globe2 size={14} /> International Export Grade</span>
          </div>
        </div>

        <div className="rrRealFoodVisual">
          <div className="rrRealPhotoCard">
            <img src={ASSETS.dishReal} alt="Traditional Tamil Nadu Spices" className="rrMainDishImg" />
            <div className="rrPhotoTag">
              <Sparkles size={13} />
              <span>TEMPLE STYLE PULIYODARAI &amp; MASALAS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rrNumberStrip">
        {[
          ["01", "Ancestral Formulas", "Handed down through Saurashtra & Chettinad elders."],
          ["02", "Cold Stone Milling", "Preserving natural volatile therapeutic spice oils."],
          ["03", "Farm-Direct Harvest", "Carefully collected whole spices from native soil."],
          ["04", "Aroma-Lock Pouches", "12-month vacuum freshness guarantee with pure ingredients."],
        ].map(([n, title, desc]) => (
          <div key={n} className="rrNumberCard">
            <div className="rrCardGlare" />
            <strong>{n}</strong>
            <b>{title}</b>
            <span>{desc}</span>
          </div>
        ))}
      </section>

      <section id="story" className="rrStoryBlock">
        <div className="rrSideLabel">01 · THE CULINARY SOUL</div>
        <div>
          <h2>
            Everyday spices crafted with care.
            <br />
            <em>A commitment to purity.</em>
          </h2>
          <div className="rrTwoColText">
            <p>
              At RR MASALA, we believe that true South Indian flavours thrive through
              patient, traditional techniques. Gentle grinding preserves the precious
              volatile oils that give spices their healing power and unmistakable fragrance.
            </p>
            <p>
              By selecting top-grade whole pods, slow-roasting them on gentle firewood
              heat, and cold stone-milling every batch, we preserve the vibrant colour
              and profound soul that make everyday home meals taste divine.
            </p>
          </div>
        </div>
      </section>

      {/* SUJATHA ARTICLE IN TAMIL WITH PHOTO */}
      <section className="rrSujathaStory">
        <div className="rrSujathaHeaderWrap">
          <div className="rrSujathaPhotoCard">
            <img
              src={ASSETS.sujatha}
              alt="எழுத்தாளர் சுஜாதா"
              className="rrSujathaImg"
            />
            <div className="rrSujathaPhotoFrame" />
          </div>
          <div className="rrSujathaTitleBox">
            <span className="rrSectionEyebrow">மதுரை சௌராட்டிர பாரம்பரியம்</span>
            <h2>மதுரை சௌராட்டிர சமூகத்தினர் செய்யும் புளியோதரை-யின் மகத்துவம் பற்றி எழுத்தாளர் சுஜாதா அவர்கள்!</h2>
            <span className="rrSujathaTag">#எழுத்தாளர்_சுஜாதா_அவர்களின்_புளியோதரை_புராணம்!</span>
          </div>
        </div>

        <div className="rrSujathaContent">
          <p>
            ரெஃப்ரிஜிரேட்டர் கண்டு பிடிக்கும் முன்பே தமிழன் “வச்சு வச்சு” சாப்பிட்டது புளி சாதத்தைத் தான்.! ஒரு வாரம் ஆனாலும் கெடாது.!
          </p>
          <p>
            அக்காலத்தில் வெளியூர் பயணங்களில் நம் கால்களே டாக்சியாக இருந்த காலத்தில் நம் பாட்டன்களின் பசியைப் போக்கிய வழிச் சோறு என்பது புளிச் சோறே! என்பது 100% உண்மை.!
          </p>
          <p>
            எப்போதும் சுவை மிகுந்த உணவுகளின் பட்டியலில் டாப் 5 இல் இடம் பிடிக்கக் கூடிய ஒரு உணவு புளியோதரை.! உப்பு, இனிப்பு, புளிப்பு, துவர்ப்பு, கார்ப்பு, கசப்பு என அறு சுவைகளும் உள்ள உணவு புளியோதரை.. இதன் நிறத்திலேயே அதன் தரத்தை அறிந்துவிடலாம்.. இதன் புராணம் மிகச் சுவையானது!
          </p>
          <p>
            புளியோதரைக்கு மணமும் நிறமும் இரு கண்கள்.. முதலில் புளியோதரைக்கு வடிக்கும் சாதத்தின் பதம் மிக முக்கியம்.. அது புதுமணத் தம்பதியர் போல பின்னிப் பிணைந்து குழைந்து இராமல்.. திருமணமாகி 10 ஆண்டுகள் ஆன தம்பதிகள் போல சற்று ஒட்டியும் ஒட்டாமலும் இருக்கும் பதமே சாலச் சிறந்தது..
          </p>
          <p>
            அடுத்து நிறம்.! புளியோதரை ஆழ்ந்த மஞ்சளில் இருப்பது மிகச்சிறப்பு.! சாதத்தை வடித்து ஆறவிட்டு பயன்படுத்துதல் புளியோதரைக்கு சரியான சமையல் முறையாகும்..
          </p>
          <p>
            அடுத்து எண்ணெய்.. நீங்கள் பில்கேட்ஸ் குடும்பமாக இருந்தாலும் எண்ணெய்க்கு பதிலாக நெய் எல்லாம் சேர்க்கக்கூடாது.. 'நல்லெண்ணெய்' என்னும் 'ஏக பத்தினி'-யை மட்டும் ஏற்றுக் கொள்வான் இந்த 'புளியோதரை என்னும் ராமச்சந்திர மூர்த்தி'! அதிலும் செக்கில் ஆட்டிய 'புனிதவதி எண்ணெய்' எனில் 'எந்தச் சீரும் வாங்காமல் சிறப்பாக இணைவான் இவன்'.
          </p>
          <p>
            அடுத்து புளி.. நேற்று முளைத்த புதுப்புளி கூடாது.! பழம் புளியே புளிக் காய்ச்சல் செய்வதற்கு மிகச் சிறந்தது.. புதுப்புளியில் செய்தால் புளியோதரை 'புளி'க்கு பிறந்த 'பூனை'யாகிவிடும்.! பழம் புளியில் தான் அது புலியாகும்!
          </p>
          <p>
            அடுத்து மிளகாய்.. நல்ல தரமான வதக்கும் போதே நெடியேறும்.. காரசார காய்ந்த மிளகாய்தான் பெரும் சிறப்பு.. அடுத்து இதற்கு மிகுந்த சுவை சேர்ப்பது கடலைப் பருப்புகள்.! கடலைப் பருப்பும் புளியோதரையும் நல்ல நண்பர்கள்! நல்லெண்ணெய் கமகமக்க ஒரு வாய் அள்ளிச் சுவைக்கையில் வாயில் அரைபடும் புளியோதரையின் கடலைப் பருப்பு பத்து பாதாம் பருப்புகளுக்குச் சமம்.!
          </p>
          <p>
            புளியோதரைக்கு மிகப் பொருத்தமான சாம்பார் இருப்பது அவசியம். இஞ்சி, பருப்பு, புதினா, கடலை, நவதானியம், இப்படி தேங்காய் சேர்க்காது புளி சேர்த்து அரைக்கும் துவையல்கள் நீண்ட நாள் உபயோகத்திற்கு.. பொட்டுக் கடலை தேங்காய் வைத்து அரைக்கும் துவையல் இன்ஸ்டண்ட் சுவர்க்கம்.!
          </p>
          <p>
            மதுரையில் சித்திரான்னங்களுக்கு பெயர் பெற்ற ஸௌராஷ்ட்ரா ஸமூக நண்பர்களுடன் பழகிய போது தான் 'ஒரு உலக உண்மையை இவ்வளவு நாள் அறிந்திராது இருந்திருக்கிறோமே' என்று உள் மனது 'உரைத்த' போது 'உறைத்தது'. ஸௌராஷ்ட்ரர்கள் செய்யும் புளியோதரை புளியோதரைகளின் மஹாராணி! அவர்கள் செய்யும் புளியோதரையை சாப்பிட்டவர்கள், இந்த ஜென்மத்தில் மற்ற புளியோதரை சாதத்தை ஒரு சிற்றரசி ஸ்தானத்தில் கூட வைக்க முடியாது. அவ்வளவு ருசியாக இருக்கும்.
          </p>
          <p>
            ஸௌராஷ்ட்ரர்கள் வீட்டில் செய்யும் புளியோதரைக்கு கருப்பு கொண்டைக் கடலை சுண்டலை தந்தார்கள்.... பக்கத்தில் சிறிது கொளுமிச்சங்காய் ஊறுகாய் வைத்தார்கள். அசுவாரஸ்யாமாக சாப்பிட்டால் சுவை ஆஹா.. அள்ளியது..! கூடவே இஞ்சி மிளகாய் சட்னி வேறு! பக்கத்தில் கடிக்க தேங்காய் பத்தை (மதுரைத் தமிழில்...தேங்காய் சில்) ஒரு துண்டு வைத்தார்கள். ஆஹா... என்ன ஒரு காம்பினேஷன். என் வாழ் நாளில் மறக்கவே முடியாத நிலை.
          </p>
          <p>
            ஆமாம்... அன்றைக்கு மாத்திரம் நான் நான்கு முறை திரும்பத் திரும்ப இலை நிறைய புளியோதரை சாப்பிட்டேன். இருந்தாலும், வயிற்றுப்போக்கு என்று... ஒரு கெடுதலும் செய்யவில்லை. எவ்வளவு ஆச்சரியம். "சொர்க்கத்தில் அறுசுவை உணவு உண்ணும் முன்பே இங்கேயே அதை அனுபவிக்க முடியும்" என்று அன்று என் உள் மனம் கருத்து சொன்னது.
          </p>
          <p>
            "ஸௌராஷ்ட்ரர்கள் செய்யும் புளியோதரைகளுக்கு நான் ஹேமநாத பாகவதர் பாண்டிய நாட்டிற்கு அடிமை என எழுதித் தந்தது போல எழுதித் தரச் சொன்னால்... கொஞ்சமும் தயங்காமல் மனதார எழுதித் தருவேன்." கோவில்களில், பெருமாளே வந்து கையேந்தும் பக்குவத்தில் மிகப் பிரமாதமாகச் செய்வார்கள். புளியோதரையை புண்ணியச் சோறு என்பார்!
          </p>
          <p>
            கல்யாண சமையல் சாதம் என்ற மாயாபஜார் படப் பாடல் வரிகளில்.. “புளியோதரையில் சோறு மிகப் பொருத்தமாய் சாம்பாரு” போல அருமையான புளியோதரை கிடைத்துவிட்டால் நாம் எல்லாருமே கடோத்கஜன்கள் தானே!!!
          </p>
          <span className="rrSujathaAuthor">— எழுத்தாளர் சுஜாதா.</span>
        </div>
      </section>

      <section className="rrIngredientSection">
        <div className="rrSectionHead">
          <div>
            <span className="rrSectionEyebrow">02 · RAW ESSENTIALS</span>
            <h2>What defines our aroma?</h2>
          </div>
          <p>Every single ingredient is cleaned, graded, sun-dried, and roasted to exact temperatures.</p>
        </div>
        <div className="rrIngredientGrid">
          {[
            ["01", "Native Guntur Chillies", "Balanced radiant heat and deep natural fiery colour.", ASSETS.chilli],
            ["02", "Organic Ripe Tomatoes", "Sun-ripened tanginess for rasam and gravy bases.", ASSETS.tomato],
            ["03", "Chettinad Star Anise", "Sweet aromatic spice delivering layered royal depth.", ASSETS.anise],
            ["04", "Ceylon Sweet Cinnamon", "Warm fragrance stone-ground into biryani powders.", ASSETS.cinnamon],
          ].map(([n, title, text, imgSrc]) => (
            <article className="rrIngredientRealCard" key={n}>
              <div className="rrCardGlare" />
              <div className="rrRealThumbBox">
                <img src={imgSrc} alt={title} />
              </div>
              <span className="rrIngNum">{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rrHeritage">
        <div className="rrHeritageIntro">
          <span className="rrSectionEyebrow">03 · CULTURAL HERITAGE</span>
          <h2>
            Echoes of the great
            <br />
            <em>Saurashtra &amp; Chettinad banquets.</em>
          </h2>
        </div>

        <div className="rrHeritageGrid">
          <article className="rrHeritageCard dark">
            <div className="rrCardGlare" />
            <div className="rrSmallIcon"><Utensils size={18} /></div>
            <span>THE FEAST</span>
            <h3>The Sacred Combination</h3>
            <p>The legendary Madurai culinary memory pairs spicy fragrant Puliyodarai with roasted black chickpea sundal, crisp vadagam, and fresh ginger-chilli thogayal.</p>
          </article>
          <article className="rrHeritageCard">
            <div className="rrCardGlare" />
            <div className="rrSmallIcon"><Sparkles size={18} /></div>
            <span>THE CRAFT</span>
            <h3>Pure Kitchen Philosophy</h3>
            <p>We craft our blends using 100% natural, farm-picked spices with authentic aroma and therapeutic purity.</p>
          </article>
          <article className="rrHeritageCard">
            <div className="rrCardGlare" />
            <div className="rrSmallIcon"><Globe2 size={18} /></div>
            <span>THE REACH</span>
            <h3>From Home to the World</h3>
            <p>Engineered with export-grade barrier packaging so families across the globe enjoy identical mill-fresh aroma.</p>
          </article>
        </div>
      </section>

      <section className="rrQuote">
        <span className="rrSectionEyebrow">04 · CUSTOMER PROMISE</span>
        <blockquote>
          “Purity is the fundamental vow of our kitchen.”
        </blockquote>
        <p>Formulated, batch-tested, and packaged under strict FSSAI compliance standards in Tamil Nadu, India.</p>
      </section>
    </div>
  </Info>
);

/* =========================================================
   CONTACT US PAGE
========================================================= */
export const Contact = () => (
  <Info
    title="Customer Care & Support"
    eyebrow="RR MASALA · DIRECT ASSISTANCE"
    description="Have questions about product details, custom bulk orders, pan-India tracking, or international consignments? Our support team is here to assist."
    icon={MessageCircle}
  >
    <section className="rrContact">
      <div className="rrContactIntro">
        <div className="rrCardGlare" />
        <span className="rrSectionEyebrow">RESPONSIVE SUPPORT CHANNELS</span>
        <h2>We are here to make your experience effortless.</h2>
        <p>For existing orders, please keep your 6-digit Order ID ready for rapid resolution. We strive to respond to all enquiries within 2–4 business hours.</p>
      </div>

      <div className="rrContactGrid">
        <div className="rrContactCard dark">
          <div className="rrCardGlare" />
          <div className="rrContactIcon"><MessageCircle size={22} /></div>
          <span>01 · INSTANT CHAT</span>
          <h3>WhatsApp Support</h3>
          <p>Instant assistance for tracking updates, pincode delivery checks, and quick queries.</p>
          <a href="#whatsapp" className="rrContactLink">Chat on WhatsApp &rarr;</a>
        </div>
        <div className="rrContactCard">
          <div className="rrCardGlare" />
          <div className="rrContactIcon"><Mail size={22} /></div>
          <span>02 · EMAIL DESK</span>
          <h3>Order &amp; Export Care</h3>
          <p>Detailed inquiries regarding institutional orders, international shipments, or refunds.</p>
          <span className="rrContactDetailText">care@rrmasala.com</span>
        </div>
        <div className="rrContactCard">
          <div className="rrCardGlare" />
          <div className="rrContactIcon"><Clock3 size={22} /></div>
          <span>03 · OPERATING HOURS</span>
          <h3>Dispatch Facility</h3>
          <p>Monday to Saturday: 9:00 AM – 7:00 PM IST</p>
          <span className="rrContactDetailText">Sunday: Dispatches on Next Business Day</span>
        </div>
      </div>

      <div className="rrContactNotice">
        <ShieldCheck size={22} />
        <div>
          <strong>Registered Production &amp; Packing Facility</strong>
          <p>RR MASALA Mills &amp; Food Processing Unit, Tamil Nadu, India. FSSAI License &amp; GST compliance information is verified on all commercial delivery invoices.</p>
        </div>
      </div>
    </section>
  </Info>
);

/* =========================================================
   FAQ HELP CENTRE
========================================================= */
const FAQ_ITEMS = [
  ["Can I browse and add items to cart without creating an account?", "Yes, absolutely. You can freely browse our full product catalogue, select spice blends, and manage your cart. You only need to verify your phone number or email address during final checkout to secure your delivery updates."],
  ["How are India shipping charges calculated?", "We offer Free Express Pan-India Delivery on all eligible orders valued above ₹999. For orders below ₹999, a flat nominal handling charge of ₹50 is applied across all postal zones."],
  ["Do you deliver internationally?", "Yes, we ship globally using verified international air couriers (DHL Express, FedEx, and EMS India Post). International shipping rates are calculated dynamically at checkout based on destination country and total consignment weight."],
  ["How do I track my active order status?", "Once your order is milled and packed, a live carrier tracking code will be sent via SMS and Email. You can also view real-time status under the 'My Account > Orders' section of the website."],
  ["Can I save multiple delivery addresses?", "Yes. Within your customer account, you can store and name multiple addresses (Home, Office, Family) and pick your preferred destination with a single tap during checkout."],
  ["Can I cancel or alter an order after placing it?", "Orders can be modified or cancelled within 2 hours of placement before entering our milling and vacuum-sealing queue. Once an order is booked with the courier partner, cancellation is disabled."],
  ["What is your return and replacement policy?", "If an item arrives with damaged packaging, tamper seal broken, or incorrect product variant, notify us within 48 hours with package photos. We will dispatch an immediate free replacement."],
  ["What online payment methods are accepted?", "We support all major secure payment methods: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ banks, and international card payments."],
  ["Do international consignments include customs duty?", "Import duties, GST/VAT, or local border clearance fees depend entirely on destination country regulations and are payable by the recipient if levied by local customs authorities."],
];

export const FAQ = () => {
  const [open, setOpen] = useState(0);

  const groups = [
    { label: "Shopping & Cart", icon: ShoppingBag, items: FAQ_ITEMS.slice(0, 2) },
    { label: "Orders & Delivery", icon: Truck, items: FAQ_ITEMS.slice(2, 6) },
    { label: "Replacements & Payments", icon: RefreshCcw, items: FAQ_ITEMS.slice(6, 8) },
    { label: "Worldwide Export", icon: Globe2, items: FAQ_ITEMS.slice(8) },
  ];

  let questionIndex = -1;

  return (
    <Info
      title="Frequently Asked Questions"
      eyebrow="RR MASALA · HELP CENTRE"
      description="Everything you need to know about our stone-ground processing, delivery charges, global shipping, and hygiene guarantees."
      icon={HelpCircle}
    >
      <section className="rrFaqPremium">
        <div className="rrFaqCategoryBar">
          {groups.map(({ label, icon: GroupIcon }, i) => (
            <a href={`#faq-group-${i}`} key={label}>
              <GroupIcon size={16} />
              <span>{label}</span>
              <ChevronRight size={14} />
            </a>
          ))}
        </div>

        <div className="rrFaqPremiumGrid">
          <aside className="rrFaqIndex">
            <div className="rrFaqIndexHead">
              <HelpCircle size={18} />
              <span>QUICK NAVIGATOR</span>
            </div>
            <div className="rrFaqIndexLine" />
            {groups.map(({ label, items }, i) => (
              <a href={`#faq-group-${i}`} key={label}>
                <span>0{i + 1}</span>
                <strong>{label}</strong>
                <small>{items.length} answers</small>
              </a>
            ))}
            <div className="rrFaqHelpCard">
              <MessageCircle size={20} />
              <strong>Have a specific question?</strong>
              <p>Our kitchen team is available on WhatsApp to answer detailed recipe queries.</p>
              <Link to="/contact">Contact Customer Care &rarr;</Link>
            </div>
          </aside>

          <div className="rrFaqGroups">
            {groups.map(({ label, icon: GroupIcon, items }, groupIndex) => (
              <section id={`faq-group-${groupIndex}`} className="rrFaqGroup" key={label}>
                <div className="rrFaqGroupHead">
                  <div className="rrFaqGroupIcon"><GroupIcon size={18} /></div>
                  <div>
                    <span>SECTION 0{groupIndex + 1}</span>
                    <h3>{label}</h3>
                  </div>
                  <p>{items.length} questions</p>
                </div>
                <div className="rrFaqQuestions">
                  {items.map(([q, a]) => {
                    questionIndex += 1;
                    const index = questionIndex;
                    const active = open === index;

                    return (
                      <article className={`rrFaqQuestion ${active ? "active" : ""}`} key={q}>
                        <button type="button" aria-expanded={active} onClick={() => setOpen(active ? -1 : index)}>
                          <span className="rrFaqQuestionNo">{String(index + 1).padStart(2, "0")}</span>
                          <strong>{q}</strong>
                          <span className="rrFaqToggle"><ChevronDown size={18} /></span>
                        </button>
                        <div className="rrFaqQuestionAnswer"><p>{a}</p></div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </Info>
  );
};

/* =========================================================
   POLICIES & TERMS CENTER
========================================================= */
const POLICY_DATA = {
  "Terms & conditions": {
    eyebrow: "SERVICE TERMS & STORE POLICY",
    icon: FileText,
    intro: "The formal legal agreement governing transactions, pricing integrity, and platform usage on the RR MASALA storefront.",
    cards: [
      ["01", "Pricing & Invoicing", "All prices listed on the store are inclusive of statutory GST. Invoices accompany every package detailing batch number and packing date."],
      ["02", "Batch Purity Variance", "Because our spices are 100% natural, slight shade variations may occur between seasonal crop harvests."],
      ["03", "Order Acceptance", "We reserve the right to decline or cancel orders in cases of demonstrable typographical pricing errors or technical inventory discrepancies."],
      ["04", "Jurisdiction", "All commercial disputes, transactions, and claims arising from website purchases shall be subject to the exclusive jurisdiction of the courts of Tamil Nadu, India."],
    ],
    sections: [
      ["Intellectual Property", "All brand logos, text assets, product descriptions, and media footage are the exclusive trademark property of RR MASALA."],
      ["Customer Accountability", "Buyers are responsible for submitting accurate shipping details, PIN codes, and reachable telephone contact numbers."],
    ],
  },
};

export const Policy = ({ title }) => {
  const data = POLICY_DATA[title] || POLICY_DATA["Terms & conditions"];
  const Icon = data.icon;
  return (
    <Info title={title} eyebrow={`RR MASALA · ${data.eyebrow}`} description={data.intro} icon={Icon}>
      <section className="rrPolicy">
        <div className="rrPolicyTop">
          <div>
            <span className="rrSectionEyebrow">POLICY SPECIFICATIONS</span>
            <h2>Transparent terms. Clear specifications.</h2>
          </div>
          <div className="rrPolicyUpdated">
            <Clock3 size={15} />
            <span>Updated &amp; Compliant for 2026</span>
          </div>
        </div>
        <div className="rrPolicyGrid">
          {data.cards.map(([no, heading, body]) => (
            <article className="rrPolicyCard" key={no}>
              <div className="rrCardGlare" />
              <div className="rrPolicyCardTop">
                <span>{no}</span>
                <CheckCircle2 size={18} />
              </div>
              <h3>{heading}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="rrPolicyDetails">
          {data.sections.map(([heading, body]) => (
            <article key={heading}>
              <span>{heading}</span>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="rrPolicyContact">
          <div className="rrPolicyContactIcon"><ShieldCheck size={24} /></div>
          <div>
            <span>LEGAL &amp; COMPLIANCE DESK</span>
            <h3>Registered Consumer Redressal Office</h3>
            <p>For regulatory queries, contact our compliance officer at <strong>compliance@rrmasala.com</strong>.</p>
          </div>
        </div>
      </section>
    </Info>
  );
};

/* =========================================================
   ORDER SUCCESS PAGE
========================================================= */
function OrderSuccessPage() {
  return (
    <main className="rrSuccessPage">
      <div className="rrSuccess">
        <div className="rrSuccessOrb"><CheckCircle2 size={46} /></div>
        <span className="rrSectionEyebrow">ORDER BOOKED SUCCESSFULLY</span>
        <h1>Thank you for choosing pure flavour.</h1>
        <p>Your order has been recorded in our mill production queue.</p>
        <div className="rrSuccessActions">
          <Link to="/orders" className="rrDarkBtn">
            <PackageCheck size={17} /> <span>View My Orders</span> <ArrowRight size={16} />
          </Link>
          <Link to="/products" className="rrLightBtn">
            <ShoppingBag size={17} /> <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export { OrderSuccessPage as Success };

/* =========================================================
   EMBEDDED STYLES
========================================================= */
export function InfoStyles() {
  return (
    <style>{`
      /* Core Root Styling */
      .rrInfoPage,
      .rrSuccessPage {
        min-height: 100vh;
        background: #ffffff;
        color: #1a1412;
        padding: 0 24px 80px;
        font-family: "DM Sans", system-ui, sans-serif;
        position: relative;
        overflow-x: hidden;
      }

      /* 1. TOP 120PX HERITAGE TAMIL NADU / MADURAI / SAURASHTRA STYLE TICKER */
      .rrTopSkyBackground {
        position: absolute;
        top: 0; 
        left: 0; 
        right: 0;
        height: 120px;
        background: radial-gradient(ellipse at top, #240a0d 0%, #100406 100%);
        border-bottom: 2px solid #b8860b;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(243, 146, 0, 0.4);
        overflow: hidden;
        z-index: 5;
        display: flex;
        align-items: center;
      }

      .rrTickerTrack {
        display: flex;
        align-items: center;
        width: max-content;
        gap: 28px;
        animation: rrTickerScroll 28s linear infinite;
        will-change: transform;
      }

      .rrTickerTrack:hover {
        animation-play-state: paused;
      }

      @keyframes rrTickerScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      /* Madurai Heritage Antique Glass Pill */
      .rrTickerItem {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        background: linear-gradient(135deg, rgba(74, 18, 22, 0.45) 0%, rgba(20, 5, 7, 0.65) 100%);
        border: 1px solid rgba(243, 146, 0, 0.35);
        border-radius: 999px;
        padding: 6px 20px 6px 8px;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 215, 0, 0.2);
        flex-shrink: 0;
        position: relative;
      }

      /* Saurashtra Brass / Temple Gold Coin Frame */
      .rrTickerImgBox {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: radial-gradient(circle, #3d1419 0%, #160608 100%);
        display: grid;
        place-items: center;
        border: 1.5px solid #d4af37;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.25), inset 0 0 8px rgba(0, 0, 0, 0.7);
        overflow: hidden;
        flex-shrink: 0;
      }

      .rrTickerImgBox img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
      }

      .rrTickerInfo {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      /* Temple Inscription Style Badge */
      .rrTickerTag {
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.8px;
        color: #f5b335;
        text-transform: uppercase;
        font-family: system-ui, sans-serif;
        text-shadow: 0 0 6px rgba(245, 179, 53, 0.4);
      }

      /* Madurai / Tamil Nadu Heritage Royal Serif Typography */
      .rrTickerName {
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: 17px;
        font-weight: 700;
        color: #fff9e6;
        letter-spacing: 0.8px;
        white-space: nowrap;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
      }

      /* Traditional Brass Bell / Accent Dot */
      .rrTickerDot {
        color: #d4af37;
        font-size: 16px;
        margin-left: 6px;
        text-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
      }

      /* INFO SHELL (Exactly below 120px ticker) */
      .rrInfoShell {
        width: min(1280px, 100%);
        margin: 0 auto;
        position: relative;
        z-index: 10;
        padding-top: 140px; 
      }

      .rrBack {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: 0;
        color: #6a5e57;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        padding: 0 0 16px;
        transition: color 0.2s ease, transform 0.2s ease;
      }
      .rrBack:hover {
        color: #9e1017;
        transform: translateX(-3px);
      }

      .rrPageHeader {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 24px;
        padding: 36px 44px;
        box-shadow: 0 8px 30px rgba(158, 16, 23, 0.05);
        margin-bottom: 24px;
      }

      .rrPageHeaderTop {
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .rrHeaderIconBox {
        width: 58px;
        height: 58px;
        border-radius: 16px;
        background: #fbf3e4;
        color: #9e1017;
        display: grid;
        place-items: center;
        border: 1px solid rgba(243, 146, 0, 0.3);
        flex-shrink: 0;
      }

      .rrEyebrow,
      .rrSectionEyebrow {
        display: block;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 2px;
        color: #9e1017;
        text-transform: uppercase;
      }

      .rrPageHeader h1 {
        margin: 6px 0 0;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(36px, 4.5vw, 54px);
        line-height: 1.05;
        font-weight: 700;
        color: #1a1412;
        letter-spacing: -1px;
      }

      .rrHeaderDesc {
        margin: 14px 0 0;
        font-size: 15px;
        line-height: 1.7;
        color: #5d524c;
        max-width: 820px;
      }

      .rrAboutHero {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 24px;
        padding: 44px;
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 40px;
        align-items: center;
        box-shadow: 0 10px 30px rgba(158, 16, 23, 0.05);
      }

      .rrAboutHero h2 {
        margin: 10px 0 14px;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(36px, 4vw, 50px);
        line-height: 1.05;
        font-weight: 700;
      }
      .rrAboutHero h2 em {
        color: #9e1017;
        font-style: italic;
      }

      .rrAboutHero p {
        font-size: 15px;
        line-height: 1.8;
        color: #5d524c;
        margin: 0;
      }

      .rrTrustPills {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }
      .rrTrustPills span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 999px;
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        font-size: 11px;
        font-weight: 800;
        color: #9e1017;
      }

      .rrRealFoodVisual {
        display: grid;
        place-items: center;
      }

      .rrRealPhotoCard {
        position: relative;
        width: min(340px, 100%);
        aspect-ratio: 1;
        border-radius: 24px;
        overflow: hidden;
        border: 4px solid #ffffff;
        box-shadow: 0 18px 40px rgba(158, 16, 23, 0.15);
      }

      .rrMainDishImg {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.6s ease;
      }
      .rrRealPhotoCard:hover .rrMainDishImg {
        transform: scale(1.08);
      }

      .rrPhotoTag {
        position: absolute;
        bottom: 14px;
        left: 14px;
        right: 14px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(8px);
        padding: 8px 12px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 900;
        color: #9e1017;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .rrPhotoTag svg { color: #f39200; }

      .rrNumberStrip {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin: 28px 0;
      }

      .rrNumberCard {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.1);
        border-radius: 18px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(158, 16, 23, 0.04);
      }
      .rrNumberCard strong {
        display: block;
        font-size: 26px;
        font-weight: 900;
        color: #f39200;
      }
      .rrNumberCard b {
        display: block;
        margin: 8px 0 4px;
        font-size: 14px;
        color: #1a1412;
      }
      .rrNumberCard span {
        display: block;
        font-size: 12px;
        color: #6a5e57;
        line-height: 1.5;
      }

      .rrStoryBlock {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 40px;
        padding: 50px 0;
        border-top: 1px solid rgba(158, 16, 23, 0.1);
      }
      .rrSideLabel {
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 2px;
        color: #9e1017;
      }
      .rrStoryBlock h2 {
        margin: 0 0 16px;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(34px, 4vw, 46px);
        line-height: 1.05;
        font-weight: 700;
      }
      .rrStoryBlock h2 em {
        color: #9e1017;
        font-style: italic;
      }
      .rrTwoColText {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
      }
      .rrTwoColText p {
        margin: 0;
        font-size: 15px;
        line-height: 1.8;
        color: #5d524c;
      }

      /* SUJATHA ARTICLE TAMIL SECTION STYLES (WITH PHOTO) */
      .rrSujathaStory {
        background: #fdfaf4;
        border: 1px solid rgba(243, 146, 0, 0.3);
        border-radius: 24px;
        padding: 44px;
        margin: 40px 0;
        box-shadow: 0 8px 26px rgba(158, 16, 23, 0.04);
      }
      .rrSujathaHeaderWrap {
        display: grid;
        grid-template-columns: 170px 1fr;
        gap: 28px;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(158, 16, 23, 0.1);
      }
      .rrSujathaPhotoCard {
        position: relative;
        width: 150px;
        height: 190px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 24px rgba(158, 16, 23, 0.15);
        border: 3px solid #d4af37;
        background: #1a0b0e;
      }
      .rrSujathaImg {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: contrast(1.05);
      }
      .rrSujathaPhotoFrame {
        position: absolute;
        inset: 0;
        box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.4);
        pointer-events: none;
      }
      .rrSujathaTitleBox h2 {
        margin: 8px 0 6px;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(24px, 2.8vw, 34px);
        color: #1a1412;
        line-height: 1.35;
        font-weight: 700;
      }
      .rrSujathaTag {
        display: inline-block;
        font-size: 13px;
        font-weight: 800;
        color: #9e1017;
      }
      .rrSujathaContent {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .rrSujathaContent p {
        font-size: 15px;
        line-height: 1.85;
        color: #4a3e39;
        margin: 0;
        text-align: justify;
      }
      .rrSujathaAuthor {
        display: block;
        margin-top: 14px;
        font-size: 16px;
        font-weight: 800;
        color: #9e1017;
        text-align: right;
      }

      .rrIngredientSection {
        padding: 50px 0;
        border-top: 1px solid rgba(158, 16, 23, 0.1);
      }
      .rrSectionHead {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 26px;
      }
      .rrSectionHead h2 {
        margin: 6px 0 0;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: 38px;
        font-weight: 700;
      }
      .rrSectionHead > p {
        margin: 0;
        font-size: 14px;
        color: #6a5e57;
        max-width: 380px;
      }

      .rrIngredientGrid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      .rrIngredientRealCard {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.1);
        border-radius: 18px;
        padding: 18px;
        box-shadow: 0 4px 16px rgba(158, 16, 23, 0.04);
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease, border-color 0.3s ease;
      }
      .rrIngredientRealCard:hover {
        transform: translateY(-6px);
        border-color: #f39200;
      }

      .rrRealThumbBox {
        width: 100%;
        height: 120px;
        border-radius: 12px;
        background: #ffffff;
        display: grid;
        place-items: center;
        margin-bottom: 12px;
        overflow: hidden;
      }
      .rrRealThumbBox img {
        width: 75%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(0 6px 12px rgba(158, 16, 23, 0.2));
      }

      .rrIngNum {
        font-size: 11px;
        font-weight: 900;
        color: #f39200;
      }
      .rrIngredientRealCard h3 {
        margin: 4px 0 6px;
        font-size: 15px;
        font-weight: 800;
      }
      .rrIngredientRealCard p {
        margin: 0;
        font-size: 12px;
        line-height: 1.6;
        color: #6a5e57;
      }

      .rrHeritage {
        padding: 50px 0;
        border-top: 1px solid rgba(158, 16, 23, 0.1);
      }
      .rrHeritageIntro h2 {
        margin: 8px 0 26px;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: 38px;
        font-weight: 700;
      }
      .rrHeritageIntro h2 em {
        color: #9e1017;
        font-style: italic;
      }

      .rrHeritageGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .rrHeritageCard {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.1);
        border-radius: 18px;
        padding: 30px;
        box-shadow: 0 4px 16px rgba(158, 16, 23, 0.04);
      }
      .rrHeritageCard.dark {
        background: #1e0907;
        color: #ffffff;
        border-color: #1e0907;
      }
      .rrHeritageCard.dark p { color: #d1c3be; }
      .rrSmallIcon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: #fbf3e4;
        color: #9e1017;
        display: grid;
        place-items: center;
        margin-bottom: 20px;
      }
      .rrHeritageCard > span {
        display: block;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
        color: #f39200;
      }
      .rrHeritageCard h3 {
        margin: 6px 0 8px;
        font-size: 17px;
        font-weight: 800;
      }
      .rrHeritageCard p {
        margin: 0;
        font-size: 13px;
        line-height: 1.7;
        color: #6a5e57;
      }

      .rrQuote {
        margin: 20px 0 60px;
        padding: 44px 30px;
        border-radius: 24px;
        background: #fbf7ef;
        border: 1px solid rgba(243, 146, 0, 0.25);
        text-align: center;
      }
      .rrQuote blockquote {
        margin: 14px auto;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(24px, 3.2vw, 34px);
        font-weight: 600;
        color: #1a1412;
        max-width: 820px;
        line-height: 1.35;
      }
      .rrQuote p {
        margin: 0;
        font-size: 13px;
        color: #6a5e57;
      }

      .rrContactIntro {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 20px;
        padding: 36px;
        box-shadow: 0 8px 24px rgba(158, 16, 23, 0.04);
      }
      .rrContactIntro h2 {
        margin: 8px 0 12px;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: 38px;
        font-weight: 700;
      }
      .rrContactIntro p {
        margin: 0;
        font-size: 14px;
        color: #6a5e57;
        line-height: 1.7;
      }

      .rrContactGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin: 20px 0;
      }
      .rrContactCard {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.1);
        border-radius: 18px;
        padding: 28px;
      }
      .rrContactCard.dark {
        background: #1e0907;
        color: #ffffff;
        border-color: #1e0907;
      }
      .rrContactCard.dark p { color: #d1c3be; }
      .rrContactIcon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: #fbf3e4;
        color: #9e1017;
        display: grid;
        place-items: center;
        margin-bottom: 16px;
      }
      .rrContactCard > span {
        display: block;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
        color: #f39200;
      }
      .rrContactCard h3 {
        margin: 6px 0 8px;
        font-size: 18px;
      }
      .rrContactCard p {
        margin: 0 0 12px;
        font-size: 13px;
        line-height: 1.7;
        color: #6a5e57;
      }
      .rrContactLink {
        color: #fbb034;
        font-size: 12px;
        font-weight: 800;
        text-decoration: none;
      }
      .rrContactDetailText {
        font-size: 13px;
        font-weight: 800;
        color: #9e1017;
      }
      .rrContactNotice {
        display: flex;
        gap: 16px;
        background: #fbf7ef;
        border: 1px solid rgba(243, 146, 0, 0.25);
        border-radius: 16px;
        padding: 22px;
      }
      .rrContactNotice svg {
        color: #9e1017;
        flex-shrink: 0;
      }
      .rrContactNotice strong {
        display: block;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .rrContactNotice p {
        margin: 0;
        font-size: 13px;
        color: #6a5e57;
        line-height: 1.6;
      }

      .rrFaqCategoryBar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 24px;
      }
      .rrFaqCategoryBar a {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 14px;
        padding: 14px 16px;
        font-size: 13px;
        font-weight: 800;
        color: #1a1412;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .rrFaqCategoryBar a:hover {
        border-color: #9e1017;
        color: #9e1017;
        transform: translateY(-2px);
      }
      .rrFaqCategoryBar a svg:first-child { color: #9e1017; }
      .rrFaqCategoryBar a svg:last-child { margin-left: auto; color: #9c8e87; }

      .rrFaqPremiumGrid {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        gap: 24px;
        align-items: start;
      }

      .rrFaqIndex {
        position: sticky;
        top: 90px;
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 8px 24px rgba(158, 16, 23, 0.04);
      }
      .rrFaqIndexHead {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.5px;
        color: #9e1017;
      }
      .rrFaqIndexLine {
        height: 1px;
        background: rgba(158, 16, 23, 0.1);
        margin: 16px 0 10px;
      }
      .rrFaqIndex > a {
        display: grid;
        grid-template-columns: 28px 1fr;
        padding: 12px 0;
        border-bottom: 1px solid rgba(158, 16, 23, 0.06);
        text-decoration: none;
        color: #1a1412;
      }
      .rrFaqIndex > a span {
        font-size: 11px;
        font-weight: 900;
        color: #f39200;
      }
      .rrFaqIndex > a strong {
        font-size: 13px;
        line-height: 1.3;
      }
      .rrFaqIndex > a small {
        grid-column: 2;
        font-size: 11px;
        color: #6a5e57;
      }

      .rrFaqHelpCard {
        margin-top: 20px;
        padding: 18px;
        border-radius: 14px;
        background: #fbf7ef;
        border: 1px solid rgba(243, 146, 0, 0.25);
      }
      .rrFaqHelpCard strong {
        display: block;
        margin: 8px 0 4px;
        font-size: 13px;
      }
      .rrFaqHelpCard p {
        margin: 0 0 10px;
        font-size: 12px;
        line-height: 1.5;
        color: #6a5e57;
      }
      .rrFaqHelpCard a {
        font-size: 12px;
        font-weight: 800;
        color: #9e1017;
        text-decoration: none;
      }

      .rrFaqGroups {
        display: grid;
        gap: 20px;
      }
      .rrFaqGroup {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 20px;
        padding: 10px;
        box-shadow: 0 6px 20px rgba(158, 16, 23, 0.04);
      }
      .rrFaqGroupHead {
        display: grid;
        grid-template-columns: 44px 1fr auto;
        gap: 14px;
        align-items: center;
        background: #fbf7ef;
        padding: 12px 16px;
        border-radius: 14px;
      }
      .rrFaqGroupIcon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #ffffff;
        color: #9e1017;
        display: grid;
        place-items: center;
      }
      .rrFaqGroupHead span {
        display: block;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.5px;
        color: #9e1017;
      }
      .rrFaqGroupHead h3 {
        margin: 2px 0 0;
        font-size: 16px;
        font-weight: 800;
      }
      .rrFaqGroupHead > p {
        margin: 0;
        font-size: 12px;
        color: #6a5e57;
      }
      .rrFaqQuestions {
        padding: 8px 12px;
      }
      .rrFaqQuestion {
        border-bottom: 1px solid rgba(158, 16, 23, 0.08);
      }
      .rrFaqQuestion:last-child {
        border-bottom: 0;
      }
      .rrFaqQuestion button {
        width: 100%;
        min-height: 66px;
        display: grid;
        grid-template-columns: 32px 1fr 34px;
        align-items: center;
        gap: 14px;
        background: transparent;
        border: 0;
        padding: 12px 0;
        text-align: left;
        cursor: pointer;
      }
      .rrFaqQuestionNo {
        font-size: 11px;
        font-weight: 900;
        color: #f39200;
      }
      .rrFaqQuestion button strong {
        font-size: 15px;
        color: #1a1412;
      }
      .rrFaqToggle {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #fbf7ef;
        color: #9e1017;
        display: grid;
        place-items: center;
        transition: transform 0.3s ease;
      }
      .rrFaqQuestion.active .rrFaqToggle {
        transform: rotate(180deg);
        background: #9e1017;
        color: #ffffff;
      }
      .rrFaqQuestionAnswer {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.35s ease;
      }
      .rrFaqQuestionAnswer p {
        margin: 0;
        overflow: hidden;
        font-size: 14px;
        line-height: 1.8;
        color: #5d524c;
        padding: 0 46px 0;
        opacity: 0;
        transition: opacity 0.2s ease, padding 0.3s ease;
      }
      .rrFaqQuestion.active .rrFaqQuestionAnswer {
        grid-template-rows: 1fr;
      }
      .rrFaqQuestion.active .rrFaqQuestionAnswer p {
        padding-bottom: 18px;
        opacity: 1;
      }

      .rrPolicyTop {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 22px;
      }
      .rrPolicyTop h2 {
        margin: 8px 0 0;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: 38px;
        font-weight: 700;
      }
      .rrPolicyUpdated {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 999px;
        background: #fbf7ef;
        border: 1px solid rgba(243, 146, 0, 0.25);
        font-size: 12px;
        font-weight: 800;
        color: #9e1017;
      }
      .rrPolicyGrid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .rrPolicyCard {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 4px 18px rgba(158, 16, 23, 0.04);
      }
      .rrPolicyCardTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #9e1017;
      }
      .rrPolicyCardTop span {
        font-size: 12px;
        font-weight: 900;
        color: #f39200;
      }
      .rrPolicyCard h3 {
        margin: 14px 0 8px;
        font-size: 18px;
        font-weight: 800;
      }
      .rrPolicyCard p {
        margin: 0;
        font-size: 14px;
        line-height: 1.75;
        color: #5d524c;
      }
      .rrPolicyDetails {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin: 20px 0;
      }
      .rrPolicyDetails article {
        background: #fbf7ef;
        border: 1px solid rgba(243, 146, 0, 0.2);
        border-radius: 18px;
        padding: 22px;
      }
      .rrPolicyDetails span {
        display: block;
        font-size: 13px;
        font-weight: 800;
        color: #9e1017;
        margin-bottom: 8px;
      }
      .rrPolicyDetails p {
        margin: 0;
        font-size: 13px;
        line-height: 1.7;
        color: #5d524c;
      }
      .rrPolicyContact {
        display: flex;
        gap: 20px;
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.15);
        border-radius: 20px;
        padding: 28px;
        align-items: flex-start;
      }
      .rrPolicyContactIcon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: #fbf3e4;
        color: #9e1017;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }
      .rrPolicyContact span {
        display: block;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
        color: #9e1017;
      }
      .rrPolicyContact h3 {
        margin: 4px 0 6px;
        font-size: 17px;
      }
      .rrPolicyContact p {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        color: #5d524c;
      }

      .rrSuccess {
        background: #ffffff;
        border: 1px solid rgba(158, 16, 23, 0.12);
        border-radius: 28px;
        padding: 60px 40px;
        text-align: center;
        max-width: 650px;
        margin: 40px auto;
        box-shadow: 0 14px 40px rgba(158, 16, 23, 0.06);
      }
      .rrSuccessOrb {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #fbf3e4;
        color: #2e7d32;
        display: grid;
        place-items: center;
        margin: 0 auto 20px;
      }
      .rrSuccess h1 {
        margin: 10px 0;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: 42px;
        font-weight: 700;
      }
      .rrSuccess p {
        margin: 0 auto 30px;
        font-size: 15px;
        color: #5d524c;
        line-height: 1.8;
      }
      .rrSuccessActions {
        display: flex;
        justify-content: center;
        gap: 14px;
      }

      .rrBottomShop {
        display: flex;
        justify-content: center;
        margin-top: 40px;
      }
      .rrShopBtn,
      .rrDarkBtn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 16px 36px;
        background: linear-gradient(135deg, #9e1017, #c41a22);
        color: #ffffff;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 800;
        text-decoration: none;
        box-shadow: 0 8px 24px rgba(158, 16, 23, 0.3);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .rrShopBtn:hover,
      .rrDarkBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(158, 16, 23, 0.45);
      }
      .rrLightBtn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 16px 30px;
        background: #ffffff;
        color: #1a1412;
        border: 1px solid rgba(158, 16, 23, 0.15);
        border-radius: 999px;
        font-size: 14px;
        font-weight: 800;
        text-decoration: none;
      }

      .rrReveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .rrRevealVisible {
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 992px) {
        .rrInfoShell { padding-top: 130px; }
        .rrAboutHero { grid-template-columns: 1fr; }
        .rrNumberStrip { grid-template-columns: repeat(2, 1fr); }
        .rrStoryBlock { grid-template-columns: 1fr; gap: 16px; }
        .rrTwoColText { grid-template-columns: 1fr; }
        .rrIngredientGrid { grid-template-columns: repeat(2, 1fr); }
        .rrHeritageGrid { grid-template-columns: 1fr; }
        .rrContactGrid { grid-template-columns: 1fr; }
        .rrFaqCategoryBar { grid-template-columns: repeat(2, 1fr); }
        .rrFaqPremiumGrid { grid-template-columns: 1fr; }
        .rrFaqIndex { position: relative; top: 0; }
        .rrPolicyGrid, .rrPolicyDetails { grid-template-columns: 1fr; }
        .rrSujathaStory { padding: 28px; }
        .rrSujathaHeaderWrap { grid-template-columns: 1fr; text-align: center; justify-items: center; }
      }

      @media (max-width: 600px) {
        .rrInfoPage { padding: 14px 16px 70px; }
        .rrPageHeader { padding: 24px; border-radius: 20px; }
        .rrPageHeader h1 { font-size: 32px; }
        .rrAboutHero { padding: 24px; border-radius: 20px; }
        .rrNumberStrip { grid-template-columns: 1fr; }
        .rrIngredientGrid { grid-template-columns: 1fr; }
        .rrSectionHead { flex-direction: column; align-items: flex-start; gap: 8px; }
        .rrPolicyTop { flex-direction: column; align-items: flex-start; gap: 10px; }
        .rrPolicyContact { flex-direction: column; }
        .rrSuccess { padding: 40px 20px; }
        .rrSuccessActions { flex-direction: column; }
        .rrSujathaStory { padding: 20px; }
        .rrSujathaPhotoCard { width: 130px; height: 160px; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}