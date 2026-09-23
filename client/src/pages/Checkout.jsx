import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API } from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Home,
  Landmark,
  LockKeyhole,
  MapPin,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Truck,
  Plane,
  User,
  X,
  ShoppingBag,
  ChevronRight,
  FileText,
  AlertCircle
} from "lucide-react";

/* =========================================================================
   HELPERS
   ========================================================================= */
const EMPTY_ADDRESS = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  area: "",
  city: "",
  district: "",
  state: "Tamil Nadu",
  pincode: "",
  landmark: "",
  type: "Home",
  country: "India",
  address: "",
  latitude: null,
  longitude: null,
};

function normalizeAddress(address, user) {
  if (!address) {
    return {
      ...EMPTY_ADDRESS,
      fullName: user?.name || "",
      mobile: user?.mobile || "",
    };
  }

  return {
    ...EMPTY_ADDRESS,
    ...address,
    fullName: address.fullName || address.name || user?.name || "",
    mobile: address.mobile || user?.mobile || "",
    address: address.address || address.fullAddress || address.formattedAddress || "",
    latitude: address.latitude ?? address.lat ?? null,
    longitude: address.longitude ?? address.lng ?? null,
  };
}

function getAddressLabel(address) {
  return address?.label || address?.type || "Saved address";
}

function getAddressText(address) {
  if (!address) return "";

  if (address.address || address.fullAddress || address.formattedAddress) {
    return address.address || address.fullAddress || address.formattedAddress;
  }

  return [
    address.house,
    address.street,
    address.area,
    address.city,
    address.district,
    address.state,
    address.pincode,
  ].filter(Boolean).join(", ");
}

/* =========================================================================
   CHECKOUT
   ========================================================================= */
