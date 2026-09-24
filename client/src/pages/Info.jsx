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
   REAL SPICE PHOTOGRAPHY ASSETS
========================================================= */
const ASSETS = {
  chilli: "/hero-chilli.webp",
  tomato: "/hero-tomoto.png",
  anise: "/hero-anise.png",
  cinnamon: "/hero-cinnamon.webp",
  dishReal: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  box: "/box.png", // Hanging cargo box
  logo: "/logo.png" // Brand Logo
};

/* =========================================================
   0. WHITE CLOTH THEATER PRELOADER
   (No Black Screen, Proper Cloth Folds)
========================================================= */
function TheaterPreloader() {
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    // 1.5 seconds loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Remove from DOM after transition completes
    const removeTimer = setTimeout(() => {
      setRender(false);
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!render) return null;

  return (
    // <div className={`rrTheaterCurtain ${!loading ? "isOpen" : ""}`} aria-hidden="true">
    //   <div className="rrClothHalf rrClothLeft">
    //     <div className="rrClothFolds" />
    //   </div>
    //   <div className="rrClothHalf rrClothRight">
    //     <div className="rrClothFolds" />
    //   </div>
      
    //   <div className="rrCurtainLogoBox">
    //     <img src={ASSETS.logo} alt="RR MASALA" className="rrCurtainLogoImg" />
    //     <div className="rrCurtainLoader" />
    //   </div>
    // </div>
    <div></div>
  );
}

/* =========================================================
   1. PURE CSS MOUNTAINS & STARS CANOPY
========================================================= */
function SpiceMountainCanopy() {
  return (
    <div className="rrCinematicCanopy" aria-hidden="true">
      <div className="rrSkyBackdrop">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`rrStar rrStar${i + 1}`} />
        ))}
      </div>
      <div className="rrMountainLayer rrMountainLayer--distant" />
      <div className="rrMountainLayer rrMountainLayer--mid" />
    </div>
  );
}

