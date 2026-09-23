import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe2,
  HelpCircle,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Truck,
  Utensils,
} from "lucide-react";
import { storeCompliance } from "../config/storeCompliance.js";

const sections = [
  { id: "terms", label: "Terms & Conditions", icon: Scale },
  { id: "privacy", label: "Privacy Policy", icon: LockKeyhole },
  { id: "shipping", label: "Shipping & Delivery", icon: Truck },
  { id: "international", label: "International Orders", icon: Globe2 },
  { id: "returns", label: "Returns & Refunds", icon: RefreshCcw },
  { id: "food", label: "Food & Product Information", icon: Utensils },
  { id: "payments", label: "Payments", icon: PackageCheck },
  { id: "grievance", label: "Grievance & Contact", icon: HelpCircle },
];

const faq = [
  ["Can I browse without an account?", "Yes. You can browse products, search, view product details and use the cart without logging in. Login is required before placing an order."],
  ["Is Cash on Delivery available?", "The current checkout is configured for online payment. Cash on Delivery should not be treated as available unless the store explicitly enables it."],
  ["How is domestic delivery charged?", "The checkout currently shows free domestic delivery for eligible orders above ₹999 and ₹50 below that threshold, subject to the final order configuration."],
  ["How are international delivery charges calculated?", "International freight depends on destination, shipment weight and dimensions, service level and carrier. Customs duty or import taxes may be charged separately by the destination country."],
  ["Can I return a food product?", "Return eligibility depends on the product, condition and reason for return. Damaged, incorrect or otherwise eligible cases should be reported through the configured support channel within the applicable return window."],
  ["Can I change my delivery address after ordering?", "Contact support as soon as possible. Address changes may not be possible once the order has been packed or shipped."],
];

function Value({ value, fallback = "Not published yet" }) {
  return value ? <span className="lcValue">{value}</span> : <span className="lcMuted">{fallback}</span>;
}

