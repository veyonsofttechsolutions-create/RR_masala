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
  MapPin,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";

/* =========================================================
   SHARED INFO SHELL
========================================================= */

export function Info({
  title,
  eyebrow = "RR MASALA",
  description,
  icon: Icon = FileText,
  children,
  accent = "gold",
}) {
  const nav = useNavigate();

  useEffect(() => {
    const root = document.querySelector(".rrInfoPage");
    if (!root) return;

    const nodes = root.querySelectorAll(
      ".rrHero, .rrAboutHero, .rrNumberStrip, .rrStoryBlock, .rrIngredientSection, .rrHeritage, .rrQuote, .rrAboutEnd, .rrContact, .rrFaq, .rrPolicy, .rrSuccess"
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
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [title]);

  return (
    <main className="rrInfoPage">
      <InfoStyles />
      <div className="rrInfoShell">
        <button className="rrBack" type="button" onClick={() => nav(-1)}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <header className={`rrHero rrHero-${accent}`}>
          <div className="rrHeroGlow" />
          <div className="rrHeroIcon">
            <Icon size={25} strokeWidth={1.8} />
          </div>
          <div className="rrHeroText">
            <div className="rrEyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          <div className="rrHeroMark">RR</div>
        </header>

        {children}

        <div className="rrBottomShop">
          <Link to="/products" className="rrShopBtn">
            <ShoppingBag size={16} />
            Explore products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   ABOUT
========================================================= */

export const About = () => (
  <Info
    title="Our food story"
    eyebrow="RR MASALA · HERITAGE & FLAVOUR"
    description="A modern home for familiar Indian pantry flavours and the food memories behind them."
    icon={Utensils}
  >
    <div className="rrAbout">
      <section className="rrAboutHero">
        <div>
          <span className="rrSectionEyebrow">MADURAI · SOUTH INDIA</span>
          <h2>
            Food carries
            <br />
            <em>a memory.</em>
          </h2>
          <p>
            Puliyodarai is more than tamarind rice. It is a dish shaped by
            tamarind, sesame oil, roasted spices, rice and generations of
            South Indian food memories.
          </p>
          <a href="#story" className="rrTextLink">
            Discover the story <ArrowRight size={15} />
          </a>
        </div>

        <div className="rrDishVisual" aria-hidden="true">
          <div className="rrDish">
            <div className="rrRice">
              <i /><i /><i /><i /><i /><i /><i /><i />
              <b /><b /><b />
            </div>
          </div>
          <div className="rrDishCaption">
            <strong>PULIYODARAI</strong>
            <span>Tamarind rice · traditional preparation</span>
          </div>
        </div>
      </section>

      <section className="rrNumberStrip">
        {[
          ["01", "Traditional recipe"],
          ["02", "Madurai food culture"],
          ["03", "Memory through food"],
          ["04", "Everyday Indian kitchen"],
        ].map(([n, t]) => (
          <div key={n}>
            <strong>{n}</strong>
            <span>{t}</span>
          </div>
        ))}
      </section>

      <section id="story" className="rrStoryBlock">
        <div className="rrSideLabel">01 · THE DISH</div>
        <div>
          <h2>
            More than
            <br />
            <em>tamarind rice.</em>
          </h2>
          <div className="rrTwoColText">
            <p>
              Puliyodarai gets its character from balance: the sourness of
              tamarind, the aroma of sesame oil, roasted chillies, lentils,
              spices and rice prepared to hold everything together.
            </p>
            <p>
              The story shared for RR MASALA remembers it as food for journeys,
              homes, temples and long meals — simple food carrying a remarkable
              amount of memory.
            </p>
          </div>
        </div>
      </section>

      <section className="rrIngredientSection">
        <div className="rrSectionHead">
          <div>
            <span className="rrSectionEyebrow">02 · THE CHARACTER</span>
            <h2>What gives it its identity?</h2>
          </div>
          <p>
            The small details are what turn ordinary rice into deeply flavoured
            Puliyodarai.
          </p>
        </div>

        <div className="rrIngredientGrid">
          {[
            ["01", "Mature tamarind", "Deep sourness that forms the foundation.", "tamarind"],
            ["02", "Sesame oil", "A distinctive aroma and richness.", "oil"],
            ["03", "Roasted chillies", "Warmth, fragrance and character.", "chilli"],
            ["04", "Bengal gram", "Crunch that contrasts with the rice.", "dal"],
          ].map(([n, title, text, cls], index) => (
            <article className={`rrIngredient ${index === 0 ? "featured" : ""}`} key={n}>
              <span>{n}</span>
              <div className={`rrIngredientArt ${cls}`} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rrHeritage">
        <div className="rrHeritageIntro">
          <span className="rrSectionEyebrow">03 · MADURAI HERITAGE</span>
          <h2>
            A special place in
            <br />
            <em>Saurashtra food memories.</em>
          </h2>
        </div>

        <div className="rrHeritageGrid">
          <article className="rrHeritageCard dark">
            <div className="rrSmallIcon"><Utensils size={18} /></div>
            <span>THE TABLE</span>
            <h3>A memorable combination</h3>
            <p>
              The shared story remembers Puliyodarai with black chickpea
              sundal, pickle, ginger-chilli chutney and coconut.
            </p>
          </article>
          <article className="rrHeritageCard">
            <div className="rrSmallIcon"><Sparkles size={18} /></div>
            <span>THE MEMORY</span>
            <h3>A meal worth remembering</h3>
            <p>
              The writing describes returning for repeated servings and
              remembering the meal as an exceptional food experience.
            </p>
          </article>
          <article className="rrHeritageCard">
            <div className="rrSmallIcon"><BookOpenIcon /></div>
            <span>THE FEELING</span>
            <h3>Simple food, lasting emotion</h3>
            <p>
              Traditional food can become part of the memories people carry
              long after the meal is finished.
            </p>
          </article>
        </div>
      </section>

      <section className="rrQuote">
        <span className="rrSectionEyebrow">04 · THE STORY</span>
        <blockquote>
          “The Puliyodarai prepared by the Saurashtra community is described
          in the shared story as the ‘queen’ of Puliyodarai.”
        </blockquote>
        <p>
          This page presents the Tamil passage supplied for RR MASALA in
          English adaptation. The original publication was not independently
          verified here.
        </p>
      </section>

      <section className="rrAboutEnd">
        <div>
          <span className="rrSectionEyebrow">RR MASALA</span>
          <h2>Traditional taste.<br /><em>Modern everyday kitchen.</em></h2>
          <p>
            Discover Indian pantry essentials presented with clear product
            information and a simple shopping experience.
          </p>
          <Link to="/products" className="rrDarkBtn">
            Shop the collection <ArrowRight size={16} />
          </Link>
        </div>
        <div className="rrRoundMark">RR</div>
      </section>
    </div>
  </Info>
);

function BookOpenIcon() {
  return <FileText size={18} />;
}

/* =========================================================
   CONTACT
========================================================= */

export const Contact = () => (
  <Info
    title="We're here to help"
    eyebrow="RR MASALA · CUSTOMER CARE"
    description="Questions about products, orders, delivery or returns? Start here."
    icon={MessageCircle}
  >
    <section className="rrContact">
      <div className="rrContactIntro">
        <span className="rrSectionEyebrow">CUSTOMER SUPPORT</span>
        <h2>Let’s make your order experience simple.</h2>
        <p>
          Keep your order number ready when contacting us about an existing
          order. Business contact details can be connected here once verified.
        </p>
      </div>

      <div className="rrContactGrid">
        <div className="rrContactCard dark">
          <div className="rrContactIcon"><MessageCircle size={21} /></div>
          <span>01 · SUPPORT</span>
          <h3>WhatsApp support</h3>
          <p>Use the configured WhatsApp channel for customer enquiries.</p>
        </div>
        <div className="rrContactCard">
          <div className="rrContactIcon"><PackageCheck size={21} /></div>
          <span>02 · ORDERS</span>
          <h3>Order assistance</h3>
          <p>Share your order number so the support team can locate the order quickly.</p>
        </div>
        <div className="rrContactCard">
          <div className="rrContactIcon"><Mail size={21} /></div>
          <span>03 · EMAIL</span>
          <h3>Customer care</h3>
          <p>Verified customer-care email can be displayed here before production.</p>
        </div>
      </div>

      <div className="rrContactNotice">
        <ShieldCheck size={20} />
        <div>
          <strong>Verified business contact details</strong>
          <p>
            Registered address, customer-care phone/email and grievance contact
            should be added from the verified business records before launch.
          </p>
        </div>
      </div>
    </section>
  </Info>
);

/* =========================================================
   FAQ
========================================================= */

// const FAQ_ITEMS = [
//   ["Can I browse without creating an account?", "Yes. You can browse products and use your cart without signing in. An authenticated customer account is required when placing an order."],
//   ["How are India delivery charges calculated?", "The current checkout configuration provides free delivery on eligible orders above ₹999 and ₹50 delivery below ₹999."],
//   ["How is international shipping calculated?", "International freight depends on destination and shipment details such as weight and dimensions. Customs duty or import taxes may be charged separately by the destination country."],
//   ["Can I track my order?", "Yes. Open My Orders and select the relevant order to view its current status and tracking information when available."],
//   ["Can I save multiple addresses?", "Yes. Customers can save multiple delivery addresses and select the address required during checkout."],
//   ["Can I cancel an order?", "Cancellation availability depends on the current order stage. Once an order has been shipped, cancellation is disabled."],
//   ["Can I request a return?", "Eligible delivered orders can request a return within the configured return window, subject to the applicable return conditions."],
//   ["What payment method is available?", "The storefront is configured for online payment. Payment-gateway integration can be enabled when the production provider credentials are connected."],
//   ["Do international orders include customs charges?", "Not necessarily. Import duties, taxes, brokerage and other destination-country charges can be separate from the store's shipping charge."],
// ];

export const FAQ = () => {
  const [open, setOpen] = useState(0);

  const groups = [
    {
      label: "Shopping",
      icon: ShoppingBag,
      items: FAQ_ITEMS.slice(0, 2),
    },
    {
      label: "Orders & delivery",
      icon: Truck,
      items: FAQ_ITEMS.slice(2, 6),
    },
    {
      label: "Returns & payments",
      icon: RefreshCcw,
      items: FAQ_ITEMS.slice(6, 8),
    },
    {
      label: "International",
      icon: Globe2,
      items: FAQ_ITEMS.slice(8),
    },
  ];

  let questionIndex = -1;

  return (
    <Info
      title="Frequently asked questions"
      eyebrow="RR MASALA · HELP CENTRE"
      description="Everything you need to know before ordering — from delivery and payments to returns and international shipping."
      icon={HelpCircle}
    >
      <section className="rrFaqPremium">
        <div className="rrFaqIntro">
          <div>
            <span className="rrSectionEyebrow">HELP CENTRE</span>
            <h2>
              Answers,
              <br />
              <em>without the guesswork.</em>
            </h2>
          </div>
          <p>
            Browse the topics below. Open any question to see the complete
            answer without leaving the page.
          </p>
        </div>

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
              <span>QUICK INDEX</span>
            </div>

            <div className="rrFaqIndexLine" />

            {groups.map(({ label, items }, i) => (
              <a href={`#faq-group-${i}`} key={label}>
                <span>0{i + 1}</span>
                <strong>{label}</strong>
                <small>{items.length} questions</small>
              </a>
            ))}

            <div className="rrFaqHelpCard">
              <MessageCircle size={19} />
              <strong>Still need help?</strong>
              <p>Our customer support section is ready for order-specific questions.</p>
              <Link to="/contact">
                Contact support <ArrowRight size={14} />
              </Link>
            </div>
          </aside>

          <div className="rrFaqGroups">
            {groups.map(({ label, icon: GroupIcon, items }, groupIndex) => (
              <section
                id={`faq-group-${groupIndex}`}
                className="rrFaqGroup"
                key={label}
              >
                <div className="rrFaqGroupHead">
                  <div className="rrFaqGroupIcon">
                    <GroupIcon size={18} />
                  </div>
                  <div>
                    <span>0{groupIndex + 1}</span>
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
                      <article
                        className={`rrFaqQuestion ${active ? "active" : ""}`}
                        key={q}
                      >
                        <button
                          type="button"
                          aria-expanded={active}
                          onClick={() => setOpen(active ? -1 : index)}
                        >
                          <span className="rrFaqQuestionNo">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <strong>{q}</strong>
                          <span className="rrFaqToggle">
                            <ChevronDown size={18} />
                          </span>
                        </button>

                        <div className="rrFaqQuestionAnswer">
                          <p>{a}</p>
                        </div>
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
   POLICY CENTER
========================================================= */

const POLICY_DATA = {
  "Privacy policy": {
    eyebrow: "03 · PRIVACY",
    icon: LockKeyhole,
    intro: "How RR MASALA handles the information needed to operate accounts, orders, delivery and support.",
    cards: [
      ["01", "Information we may collect", "Account name, mobile/email where provided, saved delivery addresses, cart and wishlist information, order details, payment status or transaction references, support messages and technical information required to operate the website."],
      ["02", "How we use information", "To create and manage accounts, process orders, calculate delivery, communicate service updates, provide customer support and maintain the security and reliability of the platform."],
      ["03", "Payments", "Payment details are handled through the payment flow/provider used by the storefront. The website may retain payment status or transaction references needed to reconcile an order."],
      ["04", "Security", "Reasonable technical and organisational measures should be used to protect account and order information. No online service can guarantee absolute security."],
    ],
    sections: [
      ["Your choices", "You can review or update account and saved-address information through the available account controls. Requests relating to personal information can be raised through the verified customer-care or grievance contact."],
      ["Cookies & technical data", "The website may use essential browser storage, session information and technical data required for authentication, cart functionality, security and service operation."],
      ["Business contact details", "Verified customer-care email, phone, registered address and grievance contact should be inserted from the final business records before production."],
    ],
  },
  "Shipping policy": {
    eyebrow: "01 · DELIVERY",
    icon: Truck,
    intro: "Clear delivery information for India orders and international destinations.",
    cards: [
      ["01", "India delivery", "The current checkout configuration provides free delivery on eligible orders above ₹999 and ₹50 delivery below ₹999, subject to store settings."],
      ["02", "International delivery", "International freight is calculated according to destination and shipment details. Available service level and carrier can vary by destination."],
      ["03", "Tracking", "Tracking information is displayed on the order when a tracking number is available from the fulfilment or carrier process."],
      ["04", "Delivery delays", "Transit time can vary because of carrier operations, remote-area delivery, weather, customs clearance and destination-country procedures."],
    ],
    sections: [
      ["International carriers", "Depending on destination and availability, international shipments may use services such as DHL Express, FedEx, UPS or India Post/EMS."],
      ["Customs & import charges", "Destination-country customs duties, import taxes, brokerage or clearance charges may be separate from the shipping amount shown by the store."],
      ["Address accuracy", "Customers are responsible for providing a complete and accurate delivery address, contact number and postal code."],
    ],
  },
  "Return policy": {
    eyebrow: "04 · RETURNS & REFUNDS",
    icon: RefreshCcw,
    intro: "A simple framework for eligible returns, damaged products and refund handling.",
    cards: [
      ["01", "Eligibility", "Eligible delivered orders may request a return within the return window configured by the store, subject to product and order conditions."],
      ["02", "Damaged or incorrect item", "If a product arrives damaged or incorrect, customers should contact support with the order number and relevant evidence as soon as reasonably possible."],
      ["03", "Review", "Return requests may be reviewed against the order, product condition and applicable store rules before approval."],
      ["04", "Refund", "Approved refunds are processed according to the payment method and the applicable payment-provider processing timeline."],
    ],
    sections: [
      ["Non-returnable situations", "Certain food products or situations may be excluded from return for safety, hygiene, product-condition or other applicable reasons. The applicable product/order conditions should be checked before purchase."],
      ["International returns", "International return arrangements can involve additional carrier, customs and destination-country considerations and may differ from domestic returns."],
    ],
  },
  "Terms & conditions": {
    eyebrow: "05 · TERMS",
    icon: FileText,
    intro: "The conditions that apply when using the RR MASALA storefront and placing an order.",
    cards: [
      ["01", "Orders & pricing", "Products are offered at the prices displayed on the storefront. Product availability, delivery charges and applicable taxes or destination charges can affect the final payable amount."],
      ["02", "Product information", "Customers should review product descriptions, ingredients, allergens, net quantity, shelf life and label information before purchase."],
      ["03", "Accounts", "Customers are responsible for providing accurate account and delivery information and for maintaining access to their account credentials."],
      ["04", "International orders", "International purchases can be subject to destination-country import rules, duties, taxes, restrictions and clearance requirements."],
    ],
    sections: [
      ["Website use", "The storefront should be used only for lawful purposes and in a manner that does not interfere with the operation or security of the service."],
      ["Availability", "Product availability, prices, delivery options and other storefront information may change as inventory and store configuration change."],
      ["Governing information", "Final legal terms and business-specific clauses should be reviewed and approved against the registered business details before production launch."],
    ],
  },
};

export const Policy = ({ title, children }) => {
  const data = POLICY_DATA[title] || POLICY_DATA["Terms & conditions"];
  const Icon = data.icon;

  return (
    <Info
      title={title}
      eyebrow={`RR MASALA · ${data.eyebrow}`}
      description={data.intro}
      icon={Icon}
      accent="dark"
    >
      <section className="rrPolicy">
        <div className="rrPolicyTop">
          <div>
            <span className="rrSectionEyebrow">POLICY OVERVIEW</span>
            <h2>Clear information. No clutter.</h2>
          </div>
          <div className="rrPolicyUpdated">
            <Clock3 size={15} />
            <span>Store policy</span>
          </div>
        </div>

        <div className="rrPolicyGrid">
          {data.cards.map(([no, heading, body]) => (
            <article className="rrPolicyCard" key={no}>
              <div className="rrPolicyCardTop">
                <span>{no}</span>
                <CheckCircle2 size={17} />
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

        {children && <div className="rrLegacyPolicyNote">{children}</div>}

        <div className="rrPolicyContact">
          <div className="rrPolicyContactIcon"><ShieldCheck size={22} /></div>
          <div>
            <span>BUSINESS & GRIEVANCE CONTACT</span>
            <h3>Verified contact details will be published here.</h3>
            <p>
              Customer-care email, phone, registered address and grievance
              officer details should be populated from the verified business
              records before production.
            </p>
          </div>
        </div>
      </section>
    </Info>
  );
};

/* =========================================================
   ORDER SUCCESS
========================================================= */

function OrderSuccessPage() {
  return (
    <main className="rrSuccessPage">
      <InfoStyles />
      <div className="rrSuccess">
        <div className="rrSuccessOrb"><CheckCircle2 size={44} /></div>
        <span className="rrSectionEyebrow">ORDER RECEIVED</span>
        <h1>Thank you.</h1>
        <p>
          Your order has been created successfully. Follow its progress from
          your orders section as it moves through confirmation, processing,
          packing and shipment.
        </p>
        <div className="rrSuccessActions">
          <Link to="/orders" className="rrDarkBtn">
            <PackageCheck size={16} /> My orders <ArrowRight size={15} />
          </Link>
          <Link to="/products" className="rrLightBtn">
            <ShoppingBag size={16} /> Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export { OrderSuccessPage as Success };

/* =========================================================
   STYLES
========================================================= */

export function InfoStyles() {
  return (
    <style>{`
      .rrInfoPage,
      .rrSuccessPage {
        min-height: 100vh;
        background:
          radial-gradient(circle at 8% 0%, rgba(226,188,54,.10), transparent 25%),
          radial-gradient(circle at 92% 18%, rgba(27,43,31,.06), transparent 24%),
          #f5f4ef;
        color: #171914;
        padding: 34px 20px 90px;
      }

      .rrInfoShell {
        width: min(1180px, 100%);
        margin: 0 auto;
      }

      .rrBack {
        appearance: none;
        border: 0;
        background: transparent;
        padding: 8px 0;
        margin: 0 0 18px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #666a61;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .rrBack:hover { color:#171914; }

      .rrHero {
        min-height: 235px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 42px 46px;
        border: 1px solid #e2dfd4;
        border-radius: 28px;
        background: linear-gradient(135deg,#fff,#fff9df);
        box-shadow: 0 20px 60px rgba(29,31,23,.06);
        isolation: isolate;
      }

      .rrHero-dark {
        color:#fff;
        border-color:#24271f;
        background: linear-gradient(135deg,#151711,#292a20);
      }

      .rrHeroGlow {
        position:absolute;
        width:420px;
        height:420px;
        right:-120px;
        top:-190px;
        border-radius:50%;
        background:rgba(232,194,51,.13);
        filter:blur(4px);
        z-index:-1;
      }

      .rrHeroIcon {
        width:62px;
        height:62px;
        flex:0 0 62px;
        display:grid;
        place-items:center;
        border-radius:18px;
        background:#fff0b6;
        color:#6d570d;
      }

      .rrHero-dark .rrHeroIcon {
        background:#dcbf4e;
        color:#202118;
      }

      .rrEyebrow,
      .rrSectionEyebrow {
        color:#9b7b19;
        font-size:11px;
        font-weight:950;
        letter-spacing:.18em;
      }

      .rrHero h1 {
        margin:8px 0 0;
        font-size:clamp(38px,5vw,66px);
        line-height:.96;
        letter-spacing:-.065em;
      }

      .rrHero p {
        max-width:680px;
        margin:15px 0 0;
        color:#6c7066;
        font-size:16px;
        line-height:1.8;
      }

      .rrHero-dark p { color:#b8bbb1; }

      .rrHeroMark {
        position:absolute;
        right:42px;
        bottom:-35px;
        font: 110px/1 Georgia,serif;
        color:rgba(190,154,32,.12);
      }

      .rrBottomShop {
        display:flex;
        justify-content:center;
        margin-top:30px;
      }

      .rrShopBtn,
      .rrDarkBtn,
      .rrLightBtn {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        min-height:44px;
        padding:0 17px;
        border-radius:12px;
        text-decoration:none;
        font-size:11px;
        font-weight:900;
      }

      .rrShopBtn,
      .rrDarkBtn {
        background:#191b16;
        color:#fff;
        box-shadow:0 10px 25px rgba(25,27,22,.14);
      }

      .rrLightBtn {
        background:#fff;
        color:#252820;
        border:1px solid #dedbd1;
      }

      /* ABOUT */
      .rrAbout { margin-top:16px; }

      .rrAboutHero {
        min-height:550px;
        display:grid;
        grid-template-columns:1fr .9fr;
        align-items:center;
        gap:30px;
        overflow:hidden;
        padding:65px;
        border-radius:28px;
        background:#171914;
        color:#fff;
        box-shadow:0 25px 70px rgba(24,26,19,.16);
      }

      .rrAboutHero h2,
      .rrStoryBlock h2,
      .rrHeritageIntro h2,
      .rrAboutEnd h2 {
        margin:16px 0 20px;
        font-size:clamp(43px,5.6vw,72px);
        line-height:.93;
        letter-spacing:-.065em;
      }

      .rrAboutHero h2 em,
      .rrStoryBlock h2 em,
      .rrHeritageIntro h2 em,
      .rrAboutEnd h2 em {
        color:#e6c54c;
        font-family:Georgia,serif;
        font-weight:500;
      }

      .rrAboutHero p {
        max-width:520px;
        color:#bfc2b8;
        font-size:13px;
        line-height:1.9;
      }

      .rrTextLink {
        display:inline-flex;
        align-items:center;
        gap:8px;
        margin-top:18px;
        color:#fff;
        text-decoration:none;
        font-size:11px;
        font-weight:900;
        border-bottom:1px solid #806c29;
        padding-bottom:7px;
      }

      .rrDishVisual {
        min-height:410px;
        position:relative;
        display:grid;
        place-items:center;
      }

      .rrDish {
        width:min(355px,75vw);
        aspect-ratio:1;
        padding:30px;
        border-radius:50%;
        background:#332f23;
        border:13px solid #4b4533;
        box-shadow:inset 0 0 0 4px #8d6d2a,0 28px 50px rgba(0,0,0,.4);
        transform:rotate(-7deg);
      }

      .rrRice {
        width:100%;
        height:100%;
        position:relative;
        overflow:hidden;
        border-radius:50%;
        background:
          radial-gradient(circle at 28% 30%,#e1af4a 0 3px,transparent 4px),
          radial-gradient(circle at 63% 25%,#bd8127 0 3px,transparent 4px),
          radial-gradient(circle at 75% 62%,#d69b36 0 3px,transparent 4px),
          radial-gradient(circle at 37% 70%,#9d641e 0 3px,transparent 4px),
          linear-gradient(145deg,#b87920,#6b3c17);
        box-shadow:inset 0 0 50px rgba(20,8,0,.38);
      }

      .rrRice i {
        position:absolute;
        width:10px;height:5px;border-radius:50%;
        background:#e3bb62;
      }
      .rrRice i:nth-child(1){left:17%;top:38%;transform:rotate(20deg)}
      .rrRice i:nth-child(2){left:35%;top:22%;transform:rotate(-18deg)}
      .rrRice i:nth-child(3){left:58%;top:37%;transform:rotate(15deg)}
      .rrRice i:nth-child(4){left:70%;top:51%;transform:rotate(-30deg)}
      .rrRice i:nth-child(5){left:44%;top:54%;transform:rotate(20deg)}
      .rrRice i:nth-child(6){left:24%;top:64%;transform:rotate(-12deg)}
      .rrRice i:nth-child(7){left:56%;top:73%;transform:rotate(26deg)}
      .rrRice i:nth-child(8){left:75%;top:35%;transform:rotate(12deg)}
      .rrRice b {
        position:absolute;
        width:12px;height:12px;border-radius:50%;
        background:#dca644;
      }
      .rrRice b:nth-last-child(3){left:32%;top:48%}
      .rrRice b:nth-last-child(2){left:62%;top:57%}
      .rrRice b:nth-last-child(1){left:48%;top:31%}

      .rrDishCaption {
        position:absolute;
        bottom:0;
        left:0;
        width:100%;
        text-align:center;
      }
      .rrDishCaption strong,
      .rrDishCaption span { display:block; }
      .rrDishCaption strong { font-size:12px;letter-spacing:.16em; }
      .rrDishCaption span { margin-top:4px;color:#85897e;font-size:9px; }

      .rrNumberStrip {
        display:grid;
        grid-template-columns:repeat(4,1fr);
        background:#fff;
        border:1px solid #e1ded3;
        border-top:0;
        border-radius:0 0 20px 20px;
        overflow:hidden;
      }

      .rrNumberStrip div {
        padding:20px;
        border-right:1px solid #e8e5dc;
      }
      .rrNumberStrip div:last-child{border-right:0}
      .rrNumberStrip strong{display:block;color:#a58119;font-size:12px}
      .rrNumberStrip span{display:block;margin-top:5px;color:#74786f;font-size:10px}

      .rrStoryBlock {
        display:grid;
        grid-template-columns:.35fr 1fr;
        gap:55px;
        padding:100px 5%;
      }

      .rrSideLabel {
        color:#979a91;
        font-size:11px;
        font-weight:950;
        letter-spacing:.14em;
      }

      .rrStoryBlock h2 { color:#191b16;margin-top:0; }
      .rrStoryBlock h2 em { color:#a37b17; }

      .rrTwoColText {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:28px;
        max-width:750px;
      }

      .rrTwoColText p {
        margin:0;
        color:#6e7268;
        font-size:12px;
        line-height:1.9;
      }

      .rrIngredientSection {
        padding:70px 0;
        border-top:1px solid #e1ded3;
      }

      .rrSectionHead {
        display:flex;
        justify-content:space-between;
        align-items:end;
        gap:30px;
        margin-bottom:25px;
      }

      .rrSectionHead h2 {
        margin:8px 0 0;
        font-size:clamp(28px,4vw,45px);
        letter-spacing:-.05em;
      }

      .rrSectionHead > p {
        max-width:320px;
        margin:0;
        color:#777b72;
        font-size:11px;
        line-height:1.7;
      }

      .rrIngredientGrid {
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:10px;
      }

      .rrIngredient {
        min-height:320px;
        padding:20px;
        border:1px solid #e0ddd2;
        border-radius:18px;
        background:#fff;
      }

      .rrIngredient.featured {
        color:#fff;
        background:#1a1c17;
        border-color:#1a1c17;
      }

      .rrIngredient > span {
        color:#a58119;
        font-size:9px;
        font-weight:950;
      }

      .rrIngredientArt {
        height:135px;
        margin:17px 0;
        border-radius:13px;
        overflow:hidden;
      }

      .rrIngredientArt.tamarind{background:radial-gradient(circle at 50% 50%,#8e551e,#35200d)}
      .rrIngredientArt.oil{background:linear-gradient(145deg,#8e6b18,#e5bd38)}
      .rrIngredientArt.chilli{background:linear-gradient(145deg,#74130d,#df5224)}
      .rrIngredientArt.dal{background:radial-gradient(circle,#d8a243 0 13%,#79501d 14% 23%,#352515 24%)}

      .rrIngredient h3{margin:0 0 6px;font-size:16px}
      .rrIngredient p{margin:0;color:#767a71;font-size:10px;line-height:1.7}
      .rrIngredient.featured p{color:#b9bcb2}

      .rrHeritage {
        padding:80px 0;
        border-top:1px solid #e1ded3;
      }

      .rrHeritageIntro h2 { color:#191b16; }
      .rrHeritageIntro h2 em { color:#a37b17; }

      .rrHeritageGrid {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:10px;
      }

      .rrHeritageCard {
        min-height:270px;
        padding:25px;
        border:1px solid #e1ded3;
        border-radius:18px;
        background:#fff;
      }

      .rrHeritageCard.dark {
        color:#fff;
        background:#191b16;
        border-color:#191b16;
      }

      .rrSmallIcon {
        width:39px;height:39px;
        display:grid;place-items:center;
        border-radius:11px;
        background:#fff0b5;
        color:#6e570d;
      }

      .rrHeritageCard > span {
        display:block;
        margin-top:45px;
        color:#a58119;
        font-size:8px;
        font-weight:950;
        letter-spacing:.16em;
      }

      .rrHeritageCard h3{margin:7px 0 8px;font-size:17px}
      .rrHeritageCard p{margin:0;color:#74786f;font-size:12px;line-height:1.8}
      .rrHeritageCard.dark p{color:#b9bcb3}

      .rrQuote {
        margin:10px 0 70px;
        padding:75px 8%;
        border-radius:24px;
        background:#e9e3d0;
      }

      .rrQuote blockquote {
        max-width:900px;
        margin:25px 0 15px;
        font:500 clamp(26px,4vw,46px)/1.25 Georgia,serif;
        letter-spacing:-.025em;
      }

      .rrQuote p{max-width:700px;margin:0;color:#78776d;font-size:11px;line-height:1.7}

      .rrAboutEnd {
        display:grid;
        grid-template-columns:1fr .4fr;
        align-items:center;
        gap:40px;
        padding:25px 0 70px;
      }

      .rrAboutEnd h2 { font-size:clamp(38px,5vw,60px); }
      .rrAboutEnd h2 em { color:#a37b17; }
      .rrAboutEnd p{max-width:540px;color:#74786e;font-size:12px;line-height:1.8}
      .rrRoundMark {
        width:190px;height:190px;
        justify-self:end;
        display:grid;place-items:center;
        border-radius:50%;
        border:1px solid #c7b87c;
        background:#1a1c17;
        color:#e6c54c;
        font:500 55px Georgia,serif;
        box-shadow:0 25px 50px rgba(25,27,22,.14);
      }

      /* FAQ */
      .rrFaq {
        display:grid;
        grid-template-columns:340px 1fr;
        gap:15px;
        margin-top:16px;
      }

      .rrFaqAside {
        position:sticky;
        top:25px;
        align-self:start;
        min-height:500px;
        padding:31px;
        border-radius:22px;
        background:#191b16;
        color:#fff;
        box-shadow:0 18px 45px rgba(24,26,20,.12);
      }

      .rrFaqAsideTop {
        display:flex;
        align-items:center;
        gap:9px;
        color:#e5c64d;
        font-size:11px;
        font-weight:950;
        letter-spacing:.14em;
      }

      .rrFaqAside h2 {
        margin:55px 0 14px;
        font-size:34px;
        line-height:1;
        letter-spacing:-.05em;
      }

      .rrFaqAside p{color:#c1c4bb;font-size:15px;line-height:1.8}

      .rrFaqTopics {
        display:grid;
        gap:8px;
        margin-top:35px;
      }

      .rrFaqTopics span {
        display:flex;
        align-items:center;
        gap:9px;
        padding:11px 12px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:10px;
        color:#d6d8cf;
        font-size:14px;
      }

      .rrFaqList {
        display:grid;
        gap:8px;
      }

      .rrFaqItem {
        overflow:hidden;
        border:1px solid #e1ded3;
        border-radius:15px;
        background:#fff;
        transition:.2s ease;
      }

      .rrFaqItem.active {
        border-color:#cbb65e;
        box-shadow:0 12px 35px rgba(33,35,26,.07);
      }

      .rrFaqItem button {
        width:100%;
        border:0;
        background:transparent;
        display:grid;
        grid-template-columns:42px 1fr 24px;
        align-items:center;
        gap:10px;
        padding:20px;
        text-align:left;
        cursor:pointer;
        color:#171914;
      }

      .rrFaqNo{color:#a58119;font-size:12px;font-weight:950}
      .rrFaqItem strong{font-size:17px;line-height:1.45}
      .rrFaqItem svg{justify-self:end;transition:.2s}
      .rrFaqItem svg.rotated{transform:rotate(180deg)}

      .rrFaqAnswer {
        padding:0 56px 25px 72px;
        color:#62685f;
        font-size:15.5px;
        line-height:1.85;
      }

      /* POLICIES */
      .rrPolicy { margin-top:16px; }

      .rrPolicyTop {
        display:flex;
        align-items:end;
        justify-content:space-between;
        gap:20px;
        padding:35px 4px 25px;
      }

      .rrPolicyTop h2 {
        margin:8px 0 0;
        font-size:clamp(28px,4vw,43px);
        letter-spacing:-.05em;
      }

      .rrPolicyUpdated {
        display:flex;
        align-items:center;
        gap:7px;
        padding:9px 12px;
        border:1px solid #dfdcd2;
        border-radius:20px;
        background:#fff;
        color:#686c63;
        font-size:10px;
        font-weight:800;
      }

      .rrPolicyGrid {
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:10px;
      }

      .rrPolicyCard {
        min-height:225px;
        padding:27px;
        border:1px solid #e0ddd2;
        border-radius:19px;
        background:#fff;
        transition:.2s ease;
      }

      .rrPolicyCard:hover {
        transform:translateY(-2px);
        box-shadow:0 14px 38px rgba(28,30,23,.06);
      }

      .rrPolicyCardTop {
        display:flex;
        justify-content:space-between;
        color:#a58119;
      }

      .rrPolicyCardTop span{font-size:11px;font-weight:950}
      .rrPolicyCard h3{margin:30px 0 12px;font-size:22px;line-height:1.2}
      .rrPolicyCard p{margin:0;color:#62675d;font-size:16px;line-height:1.85}

      .rrPolicyDetails {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:10px;
        margin-top:10px;
      }

      .rrPolicyDetails article {
        padding:25px;
        border-radius:18px;
        background:#ece8d9;
      }

      .rrPolicyDetails span {
        color:#806719;
        font-size:11px;
        font-weight:950;
        letter-spacing:.12em;
      }

      .rrPolicyDetails p{margin:12px 0 0;color:#5f655c;font-size:15.5px;line-height:1.85}

      .rrPolicyContact {
        display:flex;
        gap:15px;
        align-items:flex-start;
        margin-top:12px;
        padding:25px;
        border-radius:18px;
        background:#191b16;
        color:#fff;
      }

      .rrPolicyContactIcon {
        width:42px;height:42px;flex:0 0 42px;
        display:grid;place-items:center;
        border-radius:12px;
        background:#e5c54b;
        color:#1b1d17;
      }

      .rrPolicyContact span{color:#d7c15d;font-size:11px;font-weight:950;letter-spacing:.16em}
      .rrPolicyContact h3{margin:8px 0 8px;font-size:22px;line-height:1.25}
      .rrPolicyContact p{margin:0;color:#c4c7bf;font-size:15px;line-height:1.75}

      .rrLegacyPolicyNote {
        display:none;
      }

      /* CONTACT */
      .rrContact { margin-top:16px; }

      .rrContactIntro {
        padding:42px;
        border-radius:22px;
        background:#fff;
        border:1px solid #e1ded3;
      }

      .rrContactIntro h2 {
        max-width:700px;
        margin:10px 0 12px;
        font-size:clamp(32px,4.5vw,52px);
        line-height:1;
        letter-spacing:-.055em;
      }

      .rrContactIntro p{max-width:700px;color:#74786e;font-size:15px;line-height:1.85}

      .rrContactGrid {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:10px;
        margin-top:10px;
      }

      .rrContactCard {
        min-height:245px;
        padding:25px;
        border:1px solid #e1ded3;
        border-radius:18px;
        background:#fff;
      }

      .rrContactCard.dark{background:#191b16;color:#fff;border-color:#191b16}
      .rrContactIcon {
        width:42px;height:42px;display:grid;place-items:center;
        border-radius:12px;background:#fff0b4;color:#72590b;
      }
      .rrContactCard > span{display:block;margin-top:45px;color:#a58119;font-size:11px;font-weight:950;letter-spacing:.15em}
      .rrContactCard h3{margin:7px 0 8px;font-size:17px}
      .rrContactCard p{margin:0;color:#757970;font-size:15px;line-height:1.8}
      .rrContactCard.dark p{color:#b8bbb2}

      .rrContactNotice {
        display:flex;
        gap:14px;
        margin-top:10px;
        padding:22px;
        border-radius:17px;
        background:#ece8d9;
        color:#62665d;
      }
      .rrContactNotice svg{color:#8a701a;flex:0 0 auto}
      .rrContactNotice strong{display:block;color:#292c25;font-size:15px}
      .rrContactNotice p{margin:5px 0 0;font-size:14px;line-height:1.75}


      /* =========================================================
         RR MASALA TYPOGRAPHY V2 — LARGE / PREMIUM / READABLE
      ========================================================= */
      .rrInfoPage {
        font-size: 16px;
      }

      .rrInfoPage p,
      .rrInfoPage li {
        font-size: 16px;
        line-height: 1.85;
      }

      .rrInfoPage h2 {
        font-weight: 800;
      }

      .rrPolicy {
        margin-top: 28px;
      }

      .rrPolicyTop {
        padding: 34px 4px 28px;
      }

      .rrPolicyTop h2 {
        font-size: clamp(34px, 4vw, 48px);
        line-height: 1.05;
      }

      .rrPolicyUpdated {
        font-size: 13px;
        padding: 11px 15px;
      }

      .rrPolicyGrid {
        gap: 16px;
      }

      .rrPolicyCard {
        min-height: 255px;
        padding: 32px;
        border-radius: 22px;
        box-shadow: 0 10px 35px rgba(28,30,23,.045);
      }

      .rrPolicyCardTop span {
        font-size: 12px;
      }

      .rrPolicyCard h3 {
        margin: 34px 0 13px;
        font-size: 23px;
      }

      .rrPolicyCard p {
        font-size: 16px !important;
        line-height: 1.9 !important;
      }

      .rrPolicyDetails {
        gap: 16px;
        margin-top: 16px;
      }

      .rrPolicyDetails article {
        padding: 29px;
        border-radius: 20px;
      }

      .rrPolicyDetails span {
        font-size: 12px;
      }

      .rrPolicyDetails p {
        font-size: 15.5px !important;
        line-height: 1.9 !important;
      }

      .rrPolicyContact {
        margin-top: 16px;
        padding: 30px;
        border-radius: 20px;
      }

      .rrPolicyContact span {
        font-size: 11px;
      }

      .rrPolicyContact h3 {
        font-size: 23px;
      }

      .rrPolicyContact p {
        font-size: 15.5px !important;
        line-height: 1.85 !important;
      }

      .rrFaq {
        grid-template-columns: 350px minmax(0, 1fr);
        gap: 22px;
        margin-top: 26px;
      }

      .rrFaqAside {
        min-height: 520px;
        padding: 34px;
        border-radius: 24px;
      }

      .rrFaqAside h2 {
        margin-top: 52px;
        font-size: 38px;
      }

      .rrFaqAside p {
        font-size: 15px !important;
        line-height: 1.85 !important;
      }

      .rrFaqTopics span {
        padding: 13px 14px;
        font-size: 13px;
      }

      .rrFaqList {
        gap: 12px;
      }

      .rrFaqItem {
        border-radius: 18px;
      }

      .rrFaqItem button {
        grid-template-columns: 48px minmax(0, 1fr) 28px;
        gap: 14px;
        padding: 25px 24px;
      }

      .rrFaqNo {
        font-size: 13px;
      }

      .rrFaqItem strong {
        font-size: 18px !important;
        line-height: 1.45 !important;
      }

      .rrFaqAnswer {
        padding: 0 28px 27px 86px;
        font-size: 16px !important;
        line-height: 1.9 !important;
      }

      .rrContactIntro p,
      .rrContactCard p {
        font-size: 15px !important;
        line-height: 1.85 !important;
      }

      .rrContactCard > span {
        font-size: 11px;
      }

      @media(max-width:900px){
        .rrFaq {
          grid-template-columns: 1fr;
        }
        .rrFaqAside {
          min-height: auto;
        }
      }

      @media(max-width:620px){
        .rrInfoPage p,
        .rrInfoPage li {
          font-size: 15px;
        }

        .rrHero p {
          font-size: 14px !important;
        }

        .rrPolicyCard {
          min-height: auto;
          padding: 25px;
        }

        .rrPolicyCard h3 {
          font-size: 20px;
        }

        .rrPolicyCard p,
        .rrPolicyDetails p,
        .rrPolicyContact p {
          font-size: 15px !important;
        }

        .rrFaqAside h2 {
          font-size: 32px;
        }

        .rrFaqItem button {
          grid-template-columns: 34px minmax(0,1fr) 22px;
          padding: 20px 17px;
        }

        .rrFaqItem strong {
          font-size: 16px !important;
        }

        .rrFaqAnswer {
          padding: 0 18px 22px 51px;
          font-size: 15px !important;
        }
      }


      /* =========================================================
         FAQ V3 — PREMIUM HELP CENTRE
      ========================================================= */

      .rrFaqPremium {
        margin-top: 22px;
      }

      .rrFaqIntro {
        display: grid;
        grid-template-columns: 1fr 360px;
        gap: 45px;
        align-items: end;
        padding: 38px 4px 30px;
      }

      .rrFaqIntro h2 {
        margin: 10px 0 0;
        font-size: clamp(40px, 5vw, 62px);
        line-height: .98;
        letter-spacing: -.06em;
      }

      .rrFaqIntro h2 em {
        color: #9c7818;
        font-family: Georgia, serif;
        font-weight: 500;
      }

      .rrFaqIntro > p {
        margin: 0 0 5px;
        color: #676c62;
        font-size: 16px;
        line-height: 1.85;
      }

      .rrFaqCategoryBar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 18px;
      }

      .rrFaqCategoryBar a {
        min-height: 58px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 16px;
        border: 1px solid #dfddd4;
        border-radius: 14px;
        background: #fff;
        color: #282b25;
        text-decoration: none;
        font-size: 13px;
        font-weight: 800;
        transition: transform .25s cubic-bezier(.2,.8,.2,1),
                    border-color .25s ease,
                    box-shadow .25s ease;
      }

      .rrFaqCategoryBar a svg:first-child {
        color: #9c7818;
      }

      .rrFaqCategoryBar a svg:last-child {
        margin-left: auto;
        color: #9b9e95;
      }

      .rrFaqCategoryBar a:hover {
        transform: translateY(-3px);
        border-color: #cbb75f;
        box-shadow: 0 12px 30px rgba(31,33,25,.07);
      }

      .rrFaqPremiumGrid {
        display: grid;
        grid-template-columns: 285px minmax(0, 1fr);
        gap: 18px;
        align-items: start;
      }

      .rrFaqIndex {
        position: sticky;
        top: 24px;
        padding: 25px;
        border-radius: 20px;
        background: #191b16;
        color: #fff;
        box-shadow: 0 18px 45px rgba(25,27,22,.14);
      }

      .rrFaqIndexHead {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #e4c54c;
        font-size: 10px;
        font-weight: 950;
        letter-spacing: .16em;
      }

      .rrFaqIndexLine {
        height: 1px;
        margin: 20px 0 8px;
        background: rgba(255,255,255,.12);
      }

      .rrFaqIndex > a {
        display: grid;
        grid-template-columns: 28px 1fr;
        column-gap: 10px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(255,255,255,.09);
        color: #fff;
        text-decoration: none;
        transition: padding-left .2s ease;
      }

      .rrFaqIndex > a:hover {
        padding-left: 5px;
      }

      .rrFaqIndex > a > span {
        color: #d4b743;
        font-size: 10px;
        font-weight: 900;
      }

      .rrFaqIndex > a strong {
        font-size: 13px;
        line-height: 1.3;
      }

      .rrFaqIndex > a small {
        grid-column: 2;
        margin-top: 3px;
        color: #9da097;
        font-size: 10px;
      }

      .rrFaqHelpCard {
        margin-top: 22px;
        padding: 18px;
        border-radius: 14px;
        background: #2a2c23;
      }

      .rrFaqHelpCard > svg {
        color: #e4c54c;
      }

      .rrFaqHelpCard strong {
        display: block;
        margin-top: 14px;
        font-size: 15px;
      }

      .rrFaqHelpCard p {
        margin: 7px 0 14px;
        color: #b9bcb3;
        font-size: 12px !important;
        line-height: 1.7 !important;
      }

      .rrFaqHelpCard a {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #e7c94e;
        text-decoration: none;
        font-size: 11px;
        font-weight: 900;
      }

      .rrFaqGroups {
        display: grid;
        gap: 14px;
      }

      .rrFaqGroup {
        scroll-margin-top: 25px;
        padding: 8px;
        border: 1px solid #dfddd4;
        border-radius: 21px;
        background: #fff;
      }

      .rrFaqGroupHead {
        min-height: 76px;
        display: grid;
        grid-template-columns: 48px 1fr auto;
        gap: 13px;
        align-items: center;
        padding: 10px 13px;
        border-radius: 15px;
        background: #f5f2e8;
      }

      .rrFaqGroupIcon {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #fff0b1;
        color: #765e0e;
      }

      .rrFaqGroupHead > div:nth-child(2) span {
        color: #a17c18;
        font-size: 9px;
        font-weight: 950;
        letter-spacing: .15em;
      }

      .rrFaqGroupHead h3 {
        margin: 2px 0 0;
        font-size: 19px;
        letter-spacing: -.02em;
      }

      .rrFaqGroupHead > p {
        margin: 0;
        color: #888c83;
        font-size: 11px !important;
        white-space: nowrap;
      }

      .rrFaqQuestions {
        padding: 8px 5px 5px;
      }

      .rrFaqQuestion {
        border-bottom: 1px solid #ebe8df;
      }

      .rrFaqQuestion:last-child {
        border-bottom: 0;
      }

      .rrFaqQuestion button {
        width: 100%;
        min-height: 78px;
        display: grid;
        grid-template-columns: 38px minmax(0, 1fr) 40px;
        align-items: center;
        gap: 14px;
        padding: 12px 13px;
        border: 0;
        background: transparent;
        color: #191b16;
        text-align: left;
        cursor: pointer;
      }

      .rrFaqQuestionNo {
        color: #a17c18;
        font-size: 11px;
        font-weight: 950;
      }

      .rrFaqQuestion button strong {
        font-size: 17px;
        line-height: 1.45;
      }

      .rrFaqToggle {
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border: 1px solid #dfddd4;
        border-radius: 50%;
        color: #676b62;
        transition: transform .3s cubic-bezier(.2,.8,.2,1),
                    background .25s ease,
                    color .25s ease;
      }

      .rrFaqQuestion.active .rrFaqToggle {
        transform: rotate(180deg);
        background: #191b16;
        color: #e4c54c;
        border-color: #191b16;
      }

      .rrFaqQuestionAnswer {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows .38s cubic-bezier(.2,.8,.2,1);
      }

      .rrFaqQuestionAnswer p {
        min-height: 0;
        overflow: hidden;
        margin: 0;
        padding: 0 67px;
        color: #656a61;
        font-size: 15px !important;
        line-height: 1.9 !important;
        opacity: 0;
        transform: translateY(-5px);
        transition: opacity .25s ease, transform .35s ease, padding .35s ease;
      }

      .rrFaqQuestion.active .rrFaqQuestionAnswer {
        grid-template-rows: 1fr;
      }

      .rrFaqQuestion.active .rrFaqQuestionAnswer p {
        padding-bottom: 24px;
        opacity: 1;
        transform: translateY(0);
      }

      .rrFaqQuestion.active {
        background: linear-gradient(90deg, rgba(249,246,231,.65), transparent);
        border-radius: 13px;
      }

      @media(max-width:900px){
        .rrFaqIntro {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .rrFaqPremiumGrid {
          grid-template-columns: 1fr;
        }

        .rrFaqIndex {
          position: relative;
          top: auto;
        }

        .rrFaqIndex > a {
          grid-template-columns: 35px 1fr auto;
        }

        .rrFaqIndex > a small {
          grid-column: 3;
          margin-top: 0;
        }
      }

      @media(max-width:650px){
        .rrFaqIntro {
          padding: 25px 3px 22px;
        }

        .rrFaqIntro h2 {
          font-size: 42px;
        }

        .rrFaqIntro > p {
          font-size: 15px;
        }

        .rrFaqCategoryBar {
          grid-template-columns: 1fr 1fr;
        }

        .rrFaqCategoryBar a {
          min-height: 52px;
          font-size: 12px;
          padding: 0 12px;
        }

        .rrFaqIndex {
          padding: 20px;
        }

        .rrFaqGroupHead {
          grid-template-columns: 42px 1fr;
        }

        .rrFaqGroupHead > p {
          display: none;
        }

        .rrFaqQuestion button {
          grid-template-columns: 28px minmax(0,1fr) 34px;
          gap: 9px;
          min-height: 72px;
          padding: 11px 8px;
        }

        .rrFaqQuestion button strong {
          font-size: 15px;
        }

        .rrFaqQuestionAnswer p {
          padding: 0 43px;
          font-size: 14px !important;
        }

        .rrFaqQuestion.active .rrFaqQuestionAnswer p {
          padding-bottom: 20px;
        }
      }

      /* SUCCESS */
      .rrSuccessPage {
        display:grid;
        place-items:center;
        padding:40px 18px;
      }

      .rrSuccess {
        width:min(650px,100%);
        padding:65px 45px;
        text-align:center;
        border:1px solid #e1ded3;
        border-radius:28px;
        background:#fff;
        box-shadow:0 25px 75px rgba(29,31,23,.09);
      }

      .rrSuccessOrb {
        width:86px;height:86px;
        margin:0 auto 22px;
        display:grid;place-items:center;
        border-radius:50%;
        background:#191b16;
        color:#e5c54b;
        box-shadow:0 12px 30px rgba(25,27,22,.16);
      }

      .rrSuccess h1{margin:10px 0;font-size:55px;letter-spacing:-.06em}
      .rrSuccess p{color:#72766d;font-size:12px;line-height:1.85}
      .rrSuccessActions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:25px}

      /* =========================================================
         CINEMATIC MOTION SYSTEM
         Lightweight CSS + IntersectionObserver, no animation package
      ========================================================= */
      .rrReveal {
        opacity: 0;
        transform: translate3d(0, 34px, 0) scale(.985);
        filter: blur(4px);
        transition:
          opacity .85s cubic-bezier(.16,1,.3,1),
          transform .95s cubic-bezier(.16,1,.3,1),
          filter .85s cubic-bezier(.16,1,.3,1);
        will-change: opacity, transform, filter;
      }

      .rrRevealVisible {
        opacity: 1;
        transform: translate3d(0,0,0) scale(1);
        filter: blur(0);
      }

      .rrHero {
        animation: rrHeroIn 1s cubic-bezier(.16,1,.3,1) both;
      }

      @keyframes rrHeroIn {
        from { opacity:0; transform:translate3d(0,-22px,0) scale(.985); }
        to { opacity:1; transform:translate3d(0,0,0) scale(1); }
      }

      .rrHeroIcon {
        animation: rrIconFloat 4s ease-in-out infinite;
      }

      @keyframes rrIconFloat {
        0%,100% { transform:translateY(0) rotate(0deg); }
        50% { transform:translateY(-6px) rotate(-2deg); }
      }

      .rrHeroGlow {
        animation: rrGlowMove 8s ease-in-out infinite alternate;
      }

      @keyframes rrGlowMove {
        from { transform:translate3d(-18px,12px,0) scale(.9); opacity:.55; }
        to { transform:translate3d(20px,-10px,0) scale(1.08); opacity:1; }
      }

      .rrHeroMark {
        animation: rrMarkDrift 9s ease-in-out infinite alternate;
      }

      @keyframes rrMarkDrift {
        from { transform:translate3d(0,0,0) rotate(-2deg); }
        to { transform:translate3d(-14px,-8px,0) rotate(2deg); }
      }

      .rrPolicyCard,
      .rrIngredient,
      .rrHeritageCard,
      .rrContactCard,
      .rrFaqItem,
      .rrPolicyDetails article {
        transition:
          transform .45s cubic-bezier(.16,1,.3,1),
          box-shadow .45s cubic-bezier(.16,1,.3,1),
          border-color .3s ease;
      }

      .rrPolicyCard:hover,
      .rrIngredient:hover,
      .rrHeritageCard:hover,
      .rrContactCard:hover {
        transform:translateY(-8px);
        box-shadow:0 24px 55px rgba(28,30,23,.11);
      }

      .rrFaqItem:hover {
        transform:translateX(4px);
      }

      .rrFaqItem.active {
        animation: rrFaqOpen .45s cubic-bezier(.16,1,.3,1) both;
      }

      @keyframes rrFaqOpen {
        from { opacity:.72; transform:translateY(5px); }
        to { opacity:1; transform:translateY(0); }
      }

      .rrDish {
        animation: rrDishFloat 6s ease-in-out infinite;
      }

      @keyframes rrDishFloat {
        0%,100% { transform:translate3d(0,0,0) rotate(-7deg); }
        50% { transform:translate3d(0,-10px,0) rotate(-4deg); }
      }

      .rrDishVisual::after {
        content:"";
        position:absolute;
        width:260px;
        height:30px;
        bottom:42px;
        left:50%;
        transform:translateX(-50%);
        border-radius:50%;
        background:rgba(0,0,0,.28);
        filter:blur(16px);
        animation:rrShadowPulse 6s ease-in-out infinite;
        z-index:0;
      }

      .rrDish { position:relative; z-index:1; }

      @keyframes rrShadowPulse {
        0%,100% { opacity:.42; transform:translateX(-50%) scale(.9); }
        50% { opacity:.2; transform:translateX(-50%) scale(.72); }
      }

      .rrDarkBtn,
      .rrLightBtn,
      .rrShopBtn {
        transition:
          transform .35s cubic-bezier(.16,1,.3,1),
          box-shadow .35s ease,
          background .25s ease;
      }

      .rrDarkBtn:hover,
      .rrShopBtn:hover {
        transform:translateY(-3px);
        box-shadow:0 16px 34px rgba(25,27,22,.22);
      }

      .rrLightBtn:hover {
        transform:translateY(-3px);
        box-shadow:0 14px 30px rgba(25,27,22,.10);
      }

      .rrTextLink svg,
      .rrDarkBtn svg,
      .rrLightBtn svg,
      .rrShopBtn svg {
        transition:transform .3s cubic-bezier(.16,1,.3,1);
      }

      .rrTextLink:hover svg,
      .rrDarkBtn:hover svg,
      .rrLightBtn:hover svg,
      .rrShopBtn:hover svg {
        transform:translateX(4px);
      }

      .rrNumberStrip div {
        transition:background .3s ease, transform .3s ease;
      }

      .rrNumberStrip div:hover {
        background:#fff9df;
        transform:translateY(-2px);
      }

      @media (prefers-reduced-motion: reduce) {
        .rrReveal,
        .rrHero,
        .rrHeroIcon,
        .rrHeroGlow,
        .rrHeroMark,
        .rrDish,
        .rrDishVisual::after {
          animation:none !important;
          transition:none !important;
        }
        .rrReveal {
          opacity:1 !important;
          transform:none !important;
          filter:none !important;
        }
        .rrPolicyCard:hover,
        .rrIngredient:hover,
        .rrHeritageCard:hover,
        .rrContactCard:hover,
        .rrFaqItem:hover {
          transform:none;
        }
      }

      @media(max-width:900px){
        .rrAboutHero{grid-template-columns:1fr;padding:45px 35px}
        .rrFaq{grid-template-columns:1fr}
        .rrFaqAside{position:relative;top:auto;min-height:auto}
        .rrPolicyGrid{grid-template-columns:1fr}
        .rrPolicyDetails{grid-template-columns:1fr}
        .rrContactGrid{grid-template-columns:1fr}
        .rrIngredientGrid{grid-template-columns:1fr 1fr}
        .rrHeritageGrid{grid-template-columns:1fr}
        .rrAboutEnd{grid-template-columns:1fr}
        .rrRoundMark{justify-self:start}
      }

      @media(max-width:620px){
        .rrInfoPage,.rrSuccessPage{padding:16px 10px 55px}
        .rrHero{padding:28px 22px;min-height:205px;border-radius:20px}
        .rrHeroIcon{width:50px;height:50px;flex-basis:50px}
        .rrHeroMark{right:20px;font-size:75px}
        .rrHero h1{font-size:34px}
        .rrHero p{font-size:11px}
        .rrAboutHero{padding:34px 23px;border-radius:20px}
        .rrAboutHero h2{font-size:49px}
        .rrDishVisual{min-height:300px}
        .rrDish{width:270px}
        .rrNumberStrip{grid-template-columns:1fr 1fr}
        .rrNumberStrip div{border-bottom:1px solid #e8e5dc}
        .rrStoryBlock{grid-template-columns:1fr;gap:22px;padding:65px 4%}
        .rrTwoColText{grid-template-columns:1fr}
        .rrSectionHead{display:block}
        .rrSectionHead > p{margin-top:10px}
        .rrIngredientGrid{grid-template-columns:1fr}
        .rrHeritage{padding:55px 0}
        .rrQuote{padding:55px 24px;margin-bottom:50px}
        .rrAboutEnd{padding-bottom:50px}
        .rrFaqAside{padding:25px}
        .rrFaqAside h2{margin-top:35px}
        .rrFaqItem button{grid-template-columns:30px 1fr 20px;padding:17px}
        .rrFaqAnswer{padding:0 20px 19px 47px}
        .rrPolicyTop{display:block;padding:28px 2px 20px}
        .rrPolicyUpdated{width:max-content;margin-top:15px}
        .rrPolicyCard{min-height:auto;padding:22px}
        .rrContactIntro{padding:28px 23px}
        .rrContactGrid{grid-template-columns:1fr}
        .rrSuccess{padding:50px 24px}
        .rrSuccess h1{font-size:45px}
      }
    `}</style>
  );
}
