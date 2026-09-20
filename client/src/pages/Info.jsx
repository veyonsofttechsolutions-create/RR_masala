import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Utensils,
} from "lucide-react";

/* =========================================================
   COMMON INFO LAYOUT
========================================================= */

export function Info({
  title,
  eyebrow = "RR MASALA",
  children,
  icon: Icon = BookOpen,
}) {
  const nav = useNavigate();

  return (
    <main className="infoPage">
      <InfoStyles />
      <div className="infoShell">
        <button className="infoBack" type="button" onClick={() => nav(-1)}>
          <ArrowLeft size={15} />
          Back
        </button>

        <header className="infoPageHeader">
          <div className="infoHeaderIcon">
            <Icon size={23} strokeWidth={1.8} />
          </div>
          <div>
            <span>{eyebrow}</span>
            <h1>{title}</h1>
          </div>
        </header>

        {children}

        <div className="infoBottomCta">
          <Link to="/products" className="infoShopButton">
            <ShoppingBag size={16} />
            Explore products
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   ABOUT — COMPLETE REDESIGN
========================================================= */

export const About = () => (
  <Info title="Our food story" eyebrow="RR MASALA · HERITAGE & FLAVOUR" icon={BookOpen}>
    <div className="aboutPremium">

      {/* HERO */}
      <section className="aboutHero">
        <div className="aboutHeroNoise" />

        <div className="aboutHeroCopy">
          <div className="aboutEyebrow">
            <span />
            MADURAI · SOUTH INDIA · FOOD MEMORY
          </div>

          <h2>
            The story of
            <br />
            <i>Puliyodarai.</i>
          </h2>

          <p>
            A dish shaped by tamarind, sesame oil, roasted spices and generations
            of South Indian food memories.
          </p>

          <a href="#puliyodarai-story" className="aboutHeroLink">
            Discover the story
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="aboutHeroArt" aria-hidden="true">
          <div className="plateShadow" />
          <div className="plate">
            <div className="riceField">
              <span className="grain g1" />
              <span className="grain g2" />
              <span className="grain g3" />
              <span className="grain g4" />
              <span className="grain g5" />
              <span className="grain g6" />
              <span className="grain g7" />
              <span className="grain g8" />
              <span className="seed s1" />
              <span className="seed s2" />
              <span className="seed s3" />
              <span className="leaf l1" />
              <span className="leaf l2" />
            </div>
          </div>
          <div className="heroDishLabel">
            <strong>PULIYODARAI</strong>
            <span>Tamarind rice · traditional preparation</span>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="aboutStats">
        <div>
          <strong>01</strong>
          <span>Traditional recipe</span>
        </div>
        <div>
          <strong>02</strong>
          <span>Madurai food culture</span>
        </div>
        <div>
          <strong>03</strong>
          <span>Memory through food</span>
        </div>
        <div>
          <strong>04</strong>
          <span>Everyday Indian kitchen</span>
        </div>
      </section>

      {/* INTRO */}
      <section className="aboutIntro" id="puliyodarai-story">
        <div className="aboutSideLabel">
          <span>01</span>
          THE DISH
        </div>

        <div>
          <h2>
            More than
            <br />
            <em>tamarind rice.</em>
          </h2>

          <div className="aboutIntroText">
            <p>
              Puliyodarai is one of those foods whose identity comes from balance:
              the sourness of tamarind, the aroma of sesame oil, roasted chillies,
              lentils and spices, and rice prepared to hold everything together.
            </p>

            <p>
              The story you shared presents it as a food of journeys, homes,
              temples and unforgettable meals — a simple preparation carrying a
              remarkable amount of memory.
            </p>
          </div>
        </div>
      </section>

      {/* INGREDIENT PHILOSOPHY */}
      <section className="ingredientSection">
        <div className="sectionHeading">
          <div>
            <span>02 · THE CHARACTER</span>
            <h2>What gives it its identity?</h2>
          </div>
          <p>
            The story focuses on the details that turn ordinary rice into a
            deeply flavoured Puliyodarai.
          </p>
        </div>

        <div className="ingredientGrid">
          <article className="ingredientCard featured">
            <div className="ingredientNo">01</div>
            <div className="ingredientVisual tamarind">
              <span />
            </div>
            <div>
              <h3>Mature tamarind</h3>
              <p>Deep sourness that forms the foundation of the flavour.</p>
            </div>
          </article>

          <article className="ingredientCard">
            <div className="ingredientNo">02</div>
            <div className="ingredientVisual oil">
              <span />
            </div>
            <div>
              <h3>Sesame oil</h3>
              <p>Distinctive aroma and richness that ties the preparation together.</p>
            </div>
          </article>

          <article className="ingredientCard">
            <div className="ingredientNo">03</div>
            <div className="ingredientVisual chilli">
              <span />
            </div>
            <div>
              <h3>Roasted chillies</h3>
              <p>Warmth, fragrance and the unmistakable character of the dish.</p>
            </div>
          </article>

          <article className="ingredientCard">
            <div className="ingredientNo">04</div>
            <div className="ingredientVisual dal">
              <span />
            </div>
            <div>
              <h3>Bengal gram</h3>
              <p>A little crunch that contrasts beautifully with the rice.</p>
            </div>
          </article>
        </div>
      </section>

      {/* EDITORIAL STORY */}
      <section className="editorialStory">
        <div className="editorialImage">
          <div className="editorialCircle">
            <span>R</span>
            <small>MASALA</small>
          </div>
          <div className="editorialVertical">TRADITIONAL FOOD MEMORY</div>
        </div>

        <div className="editorialCopy">
          <span className="sectionTag">03 · THE MEMORY</span>
          <h2>
            Food becomes
            <br />
            <em>a story.</em>
          </h2>

          <p>
            The Tamil passage shared for this page remembers Puliyodarai as
            something far beyond a recipe. It recalls long journeys when food
            had to travel with people, the importance of texture and aroma, and
            the pleasure of eating it with carefully chosen accompaniments.
          </p>

          <p>
            At the centre of that memory is the Puliyodarai associated in the
            story with the Saurashtra community of Madurai — a version described
            with particular affection and nostalgia.
          </p>

          <div className="memoryLine">
            <Sparkles size={17} />
            <span>Tradition is remembered through taste.</span>
          </div>
        </div>
      </section>

      {/* SAURASHTRA */}
      <section className="heritageSection">
        <div className="heritageTop">
          <span>04 · MADURAI HERITAGE</span>
          <h2>
            A special place in
            <br />
            <em>Saurashtra food memories.</em>
          </h2>
        </div>

        <div className="heritageGrid">
          <article className="heritageCard dark">
            <div className="heritageIcon"><Utensils size={19} /></div>
            <span>THE TABLE</span>
            <h3>A memorable combination</h3>
            <p>
              Puliyodarai served with black chickpea sundal, pickle,
              ginger-chilli chutney and coconut is part of the meal remembered
              in the story.
            </p>
          </article>

          <article className="heritageCard">
            <div className="heritageIcon"><BookOpen size={19} /></div>
            <span>THE MEMORY</span>
            <h3>A meal worth remembering</h3>
            <p>
              The writing describes returning repeatedly for servings and
              remembering the experience as an exceptional food memory.
            </p>
          </article>

          <article className="heritageCard">
            <div className="heritageIcon"><Sparkles size={19} /></div>
            <span>THE FEELING</span>
            <h3>Simple food, lasting emotion</h3>
            <p>
              The story's central idea is simple: traditional food can create
              memories that stay long after the meal is over.
            </p>
          </article>
        </div>
      </section>

      {/* QUOTE */}
      <section className="aboutQuote">
        <div className="quoteTop">
          <span>05 · THE LINE THAT STAYS</span>
          <div />
        </div>
        <blockquote>
          “The Puliyodarai prepared by the Saurashtra community is described in
          the shared story as the ‘queen’ of Puliyodarai.”
        </blockquote>
        <p>
          Presented here as a reference to the user-provided Tamil text. The
          original publication of the full passage has not been independently
          verified on this page.
        </p>
      </section>

      {/* TRADITION */}
      <section className="traditionSection">
        <div className="traditionCopy">
          <span>06 · WHY RR MASALA</span>
          <h2>
            Tradition deserves
            <br />
            a modern home.
          </h2>
          <p>
            RR MASALA is built around the same idea: familiar Indian pantry
            flavours should feel easy to discover, understand and bring into
            everyday kitchens.
          </p>

          <Link to="/products" className="traditionButton">
            Explore RR MASALA
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="traditionPanel">
          <div className="stamp">RR</div>
          <div>
            <span>FOOD · MEMORY · TRADITION</span>
            <strong>Simple shopping.<br />Traditional taste.</strong>
          </div>
        </div>
      </section>

      {/* DISCLAIMER / SOURCE */}
      <section className="aboutNote">
        <BookOpen size={17} />
        <div>
          <strong>About this story</strong>
          <p>
            This About page is based on the Tamil passage supplied for RR MASALA
            and translated/adapted into English for the website. References to
            the author and the original passage are presented as supplied by the
            user; the complete original publication was not independently
            verified here.
          </p>
        </div>
      </section>

      {/* FINAL */}
      <section className="aboutFinal">
        <div className="finalMark">RR</div>
        <span>RR MASALA</span>
        <h2>Every flavour carries a memory.</h2>
        <p>Discover the pantry behind the story.</p>
        <Link to="/products">
          Shop the collection
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  </Info>
);

/* =========================================================
   CONTACT
========================================================= */

export const Contact = () => (
  <Info title="Contact us" icon={MessageCircle}>
    <div className="simpleInfo">
      <p>Need help with an order, product or delivery? We're here to help.</p>

      <div className="simpleGrid">
        <div>
          <MessageCircle size={20} />
          <h3>WhatsApp support</h3>
          <p>Use the store's configured WhatsApp channel for support enquiries.</p>
        </div>

        <div>
          <PackageCheck size={20} />
          <h3>Order support</h3>
          <p>Keep your order number ready when contacting us about an existing order.</p>
        </div>
      </div>

      <h2>How can we help?</h2>
      <p>
        For orders, products and delivery questions, please use the store's
        configured phone, email or WhatsApp channel.
      </p>
    </div>
  </Info>
);

/* =========================================================
   FAQ
========================================================= */

export const FAQ = () => (
  <Info title="Frequently asked questions" eyebrow="HELP CENTRE" icon={HelpCircle}>
    <div className="faqList">
      <div className="faqItem">
        <h3>Do I need an account to browse?</h3>
        <p> No. You can browse products and use your cart without logging in. Login is required when placing an order.</p>
      </div>
      <div className="faqItem">
        <h3>Can I cancel after shipping?</h3>
        <p>Cancellation is disabled once an order has been shipped.</p>
      </div>
      <div className="faqItem">
        <h3>Can I track my order?</h3>
        <p>Yes. Open My Orders and select Track Order to view the current status.</p>
      </div>
      <div className="faqItem">
        <h3>Can I save multiple addresses?</h3>
        <p>Yes. You can add multiple delivery addresses and choose a default address.</p>
      </div>
      <div className="faqItem">
        <h3>Can I add products to my wishlist?</h3>
        <p>Yes. Use the heart option on products to save them for later.</p>
      </div>
    </div>
  </Info>
);

/* =========================================================
   POLICY
========================================================= */

export const Policy = ({ title, children }) => (
  <Info title={title} eyebrow="RR MASALA · POLICY" icon={ShieldCheck}>
    <div className="simpleInfo">{children}</div>
  </Info>
);

/* =========================================================
   ORDER SUCCESS
========================================================= */

export function Success() {
  return (
    <main className="successPage">
      <div className="successCard">
        <div className="successIcon">✓</div>
        <span>ORDER RECEIVED</span>
        <h1>Thank you.</h1>
        <p>
          Your order has been created successfully. You can follow its progress
          from your orders section as it moves through confirmation, processing,
          packing and shipment.
        </p>

        <div className="successActions">
          <Link to="/orders">
            <PackageCheck size={16} />
            My orders
            <ArrowRight size={15} />
          </Link>
          <Link to="/products" className="secondary">
            <ShoppingBag size={16} />
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   STYLES
========================================================= */

export function InfoStyles() {
  return (
    <style>{`
      .infoPage {
        min-height: 100vh;
        padding: 26px 18px 70px;
        background:
          radial-gradient(circle at 5% 0%, rgba(232,194,51,.10), transparent 25%),
          #f7f6f2;
        color: #191a16;
      }

      .infoShell {
        width: min(1160px, 100%);
        margin: auto;
      }

      .infoBack {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border: 0;
        background: transparent;
        color: #64675e;
        font-size: 11px;
        font-weight: 850;
        cursor: pointer;
        padding: 8px 0;
        margin-bottom: 17px;
      }

      .infoPageHeader {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 25px 28px;
        margin-bottom: 15px;
        border: 1px solid #e7e4da;
        border-radius: 17px;
        background: linear-gradient(135deg,#fff,#fffbea);
      }

      .infoHeaderIcon {
        width: 48px;
        height: 48px;
        flex: 0 0 48px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #fff2bb;
        color: #725d13;
      }

      .infoPageHeader span {
        color: #9a7d19;
        font-size: 8px;
        font-weight: 950;
        letter-spacing: .17em;
      }

      .infoPageHeader h1 {
        margin: 5px 0 0;
        font-size: clamp(25px,4vw,38px);
        letter-spacing: -.045em;
      }

      .infoBottomCta {
        display: flex;
        justify-content: center;
        padding-top: 18px;
      }

      .infoShopButton {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 42px;
        padding: 0 15px;
        border-radius: 10px;
        background: #191a16;
        color: #fff;
        text-decoration: none;
        font-size: 10px;
        font-weight: 900;
      }

      /* ABOUT HERO */
      .aboutPremium { overflow: hidden; }

      .aboutHero {
        min-height: 560px;
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr .9fr;
        align-items: center;
        border-radius: 25px;
        background: #171813;
        color: #fff;
        padding: 60px;
        box-shadow: 0 24px 65px rgba(22,23,18,.15);
      }

      .aboutHeroNoise {
        position: absolute;
        inset: 0;
        opacity: .45;
        background:
          radial-gradient(circle at 72% 35%, rgba(235,194,48,.14), transparent 25%),
          linear-gradient(120deg, transparent 45%, rgba(255,255,255,.025) 46%, transparent 47%);
      }

      .aboutHeroCopy,
      .aboutHeroArt { position: relative; z-index: 2; }

      .aboutEyebrow {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #dbc46b;
        font-size: 8px;
        font-weight: 950;
        letter-spacing: .18em;
      }

      .aboutEyebrow span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #e5bd29;
        box-shadow: 0 0 0 5px rgba(229,189,41,.10);
      }

      .aboutHero h2 {
        margin: 20px 0 18px;
        font-size: clamp(48px,6vw,78px);
        line-height: .92;
        letter-spacing: -.065em;
      }

      .aboutHero h2 i {
        color: #e8c235;
        font-family: Georgia,serif;
        font-weight: 500;
      }

      .aboutHeroCopy > p {
        max-width: 510px;
        margin: 0;
        color: #bfc1b8;
        font-size: 13px;
        line-height: 1.85;
      }

      .aboutHeroLink {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 27px;
        padding-bottom: 6px;
        color: #fff;
        border-bottom: 1px solid #7d6b2a;
        text-decoration: none;
        font-size: 10px;
        font-weight: 900;
      }

      .aboutHeroArt {
        min-height: 400px;
        display: grid;
        place-items: center;
      }

      .plateShadow {
        position: absolute;
        width: 310px;
        height: 55px;
        bottom: 48px;
        border-radius: 50%;
        background: rgba(0,0,0,.55);
        filter: blur(18px);
      }

      .plate {
        width: min(350px,80vw);
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        border-radius: 50%;
        transform: rotate(-7deg);
        background: #25231b;
        border: 14px solid #302e25;
        box-shadow: inset 0 0 0 5px #6e5a32, 0 25px 40px rgba(0,0,0,.35);
      }

      .riceField {
        width: 77%;
        height: 77%;
        position: relative;
        border-radius: 50%;
        background:
          radial-gradient(circle at 30% 25%, #c18a2a, transparent 3%),
          radial-gradient(circle at 65% 28%, #d39c36, transparent 3%),
          radial-gradient(circle at 50% 65%, #a96d20, transparent 3%),
          radial-gradient(circle at 25% 70%, #d19a35, transparent 3%),
          radial-gradient(circle at 70% 70%, #8f5b1d, transparent 3%),
          linear-gradient(145deg,#b77821,#704217);
          box-shadow: inset 0 0 35px rgba(25,10,2,.38);
      }

      .grain,.seed,.leaf {
        position: absolute;
        display: block;
      }

      .grain {
        width: 8px;
        height: 4px;
        border-radius: 100%;
        background: #e0b65a;
      }

      .g1 { left:20%;top:35%;transform:rotate(25deg); }
      .g2 { left:37%;top:23%;transform:rotate(-20deg); }
      .g3 { left:58%;top:35%;transform:rotate(18deg); }
      .g4 { left:70%;top:52%;transform:rotate(-30deg); }
      .g5 { left:43%;top:51%;transform:rotate(22deg); }
      .g6 { left:25%;top:62%;transform:rotate(-15deg); }
      .g7 { left:57%;top:70%;transform:rotate(28deg); }
      .g8 { left:76%;top:38%;transform:rotate(10deg); }

      .seed {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #d9a53e;
      }

      .s1 { left:34%;top:45%; }
      .s2 { left:62%;top:55%; }
      .s3 { left:48%;top:30%; }

      .leaf {
        width: 34px;
        height: 16px;
        border-radius: 100% 0 100% 0;
        background: #3d512c;
      }

      .l1 { left:22%;top:22%;transform:rotate(-22deg); }
      .l2 { right:20%;bottom:23%;transform:rotate(32deg); }

      .heroDishLabel {
        position: absolute;
        bottom: 15px;
        left: 0;
        width: 100%;
        text-align: center;
      }

      .heroDishLabel strong,
      .heroDishLabel span { display:block; }
      .heroDishLabel strong { font-size: 11px; letter-spacing:.12em; }
      .heroDishLabel span { margin-top:3px;color:#888b81;font-size:8px; }

      /* STATS */
      .aboutStats {
        display:grid;
        grid-template-columns:repeat(4,1fr);
        border:1px solid #e5e2d8;
        border-top:0;
        border-radius:0 0 17px 17px;
        overflow:hidden;
        background:#fff;
      }

      .aboutStats div {
        padding:18px 20px;
        border-right:1px solid #ece9df;
      }

      .aboutStats div:last-child { border-right:0; }
      .aboutStats strong { display:block;color:#b08a20;font-size:12px; }
      .aboutStats span { display:block;margin-top:5px;color:#74776e;font-size:9px; }

      /* INTRO */
      .aboutIntro {
        display:grid;
        grid-template-columns:.35fr 1fr;
        gap:60px;
        padding:105px 6%;
      }

      .aboutSideLabel {
        color:#999b92;
        font-size:8px;
        font-weight:950;
        letter-spacing:.17em;
      }

      .aboutSideLabel span {
        color:#b28b20;
        margin-right:9px;
        font-size:13px;
      }

      .aboutIntro h2 {
        margin:0 0 22px;
        font-size:clamp(38px,5vw,60px);
        line-height:.98;
        letter-spacing:-.06em;
      }

      .aboutIntro h2 em {
        color:#a17a15;
        font-family:Georgia,serif;
        font-weight:500;
      }

      .aboutIntroText {
        max-width:730px;
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:28px;
      }

      .aboutIntroText p {
        margin:0;
        color:#6e7168;
        font-size:12px;
        line-height:1.9;
      }

      /* INGREDIENTS */
      .ingredientSection {
        padding:70px 0;
        border-top:1px solid #e5e2d8;
      }

      .sectionHeading {
        display:flex;
        align-items:end;
        justify-content:space-between;
        gap:25px;
        margin-bottom:27px;
      }

      .sectionHeading > div > span,
      .heritageTop > span,
      .editorialCopy > .sectionTag,
      .traditionCopy > span {
        color:#9b7b1d;
        font-size:8px;
        font-weight:950;
        letter-spacing:.17em;
      }

      .sectionHeading h2 {
        margin:7px 0 0;
        font-size:clamp(27px,4vw,43px);
        letter-spacing:-.045em;
      }

      .sectionHeading > p {
        max-width:310px;
        margin:0;
        color:#777a71;
        font-size:10px;
        line-height:1.7;
      }

      .ingredientGrid {
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:10px;
      }

      .ingredientCard {
        min-height:330px;
        padding:19px;
        border:1px solid #e4e1d7;
        border-radius:17px;
        background:#fff;
        display:flex;
        flex-direction:column;
      }

      .ingredientCard.featured {
        background:#191a15;
        color:#fff;
        border-color:#191a15;
      }

      .ingredientNo {
        color:#9d7d20;
        font-size:8px;
        font-weight:950;
      }

      .ingredientVisual {
        height:145px;
        margin:16px 0 18px;
        border-radius:12px;
        position:relative;
        overflow:hidden;
      }

      .tamarind { background:radial-gradient(circle at 45% 50%,#9e6424,#4b2b12); }
      .oil { background:linear-gradient(145deg,#9b771c,#e4bc37); }
      .chilli { background:linear-gradient(145deg,#7e1710,#d94b22); }
      .dal { background:radial-gradient(circle,#d9a447 0 12%,#83501d 13% 20%,#3c2816 21%); }

      .ingredientVisual::before,
      .ingredientVisual::after {
        content:"";
        position:absolute;
        border-radius:50%;
      }

      .tamarind::before {
        width:85px;height:45px;left:28px;top:48px;
        background:#6d3b16;transform:rotate(-18deg);
        box-shadow:55px 12px #8a4e1e;
      }

      .oil::before {
        width:105px;height:105px;left:45px;top:20px;
        border:9px solid rgba(255,241,157,.35);
      }

      .chilli::before {
        width:20px;height:105px;left:70px;top:22px;
        border-radius:80% 20% 80% 20%;background:#ef6a28;transform:rotate(23deg);
        box-shadow:30px -5px #a91e16;
      }

      .dal::before {
        width:20px;height:20px;left:45px;top:35px;background:#dca94b;
        box-shadow:40px 25px #e5b653,85px 8px #c89134,20px 55px #d8a545,70px 65px #e3b554;
      }

      .ingredientCard h3 { margin:0 0 6px;font-size:15px; }
      .ingredientCard p { margin:0;color:#75786f;font-size:10px;line-height:1.65; }
      .ingredientCard.featured p { color:#b7b9af; }

      /* EDITORIAL */
      .editorialStory {
        display:grid;
        grid-template-columns:.85fr 1fr;
        gap:70px;
        padding:80px 0;
        align-items:center;
      }

      .editorialImage {
        min-height:480px;
        position:relative;
        overflow:hidden;
        border-radius:22px;
        background:
          radial-gradient(circle at 50% 50%,#9b6c22 0 12%,transparent 12.5%),
          radial-gradient(circle at 50% 50%,#5c3816 0 30%,transparent 30.5%),
          linear-gradient(145deg,#332717,#141510);
        box-shadow:inset 0 0 70px rgba(0,0,0,.3);
      }

      .editorialCircle {
        position:absolute;
        width:230px;height:230px;
        left:50%;top:50%;
        transform:translate(-50%,-50%);
        border:1px solid rgba(235,196,74,.5);
        border-radius:50%;
        display:grid;
        place-items:center;
        align-content:center;
        color:#e2c55d;
      }

      .editorialCircle span {
        font-family:Georgia,serif;
        font-size:74px;
        line-height:.7;
      }

      .editorialCircle small {
        margin-top:14px;
        font-size:9px;
        letter-spacing:.3em;
      }

      .editorialVertical {
        position:absolute;
        left:20px;
        bottom:22px;
        writing-mode:vertical-rl;
        transform:rotate(180deg);
        color:#8f8b78;
        font-size:7px;
        letter-spacing:.18em;
      }

      .editorialCopy h2 {
        margin:9px 0 20px;
        font-size:clamp(39px,5vw,62px);
        line-height:.96;
        letter-spacing:-.06em;
      }

      .editorialCopy h2 em {
        color:#a17a15;
        font-family:Georgia,serif;
        font-weight:500;
      }

      .editorialCopy > p {
        max-width:560px;
        color:#6e7168;
        font-size:12px;
        line-height:1.9;
      }

      .memoryLine {
        display:flex;
        align-items:center;
        gap:9px;
        margin-top:25px;
        color:#816719;
        font-size:10px;
        font-weight:850;
      }

      /* HERITAGE */
      .heritageSection {
        padding:75px 0;
        border-top:1px solid #e5e2d8;
      }

      .heritageTop h2 {
        margin:8px 0 30px;
        font-size:clamp(38px,5vw,60px);
        line-height:.98;
        letter-spacing:-.06em;
      }

      .heritageTop h2 em {
        color:#a17a15;
        font-family:Georgia,serif;
        font-weight:500;
      }

      .heritageGrid {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:10px;
      }

      .heritageCard {
        min-height:275px;
        padding:25px;
        border:1px solid #e5e2d8;
        border-radius:17px;
        background:#fff;
      }

      .heritageCard.dark {
        background:#191a15;
        color:#fff;
        border-color:#191a15;
      }

      .heritageIcon {
        width:36px;height:36px;
        display:grid;place-items:center;
        border-radius:10px;
        background:#fff2bd;
        color:#725a0e;
      }

      .heritageCard > span {
        display:block;
        margin-top:48px;
        color:#9b7b1d;
        font-size:8px;
        font-weight:950;
        letter-spacing:.14em;
      }

      .heritageCard h3 { margin:7px 0 9px;font-size:17px; }
      .heritageCard p { margin:0;color:#74776e;font-size:10px;line-height:1.8; }
      .heritageCard.dark p { color:#b9bbb2; }

      /* QUOTE */
      .aboutQuote {
        padding:100px 8%;
        margin:10px 0 75px;
        border-radius:23px;
        background:#eae5d5;
      }

      .quoteTop {
        display:flex;
        align-items:center;
        gap:15px;
        color:#8c7841;
        font-size:8px;
        font-weight:950;
        letter-spacing:.17em;
      }

      .quoteTop div { height:1px;flex:1;background:#cfc6aa; }

      .aboutQuote blockquote {
        max-width:900px;
        margin:32px 0 18px;
        font-family:Georgia,serif;
        font-size:clamp(26px,4vw,45px);
        line-height:1.28;
        letter-spacing:-.025em;
      }

      .aboutQuote p {
        max-width:700px;
        margin:0;
        color:#77766c;
        font-size:9px;
        line-height:1.6;
      }

      /* FINAL BRAND */
      .traditionSection {
        display:grid;
        grid-template-columns:1fr .65fr;
        gap:50px;
        padding:20px 0 80px;
        align-items:center;
      }

      .traditionCopy h2 {
        margin:8px 0 18px;
        font-size:clamp(38px,5vw,60px);
        line-height:.98;
        letter-spacing:-.06em;
      }

      .traditionCopy > p {
        max-width:550px;
        color:#70736a;
        font-size:12px;
        line-height:1.85;
      }

      .traditionButton {
        display:inline-flex;
        align-items:center;
        gap:7px;
        margin-top:20px;
        padding:12px 15px;
        border-radius:10px;
        background:#191a16;
        color:#fff;
        text-decoration:none;
        font-size:10px;
        font-weight:900;
      }

      .traditionPanel {
        min-height:260px;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        padding:27px;
        border-radius:20px;
        background:linear-gradient(145deg,#1a1b16,#353019);
        color:#fff;
      }

      .traditionPanel span { color:#c9b65c;font-size:8px;letter-spacing:.15em;font-weight:950; }
      .traditionPanel strong { display:block;margin-top:7px;font-size:22px;line-height:1.1;letter-spacing:-.03em; }

      .stamp {
        width:55px;height:55px;
        display:grid;place-items:center;
        border:1px solid #806e30;
        border-radius:50%;
        color:#e5c856;
        font-family:Georgia,serif;
        font-size:20px;
      }

      .aboutNote {
        display:flex;
        gap:11px;
        align-items:flex-start;
        padding:15px;
        border:1px solid #e4e1d8;
        border-radius:12px;
        background:#f5f4ef;
        color:#767970;
      }

      .aboutNote svg { flex:0 0 auto;margin-top:2px;color:#92731b; }
      .aboutNote strong { display:block;color:#474a42;font-size:9px; }
      .aboutNote p { margin:4px 0 0;font-size:9px;line-height:1.65; }

      .aboutFinal {
        text-align:center;
        padding:95px 15px 55px;
      }

      .finalMark {
        width:52px;height:52px;
        margin:0 auto 15px;
        display:grid;place-items:center;
        border-radius:50%;
        background:#191a16;
        color:#e6c34b;
        font-family:Georgia,serif;
        font-size:20px;
      }

      .aboutFinal > span {
        color:#9a7a1d;
        font-size:8px;
        font-weight:950;
        letter-spacing:.2em;
      }

      .aboutFinal h2 {
        margin:9px 0 7px;
        font-size:clamp(27px,4vw,42px);
        letter-spacing:-.05em;
      }

      .aboutFinal p { margin:0;color:#777970;font-size:10px; }

      .aboutFinal a {
        display:inline-flex;
        align-items:center;
        gap:8px;
        margin-top:22px;
        padding:12px 16px;
        border-radius:10px;
        background:#e8c333;
        color:#171813;
        text-decoration:none;
        font-size:10px;
        font-weight:900;
      }

      /* OTHER PAGES */
      .simpleInfo { padding:30px;border:1px solid #e5e2d8;border-radius:18px;background:#fff; }
      .simpleInfo > p { color:#6f7269;font-size:12px;line-height:1.8; }
      .simpleInfo h2 { margin-top:30px;font-size:20px; }
      .simpleGrid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:25px 0; }
      .simpleGrid > div { padding:20px;border:1px solid #e5e2d8;border-radius:14px;background:#faf9f4; }
      .simpleGrid svg { color:#9b7b1d; }
      .simpleGrid h3 { margin:30px 0 6px;font-size:14px; }
      .simpleGrid p { margin:0;color:#777970;font-size:10px;line-height:1.7; }

      .faqList { display:grid;gap:10px; }
      .faqItem { padding:20px;border:1px solid #e5e2d8;border-radius:13px;background:#fff; }
      .faqItem h3 { margin:0 0 7px;font-size:13px; }
      .faqItem p { margin:0;color:#777970;font-size:10px;line-height:1.7; }

      .successPage { min-height:100vh;padding:70px 18px;background:#f7f6f2; }
      .successCard { width:min(620px,100%);margin:auto;padding:45px 28px;text-align:center;border:1px solid #e5e2d8;border-radius:20px;background:#fff;box-shadow:0 18px 50px rgba(0,0,0,.06); }
      .successIcon { width:72px;height:72px;margin:0 auto 18px;display:grid;place-items:center;border-radius:50%;background:#191a16;color:#e6c333;font-size:30px;font-weight:900; }
      .successCard > span { color:#9a7a1d;font-size:8px;font-weight:950;letter-spacing:.18em; }
      .successCard h1 { margin:8px 0 9px;font-size:42px;letter-spacing:-.05em; }
      .successCard p { color:#777970;font-size:11px;line-height:1.8; }
      .successActions { display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:23px; }
      .successActions a { display:inline-flex;align-items:center;gap:6px;padding:11px 14px;border-radius:9px;background:#191a16;color:#fff;text-decoration:none;font-size:10px;font-weight:900; }
      .successActions a.secondary { background:#fff;color:#292b25;border:1px solid #ddd9cf; }

      @media(max-width:900px) {
        .aboutHero { grid-template-columns:1fr;padding:45px 35px; }
        .aboutHeroArt { min-height:340px; }
        .aboutIntro { grid-template-columns:1fr;gap:25px;padding:75px 4%; }
        .ingredientGrid { grid-template-columns:1fr 1fr; }
        .editorialStory { grid-template-columns:1fr;gap:35px; }
        .heritageGrid { grid-template-columns:1fr; }
        .traditionSection { grid-template-columns:1fr; }
      }

      @media(max-width:620px) {
        .infoPage { padding:16px 10px 45px; }
        .infoPageHeader { padding:20px; }
        .infoPageHeader h1 { font-size:25px; }
        .aboutHero { min-height:auto;padding:32px 22px;border-radius:19px; }
        .aboutHero h2 { font-size:50px; }
        .aboutHeroCopy > p { font-size:11px; }
        .aboutHeroArt { min-height:300px; }
        .plate { width:270px; }
        .aboutStats { grid-template-columns:1fr 1fr; }
        .aboutStats div { border-bottom:1px solid #ece9df; }
        .aboutIntroText { grid-template-columns:1fr; }
        .ingredientSection { padding:55px 0; }
        .sectionHeading { display:block; }
        .sectionHeading > p { margin-top:12px; }
        .ingredientGrid { grid-template-columns:1fr; }
        .ingredientCard { min-height:290px; }
        .editorialImage { min-height:330px; }
        .heritageSection { padding:55px 0; }
        .aboutQuote { padding:65px 23px;margin-bottom:55px; }
        .traditionSection { padding-bottom:55px; }
        .simpleGrid { grid-template-columns:1fr; }
      }
    `}</style>
  );
}