function Section({ id, icon: Icon, eyebrow, title, children }) {
  return (
    <section id={id} className="lcSection">
      <div className="lcSectionRail">
        <div className="lcSectionIcon"><Icon size={19} /></div>
        <span>{eyebrow}</span>
      </div>
      <div className="lcSectionBody">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function LegalCenter() {
  const [active, setActive] = useState("terms");
  const [openFaq, setOpenFaq] = useState(null);

  const current = useMemo(
    () => sections.find((item) => item.id === active) || sections[0],
    [active]
  );

  const jump = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="legalCenterPremium">
      <style>{`
        .legalCenterPremium {
          --lc-ink:#181613;
          --lc-brown:#3a2116;
          --lc-gold:#e8b52b;
          --lc-gold-soft:#fff4c8;
          --lc-cream:#f7f4ed;
          --lc-paper:#fff;
          --lc-line:#e7e1d6;
          --lc-muted:#77736b;
          min-height:100vh;
          background:
            radial-gradient(circle at 88% 4%,rgba(232,181,43,.13),transparent 25%),
            linear-gradient(180deg,#fbfaf6 0%,#f4f1e9 100%);
          color:var(--lc-ink);
          padding:34px 18px 90px;
        }

        .lcShell { width:min(1180px,100%); margin:auto; }

        .lcBack {
          display:inline-flex;
          align-items:center;
          gap:7px;
          border:0;
          background:transparent;
          color:#716c64;
          font-size:11px;
          font-weight:900;
          cursor:pointer;
          padding:7px 0 18px;
        }

        .lcHero {
          position:relative;
          overflow:hidden;
          min-height:370px;
          display:grid;
          grid-template-columns:1.25fr .75fr;
          align-items:stretch;
          border-radius:28px;
          background:#181714;
          color:white;
          box-shadow:0 25px 65px rgba(37,25,12,.16);
        }

        .lcHero::after {
          content:"";
          position:absolute;
          width:430px;
          height:430px;
          right:-120px;
          top:-170px;
          border:1px solid rgba(232,181,43,.28);
          border-radius:50%;
          box-shadow:0 0 0 45px rgba(232,181,43,.025),0 0 0 95px rgba(232,181,43,.018);
        }

        .lcHeroCopy {
          position:relative;
          z-index:2;
          padding:52px 54px;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        .lcEyebrow {
          display:flex;
          align-items:center;
          gap:8px;
          color:#e7c95e;
          font-size:8px;
          font-weight:950;
          letter-spacing:.2em;
        }

        .lcEyebrow i {
          width:6px;height:6px;border-radius:50%;
          background:var(--lc-gold);
          box-shadow:0 0 0 5px rgba(232,181,43,.1);
        }

        .lcHero h1 {
          margin:16px 0 13px;
          max-width:690px;
          font-size:clamp(44px,6vw,72px);
          line-height:.94;
          letter-spacing:-.065em;
        }

        .lcHero h1 em {
          color:#e9c13c;
          font-family:Georgia,serif;
          font-weight:500;
        }

        .lcHero p {
          max-width:620px;
          margin:0;
          color:#bdbbb3;
          font-size:12px;
          line-height:1.8;
        }

        .lcHeroMeta {
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-top:24px;
        }

        .lcHeroMeta span {
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:8px 10px;
          border:1px solid rgba(255,255,255,.1);
          border-radius:999px;
          background:rgba(255,255,255,.035);
          color:#d4d2ca;
          font-size:8px;
          font-weight:850;
        }

        .lcHeroArt {
          position:relative;
          display:grid;
          place-items:center;
          min-height:330px;
          background:
            radial-gradient(circle at 50% 50%,rgba(232,181,43,.13),transparent 30%),
            linear-gradient(135deg,#231e18,#171714);
        }

        .lcSeal {
          position:relative;
          z-index:3;
          width:190px;height:190px;
          display:grid;
          place-items:center;
          border:1px solid rgba(232,181,43,.6);
          border-radius:50%;
          color:#e7c75d;
        }

        .lcSeal::before,.lcSeal::after {
          content:"";
          position:absolute;
          border:1px solid rgba(232,181,43,.22);
          border-radius:50%;
        }
        .lcSeal::before { inset:14px; }
        .lcSeal::after { inset:34px; }

        .lcSealInner {
          text-align:center;
          z-index:2;
        }

        .lcSealInner strong {
          display:block;
          font-family:Georgia,serif;
          font-size:39px;
          line-height:1;
        }

        .lcSealInner span {
          display:block;
          margin-top:9px;
          font-size:7px;
          font-weight:950;
          letter-spacing:.22em;
        }

        .lcLayout {
          display:grid;
          grid-template-columns:275px 1fr;
          gap:18px;
          align-items:start;
          margin-top:18px;
        }

        .lcNav {
          position:sticky;
          top:18px;
          padding:10px;
          border:1px solid var(--lc-line);
          border-radius:18px;
          background:rgba(255,255,255,.8);
          backdrop-filter:blur(12px);
          box-shadow:0 10px 30px rgba(40,25,10,.04);
        }

        .lcNavTitle {
          padding:10px 11px 12px;
          color:#9a7620;
          font-size:8px;
          font-weight:950;
          letter-spacing:.16em;
        }

        .lcNav button {
          width:100%;
          display:flex;
          align-items:center;
          gap:9px;
          padding:11px 10px;
          border:0;
          border-radius:10px;
          background:transparent;
          color:#5f5b54;
          text-align:left;
          cursor:pointer;
          font-size:9px;
          font-weight:850;
        }

        .lcNav button:hover { background:#f8f4e7;color:#6c5210; }

        .lcNav button.active {
          background:#1a1915;
          color:white;
          box-shadow:0 6px 15px rgba(0,0,0,.08);
        }

        .lcNav button svg { flex:0 0 auto; }

        .lcContent {
          min-width:0;
        }

        .lcCurrent {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:15px;
          margin-bottom:10px;
          padding:13px 15px;
          border:1px solid var(--lc-line);
          border-radius:13px;
          background:#fff;
        }

        .lcCurrent span {
          color:#9a7620;
          font-size:8px;
          font-weight:950;
          letter-spacing:.13em;
        }

        .lcCurrent strong { font-size:11px; }

        .lcSection {
          scroll-margin-top:22px;
          display:grid;
          grid-template-columns:115px 1fr;
          gap:24px;
          padding:31px 28px;
          margin-bottom:10px;
          border:1px solid var(--lc-line);
          border-radius:18px;
          background:#fff;
        }

        .lcSectionRail {
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          gap:10px;
        }

        .lcSectionRail span {
          color:#a17b20;
          font-size:7px;
          line-height:1.4;
          font-weight:950;
          letter-spacing:.13em;
        }

        .lcSectionIcon {
          width:40px;height:40px;
          display:grid;
          place-items:center;
          border-radius:11px;
          background:var(--lc-gold-soft);
          color:#72570e;
        }

        .lcSectionBody h2 {
          margin:0 0 11px;
          font-size:24px;
          letter-spacing:-.045em;
        }

        .lcSectionBody > p {
          margin:0 0 14px;
          color:#68655e;
          font-size:11px;
          line-height:1.85;
        }

        .lcSectionBody h3 {
          margin:21px 0 7px;
          font-size:12px;
        }

        .lcSectionBody ul {
          margin:9px 0 0;
          padding-left:17px;
          color:#6c6962;
          font-size:10px;
          line-height:1.9;
        }

        .lcCallout {
          display:flex;
          gap:10px;
          padding:13px 14px;
          margin:15px 0;
          border:1px solid #eee1b7;
          border-radius:12px;
          background:#fffaf0;
          color:#6d5a24;
          font-size:9px;
          line-height:1.7;
        }

        .lcCallout svg { flex:0 0 auto;margin-top:1px; }

        .lcInfoGrid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:9px;
          margin-top:15px;
        }

        .lcInfoCard {
          padding:15px;
          border:1px solid #ebe7de;
          border-radius:12px;
          background:#faf9f5;
        }

        .lcInfoCard label {
          display:block;
          color:#9b7721;
          font-size:7px;
          font-weight:950;
          letter-spacing:.14em;
          margin-bottom:6px;
        }

        .lcInfoCard .lcValue,
        .lcInfoCard .lcMuted {
          display:block;
          color:#302d28;
          font-size:10px;
          line-height:1.6;
          word-break:break-word;
        }

        .lcMuted { color:#aaa69e !important; }

        .lcFaq {
          border-top:1px solid #eeeae1;
        }

        .lcFaqItem {
          border-bottom:1px solid #eeeae1;
        }

        .lcFaqButton {
          width:100%;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:15px;
          padding:15px 0;
          border:0;
          background:transparent;
          color:#25231f;
          text-align:left;
          cursor:pointer;
          font-size:10px;
          font-weight:900;
        }

        .lcFaqAnswer {
          padding:0 30px 15px 0;
          color:#77736b;
          font-size:9px;
          line-height:1.8;
        }

        .lcComplianceGrid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:9px;
          margin-top:15px;
        }

        .lcComplianceCard {
          padding:15px;
          border-radius:13px;
          background:#1a1915;
          color:white;
        }

        .lcComplianceCard small {
          display:block;
          color:#c7ad51;
          font-size:7px;
          font-weight:950;
          letter-spacing:.12em;
        }

        .lcComplianceCard strong {
          display:block;
          margin-top:8px;
          font-size:12px;
        }

        .lcComplianceCard p {
          margin:7px 0 0;
          color:#aaa9a1;
          font-size:8px;
          line-height:1.6;
        }

        .lcBottom {
          display:grid;
          grid-template-columns:1fr .8fr;
          gap:12px;
          margin-top:18px;
        }

        .lcBottomCard {
          padding:23px;
          border-radius:18px;
          border:1px solid var(--lc-line);
          background:#fff;
        }

        .lcBottomCard.dark {
          background:#1a1915;
          color:#fff;
          border-color:#1a1915;
        }

        .lcBottomCard span {
          color:#9a7620;
          font-size:7px;
          font-weight:950;
          letter-spacing:.15em;
        }

        .lcBottomCard h3 {
          margin:7px 0 8px;
          font-size:19px;
          letter-spacing:-.03em;
        }

        .lcBottomCard p {
          margin:0;
          color:#77736b;
          font-size:9px;
          line-height:1.7;
        }

        .lcBottomCard.dark p { color:#b7b5ad; }

        .lcLinks {
          display:flex;
          flex-wrap:wrap;
          gap:7px;
          margin-top:15px;
        }

        .lcLinks a {
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:9px 11px;
          border-radius:9px;
          background:#f5f2e9;
          color:#4d493f;
          text-decoration:none;
          font-size:8px;
          font-weight:900;
        }

        .lcLinks a:hover { background:#eee5ca; }

        .lcFooterNote {
          margin-top:12px;
          padding:13px 15px;
          color:#918d85;
          font-size:8px;
          line-height:1.7;
          text-align:center;
        }

        @media(max-width:850px) {
          .lcHero { grid-template-columns:1fr; }
          .lcHeroArt { min-height:230px; }
          .lcLayout { grid-template-columns:1fr; }
          .lcNav { position:static; display:flex; overflow-x:auto; gap:4px; }
          .lcNavTitle { display:none; }
          .lcNav button { width:auto; flex:0 0 auto; white-space:nowrap; }
          .lcSection { grid-template-columns:1fr; gap:14px; }
          .lcSectionRail { flex-direction:row;align-items:center; }
          .lcComplianceGrid { grid-template-columns:1fr 1fr; }
        }

        @media(max-width:560px) {
          .legalCenterPremium { padding:18px 10px 55px; }
          .lcHeroCopy { padding:36px 25px; }
          .lcHero h1 { font-size:47px; }
          .lcHeroArt { min-height:220px; }
          .lcSeal { width:155px;height:155px; }
          .lcSealInner strong { font-size:31px; }
          .lcSection { padding:24px 18px; }
          .lcInfoGrid,.lcComplianceGrid,.lcBottom { grid-template-columns:1fr; }
          .lcCurrent { align-items:flex-start; flex-direction:column; }
        }

        /* RR MASALA — LEGAL CENTER PREMIUM OVERRIDES */
        .legalCenterPremium{
          --lc-red:#a90f19!important;
          --lc-red-dark:#69080e!important;
          --lc-gold:#d79b1c!important;
          --lc-ink:#171311!important;
          --lc-muted:#716862!important;
          padding:46px 18px 100px!important;
          background:
            radial-gradient(circle at 7% 5%,rgba(169,15,25,.055),transparent 25%),
            radial-gradient(circle at 94% 8%,rgba(215,155,28,.08),transparent 24%),
            #fff!important;
        }
        .lcShell{width:min(1280px,100%)!important}
        .lcBack{font-size:13px!important;padding:10px 0 22px!important}
        .lcHero{
          min-height:430px!important;
          border-radius:30px!important;
          background:
            radial-gradient(circle at 82% 30%,rgba(215,155,28,.22),transparent 28%),
            linear-gradient(135deg,#220c0f,#3d1015 50%,#170e0d)!important;
          box-shadow:0 30px 90px rgba(66,18,15,.17)!important;
        }
        .lcHeroCopy{padding:66px 64px!important}
        .lcEyebrow{font-size:11px!important}
        .lcHero h1{
          font-size:clamp(52px,7vw,88px)!important;
          line-height:.92!important;
          letter-spacing:-.055em!important;
        }
        .lcHero p{font-size:16px!important;line-height:1.8!important;max-width:690px!important}
        .lcHeroMeta span{font-size:11px!important;padding:10px 13px!important}
        .lcHeroArt{min-height:390px!important}
        .lcLayout{grid-template-columns:300px 1fr!important;gap:22px!important;margin-top:22px!important}
        .lcNav{padding:12px!important;border-radius:20px!important}
        .lcNavTitle{font-size:10px!important;padding:13px!important}
        .lcNav button{font-size:13px!important;padding:14px 12px!important}
        .lcCurrent{padding:16px 18px!important}
        .lcCurrent span{font-size:10px!important}
        .lcCurrent strong{font-size:14px!important}
        .lcSection{padding:38px 34px!important;border-radius:20px!important;gap:30px!important}
        .lcSectionRail span{font-size:10px!important}
        .lcSectionBody h2{font-size:clamp(30px,3vw,45px)!important;letter-spacing:-.035em!important}
        .lcSectionBody p,.lcSectionBody li{font-size:15px!important;line-height:1.85!important}
        .lcInfoCard{padding:19px!important;border-radius:14px!important}
        .lcInfoCard label{font-size:10px!important}
        .lcValue,.lcMuted{font-size:14px!important}
        .lcLinks a{font-size:13px!important;padding:10px 13px!important}
        .lcBottom{gap:18px!important}
        .lcBottomCard{padding:34px!important;border-radius:20px!important}
        .lcBottomCard h3{font-size:27px!important}
        .lcBottomCard p{font-size:14px!important;line-height:1.75!important}
        .lcFooterNote{font-size:12px!important;line-height:1.7!important}
        @media(max-width:900px){
          .lcLayout{grid-template-columns:1fr!important}
          .lcNav{position:relative!important;top:auto!important}
        }
        @media(max-width:620px){
          .legalCenterPremium{padding:24px 11px 65px!important}
          .lcHero{min-height:360px!important;border-radius:22px!important}
          .lcHeroCopy{padding:38px 25px!important}
          .lcHero h1{font-size:47px!important}
          .lcHero p{font-size:14px!important}
          .lcSection{padding:25px 21px!important}
          .lcSectionBody h2{font-size:32px!important}
          .lcSectionBody p,.lcSectionBody li{font-size:14px!important}
          .lcBottomCard{padding:26px!important}
        }

      `}</style>

      <div className="lcShell">
        <Link className="lcBack" to="/">
          <ArrowLeft size={15} />
          Back to RR MASALA
        </Link>

        <section className="lcHero">
          <div className="lcHeroCopy">
            <div className="lcEyebrow"><i /> RR MASALA · TRUST & TRANSPARENCY</div>
            <h1>
              Legal, <em>clearly.</em>
            </h1>
            <p>
              Store policies, customer information, food-product details,
              domestic delivery and international order guidance — presented
              in one place.
            </p>

            <div className="lcHeroMeta">
              <span><ShieldCheck size={12} /> Customer protection</span>
              <span><FileText size={12} /> Store policies</span>
              <span><Globe2 size={12} /> India + international</span>
            </div>
          </div>

          <div className="lcHeroArt">
            <div className="lcSeal">
              <div className="lcSealInner">
                <strong>RR</strong>
                <span>MASALA · TRUST</span>
              </div>
            </div>
          </div>
        </section>

        <div className="lcLayout">
          <aside className="lcNav">
            <div className="lcNavTitle">POLICY CENTRE</div>
            {sections.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={active === item.id ? "active" : ""}
                  onClick={() => jump(item.id)}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </aside>

          <div className="lcContent">
            <div className="lcCurrent">
              <span>VIEWING POLICY</span>
              <strong>{current.label}</strong>
            </div>

            <Section id="terms" icon={Scale} eyebrow="01 · STORE TERMS" title="Terms & Conditions">
              <p>
                These terms describe the basic rules for using the RR MASALA
                website, placing orders and purchasing products through the
                store.
              </p>

              <h3>Orders & pricing</h3>
              <p>
                Product availability, selling price, taxes where applicable,
                delivery charges and order totals are shown during the purchase
                flow. RR MASALA currently uses a public product selling price
                in INR; international freight and destination-country charges
                may be communicated separately.
              </p>

              <h3>Account & customer responsibility</h3>
              <ul>
                <li>Provide accurate name, mobile number and delivery details.</li>
                <li>Keep account credentials secure.</li>
                <li>Do not use the website for unlawful or fraudulent activity.</li>
                <li>Review the order summary before confirming an order.</li>
              </ul>

              <div className="lcCallout">
                <CheckCircle2 size={15} />
                <span>
                  Product information should always be read together with the
                  actual product packaging and the information shown at checkout.
                </span>
              </div>
            </Section>

            <Section id="privacy" icon={LockKeyhole} eyebrow="02 · DATA & PRIVACY" title="Privacy Policy">
              <p>
                RR MASALA uses customer information to provide accounts,
                shopping, delivery, order support and related store services.
              </p>

              <div className="lcInfoGrid">
                <div className="lcInfoCard">
                  <label>ACCOUNT DATA</label>
                  <span>Information such as name, mobile/email and account details.</span>
                </div>
                <div className="lcInfoCard">
                  <label>ORDER DATA</label>
                  <span>Products, quantities, address and order history needed to fulfil purchases.</span>
                </div>
                <div className="lcInfoCard">
                  <label>SUPPORT</label>
                  <span>Information you provide when contacting customer support.</span>
                </div>
                <div className="lcInfoCard">
                  <label>SECURITY</label>
                  <span>Authentication and operational data may be processed to protect the service.</span>
                </div>
              </div>

              <h3>How information is used</h3>
              <ul>
                <li>Creating and maintaining customer accounts.</li>
                <li>Processing and delivering orders.</li>
                <li>Providing order status and support.</li>
                <li>Maintaining website security and preventing abuse.</li>
                <li>Meeting applicable legal or operational requirements.</li>
              </ul>

              <h3>Payment information</h3>
              <p>
                Payment credentials should be handled by the applicable payment
                provider. RR MASALA should not store sensitive payment
                credentials unless a compliant payment architecture specifically
                requires it.
              </p>
            </Section>

            <Section id="shipping" icon={Truck} eyebrow="03 · DELIVERY" title="Shipping & Delivery">
              <p>
                Delivery options and charges are shown according to the
                destination selected at checkout.
              </p>

              <div className="lcComplianceGrid">
                <div className="lcComplianceCard">
                  <small>INDIA</small>
                  <strong>₹999+ delivery</strong>
                  <p>Free domestic delivery above the configured threshold; ₹50 below it in the current checkout configuration.</p>
                </div>
                <div className="lcComplianceCard">
                  <small>TRACKING</small>
                  <strong>Shipment updates</strong>
                  <p>Tracking details may become available after the order is shipped and a tracking number is assigned.</p>
                </div>
                <div className="lcComplianceCard">
                  <small>ADDRESS</small>
                  <strong>Accurate details</strong>
                  <p>Customers are responsible for providing a complete and reachable delivery address.</p>
                </div>
              </div>

              <h3>Delivery timing</h3>
              <p>
                Actual delivery time can vary by destination, carrier capacity,
                weather, holidays, address issues and other operational factors.
              </p>
            </Section>

            <Section id="international" icon={Globe2} eyebrow="04 · EXPORT ORDERS" title="International Shipping & Customs">
              <p>
                RR MASALA may support international destinations where products
                and export arrangements are available. International freight is
                destination-based rather than a single worldwide fixed charge.
              </p>

              <div className="lcInfoGrid">
                <div className="lcInfoCard">
                  <label>EXPRESS CARRIERS</label>
                  <span>DHL Express · FedEx · UPS</span>
                </div>
                <div className="lcInfoCard">
                  <label>POSTAL OPTION</label>
                  <span>India Post / EMS where available</span>
                </div>
                <div className="lcInfoCard">
                  <label>FREIGHT</label>
                  <span>Calculated from destination, shipment weight/dimensions and service level.</span>
                </div>
                <div className="lcInfoCard">
                  <label>DESTINATION CHARGES</label>
                  <span>Import duty, VAT/GST or other destination-country charges may apply separately.</span>
                </div>
              </div>

              <div className="lcCallout">
                <Globe2 size={15} />
                <span>
                  Import rules differ by country. Customers should verify that
                  the selected food products can be imported into their
                  destination country before ordering.
                </span>
              </div>
            </Section>

            <Section id="returns" icon={RefreshCcw} eyebrow="05 · RETURNS" title="Cancellation, Returns & Refunds">
              <p>
                Return eligibility depends on the order status, product
                condition and reason for the request. The current store
                configuration uses a 7-day return window for eligible delivered
                orders.
              </p>

              <h3>Before shipment</h3>
              <p>
                Cancellation may be available while the order is still in an
                eligible pre-shipment status. Cancellation is not guaranteed
                after processing or shipment.
              </p>

              <h3>Damaged or incorrect order</h3>
              <p>
                Report damaged, missing or incorrect products through the
                configured support channel as soon as possible, preferably with
                photographs and the order number.
              </p>

              <h3>Refunds</h3>
              <p>
                Once a return or refund is approved, the applicable refund
                process depends on the payment method and the store's confirmed
                refund procedure.
              </p>

              <div className="lcCallout">
                <RefreshCcw size={15} />
                <span>
                  Food-product return eligibility can be subject to hygiene,
                  safety and condition requirements. The final policy should be
                  reviewed against the actual business process before production.
                </span>
              </div>
            </Section>

            <Section id="food" icon={Utensils} eyebrow="06 · FOOD INFORMATION" title="Food Safety & Product Information">
              <p>
                Product pages are intended to display the product information
                available from business-approved records and packaging.
              </p>

              <div className="lcInfoGrid">
                <div className="lcInfoCard"><label>ORIGIN</label><Value value={storeCompliance.countryOfOrigin} /></div>
                <div className="lcInfoCard"><label>FSSAI LICENCE</label><Value value={storeCompliance.fssaiLicenseNo} /></div>
                <div className="lcInfoCard"><label>GSTIN</label><Value value={storeCompliance.gstin} /></div>
                <div className="lcInfoCard"><label>IEC</label><Value value={storeCompliance.iec} /></div>
                <div className="lcInfoCard"><label>CRES</label><Value value={storeCompliance.cres} /></div>
                <div className="lcInfoCard"><label>APEDA RCMC</label><Value value={storeCompliance.apedaRcmc} /></div>
              </div>

              <h3>Product label information</h3>
              <p>
                Customers should review ingredients, allergens, net quantity,
                shelf life, manufacturer/packer information, storage
                instructions and other applicable information on the product
                page and physical pack.
              </p>
            </Section>

            <Section id="payments" icon={PackageCheck} eyebrow="07 · CHECKOUT" title="Payment & Refund Information">
              <p>
                The current checkout is designed for online payment. The payment
                gateway integration may be connected separately before
                production launch.
              </p>

              <div className="lcComplianceGrid">
                <div className="lcComplianceCard">
                  <small>PAYMENT</small>
                  <strong>Online checkout</strong>
                  <p>Payment is intended to be completed through the configured online payment flow.</p>
                </div>
                <div className="lcComplianceCard">
                  <small>COD</small>
                  <strong>Not currently offered</strong>
                  <p>Cash on Delivery should not be shown as available while the store remains online-payment-only.</p>
                </div>
                <div className="lcComplianceCard">
                  <small>ORDER TOTAL</small>
                  <strong>Before confirmation</strong>
                  <p>Review products, delivery charges and the final total before confirming the order.</p>
                </div>
              </div>
            </Section>

            <Section id="grievance" icon={HelpCircle} eyebrow="08 · SUPPORT" title="Grievance & Contact">
              <p>
                For order, product, delivery, return or privacy questions,
                contact the business using the verified customer-care details
                published here.
              </p>

              <div className="lcInfoGrid">
                <div className="lcInfoCard">
                  <label>LEGAL NAME</label>
                  <Value value={storeCompliance.legalName} />
                </div>
                <div className="lcInfoCard">
                  <label>REGISTERED ADDRESS</label>
                  <Value value={storeCompliance.registeredAddress} />
                </div>
                <div className="lcInfoCard">
                  <label>CUSTOMER CARE EMAIL</label>
                  <Value value={storeCompliance.customerCareEmail} />
                </div>
                <div className="lcInfoCard">
                  <label>CUSTOMER CARE PHONE</label>
                  <Value value={storeCompliance.customerCarePhone} />
                </div>
                <div className="lcInfoCard">
                  <label>GRIEVANCE OFFICER</label>
                  <Value value={storeCompliance.grievanceOfficerName} />
                </div>
                <div className="lcInfoCard">
                  <label>GRIEVANCE EMAIL</label>
                  <Value value={storeCompliance.grievanceOfficerEmail} />
                </div>
              </div>

              <div className="lcLinks">
                <Link to="/contact"><Mail size={13} /> Contact RR MASALA</Link>
                <Link to="/faq"><HelpCircle size={13} /> FAQ</Link>
                <Link to="/products"><PackageCheck size={13} /> Shop products</Link>
              </div>
            </Section>

            <div className="lcBottom">
              <div className="lcBottomCard">
                <span>NEED HELP?</span>
                <h3>Have a question about your order?</h3>
                <p>Visit our contact page or FAQ before reaching out to support.</p>
                <div className="lcLinks">
                  <Link to="/contact">Contact <ArrowRight size={12} /></Link>
                  <Link to="/faq">FAQ <ArrowRight size={12} /></Link>
                </div>
              </div>

              <div className="lcBottomCard dark">
                <span>RR MASALA</span>
                <h3>Food · Trust · Tradition</h3>
                <p>Policies are presented for customer information and should be reviewed with the business's legal/compliance advisers before production.</p>
              </div>
            </div>

            <div className="lcFooterNote">
              Business registration numbers, licences, tax details and grievance
              contacts are intentionally shown only when verified business data
              has been supplied.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
