import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API } from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Home,
  Landmark,
  LockKeyhole,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Truck,
  Plane,
  Ship,
  X,
  ShoppingBag,
  ChevronRight,
  FileText,
  AlertCircle
} from "lucide-react";

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
    country: address.country || "India",
    address: address.address || address.fullAddress || address.formattedAddress || "",
  };
}

function getAddressText(address) {
  if (!address) return "";
  if (address.address) return address.address;
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

/* =========================================================
   WHITE CLOTH THEATER PRELOADER
========================================================= */
function TheaterPreloader() {
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    const removeTimer = setTimeout(() => setRender(false), 2400);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, []);

  if (!render) return null;

  return (
    <div className={`rrTheaterCurtain ${!loading ? "isOpen" : ""}`} aria-hidden="true">
      <div className="rrClothHalf rrClothLeft"><div className="rrClothFolds" /></div>
      <div className="rrClothHalf rrClothRight"><div className="rrClothFolds" /></div>
      <div className="rrCurtainLogoBox">
        <img src="/logo.png" alt="RR MASALA" className="rrCurtainLogoImg" />
        <div className="rrCurtainLoader" />
      </div>

      <style>{`
        .rrTheaterCurtain { position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .rrClothHalf { position: absolute; top: 0; bottom: 0; width: 50%; background: #ffffff; box-shadow: inset 0 0 40px rgba(0,0,0,0.05); transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1) 0.3s; will-change: transform; }
        .rrClothLeft { left: 0; transform-origin: left; border-right: 1px solid rgba(0,0,0,0.05); }
        .rrClothRight { right: 0; transform-origin: right; border-left: 1px solid rgba(0,0,0,0.05); }
        .rrClothFolds { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.03) 10%, transparent 20%); }
        .rrTheaterCurtain.isOpen .rrClothLeft { transform: translateX(-100%); }
        .rrTheaterCurtain.isOpen .rrClothRight { transform: translateX(100%); }
        .rrCurtainLogoBox { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 15px; transition: opacity 0.3s ease; }
        .rrTheaterCurtain.isOpen .rrCurtainLogoBox { opacity: 0; }
        .rrCurtainLogoImg { height: 190px; object-fit: contain; }
        .rrCurtainLoader { width: 120px; height: 2px; background: rgba(0,0,0,0.1); position: relative; overflow: hidden; }
        .rrCurtainLoader::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: #fbb034; animation: rrTheaterLoad 1.2s ease-in-out forwards; }
        @keyframes rrTheaterLoad { 0% { left: -100%; } 100% { left: 0; } }
      `}</style>
    </div>
  );
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const nav = useNavigate();

  const savedAddresses = useMemo(() => {
    if (!Array.isArray(user?.addresses)) return [];
    return user.addresses.filter(Boolean);
  }, [user?.addresses]);

  const defaultAddress = useMemo(() => {
    return savedAddresses.find((address) => address.isDefault) || savedAddresses[0] || null;
  }, [savedAddresses]);

  const [addr, setAddr] = useState(() => normalizeAddress(defaultAddress, user));
  const [selectedSavedIndex, setSelectedSavedIndex] = useState(defaultAddress ? savedAddresses.indexOf(defaultAddress) : -1);
  
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isNewAddressMode, setIsNewAddressMode] = useState(false);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [shippingMethod, setShippingMethod] = useState("DOMESTIC");
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);

  useEffect(() => {
    if (!user) return;
    const addresses = Array.isArray(user.addresses) ? user.addresses.filter(Boolean) : [];
    const preferred = addresses.find((a) => a.isDefault) || addresses[0] || null;

    if (!preferred) {
      setAddr((prev) => ({ ...prev, fullName: prev.fullName || user.name || "", mobile: prev.mobile || user.mobile || "" }));
      setSelectedSavedIndex(-1);
      return;
    }

    setAddr(normalizeAddress(preferred, user));
    setSelectedSavedIndex(addresses.indexOf(preferred));
  }, [user]);

  const country = addr.country === "Other" ? String(addr.customCountry || "International").trim() : String(addr.country || "India").trim();
  const international = country.toLowerCase() !== "india";
  const shipping = international ? null : (Number(total || 0) >= 999 ? 0 : 50);
  const grandTotal = Number(total || 0) + Number(shipping || 0);

  useEffect(() => {
    setShippingMethod(international ? "AIR" : "DOMESTIC");
  }, [international]);

  if (!items?.length) {
    return (
      <main className="rrCheckoutEmpty">
        <TheaterPreloader />
        <CheckoutStyles />
        <div className="emptyBox">
          <div className="rrEmptyIconBox"><ShoppingBag size={48} color="var(--rr-maroon, #9e1017)" /></div>
          <h1>Your cart is empty</h1>
          <p>Add authentic South Indian blends before proceeding to checkout.</p>
          <Link to="/products" className="btnSolid">Browse Products</Link>
        </div>
      </main>
    );
  }

  const openAddressModal = () => {
    setErr("");
    setIsAddressModalOpen(true);
    setIsNewAddressMode(savedAddresses.length === 0);
  };

  const selectSavedAddress = (address, index) => {
    setAddr(normalizeAddress(address, user));
    setSelectedSavedIndex(index);
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
    setAddr((prev) => ({ ...prev, [field]: value }));
  };

  const saveNewAddressToBackend = async () => {
    if (!user) { setErr("Please login first."); return; }
    const cleanMobile = String(addr.mobile || "").replace(/\D/g, "");
    
    if (!addr.fullName?.trim()) { setErr("Please enter your name."); return; }
    if (cleanMobile.length < 7) { setErr("Please enter a valid mobile number."); return; }
    if (!addr.address?.trim() && !getAddressText(addr).trim()) { setErr("Please enter your delivery address."); return; }
    if (!addr.pincode?.trim()) { setErr("Please enter your pincode."); return; }

    setBusy(true);
    try {
      const newAddressObj = {
        ...addr,
        mobile: cleanMobile,
        isDefault: savedAddresses.length === 0
      };
      
      const updatedAddresses = [...savedAddresses, newAddressObj];
      await API.put("/users/addresses", { addresses: updatedAddresses });
      
      setAddr(newAddressObj);
      setSelectedSavedIndex(updatedAddresses.length - 1);
      setIsNewAddressMode(false);
      setIsAddressModalOpen(false);
      setErr("");
      window.location.reload(); 
    } catch {
      setErr("Failed to save address. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const place = async (e) => {
    e.preventDefault();
    setErr("");

    if (!user) { nav("/login?returnTo=/checkout"); return; }
    if (!addr.fullName?.trim() || !getAddressText(addr).trim()) { 
      setErr("Please select a delivery address."); 
      openAddressModal();
      return; 
    }

    if (international && shippingMethod !== "AIR" && shippingMethod !== "SEA") {
      setErr("Choose AIR or SEA shipping for international orders.");
      return;
    }

    setBusy(true);

    try {
      const shippingAddress = {
        ...addr,
        fullName: addr.fullName.trim(),
        mobile: String(addr.mobile || "").trim(),
        country,
        address: addr.address?.trim() || getAddressText(addr).trim(),
      };

      const response = await API.post("/orders", {
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod: "UPI",
        shippingMethod: international ? shippingMethod : "DOMESTIC",
      });

      const order = response?.data?.data?.order;
      if (!order?._id) throw new Error("Order creation failed.");

      setShowPaymentPreview(true);
      window.__rrMasalaPendingOrderId = order._id;
    } catch (error) {
      setErr(error?.response?.data?.message || error?.message || "Could not place order.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="rrCheckoutPage">
      <TheaterPreloader />
      <CheckoutStyles />
      
      <div className="rrCheckoutContainer">
        
        {/* LEFT PANEL */}
        <div className="rrLeftPanel">
          <div className="rrHeaderRow">
            <button type="button" onClick={() => nav(-1)} className="rrBackBtn">
              <ArrowLeft size={16} /> Back
            </button>
            <h2>Secure Checkout</h2>
          </div>

          {err && !isAddressModalOpen && (
            <div className="rrErrorBanner"><AlertCircle size={16}/> {err}</div>
          )}

          {/* 1. DELIVERY ADDRESS CARD */}
          <div className="rrCardBox">
            <div className="rrCardHead">
              <div className="titleArea">
                <div className="iconWrap"><MapPin size={20} /></div>
                <div>
                  <h3>Delivery Address</h3>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>
              <button type="button" className="rrChangeBtn" onClick={openAddressModal}>
                Change / Select
              </button>
            </div>
            
            <div className="rrSelectedAddressBox">
              {addr.fullName && getAddressText(addr) ? (
                <>
                  <div className="addrLabelTag">
                    {addr.type === "Work" ? <Landmark size={13} /> : <Home size={13} />}
                    {addr.type || "Home"}
                  </div>
                  <strong>{addr.fullName} &bull; {addr.mobile}</strong>
                  <p>{addr.address || getAddressText(addr)}</p>
                </>
              ) : (
                <div className="rrNoAddrPrompt" onClick={openAddressModal}>
                  <Plus size={16}/> Click here to select or add a delivery address
                </div>
              )}
            </div>
          </div>

          {/* 2. SHIPPING METHOD */}
          <div className="rrCardBox">
            <div className="rrCardHead borderNone">
              <div className="titleArea">
                <div className="iconWrap"><Truck size={20} /></div>
                <div>
                  <h3>Shipping Method</h3>
                  <p>{international ? "International Cargo Routing" : "Domestic Express Delivery"}</p>
                </div>
              </div>
            </div>
            {international ? (
              <div className="shipMethodSelector">
                <label className={`shipBox ${shippingMethod === "AIR" ? "active" : ""}`}>
                  <input type="radio" name="shipMethod" checked={shippingMethod === "AIR"} onChange={() => setShippingMethod("AIR")} />
                  <Plane size={22} />
                  <div>
                    <strong>Air Freight (Express)</strong>
                    <span>Fast delivery via Air Cargo</span>
                  </div>
                </label>
                <label className={`shipBox ${shippingMethod === "SEA" ? "active" : ""}`}>
                  <input type="radio" name="shipMethod" checked={shippingMethod === "SEA"} onChange={() => setShippingMethod("SEA")} />
                  <Ship size={22} />
                  <div>
                    <strong>Sea Freight (Economy)</strong>
                    <span>Economical for bulk export orders</span>
                  </div>
                </label>
              </div>
            ) : (
              <div className="shipMethodStandard">
                <CheckCircle2 size={18} color="#2e7d32"/>
                <span>Standard Domestic Courier (Free Shipping on orders above ₹999)</span>
              </div>
            )}
          </div>

          {/* 3. PAYMENT METHOD */}
          <div className="rrCardBox">
            <div className="rrCardHead borderNone">
              <div className="titleArea">
                <div className="iconWrap"><CreditCard size={20} /></div>
                <div>
                  <h3>Payment Gateway</h3>
                  <p>Encrypted & secure transaction</p>
                </div>
              </div>
            </div>
            <div className="rrPaymentBox active">
              <img src="https://cdn.iconscout.com/icon/free/png-256/free-phonepe-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-5-pack-logos-icons-2945037.png?f=webp&w=256" alt="PhonePe" className="upiIcon" />
              <div className="payDetails">
                <strong>Pay via PhonePe / UPI Gateway</strong>
                <span>Instant payment confirmation</span>
              </div>
              <CheckCircle2 color="#2e7d32" size={20} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - ORDER SUMMARY */}
        <div className="rrRightPanel">
          <div className="rrSummaryCard">
            <div className="rrSummaryItems">
              <h4>Order Summary ({items.length} item{items.length > 1 ? 's' : ''})</h4>
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

            <div className="rrBillDetails">
              <h4>Price Breakdown</h4>
              <div className="billRow">
                <div className="bLabel"><FileText size={14}/> Subtotal</div>
                <div className="bValue">₹{Number(total || 0).toFixed(0)}</div>
              </div>
              <div className="billRow">
                <div className="bLabel"><Truck size={14}/> Shipping</div>
                <div className="bValue">
                  {international ? "Calculated at Gateway" : shipping === 0 ? <span className="free">FREE</span> : `₹${shipping}`}
                </div>
              </div>
              <div className="billDivider" />
              <div className="billRow grandTotal">
                <div className="bLabel">Total Amount</div>
                <div className="bValue">₹{grandTotal.toFixed(0)}</div>
              </div>
            </div>

            <div className="rrSecureBadge">
              <ShieldCheck size={16}/> 100% Safe, Secure & Encrypted Checkout
            </div>

            {/* DESKTOP PROCEED TO PAY BUTTON */}
            <button className="rrPlaceOrderBtn desktopOnlyBtn" onClick={place} disabled={busy}>
              {busy ? "Processing..." : "Proceed to Pay"} <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* STICKY BOTTOM BAR FOR MOBILE */}
        <div className="rrStickyBottomBar">
          <div className="stickTotal">
            <span>Total Payable</span>
            <strong>₹{grandTotal.toFixed(0)}</strong>
          </div>
          <button className="rrPlaceOrderBtn" onClick={place} disabled={busy}>
            {busy ? "Processing..." : "Proceed to Pay"} <ChevronRight size={18} />
          </button>
        </div>

      </div>

      {/* ADDRESS SELECTOR MODAL */}
      {isAddressModalOpen && (
        <div className="rrModalOverlay" onClick={() => setIsAddressModalOpen(false)}>
          <div className="rrModalBox" onClick={e => e.stopPropagation()}>
            <div className="rrModalHead">
              <h3>{isNewAddressMode ? "Add New Delivery Address" : "Select Delivery Address"}</h3>
              <X size={22} className="closeIcon" onClick={() => setIsAddressModalOpen(false)} />
            </div>
            
            <div className="rrModalBody">
              {err && <div className="rrModalError">{err}</div>}

              {!isNewAddressMode ? (
                <div className="modalAddressList">
                  <button className="rrAddNewPinnedBtn" onClick={() => startNewAddress()}>
                    <div className="plusCircle"><Plus size={18} color="var(--rr-maroon, #9e1017)" /></div>
                    <span>Add New Delivery Address</span>
                    <ChevronRight size={18} color="#9ca3af" />
                  </button>

                  <div className="dividerText"><span>OR CHOOSE FROM SAVED ADDRESSES</span></div>

                  {savedAddresses.length > 0 ? (
                    savedAddresses.map((savedAddress, index) => (
                      <div 
                        key={index} 
                        className={`modalAddressCard ${selectedSavedIndex === index ? "active" : ""}`}
                        onClick={() => selectSavedAddress(savedAddress, index)}
                      >
                        <div className="iconBox">
                          {savedAddress.type === "Work" ? <Landmark size={18} /> : <Home size={18} />}
                        </div>
                        <div className="addrInfo">
                          <strong>{savedAddress.type || "Home"}</strong>
                          <p>{getAddressText(savedAddress)}</p>
                          <span>{savedAddress.fullName} &bull; {savedAddress.mobile}</span>
                        </div>
                        {selectedSavedIndex === index && <CheckCircle2 color="var(--rr-maroon, #9e1017)" size={20}/>}
                      </div>
                    ))
                  ) : (
                    <p className="noSavedTxt">No saved addresses found in your profile.</p>
                  )}
                </div>
              ) : (
                <div className="modalNewAddressForm">
                  <div className="inGrpRow">
                    <div className="inGrp">
                      <label>Full Name</label>
                      <input value={addr.fullName || ""} onChange={e => updateAddress("fullName", e.target.value)} placeholder="Receiver's full name" />
                    </div>
                    <div className="inGrp">
                      <label>Mobile Number</label>
                      <input type="tel" maxLength={16} value={addr.mobile || ""} onChange={e => updateAddress("mobile", e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="10 digit mobile" />
                    </div>
                  </div>

                  <div className="inGrp">
                    <label>Country / Region</label>
                    <select value={addr.country || "India"} onChange={e => updateAddress("country", e.target.value)}>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="United Arab Emirates">UAE</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Other">Other (Custom Country)</option>
                    </select>
                  </div>

                  {addr.country === "Other" && (
                    <div className="inGrp">
                      <label>Specify Custom Country</label>
                      <input value={addr.customCountry || ""} onChange={e => updateAddress("customCountry", e.target.value)} placeholder="Enter country name" />
                    </div>
                  )}

                  <div className="inGrpRow">
                    <div className="inGrp">
                      <label>Pincode / ZIP</label>
                      <input type="text" maxLength={12} value={addr.pincode || ""} onChange={e => updateAddress("pincode", e.target.value)} placeholder="Postal code" />
                    </div>
                    <div className="inGrp">
                      <label>City / Town</label>
                      <input value={addr.city || ""} onChange={e => updateAddress("city", e.target.value)} placeholder="City name" />
                    </div>
                  </div>

                  <div className="inGrp">
                    <label>Complete Street Address</label>
                    <textarea rows={2} value={addr.address || ""} onChange={e => updateAddress("address", e.target.value)} placeholder="Door No, Street Name, Area..." />
                  </div>

                  <div className="addrTypeSelector">
                    <label>Address Label</label>
                    <div className="typeChips">
                      {["Home", "Work", "Other"].map(t => (
                        <button type="button" key={t} className={addr.type === t ? "active" : ""} onClick={() => updateAddress("type", t)}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="modalFooterBtns">
                    {savedAddresses.length > 0 && (
                      <button type="button" className="rrCancelBtn" onClick={() => { setIsNewAddressMode(false); setErr(""); }}>Back to List</button>
                    )}
                    <button type="button" className="rrSaveAddressBtn" onClick={saveNewAddressToBackend} disabled={busy}>
                      {busy ? "Saving Address..." : "Save & Use Address"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT SUCCESS PREVIEW MODAL */}
      {showPaymentPreview && (
        <div className="rrModalOverlay">
          <div className="rrPaymentPreviewModal">
            <div className="payAnimIcon"><CheckCircle2 size={48} /></div>
            <h2>Order Placed Successfully!</h2>
            <p>Your payment gateway session is initialized. Click below to view live tracking.</p>
            <button className="rrPlaceOrderBtn" style={{width: "100%", justifyContent: "center"}} onClick={() => {
              const id = window.__rrMasalaPendingOrderId;
              delete window.__rrMasalaPendingOrderId;
              clearCart();
              nav(`/orders/${id}?payment=success`);
            }}>
              Continue to Order Tracking <ArrowRight size={18}/>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function CheckoutStyles() {
  return (
    <style>{`
      .rrCheckoutPage { min-height: 100vh; background-color: #fbf7ef; font-family: "DM Sans", system-ui, sans-serif; padding-top: 32px; padding-bottom: 100px; box-sizing: border-box; }
      .rrCheckoutContainer { width: min(1180px, 92%); margin: 0 auto; display: grid; grid-template-columns: 1.4fr 0.9fr; gap: 24px; align-items: start; box-sizing: border-box; }
      
      .rrCheckoutEmpty { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #fbf7ef; padding: 20px; }
      .emptyBox { background: #ffffff; padding: 60px 40px; border-radius: 24px; text-align: center; box-shadow: 0 12px 36px rgba(0,0,0,0.04); max-width: 480px; width: 100%; display: flex; flex-direction: column; align-items: center; border: 1px solid rgba(158, 16, 23, 0.08); }
      .rrEmptyIconBox { width: 80px; height: 80px; border-radius: 50%; background: #fdf3e8; display: grid; place-items: center; margin: 0 auto 20px; }
      .emptyBox h1 { font-size: 28px; margin: 0 0 10px; color: #140d0b; font-family: 'Cormorant Garamond', serif; }
      .emptyBox p { color: #5e514c; font-size: 14px; margin: 0 0 30px; }
      .btnSolid { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22); color: #fff; text-decoration: none; padding: 14px 30px; border-radius: 14px; font-weight: 800; box-shadow: 0 8px 20px rgba(158, 16, 23, 0.25); }

      .rrLeftPanel { display: flex; flex-direction: column; gap: 20px; width: 100%; box-sizing: border-box; }
      .rrHeaderRow { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
      .rrBackBtn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--rr-border, #e5b900); background: #fff; border-radius: 10px; padding: 10px 16px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
      .rrHeaderRow h2 { margin: 0; font-size: 26px; font-weight: 700; color: #140d0b; font-family: 'Cormorant Garamond', serif; }
      
      .rrErrorBanner { background: #fff0f1; border: 1px solid #ffd1d3; color: #9e1017; padding: 14px 18px; border-radius: 14px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
      
      .rrCardBox { background: #ffffff; border-radius: 24px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); width: 100%; box-sizing: border-box; }
      .rrCardHead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; }
      .rrCardHead.borderNone { border-bottom: none; padding-bottom: 0; margin-bottom: 16px; }
      
      .titleArea { display: flex; align-items: center; gap: 14px; }
      .iconWrap { width: 44px; height: 44px; background: #fdf3e8; color: var(--rr-maroon, #9e1017); border-radius: 14px; display: grid; place-items: center; }
      .titleArea h3 { margin: 0; font-size: 18px; font-weight: 800; color: #140d0b; }
      .titleArea p { margin: 2px 0 0; font-size: 12px; color: #5e514c; }
      .rrChangeBtn { background: transparent; border: 1px solid var(--rr-border, #e5b900); color: var(--rr-maroon, #9e1017); font-weight: 800; font-size: 13px; cursor: pointer; padding: 8px 16px; border-radius: 20px; transition: all 0.2s; }
      .rrChangeBtn:hover { background: #fdf3e8; }
      
      .rrSelectedAddressBox { background: #faf9f4; border: 1px solid #eef0ec; border-radius: 16px; padding: 20px; box-sizing: border-box; }
      .addrLabelTag { display: inline-flex; align-items: center; gap: 6px; background: #e5b90030; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 900; color: #140d0b; margin-bottom: 10px; }
      .rrSelectedAddressBox strong { display: block; font-size: 15px; color: #140d0b; margin-bottom: 4px; }
      .rrSelectedAddressBox p { margin: 0; font-size: 13px; color: #5e514c; line-height: 1.5; }
      .rrNoAddrPrompt { display: flex; align-items: center; justify-content: center; gap: 8px; height: 70px; font-weight: 700; color: var(--rr-maroon, #9e1017); cursor: pointer; border: 1px dashed rgba(158, 16, 23, 0.3); border-radius: 12px; background: #fff0f1; font-size: 13px; }
      
      .shipMethodStandard { display: flex; align-items: center; gap: 10px; background: #edf7f1; border: 1px solid #c8e6c9; padding: 16px; border-radius: 14px; font-weight: 700; color: #2e7d32; font-size: 13px; }
      .shipMethodSelector { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
      .shipBox { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #eee; border-radius: 14px; cursor: pointer; transition: all 0.2s; background: #faf9f4; }
      .shipBox.active { border-color: var(--rr-maroon, #9e1017); background: #fff; box-shadow: 0 4px 12px rgba(158, 16, 23, 0.08); }
      .shipBox input { accent-color: var(--rr-maroon, #9e1017); width: 16px; height: 16px; }
      .shipBox svg { color: #8a7c75; }
      .shipBox.active svg { color: var(--rr-maroon, #9e1017); }
      .shipBox strong { display: block; font-size: 13px; color: #140d0b; }
      .shipBox span { font-size: 11px; color: #5e514c; }
      
      .rrPaymentBox { display: flex; align-items: center; gap: 16px; padding: 16px; border: 2px solid var(--rr-maroon, #9e1017); border-radius: 16px; background: #faf9f4; }
      .upiIcon { width: 36px; height: 36px; object-fit: contain; }
      .payDetails { flex: 1; }
      .payDetails strong { display: block; font-size: 14px; color: #140d0b; }
      .payDetails span { font-size: 12px; color: #5e514c; }
      
      .rrRightPanel { position: sticky; top: 24px; width: 100%; box-sizing: border-box; }
      .rrSummaryCard { background: #ffffff; border-radius: 24px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(158, 16, 23, 0.08); }
      .rrSummaryItems h4 { margin: 0 0 16px; font-size: 16px; font-weight: 800; color: #140d0b; }
      .itemListScroll { max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-right: 4px; }
      .summaryItemRow { display: flex; align-items: center; gap: 12px; }
      .summaryItemRow img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid #eee; }
      .itemDesc { flex: 1; min-width: 0; }
      .itemDesc .name { display: block; font-size: 13px; font-weight: 700; color: #140d0b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .itemDesc .qtyVar { display: block; font-size: 11px; color: #5e514c; margin-top: 2px; }
      .itemPrice { font-weight: 800; font-size: 13px; color: #140d0b; }
      
      .rrBillDetails { margin-top: 20px; background: #faf9f4; border-radius: 16px; padding: 20px; border: 1px solid #eef0ec; }
      .rrBillDetails h4 { margin: 0 0 14px; font-size: 11px; font-weight: 900; color: var(--rr-maroon, #9e1017); letter-spacing: 1.2px; text-transform: uppercase; }
      .billRow { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px; color: #5e514c; }
      .bLabel { display: flex; align-items: center; gap: 8px; }
      .bValue { font-weight: 700; color: #140d0b; }
      .bValue .free { color: #2e7d32; background: #edf7f1; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; }
      .billDivider { height: 1px; background: repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 5px, transparent 5px, transparent 10px); margin: 14px 0; }
      .billRow.grandTotal { font-size: 18px; font-weight: 900; color: #140d0b; margin-bottom: 0; }
      .rrSecureBadge { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 18px; font-size: 11px; font-weight: 800; color: #2e7d32; }
      
      .rrStickyBottomBar { display: none; }
      .rrPlaceOrderBtn { width: 100%; background: linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22); color: #fff; border: none; padding: 16px; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 8px 20px rgba(158, 16, 23, 0.25); margin-top: 20px; transition: transform 0.2s; box-sizing: border-box; }
      .rrPlaceOrderBtn:hover:not(:disabled) { transform: translateY(-2px); }
      .rrPlaceOrderBtn:disabled { opacity: 0.7; cursor: not-allowed; }

      /* MODAL UI */
      .rrModalOverlay { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.75); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box; }
      .rrModalBox { background: #ffffff; width: 100%; max-width: 540px; border-radius: 24px; padding: 28px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.2); box-sizing: border-box; }
      .rrModalHead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .rrModalHead h3 { margin: 0; font-size: 20px; font-weight: 700; color: #140d0b; font-family: 'Cormorant Garamond', serif; }
      .rrModalHead .closeIcon { cursor: pointer; color: #5e514c; background: #faf9f4; padding: 6px; border-radius: 50%; width: 32px; height: 32px; }
      .rrModalError { background: #fff0f1; color: #9e1017; padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 700; margin-bottom: 14px; }
      
      .modalAddressList { display: flex; flex-direction: column; gap: 12px; }
      .rrAddNewPinnedBtn { background: #fffaf9; border: 1px dashed rgba(158, 16, 23, 0.4); padding: 14px 16px; border-radius: 14px; display: flex; align-items: center; gap: 14px; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; box-sizing: border-box; }
      .rrAddNewPinnedBtn:hover { background: #fff0f1; border-color: var(--rr-maroon, #9e1017); }
      .rrAddNewPinnedBtn .plusCircle { width: 36px; height: 36px; background: #fff; border-radius: 50%; display: grid; place-items: center; box-shadow: 0 2px 8px rgba(158,16,23,0.1); flex-shrink: 0; }
      .rrAddNewPinnedBtn span { flex: 1; font-weight: 800; color: var(--rr-maroon, #9e1017); font-size: 14px; }

      .dividerText { text-align: center; margin: 6px 0; position: relative; }
      .dividerText::before { content: ""; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; z-index: 1; }
      .dividerText span { position: relative; z-index: 2; background: #fff; padding: 0 10px; font-size: 10px; font-weight: 900; color: #8a7c75; letter-spacing: 1px; }

      .modalAddressCard { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border: 1px solid #eee; border-radius: 14px; cursor: pointer; background: #faf9f4; transition: all 0.2s; box-sizing: border-box; }
      .modalAddressCard.active { border: 2px solid var(--rr-maroon, #9e1017); background: #fff0f1; }
      .modalAddressCard .iconBox { width: 36px; height: 36px; background: #fff; border-radius: 10px; display: grid; place-items: center; color: #5e514c; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
      .modalAddressCard.active .iconBox { color: var(--rr-maroon, #9e1017); }
      .modalAddressCard .addrInfo { flex: 1; min-width: 0; }
      .modalAddressCard .addrInfo strong { display: block; font-size: 14px; color: #140d0b; margin-bottom: 3px; font-weight: 800; text-transform: capitalize; }
      .modalAddressCard .addrInfo p { margin: 0 0 6px; font-size: 12px; color: #5e514c; line-height: 1.4; }
      .modalAddressCard .addrInfo span { font-size: 11px; font-weight: 700; color: #8a7c75; }
      .noSavedTxt { text-align: center; color: #5e514c; padding: 20px 0; font-size: 13px; }

      .modalNewAddressForm { display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; }
      .inGrpRow { display: flex; gap: 12px; }
      .inGrp { flex: 1; display: flex; flex-direction: column; gap: 5px; box-sizing: border-box; }
      .inGrp label { font-size: 11px; font-weight: 800; color: #140d0b; text-transform: uppercase; letter-spacing: 0.5px; }
      .inGrp input, .inGrp select, .inGrp textarea { width: 100%; padding: 12px 14px; background: #faf9f4; border: 1px solid #ddd; border-radius: 12px; font-size: 13px; outline: none; box-sizing: border-box; font-family: inherit; }
      .inGrp input:focus, .inGrp select:focus, .inGrp textarea:focus { border-color: var(--rr-maroon, #9e1017); background: #fff; }
      
      .addrTypeSelector label { font-size: 11px; font-weight: 800; color: #140d0b; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
      .typeChips { display: flex; gap: 10px; }
      .typeChips button { padding: 8px 18px; border-radius: 99px; border: 1px solid #ddd; background: #faf9f4; font-weight: 700; color: #5e514c; cursor: pointer; font-size: 12px; }
      .typeChips button.active { background: #140d0b; color: #fff; border-color: #140d0b; }

      .modalFooterBtns { display: flex; gap: 10px; margin-top: 10px; }
      .rrCancelBtn { flex: 1; padding: 14px; background: #faf9f4; color: #5e514c; border: 1px solid #ddd; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 13px; }
      .rrSaveAddressBtn { flex: 2; padding: 14px; background: linear-gradient(135deg, var(--rr-maroon, #9e1017), #c41a22); color: #fff; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 13px; box-shadow: 0 4px 12px rgba(158, 16, 23, 0.2); }
      
      .rrPaymentPreviewModal { background: #fff; padding: 40px 30px; border-radius: 24px; text-align: center; width: 100%; max-width: 400px; margin: auto; border: 1px solid rgba(158, 16, 23, 0.08); }
      .payAnimIcon { color: #2e7d32; margin-bottom: 16px; }
      .rrPaymentPreviewModal h2 { margin: 0 0 8px; font-family: 'Cormorant Garamond', serif; font-size: 26px; color: #140d0b; }
      .rrPaymentPreviewModal p { color: #5e514c; font-size: 13px; margin: 0 0 24px; }

      @media (min-width: 901px) {
        .desktopOnlyBtn { display: flex !important; }
      }
      @media (max-width: 900px) {
        .rrCheckoutContainer { grid-template-columns: 1fr; padding-bottom: 110px; width: 95%; }
        .rrRightPanel { display: none; }
        .desktopOnlyBtn { display: none !important; }
        .rrStickyBottomBar { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #ffffff; border-top: 1px solid #eee; padding: 16px 20px; align-items: center; justify-content: space-between; z-index: 1000; box-shadow: 0 -10px 30px rgba(0,0,0,0.06); box-sizing: border-box; }
        .stickTotal span { display: block; font-size: 11px; color: #8a7c75; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .stickTotal strong { display: block; font-size: 20px; font-weight: 900; color: #140d0b; }
        .rrPlaceOrderBtn { width: auto; margin-top: 0; padding: 14px 28px; font-size: 14px; border-radius: 12px; }
      }
    `}</style>
  );
}