export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const nav = useNavigate();

  /* =========================================================================
     SAVED ADDRESSES
     ========================================================================= */
  const savedAddresses = useMemo(() => {
    if (!Array.isArray(user?.addresses)) return [];
    return user.addresses.filter(Boolean);
  }, [user?.addresses]);

  const defaultAddress = useMemo(() => {
    return savedAddresses.find((address) => address.isDefault) || savedAddresses[0] || null;
  }, [savedAddresses]);

  /* =========================================================================
     STATE
     ========================================================================= */
  const [addr, setAddr] = useState(() => normalizeAddress(defaultAddress, user));
  const [selectedSavedIndex, setSelectedSavedIndex] = useState(defaultAddress ? savedAddresses.indexOf(defaultAddress) : -1);
  
  // Modals for Blinkit style clean UI
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isNewAddressMode, setIsNewAddressMode] = useState(savedAddresses.length === 0);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [addressMessage, setAddressMessage] = useState("");
  const [shippingMethod, setShippingMethod] = useState("DOMESTIC");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);

  useEffect(() => {
    if (!user) return;
    const addresses = Array.isArray(user.addresses) ? user.addresses.filter(Boolean) : [];
    const preferred = addresses.find((a) => a.isDefault) || addresses[0] || null;

    if (!preferred) {
      setAddr((previous) => ({
        ...previous,
        fullName: previous.fullName || user.name || "",
        mobile: previous.mobile || user.mobile || "",
      }));
      setIsNewAddressMode(true);
      setIsAddressModalOpen(true);
      setSelectedSavedIndex(-1);
      return;
    }

    const preferredIndex = addresses.indexOf(preferred);
    setAddr(normalizeAddress(preferred, user));
    setSelectedSavedIndex(preferredIndex);
  }, [user]);

  const country = addr.country === "Other" ? String(addr.customCountry || "International").trim() : String(addr.country || "India").trim();
  const international = country.toLowerCase() !== "india";
  const shipping = international ? null : (Number(total || 0) >= 999 ? 0 : 50);
  const grandTotal = Number(total || 0) + Number(shipping || 0);

  useEffect(() => {
    setShippingMethod(international ? "AIR_EXPRESS" : "DOMESTIC");
  }, [international]);

  if (!items?.length) {
    return (
      <main className="rrCheckoutEmpty">
        <CheckoutStyles />
        <div className="emptyBox">
          <ShoppingBag size={48} color="#9e1017" />
          <h1>Cart is Empty</h1>
          <p>Add some authentic masalas to your cart to proceed.</p>
          <Link to="/products" className="btnSolid">Browse Products</Link>
        </div>
      </main>
    );
  }

  const selectSavedAddress = (address, index) => {
    setAddr(normalizeAddress(address, user));
    setSelectedSavedIndex(index);
    setIsNewAddressMode(false);
    setIsAddressModalOpen(false);
    setErr("");
  };

  const startNewAddress = () => {
    setAddr(normalizeAddress(null, user));
    setSelectedSavedIndex(-1);
    setIsNewAddressMode(true);
    setErr("");
  };

  const updateAddress = (field, value) => {
    setAddr((previous) => ({ ...previous, [field]: value }));
  };

  const saveAddress = async () => {
    if (!user) { setErr("Please login before saving an address."); return; }
    const cleanMobile = String(addr.mobile || "").replace(/\D/g, "");
    if (!addr.fullName?.trim()) { setErr("Please enter your name."); return; }
    if (cleanMobile.length !== 10 && !international) { setErr("Please enter a valid 10 digit mobile number."); return; }
    if (!addr.address?.trim() && !getAddressText(addr).trim()) { setErr("Please enter your delivery address."); return; }
    if (!addr.pincode?.trim()) { setErr("Please enter your pincode."); return; }

    try {
      setAddressMessage("Address selected.");
      setErr("");
      setIsAddressModalOpen(false);
    } catch {
      setErr("Could not save address.");
    }
  };

  const place = async (e) => {
    e.preventDefault();
    setErr("");

    if (!user) { nav("/login?returnTo=/checkout"); return; }
    if (!addr.fullName?.trim()) { setErr("Please select or enter a delivery address."); setIsAddressModalOpen(true); return; }

    const cleanMobile = String(addr.mobile || "").trim();
    const mobileDigits = cleanMobile.replace(/\D/g, "");

    if (mobileDigits.length < 7 || mobileDigits.length > 15) {
      setErr(international ? "Invalid international phone number." : "Invalid 10 digit mobile number.");
      setIsAddressModalOpen(true);
      return;
    }

    const addressText = addr.address?.trim() || getAddressText(addr).trim();
    if (!addressText || !addr.pincode?.trim() || !addr.country?.trim()) {
      setErr("Incomplete address details. Please update your address.");
      setIsAddressModalOpen(true);
      return;
    }

    if (international && !shippingMethod) {
      setErr("Please select an international delivery method.");
      return;
    }

    setBusy(true);

    try {
      const shippingAddress = {
        ...addr,
        fullName: addr.fullName.trim(),
        mobile: cleanMobile,
        country,
        address: addressText,
      };

      const response = await API.post("/orders", {
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod: "UPI",
        shippingMethod: international ? shippingMethod : "DOMESTIC",
      });

      const order = response?.data?.data?.order;
      if (!order?._id) throw new Error("Order was not created.");

      setPaymentMessage("Secure online payment preview — PhonePe will be connected later.");
      setShowPaymentPreview(true);
      window.__rrMasalaPendingOrderId = order._id;
    } catch (error) {
      console.error("ORDER PLACE ERROR:", error);
      setErr(error?.response?.data?.message || error?.message || "Could not place order. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="bkCheckoutPage">
      <CheckoutStyles />
      
      <div className="bkContainer">
        
        {/* LEFT COLUMN - MAIN CHECKOUT FLOW */}
        <div className="bkLeftPanel">
          <div className="bkHeader">
            <ArrowLeft className="backIcon" onClick={() => nav(-1)} />
            <h2>Checkout</h2>
          </div>

          {err && !isAddressModalOpen && (
            <div className="bkErrorBanner"><AlertCircle size={16}/> {err}</div>
          )}

          {/* 1. DELIVERY ADDRESS CARD (Clean UI) */}
          <div className="bkCard">
            <div className="bkCardHeader">
              <div className="titleArea">
                <div className="iconWrap"><MapPin size={20} /></div>
                <div>
                  <h3>Delivery Address</h3>
                  <p>We will deliver your order here</p>
                </div>
              </div>
              <button type="button" className="textBtn" onClick={() => setIsAddressModalOpen(true)}>
                Change
              </button>
            </div>
            
            <div className="bkSelectedAddress">
              {addr.fullName ? (
                <>
                  <div className="addrLabel">
                    {addr.type === "Work" ? <Landmark size={14} /> : <Home size={14} />}
                    {getAddressLabel(addr)}
                  </div>
                  <strong>{addr.fullName} &middot; {addr.mobile}</strong>
                  <p>{addr.address || getAddressText(addr)}</p>
                </>
              ) : (
                <div className="noAddrPrompt" onClick={() => setIsAddressModalOpen(true)}>
                  <Plus size={16}/> Select or Add Address
                </div>
              )}
            </div>
          </div>

          {/* 2. SHIPPING METHOD */}
          <div className="bkCard">
            <div className="bkCardHeader borderNone">
              <div className="titleArea">
                <div className="iconWrap"><Truck size={20} /></div>
                <div>
                  <h3>Delivery Method</h3>
                  <p>{international ? "International Shipping" : "Domestic Courier"}</p>
                </div>
              </div>
            </div>
            {international ? (
              <div className="shipMethodSelector">
                <label className={`shipBox ${shippingMethod === "AIR_EXPRESS" ? "active" : ""}`}>
                  <input type="radio" name="shipMethod" checked={shippingMethod === "AIR_EXPRESS"} onChange={() => setShippingMethod("AIR_EXPRESS")} />
                  <Plane size={20} />
                  <div>
                    <strong>Express Air</strong>
                    <span>Fastest. Calculated at gateway.</span>
                  </div>
                </label>
                <label className={`shipBox ${shippingMethod === "ECONOMY" ? "active" : ""}`}>
                  <input type="radio" name="shipMethod" checked={shippingMethod === "ECONOMY"} onChange={() => setShippingMethod("ECONOMY")} />
                  <Truck size={20} />
                  <div>
                    <strong>Standard Economy</strong>
                    <span>Best value. Route dependent.</span>
                  </div>
                </label>
              </div>
            ) : (
              <div className="shipMethodStandard">
                <CheckCircle2 size={16} color="#16a34a"/>
                <span>Standard Delivery (Free above ₹999)</span>
              </div>
            )}
          </div>

          {/* 3. PAYMENT METHOD */}
          <div className="bkCard">
            <div className="bkCardHeader borderNone">
              <div className="titleArea">
                <div className="iconWrap"><CreditCard size={20} /></div>
                <div>
                  <h3>Payment Method</h3>
                  <p>Secure online payment</p>
                </div>
              </div>
            </div>
            <div className="bkPaymentMethod active">
              <img src="https://cdn.iconscout.com/icon/free/png-256/free-phonepe-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-5-pack-logos-icons-2945037.png?f=webp&w=256" alt="PhonePe" className="upiIcon" />
              <div className="payDetails">
                <strong>Pay via PhonePe</strong>
                <span>UPI, Wallets, Credit & Debit Cards</span>
              </div>
              <CheckCircle2 color="#16a34a" size={20} />
            </div>
            <div className="bkCodNotice">
              <ShieldCheck size={14} /> Cash on delivery is unavailable
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - CART & BILL SUMMARY */}
        <div className="bkRightPanel">
          <div className="bkSummaryCard">
            
            <div className="bkSummaryItems">
              <h4>Order Items ({items.length})</h4>
              <div className="itemListScroll">
                {items.filter(i => i?.product).map(item => (
                  <div className="summaryItemRow" key={item.product._id}>
                    <img src={item.product.thumbnail || item.product.images?.[0] || "/products/placeholder.svg"} alt="" />
                    <div className="itemDesc">
                      <span className="name">{item.product.name}</span>
                      <span className="qtyVar">{item.quantity} × ₹{Number(item.product.price || 0).toFixed(0)}</span>
                    </div>
                    <div className="itemPrice">
                      ₹{(Number(item.product.price || 0) * Number(item.quantity || 0)).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bkBillDetails">
              <h4>Bill Details</h4>
              <div className="billRow">
                <div className="bLabel"><FileText size={14}/> Item Total</div>
                <div className="bValue">₹{Number(total || 0).toFixed(0)}</div>
              </div>
              <div className="billRow">
                <div className="bLabel"><Truck size={14}/> Delivery Fee</div>
                <div className="bValue">
                  {international ? "Calculated next" : shipping === 0 ? <span className="free">FREE</span> : `₹${shipping}`}
                </div>
              </div>
              <div className="billDivider" />
              <div className="billRow grandTotal">
                <div className="bLabel">To Pay</div>
                <div className="bValue">₹{grandTotal.toFixed(0)}</div>
              </div>
            </div>

            <div className="bkSecureBadge">
              <LockKeyhole size={14}/> 100% Safe & Secure Payments
            </div>

          </div>
        </div>

        {/* STICKY BOTTOM BAR FOR MOBILE & DESKTOP CTA */}
        <div className="bkStickyBottom">
          <div className="stickTotal">
            <span>To Pay</span>
            <strong>₹{grandTotal.toFixed(0)}</strong>
          </div>
          <button className="bkPlaceOrderBtn" onClick={place} disabled={busy}>
            {busy ? "Processing..." : "Proceed to Pay"} <ChevronRight size={20} />
          </button>
        </div>

      </div>

      {/* =====================================================================
          ADDRESS SELECTOR / ADD NEW MODAL (CLEAN BLINKIT STYLE)
      ====================================================================== */}
      {isAddressModalOpen && (
        <div className="bkModalOverlay" onClick={() => setIsAddressModalOpen(false)}>
          <div className="bkModalContent" onClick={e => e.stopPropagation()}>
            <div className="bkModalHeader">
              <h3>{isNewAddressMode ? "Add New Address" : "Select Address"}</h3>
              <X size={24} className="closeIcon" onClick={() => setIsAddressModalOpen(false)} />
            </div>
            
            <div className="bkModalBody">
              {err && <div className="bkErrorBanner">{err}</div>}

              {!isNewAddressMode ? (
                // SAVED ADDRESSES LIST
                <div className="modalAddressList">
                  {savedAddresses.map((savedAddress, index) => (
                    <div 
                      key={index} 
                      className={`modalAddressCard ${selectedSavedIndex === index ? "active" : ""}`}
                      onClick={() => selectSavedAddress(savedAddress, index)}
                    >
                      <div className="iconBox">
                        {savedAddress.type === "Work" ? <Landmark size={18} /> : <Home size={18} />}
                      </div>
                      <div className="addrInfo">
                        <strong>{getAddressLabel(savedAddress)}</strong>
                        <p>{getAddressText(savedAddress)}</p>
                        <span>{savedAddress.fullName} &middot; {savedAddress.mobile}</span>
                      </div>
                      {selectedSavedIndex === index && <CheckCircle2 color="#9e1017" size={20}/>}
                    </div>
                  ))}
                  
                  <button className="bkAddNewLineBtn" onClick={() => startNewAddress()}>
                    <Plus size={18} /> Add New Address
                  </button>
                </div>
              ) : (
                // ADD NEW ADDRESS FORM (COMPACT)
                <div className="modalNewAddressForm">
                  <div className="inGrpRow">
                    <div className="inGrp">
                      <label>Full Name</label>
                      <input value={addr.fullName || ""} onChange={e => updateAddress("fullName", e.target.value)} placeholder="Enter name" />
                    </div>
                    <div className="inGrp">
                      <label>Mobile</label>
                      <input type="tel" maxLength={16} value={addr.mobile || ""} onChange={e => updateAddress("mobile", e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="10 digit mobile" />
                    </div>
                  </div>

                  <div className="inGrp">
                    <label>Country</label>
                    <select value={addr.country || "India"} onChange={e => updateAddress("country", e.target.value)}>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {addr.country === "Other" && (
                     <div className="inGrp">
                       <input value={addr.customCountry || ""} onChange={e => updateAddress("customCountry", e.target.value)} placeholder="Enter Country Name" />
                     </div>
                  )}

                  <div className="inGrpRow">
                    <div className="inGrp">
                      <label>Pincode / ZIP</label>
                      <input type="text" maxLength={12} value={addr.pincode || ""} onChange={e => updateAddress("pincode", e.target.value)} placeholder="e.g. 600001" />
                    </div>
                    <div className="inGrp">
                      <label>City</label>
                      <input value={addr.city || ""} onChange={e => updateAddress("city", e.target.value)} placeholder="City" />
                    </div>
                  </div>

                  <div className="inGrp">
                    <label>Complete Address</label>
                    <textarea rows={2} value={addr.address || ""} onChange={e => updateAddress("address", e.target.value)} placeholder="House/Flat No, Street, Area..." />
                  </div>

                  <div className="addrTypeSelector">
                    <label>Save As:</label>
                    <div className="typeChips">
                      {["Home", "Work", "Other"].map(t => (
                        <button key={t} className={addr.type === t ? "active" : ""} onClick={() => updateAddress("type", t)}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="modalFooterBtns">
                    {savedAddresses.length > 0 && (
                      <button className="bkCancelBtn" onClick={() => setIsNewAddressMode(false)}>Cancel</button>
                    )}
                    <button className="bkSaveBtn" onClick={saveAddress}>Save & Use Address</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PAYMENT PREVIEW MODAL
      ====================================================================== */}
      {showPaymentPreview && (
        <div className="bkModalOverlay">
          <div className="bkPaymentPreviewModal">
            <div className="payAnimIcon"><CheckCircle2 size={40} /></div>
            <h2>Order Generated</h2>
            <p>You are being redirected to PhonePe for secure payment.</p>
            
            <div className="paySummaryBox">
              <div className="psRow"><span>Amount to Pay</span> <strong>₹{grandTotal.toFixed(0)}</strong></div>
            </div>

            <button className="bkPlaceOrderBtn" onClick={() => {
              const id = window.__rrMasalaPendingOrderId;
              delete window.__rrMasalaPendingOrderId;
              clearCart();
              nav(`/orders/${id}?payment=prototype-success`);
            }}>
              Simulate Successful Payment <ArrowRight size={18}/>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================================
   EMBEDDED STYLES (BLINKIT / MODERN QUICK-COMMERCE LOOK)
   ========================================================================= */
function CheckoutStyles() {
  return (
    <style>{`
      /* Base Page Setup */
      .bkCheckoutPage {
        min-height: 100vh;
        background-color: #f3f4f6; /* Modern light gray background */
        font-family: "DM Sans", system-ui, sans-serif;
        padding-bottom: 100px; /* Space for sticky bottom bar */
      }

      .bkContainer {
        max-width: 1080px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.2fr 0.8fr; /* Left broader, Right slightly narrow */
        gap: 24px;
        padding: 24px;
        align-items: start;
      }

      /* Headers */
      .bkHeader {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }
      .bkHeader .backIcon { cursor: pointer; color: #1f2937; }
      .bkHeader h2 { margin: 0; font-size: 24px; font-weight: 800; color: #1f2937; letter-spacing: -0.5px; }

      .bkErrorBanner {
        background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
        padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 600;
        margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
      }

      /* Left Side Cards */
      .bkLeftPanel { display: flex; flex-direction: column; gap: 16px; }
      .bkCard {
        background: #ffffff;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      }
      
      .bkCardHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f3f4f6;
      }
      .bkCardHeader.borderNone { border-bottom: none; padding-bottom: 0; margin-bottom: 16px; }
      
      .titleArea { display: flex; align-items: center; gap: 16px; }
      .iconWrap { width: 40px; height: 40px; background: #fdf2f2; color: #9e1017; border-radius: 12px; display: grid; place-items: center; }
      .titleArea h3 { margin: 0; font-size: 18px; font-weight: 800; color: #111827; }
      .titleArea p { margin: 2px 0 0; font-size: 13px; color: #6b7280; }
      
      .textBtn { background: transparent; border: none; color: #9e1017; font-weight: 800; font-size: 14px; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.2s; }
      .textBtn:hover { background: #fdf2f2; }

      /* Selected Address View */
      .bkSelectedAddress {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 20px;
        position: relative;
      }
      .addrLabel { display: inline-flex; align-items: center; gap: 6px; background: #e5e7eb; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; color: #374151; margin-bottom: 12px; }
      .bkSelectedAddress strong { display: block; font-size: 16px; color: #111827; margin-bottom: 4px; }
      .bkSelectedAddress p { margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6; }
      .noAddrPrompt { display: flex; align-items: center; justify-content: center; gap: 8px; height: 80px; font-weight: 700; color: #9e1017; cursor: pointer; border: 1px dashed #fca5a5; border-radius: 12px; background: #fef2f2; }

      /* Shipping Methods */
      .shipMethodStandard { display: flex; align-items: center; gap: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; font-weight: 700; color: #166534; font-size: 14px; }
      .shipMethodSelector { display: grid; gap: 12px; }
      .shipBox { display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
      .shipBox.active { border-color: #111827; background: #f9fafb; }
      .shipBox input { accent-color: #111827; width: 18px; height: 18px; }
      .shipBox svg { color: #6b7280; }
      .shipBox.active svg { color: #111827; }
      .shipBox strong { display: block; font-size: 15px; color: #111827; }
      .shipBox span { font-size: 13px; color: #6b7280; }

      /* Payment Method */
      .bkPaymentMethod { display: flex; align-items: center; gap: 16px; padding: 16px; border: 2px solid #111827; border-radius: 16px; background: #f9fafb; margin-bottom: 12px; }
      .upiIcon { width: 36px; height: 36px; object-fit: contain; }
      .payDetails { flex: 1; }
      .payDetails strong { display: block; font-size: 15px; color: #111827; }
      .payDetails span { font-size: 13px; color: #6b7280; }
      .bkCodNotice { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9a3412; background: #fff7ed; padding: 12px; border-radius: 10px; font-weight: 600; }

      /* Right Side - Summary (Receipt Style) */
      .bkRightPanel { position: sticky; top: 24px; }
      .bkSummaryCard { background: #ffffff; border-radius: 20px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
      
      .bkSummaryItems h4 { margin: 0 0 16px; font-size: 16px; font-weight: 800; color: #111827; }
      .itemListScroll { max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-right: 8px; }
      .itemListScroll::-webkit-scrollbar { width: 4px; }
      .itemListScroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      
      .summaryItemRow { display: flex; align-items: center; gap: 12px; }
      .summaryItemRow img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid #f3f4f6; }
      .itemDesc { flex: 1; min-width: 0; }
      .itemDesc .name { display: block; font-size: 13px; font-weight: 700; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .itemDesc .qtyVar { display: block; font-size: 12px; color: #6b7280; margin-top: 2px; }
      .itemPrice { font-weight: 800; font-size: 14px; color: #111827; }

      .bkBillDetails { margin-top: 24px; background: #f9fafb; border-radius: 16px; padding: 20px; border: 1px solid #f3f4f6; }
      .bkBillDetails h4 { margin: 0 0 16px; font-size: 14px; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
      .billRow { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; color: #4b5563; }
      .bLabel { display: flex; align-items: center; gap: 8px; }
      .bValue { font-weight: 600; color: #111827; }
      .bValue .free { color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 800; }
      .billDivider { height: 1px; background: repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 5px, transparent 5px, transparent 10px); margin: 16px 0; }
      .billRow.grandTotal { font-size: 18px; font-weight: 900; color: #111827; margin-bottom: 0; }
      
      .bkSecureBadge { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; font-size: 12px; font-weight: 700; color: #059669; }

      /* Sticky Bottom Bar */
      .bkStickyBottom {
        position: fixed; bottom: 0; left: 0; right: 0;
        background: #ffffff; border-top: 1px solid #e5e7eb;
        padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.05); z-index: 100;
      }
      .stickTotal span { display: block; font-size: 12px; color: #6b7280; font-weight: 700; text-transform: uppercase; }
      .stickTotal strong { display: block; font-size: 22px; font-weight: 900; color: #111827; }
      .bkPlaceOrderBtn {
        background: #9e1017; color: #fff; border: none; padding: 16px 32px; border-radius: 16px;
        font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px;
        box-shadow: 0 4px 15px rgba(158, 16, 23, 0.25); transition: background 0.2s;
      }
      .bkPlaceOrderBtn:hover { background: #7a0c12; }
      .bkPlaceOrderBtn:disabled { background: #d1d5db; cursor: not-allowed; box-shadow: none; }

      /* Modals (Blinkit Style Bottom Sheet/Modal) */
      .bkModalOverlay {
        position: fixed; inset: 0; background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(4px);
        z-index: 9999; display: flex; align-items: flex-end; justify-content: center;
      }
      .bkModalContent {
        background: #ffffff; width: 100%; max-width: 540px; border-radius: 24px 24px 0 0;
        padding: 24px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease-out;
      }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      
      .bkModalHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .bkModalHeader h3 { margin: 0; font-size: 20px; font-weight: 800; color: #111827; }
      .bkModalHeader .closeIcon { cursor: pointer; color: #6b7280; background: #f3f4f6; padding: 4px; border-radius: 50%; width: 32px; height: 32px; }

      .modalAddressList { display: flex; flex-direction: column; gap: 12px; }
      .modalAddressCard { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 16px; cursor: pointer; position: relative; }
      .modalAddressCard.active { border: 2px solid #9e1017; background: #fffafaf; }
      .modalAddressCard .iconBox { width: 36px; height: 36px; background: #f3f4f6; border-radius: 10px; display: grid; place-items: center; color: #4b5563; flex-shrink: 0; }
      .modalAddressCard.active .iconBox { background: #fdf2f2; color: #9e1017; }
      .modalAddressCard .addrInfo strong { display: block; font-size: 15px; color: #111827; margin-bottom: 4px; }
      .modalAddressCard .addrInfo p { margin: 0 0 6px; font-size: 13px; color: #4b5563; line-height: 1.5; }
      .modalAddressCard .addrInfo span { font-size: 12px; font-weight: 600; color: #9ca3af; }
      
      .bkAddNewLineBtn { margin-top: 10px; background: #f9fafb; border: 1px dashed #d1d5db; color: #9e1017; padding: 16px; border-radius: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
      
      /* Compact Form inside Modal */
      .modalNewAddressForm { display: flex; flex-direction: column; gap: 16px; }
      .inGrpRow { display: flex; gap: 16px; }
      .inGrp { flex: 1; display: flex; flex-direction: column; gap: 6px; }
      .inGrp label { font-size: 12px; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px; }
      .inGrp input, .inGrp select, .inGrp textarea { width: 100%; padding: 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; font-family: inherit; outline: none; }
      .inGrp input:focus, .inGrp textarea:focus { border-color: #9e1017; background: #fff; }
      
      .addrTypeSelector label { font-size: 12px; font-weight: 700; color: #4b5563; display: block; margin-bottom: 8px; }
      .typeChips { display: flex; gap: 10px; }
      .typeChips button { padding: 8px 16px; border-radius: 99px; border: 1px solid #d1d5db; background: #fff; font-weight: 600; color: #4b5563; cursor: pointer; }
      .typeChips button.active { background: #111827; color: #fff; border-color: #111827; }

      .modalFooterBtns { display: flex; gap: 12px; margin-top: 10px; }
      .bkCancelBtn { flex: 1; padding: 16px; background: #f3f4f6; color: #4b5563; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; }
      .bkSaveBtn { flex: 2; padding: 16px; background: #111827; color: #fff; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; }

      /* Payment Preview Modal */
      .bkPaymentPreviewModal { background: #fff; padding: 40px 30px; border-radius: 24px; text-align: center; width: 100%; max-width: 400px; }
      .payAnimIcon { color: #16a34a; margin-bottom: 16px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      @keyframes popIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
      .bkPaymentPreviewModal h2 { margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #111827; }
      .bkPaymentPreviewModal p { color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
      .paySummaryBox { background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 16px; padding: 20px; margin-bottom: 24px; }
      .psRow { display: flex; justify-content: space-between; align-items: center; font-size: 16px; color: #4b5563; }
      .psRow strong { font-size: 22px; color: #111827; font-weight: 900; }

      /* Responsive */
      @media (max-width: 992px) {
        .bkContainer { grid-template-columns: 1fr; padding-bottom: 120px; }
        .bkRightPanel { position: static; }
      }
      @media (min-width: 768px) {
        .bkModalOverlay { align-items: center; }
        .bkModalContent { border-radius: 24px; max-height: 85vh; }
      }
    `}</style>
  );
}