/* =========================================================
   2. PURE CSS GLOBAL EXPORT FLEET (IN TOP 120PX ONLY)
   Flies Left to Right sequentially to avoid overflow
========================================================= */
function GlobalExportSkyway() {
  return (
    <div className="rrExportSkyway" aria-hidden="true">
      
      {/* Flight 1 */}
      <div className="rrCssAircraft rrCssPlane1">
        <div className="rrPlaneFuselage">
          <div className="rrPlaneCockpit" />
          <div className="rrPlaneWindows" />
          <span className="rrPlaneBrand">RR MASALA EXPORT</span>
        </div>
        <div className="rrPlaneWingFront">
          <div className="rrPlaneEngine" />
          <div className="rrNavLight rrNavLight--red" />
        </div>
        <div className="rrPlaneWingBack">
          <div className="rrPlaneEngine" />
          <div className="rrNavLight rrNavLight--green" />
        </div>
        <div className="rrPlaneTail">
          <div className="rrPlaneTailFin" />
          <div className="rrNavLight rrNavLight--white" />
        </div>
        <div className="rrHangingCargo">
          <div className="rrCargoCable" />
          <img src={ASSETS.box} alt="Cargo Box" className="rrCargoBoxImg" />
        </div>
      </div>

      {/* Helicopter 1 */}
      <div className="rrCssAircraft rrCssHelicopter1">
        <div className="rrHeliMainRotor"><div className="rrHeliBlade" /></div>
        <div className="rrHeliCabin">
          <div className="rrHeliWindow" />
        </div>
        <div className="rrHeliTail">
          <div className="rrHeliTailRotor"><div className="rrHeliBladeSmall" /></div>
        </div>
        <div className="rrHeliSkids">
          <div className="rrHeliLeg" />
          <div className="rrHeliLeg" />
          <div className="rrHeliRunner" />
        </div>
        <div className="rrHangingCargo">
          <div className="rrCargoCable" />
          <img src={ASSETS.box} alt="Cargo Box" className="rrCargoBoxImg" />
        </div>
      </div>

      {/* Flight 2 */}
      <div className="rrCssAircraft rrCssPlane2">
        <div className="rrPlaneFuselage">
          <div className="rrPlaneCockpit" />
          <span className="rrPlaneBrand">GLOBAL SPICE</span>
        </div>
        <div className="rrPlaneWingFront"><div className="rrPlaneEngine" /></div>
        <div className="rrPlaneWingBack"><div className="rrPlaneEngine" /></div>
        <div className="rrPlaneTail"><div className="rrPlaneTailFin" /></div>
      </div>

      {/* Helicopter 2 */}
      <div className="rrCssAircraft rrCssHelicopter2">
        <div className="rrHeliMainRotor"><div className="rrHeliBlade" /></div>
        <div className="rrHeliCabin">
          <div className="rrHeliWindow" />
        </div>
        <div className="rrHeliTail">
          <div className="rrHeliTailRotor"><div className="rrHeliBladeSmall" /></div>
        </div>
        <div className="rrHeliSkids">
          <div className="rrHeliLeg" />
          <div className="rrHeliLeg" />
          <div className="rrHeliRunner" />
        </div>
        <div className="rrHangingCargo">
          <div className="rrCargoCable" />
          <img src={ASSETS.box} alt="Cargo Box" className="rrCargoBoxImg" />
        </div>
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
      ".rrPageHeader, .rrAboutHero, .rrNumberStrip, .rrStoryBlock, .rrIngredientSection, .rrHeritage, .rrQuote, .rrContact, .rrFaqPremium, .rrPolicy, .rrSuccess"
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

        {/* Cinematic Parallax Background + Export Flights Restricted to Top 120px */}
        <div className="rrTopSkyBackground">
          <SpiceMountainCanopy />
          <GlobalExportSkyway />
        </div>

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
   ABOUT US PAGE
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
            Food is not just taste.
            <br />
            <em>It is sacred memory.</em>
          </h2>
          <p>
            Puliyodarai and sambar are not mere recipes—they are shaped by
            sun-drenched Salem turmeric, cold-pressed gingelly oil, hand-picked
            Guntur chillies, and stone-ground traditions perfected over generations in
            South Indian family homes.
          </p>
          <div className="rrTrustPills">
            <span><Sparkles size={14} /> Zero Synthetic Colours</span>
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
          ["04", "Aroma-Lock Pouches", "12-month vacuum freshness guarantee without chemicals."],
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
            More than everyday spices.
            <br />
            <em>A commitment to purity.</em>
          </h2>
          <div className="rrTwoColText">
            <p>
              At RR MASALA, we believe that true South Indian flavours cannot be
              rushed through industrial high-speed blade cutters. High mechanical heat
              burns away the precious volatile oils that give spices their healing
              power and unmistakable fragrance.
            </p>
            <p>
              By selecting top-grade whole pods, slow-roasting them on gentle firewood
              heat, and cold stone-milling every batch, we preserve the vibrant colour
              and profound soul that make everyday home meals taste divine.
            </p>
          </div>
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
            <h3>No Commercial Compromise</h3>
            <p>We completely reject artificial enhancers, emulsifiers, MSG, or synthetic red dyes. What goes into our pack is 100% natural spice.</p>
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
          “Purity is not a feature we market; it is the fundamental vow of our kitchen.”
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
      ["02", "Batch Purity Variance", "Because our spices are 100% natural without artificial dyes, slight shade variations may occur between seasonal crop harvests."],
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
            <h2>Transparent terms. No hidden clauses.</h2>
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
   EMBEDDED STYLES (CLEAN WHITE THEME + TOP SKY EXPORT ANIMATION)
========================================================= */
export function InfoStyles() {
  return (
    <style>{`
      /* Core Root Styling - Entire page is pure white */
      .rrInfoPage,
      .rrSuccessPage {
        min-height: 100vh;
        background: #ffffff; /* PURE WHITE BACKGROUND EVERYWHERE EXCEPT TOP SKY */
        color: #1a1412;
        padding: 0 24px 80px;
        font-family: "DM Sans", system-ui, sans-serif;
        position: relative;
        overflow-x: hidden;
      }

      /* 0. THEATER PRELOADER WHITE CLOTH CURTAIN */
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
        top: 0;
        bottom: 0;
        width: 50%;
        background: #ffffff;
        box-shadow: inset 0 0 40px rgba(0,0,0,0.05);
        transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1) 0.2s;
        will-change: transform;
      }

      .rrClothLeft {
        left: 0;
        transform-origin: left;
        border-right: 1px solid rgba(0,0,0,0.05);
      }

      .rrClothRight {
        right: 0;
        transform-origin: right;
        border-left: 1px solid rgba(0,0,0,0.05);
      }

      .rrClothFolds {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          90deg,
          transparent 0%,
          rgba(0,0,0,0.03) 10%,
          transparent 20%
        );
      }

      .rrTheaterCurtain.isOpen .rrClothLeft {
        transform: translateX(-100%);
      }

      .rrTheaterCurtain.isOpen .rrClothRight {
        transform: translateX(100%);
      }

      .rrCurtainLogoBox {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        transition: opacity 0.3s ease;
      }

      .rrTheaterCurtain.isOpen .rrCurtainLogoBox {
        opacity: 0;
      }

      .rrCurtainLogoImg {
        height: 190px;
        object-fit: contain;
        animation: rrCurtainPulse 1.5s ease-in-out infinite alternate;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
      }

      .rrCurtainLoader {
        width: 120px;
        height: 2px;
        background: rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
      }

      .rrCurtainLoader::before {
        content: "";
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: #fbb034;
        animation: rrTheaterLoad 1.5s ease-in-out forwards;
      }

      @keyframes rrTheaterLoad {
        0% { left: -100%; }
        100% { left: 0; }
      }
      @keyframes rrCurtainPulse {
        0% { transform: scale(0.95); opacity: 0.8; }
        100% { transform: scale(1.05); opacity: 1; }
      }

      /* 1. TOP SKY EXPORT ANIMATION (LIMITED TO TOP 120PX ONLY) */
      .rrTopSkyBackground {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 120px; /* Reduced to strictly the marked yellow area */
        background: linear-gradient(180deg, #090406 0%, #1a0b0e 100%);
        overflow: hidden;
        z-index: 1;
      }

      .rrCinematicCanopy {
        position: absolute;
        inset: 0;
      }

      .rrStar {
        position: absolute;
        width: 2px; height: 2px;
        background: #ffffff;
        border-radius: 50%;
        animation: rrStarTwinkle 4s infinite alternate;
      }
      .rrStar1 { top: 10%; left: 15%; }
      .rrStar2 { top: 30%; left: 40%; }
      .rrStar3 { top: 15%; left: 85%; }
      .rrStar4 { top: 40%; left: 10%; }
      .rrStar5 { top: 5%; left: 60%; }
      .rrStar6 { top: 50%; left: 75%; }
      .rrStar7 { top: 20%; left: 92%; }
      .rrStar8 { top: 8%; left: 30%; }
      .rrStar9 { top: 35%; left: 52%; }
      .rrStar10 { top: 18%; left: 5%; }
      .rrStar11 { top: 60%; left: 25%; }
      .rrStar12 { top: 70%; left: 48%; }
      .rrStar13 { top: 65%; left: 88%; }
      .rrStar14 { top: 55%; left: 22%; }
      .rrStar15 { top: 78%; left: 58%; }

      @keyframes rrStarTwinkle {
        0% { opacity: 0.2; }
        100% { opacity: 1; }
      }

      /* Export Skyway Flowing Left to Right */
      .rrExportSkyway {
        position: absolute;
        inset: 0;
      }

      .rrCssAircraft {
        position: absolute;
        will-change: transform;
        opacity: 0;
        transform: scale(0.65); /* Scale down to fit in 120px */
      }

      .rrNavLight {
        position: absolute;
        width: 3px; height: 3px;
        border-radius: 50%;
        animation: rrBlinkNav 1s infinite;
      }
      .rrNavLight--red { background: #ff2a2a; }
      .rrNavLight--green { background: #2aff2a; }
      .rrNavLight--white { background: #ffffff; animation: rrBlinkNavFast 0.5s infinite; }

      @keyframes rrBlinkNav { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes rrBlinkNavFast { 0%, 20% { opacity: 1; } 21%, 100% { opacity: 0; } }

      .rrHangingCargo {
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: rrCargoSwing 2.5s ease-in-out infinite alternate;
        transform-origin: top center;
      }
      .rrCargoCable {
        width: 1px;
        height: 16px;
        background: rgba(255, 255, 255, 0.4);
      }
      .rrCargoBoxImg {
        width: 18px;
        height: auto;
        object-fit: contain;
      }

      @keyframes rrCargoSwing {
        0% { transform: translateX(-50%) rotate(-5deg); }
        100% { transform: translateX(-50%) rotate(5deg); }
      }

      /* Base Plane Animation - All go left to right sequentially */
      @keyframes rrFlyLeftToRight {
        0% { transform: translateX(-150px) scale(0.65); opacity: 0; }
        5% { opacity: 1; }
        95% { opacity: 1; }
        100% { transform: translateX(110vw) scale(0.65); opacity: 0; }
      }

      /* Plane 1 - Jumbo Export Cargo */
      .rrCssPlane1 {
        top: 10px;
        width: 80px; height: 20px;
        animation: rrFlyLeftToRight 24s linear infinite 0s;
      }
      .rrCssPlane1 .rrPlaneFuselage {
        position: absolute;
        top: 8px; left: 0;
        width: 80px; height: 10px;
        background: #ffffff;
        border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
      }
      .rrCssPlane1 .rrPlaneCockpit {
        position: absolute;
        top: 2px; right: 4px;
        width: 8px; height: 4px;
        background: #111;
        border-radius: 2px 5px 0 0;
      }
      .rrCssPlane1 .rrPlaneBrand {
        position: absolute;
        top: 3px; left: 15px;
        font-size: 3px; font-weight: 900; color: #9e1017;
      }
      .rrCssPlane1 .rrPlaneWingFront {
        position: absolute;
        top: 12px; left: 30px;
        width: 25px; height: 8px;
        background: #e6e6e6;
        clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
        transform: rotate(-10deg);
        z-index: 2;
      }
      .rrCssPlane1 .rrPlaneWingFront .rrNavLight { bottom: -1px; left: -1px; }
      
      .rrCssPlane1 .rrPlaneWingBack {
        position: absolute;
        top: 4px; left: 32px;
        width: 20px; height: 6px;
        background: #cccccc;
        clip-path: polygon(0 100%, 100% 100%, 80% 0, 20% 0);
        transform: rotate(10deg);
        z-index: -1;
      }
      .rrCssPlane1 .rrPlaneWingBack .rrNavLight { top: -1px; left: -1px; }

      .rrCssPlane1 .rrPlaneTail {
        position: absolute;
        top: 0; left: 3px;
        width: 10px; height: 12px;
      }
      .rrCssPlane1 .rrPlaneTailFin {
        position: absolute;
        bottom: 5px; left: 0;
        width: 8px; height: 10px;
        background: #9e1017;
        clip-path: polygon(0 100%, 100% 100%, 60% 0, 0 0);
      }
      .rrCssPlane1 .rrPlaneTail .rrNavLight { top: 1px; left: -1px; }

      /* Helicopter 1 */
      .rrCssHelicopter1 {
        top: 25px;
        width: 90px; height: 45px;
        animation: rrFlyLeftToRight 24s linear infinite 6s;
      }
      /* Plane 2 - Fast Mid Altitude */
      .rrCssPlane2 {
        top: 40px;
        width: 50px; height: 15px;
        animation: rrFlyLeftToRight 24s linear infinite 12s;
        z-index: 1;
      }
      .rrCssPlane2 .rrPlaneFuselage {
        position: absolute;
        top: 5px; left: 0;
        width: 50px; height: 8px;
        background: #d9d9d9;
        border-radius: 50% / 60% 60% 40% 40%;
      }
      .rrCssPlane2 .rrPlaneCockpit {
        position: absolute;
        top: 1px; right: 3px;
        width: 6px; height: 3px;
        background: #000;
        border-radius: 2px 4px 0 0;
      }
      .rrCssPlane2 .rrPlaneWingFront {
        position: absolute;
        top: 8px; left: 20px;
        width: 16px; height: 6px;
        background: #aaa;
        clip-path: polygon(0 0, 100% 0, 70% 100%, 30% 100%);
        transform: rotate(-10deg);
        z-index: 2;
      }
      .rrCssPlane2 .rrPlaneWingBack {
        position: absolute;
        top: 2px; left: 22px;
        width: 14px; height: 4px;
        background: #777;
        clip-path: polygon(0 100%, 100% 100%, 70% 0, 30% 0);
        transform: rotate(10deg);
        z-index: -1;
      }
      .rrCssPlane2 .rrPlaneTailFin {
        position: absolute;
        bottom: 6px; left: 3px;
        width: 6px; height: 8px;
        background: #2e7d32;
        clip-path: polygon(0 100%, 100% 100%, 50% 0, 0 0);
      }

      /* Helicopter 2 */
      .rrCssHelicopter2 {
        top: 15px;
        width: 90px; height: 45px;
        animation: rrFlyLeftToRight 24s linear infinite 18s;
      }

      /* Shared Helicopter Parts */
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliCabin {
        position: absolute;
        top: 12px; left: 27px;
        width: 38px; height: 26px;
        background: #c41a22;
        border-radius: 40% 60% 50% 50% / 50% 50% 40% 40%;
        z-index: 2;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliWindow {
        position: absolute;
        top: 4px; right: 4px;
        width: 15px; height: 12px;
        background: #aaccff;
        border-radius: 3px 12px 3px 3px;
        opacity: 0.8;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliTail {
        position: absolute;
        top: 18px; left: 0;
        width: 32px; height: 6px;
        background: #9e1017;
        border-radius: 3px 0 0 3px;
        z-index: 1;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliTailRotor {
        position: absolute;
        top: -6px; left: -3px;
        width: 15px; height: 15px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.2);
        display: grid; place-items: center;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliBladeSmall {
        width: 1px; height: 12px; background: #fff;
        animation: rrHeliRotorSpin 0.1s linear infinite;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliMainRotor {
        position: absolute;
        top: 0; left: 30px;
        width: 30px; height: 8px;
        z-index: 3;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliMainRotor::before {
        content: ""; position: absolute;
        bottom: 0; left: 14px;
        width: 3px; height: 9px; background: #555;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliBlade {
        position: absolute;
        top: -1px; left: -22px;
        width: 75px; height: 1px;
        background: rgba(255,255,255,0.8);
        border-radius: 50%;
        animation: rrHeliRotorSpin 0.15s linear infinite;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliSkids {
        position: absolute;
        bottom: -1px; left: 30px;
        width: 30px; height: 9px;
        z-index: 1;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliLeg {
        position: absolute;
        top: 0; width: 2px; height: 7px; background: #777;
      }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliLeg:nth-child(1) { left: 8px; }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliLeg:nth-child(2) { right: 8px; }
      .rrCssAircraft[class*="rrCssHeli"] .rrHeliRunner {
        position: absolute;
        bottom: 0; left: -3px;
        width: 38px; height: 2px;
        background: #ccc; border-radius: 1px;
      }

      @keyframes rrHeliRotorSpin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }

      /* INFO SHELL Gap Fix (Directly below 120px sky) */
      .rrInfoShell {
        width: min(1280px, 100%);
        margin: 0 auto;
        position: relative;
        z-index: 10;
        padding-top: 140px; 
      }

      /* Clean Back Button */
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

      /* High-End Glass Header */
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

      /* About Section Overrides */
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

      /* Real Food Photography */
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

      /* Number Strip */
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

      /* Story Block */
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

      /* Real Ingredients Photo Grid */
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

      /* Heritage Grid */
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
      .rrHeritageCard.dark p {
        color: #d1c3be;
      }
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

      /* Quote */
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

      /* Contact Section */
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

      /* FAQ */
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

      /* Policies */
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

      /* Order Success Page */
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

      /* CTA Bottom Button */
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

      /* Scroll reveal animations */
      .rrReveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .rrRevealVisible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Responsive Rules */
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