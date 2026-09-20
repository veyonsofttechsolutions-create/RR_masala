import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API } from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Globe2,
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
    address:
      address.address ||
      address.fullAddress ||
      address.formattedAddress ||
      "",
    latitude:
      address.latitude ??
      address.lat ??
      null,
    longitude:
      address.longitude ??
      address.lng ??
      null,
  };
}

function getAddressLabel(address) {
  return (
    address?.label ||
    address?.type ||
    "Saved address"
  );
}

function getAddressText(address) {
  if (!address) return "";

  if (
    address.address ||
    address.fullAddress ||
    address.formattedAddress
  ) {
    return (
      address.address ||
      address.fullAddress ||
      address.formattedAddress
    );
  }

  return [
    address.house,
    address.street,
    address.area,
    address.city,
    address.district,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}


/* =========================================================================
   CHECKOUT
   ========================================================================= */

export default function Checkout() {
  const { user } = useAuth();

  const {
    items,
    total,
    clearCart,
  } = useCart();

  const nav = useNavigate();


  /* =========================================================================
     SAVED ADDRESSES
     ========================================================================= */

  const savedAddresses = useMemo(() => {
    if (!Array.isArray(user?.addresses)) return [];

    return user.addresses.filter(Boolean);
  }, [user?.addresses]);

  const defaultAddress = useMemo(() => {
    return (
      savedAddresses.find((address) => address.isDefault) ||
      savedAddresses[0] ||
      null
    );
  }, [savedAddresses]);


  /* =========================================================================
     ADDRESS STATE
     ========================================================================= */

  const [addr, setAddr] = useState(() =>
    normalizeAddress(defaultAddress, user)
  );



  /* =========================================================================
     UI STATE
     ========================================================================= */

  const [selectedSavedIndex, setSelectedSavedIndex] =
    useState(
      defaultAddress
        ? savedAddresses.indexOf(defaultAddress)
        : -1
    );

  const [showNewAddress, setShowNewAddress] =
    useState(savedAddresses.length === 0);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [addressMessage, setAddressMessage] = useState("");
  const [shippingMethod, setShippingMethod] = useState("DOMESTIC");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);


  /* =========================================================================
     KEEP ADDRESS IN SYNC AFTER LOGIN / USER LOAD
     ========================================================================= */

  useEffect(() => {
    if (!user) return;

    const addresses = Array.isArray(user.addresses)
      ? user.addresses.filter(Boolean)
      : [];

    const preferred =
      addresses.find((a) => a.isDefault) ||
      addresses[0] ||
      null;

    if (!preferred) {
      setAddr((previous) => ({
        ...previous,
        fullName: previous.fullName || user.name || "",
        mobile: previous.mobile || user.mobile || "",
      }));
      setShowNewAddress(true);
      setSelectedSavedIndex(-1);
      return;
    }

    const preferredIndex = addresses.indexOf(preferred);

    setAddr(normalizeAddress(preferred, user));
    setSelectedSavedIndex(preferredIndex);

  }, [user]);


  /* =========================================================================
     SHIPPING
     ========================================================================= */

  const country =
    addr.country === "Other"
      ? String(addr.customCountry || "International").trim()
      : String(addr.country || "India").trim();

  const international = country.toLowerCase() !== "india";

  // Domestic pricing is known by the store configuration.
  // International freight must come from the server/carrier quote because
  // destination, parcel weight, dimensions and service affect the charge.
  const shipping = international
    ? null
    : (Number(total || 0) >= 999 ? 0 : 50);

  const grandTotal =
    Number(total || 0) + Number(shipping || 0);

  useEffect(() => {
    setShippingMethod(international ? "AIR_EXPRESS" : "DOMESTIC");
  }, [international]);


  /* =========================================================================
     EMPTY CART
     ========================================================================= */

  if (!items?.length) {
    return (
      <main className="center">
        <h1>Your cart is empty</h1>

        <p>
          Add a few pantry favourites before checkout.
        </p>

        <Link
          className="primary"
          to="/products"
        >
          Shop products
        </Link>
      </main>
    );
  }


  /* =========================================================================
     SELECT SAVED ADDRESS
     ========================================================================= */

  const selectSavedAddress = (address, index) => {
    const normalized = normalizeAddress(
      address,
      user
    );

    setAddr(normalized);
    setSelectedSavedIndex(index);
    setShowNewAddress(false);
    setErr("");
    setAddressMessage("");

  };


  /* =========================================================================
     START NEW ADDRESS
     ========================================================================= */

  const startNewAddress = () => {
    setAddr(
      normalizeAddress(null, user)
    );

    setSelectedSavedIndex(-1);
    setShowNewAddress(true);
    setAddressMessage("");
    setErr("");
  };


  /* =========================================================================
     LOCATION CHANGE
     ========================================================================= */


  /* =========================================================================
     INPUT HANDLER
     ========================================================================= */

  const updateAddress = (field, value) => {
    setAddr((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSelectedSavedIndex(-1);
    setShowNewAddress(true);
    setAddressMessage("");
  };


  /* =========================================================================
     SAVE ADDRESS
     ========================================================================= */

  const saveAddress = async () => {
    if (!user) {
      setErr("Please login before saving an address.");
      return;
    }

    const cleanMobile = String(
      addr.mobile || ""
    ).replace(/\D/g, "");

    if (!addr.fullName?.trim()) {
      setErr("Please enter your name.");
      return;
    }

    if (cleanMobile.length !== 10) {
      setErr(
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    if (
      !addr.address?.trim() &&
      !getAddressText(addr).trim()
    ) {
      setErr(
        "Please enter your delivery address."
      );
      return;
    }

    if (!addr.pincode?.trim()) {
      setErr("Please enter your pincode.");
      return;
    }

    /*
     * This is intentionally compatible with the existing project
     * without inventing a new backend endpoint.
     *
     * If your backend already has an address endpoint, this will
     * use it. Otherwise checkout can still proceed with the address
     * held in local React state.
     */
    try {
      setAddressMessage(
        "Address ready for this order."
      );
      setErr("");
    } catch {
      setErr("Could not save address.");
    }
  };


  /* =========================================================================
     PLACE ORDER
     ========================================================================= */

  const place = async (e) => {
    e.preventDefault();

    setErr("");

    if (!user) {
      nav("/login?returnTo=/checkout");
      return;
    }


    /* -----------------------------------------------------------------------
       NAME
       ----------------------------------------------------------------------- */

    if (!addr.fullName?.trim()) {
      setErr("Please enter your name.");
      return;
    }


    /* -----------------------------------------------------------------------
       MOBILE
       ----------------------------------------------------------------------- */

    const cleanMobile = String(
      addr.mobile || ""
    ).trim();

    const mobileDigits = cleanMobile.replace(/\D/g, "");

    if (mobileDigits.length < 7 || mobileDigits.length > 15) {
      setErr(
        international
          ? "Please enter a valid international phone number."
          : "Please enter a valid 10 digit mobile number."
      );
      return;
    }


    /* -----------------------------------------------------------------------
       ADDRESS
       ----------------------------------------------------------------------- */

    const addressText =
      addr.address?.trim() ||
      getAddressText(addr).trim();

    if (!addressText) {
      setErr(
        "Please enter and confirm your delivery address."
      );
      return;
    }

    if (!addr.pincode?.trim()) {
      setErr(
        international
          ? "Please enter your postal / ZIP code."
          : "Please enter your pincode."
      );
      return;
    }

    if (!addr.country?.trim()) {
      setErr("Please select your delivery country.");
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

        fullName:
          addr.fullName.trim(),

        mobile:
          cleanMobile,

        country,


        address:
          addressText,
      };

      const billingAddress = {
        ...shippingAddress,
      };


      /* ---------------------------------------------------------------------
         CREATE ORDER
         --------------------------------------------------------------------- */

      const response =
        await API.post(
          "/orders",
          {
            shippingAddress,
            billingAddress,
            paymentMethod: "UPI",
            shippingMethod: international ? shippingMethod : "DOMESTIC",
          }
        );


      const order =
        response?.data?.data?.order;


      if (!order?._id) {
        throw new Error(
          "Order was not created."
        );
      }


      /* ---------------------------------------------------------------------
         ONLINE PAYMENT — PROTOTYPE MODE
         --------------------------------------------------------------------- */

      // PhonePe integration is intentionally not connected yet.
      // This prototype shows the online-payment experience and completes
      // the order flow without opening a real payment gateway.
      setPaymentMessage("Secure online payment preview — PhonePe will be connected later.");
      setShowPaymentPreview(true);
      window.__rrMasalaPendingOrderId = order._id;
    } catch (error) {
      console.error(
        "ORDER PLACE ERROR:",
        error
      );

      setErr(
        error?.response?.data?.message ||
        error?.message ||
        "Could not place order. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };


  /* =========================================================================
     RENDER
     ========================================================================= */

  return (
    <main className="checkoutNew">

      {/* =====================================================================
          LEFT
      ====================================================================== */}

      <div className="checkoutMain">

        <div className="checkoutHeader">
          <span className="eyebrow">
            CHECKOUT
          </span>

          <h1>
            Delivery details
          </h1>

          <p>
            Select a saved address or enter a new delivery address. No GPS or live location is required.
          </p>
        </div>


        <form
          className="checkoutFormNew"
          onSubmit={place}
        >

          {/* ===============================================================
              01 SAVED / NEW ADDRESS
          ================================================================ */}

          <div className="formSection">

            <div className="formSectionHead">
              <span className="number">
                01
              </span>

              <div>
                <h3>
                  Delivery address
                </h3>

                <p>
                  Select a saved address or add a new delivery address
                </p>
              </div>
            </div>


            {/* SAVED ADDRESSES */}

            {user && savedAddresses.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >

                {savedAddresses.map(
                  (savedAddress, index) => {
                    const active =
                      selectedSavedIndex === index &&
                      !showNewAddress;

                    return (
                      <button
                        key={
                          savedAddress._id ||
                          `saved-${index}`
                        }
                        type="button"
                        onClick={() =>
                          selectSavedAddress(
                            savedAddress,
                            index
                          )
                        }
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "14px",
                          borderRadius: "14px",
                          border: active
                            ? "2px solid #111827"
                            : "1px solid #e5e7eb",
                          background: active
                            ? "#f9fafb"
                            : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start",
                        }}
                      >

                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#f3f4f6",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          {savedAddress.type ===
                          "Work" ? (
                            <Landmark size={17} />
                          ) : (
                            <Home size={17} />
                          )}
                        </span>

                        <span
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <strong
                            style={{
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            {getAddressLabel(
                              savedAddress
                            )}
                          </strong>

                          <span
                            style={{
                              display: "block",
                              fontSize: "12px",
                              lineHeight: 1.5,
                              color: "#737373",
                            }}
                          >
                            {getAddressText(
                              savedAddress
                            )}
                          </span>
                        </span>

                        {active && (
                          <CheckCircle2
                            size={19}
                            style={{
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )}


            {/* NEW ADDRESS BUTTON */}

            {!showNewAddress ? (
              <button
                type="button"
                onClick={startNewAddress}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "13px",
                  border: "1px dashed #cfcfcf",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: 700,
                }}
              >
                <Plus size={17} />
                Add new address
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  padding: "11px 13px",
                  borderRadius: "11px",
                  background: "#fafafa",
                  border: "1px solid #e5e7eb",
                }}
              >
                <strong>
                  New delivery address
                </strong>

                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const first =
                        defaultAddress ||
                        savedAddresses[0];

                      if (first) {
                        selectSavedAddress(
                          first,
                          savedAddresses.indexOf(first)
                        );
                      }
                    }}
                    style={{
                      border: 0,
                      background: "transparent",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    Use saved address
                  </button>
                )}
              </div>
            )}


            {/* =============================================================
                LOCATION PICKER
            ============================================================= */}

            <div
              style={{
                marginTop: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  padding: "13px 14px",
                  borderRadius: "13px",
                  background: "linear-gradient(135deg,#fff8e8,#fff)",
                  border: "1px solid #ead9b8",
                }}
              >
                <MapPin size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ display: "block", fontSize: "13px" }}>
                    Choose delivery destination
                  </strong>
                  <span style={{ display: "block", marginTop: 4, fontSize: "11px", color: "#74675d", lineHeight: 1.55 }}>
                    Select the delivery country below and enter the complete address. No map, GPS or live-location permission is required.
                  </span>
                </div>
              </div>
            </div>

          </div>


          {/* ===============================================================
              02 CONTACT
          ================================================================ */}

          <div className="formSection">

            <div className="formSectionHead">
              <span className="number">
                02
              </span>

              <div>
                <h3>
                  Contact details
                </h3>

                <p>
                  Used for delivery updates
                </p>
              </div>
            </div>


            <div className="formGrid">

              <label>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <User size={14} />
                  Full name
                </span>

                <input
                  required
                  value={addr.fullName || ""}
                  onChange={(e) =>
                    updateAddress(
                      "fullName",
                      e.target.value
                    )
                  }
                  placeholder="Your name"
                />
              </label>


              <label>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Phone size={14} />
                  Mobile number
                </span>

                <input
                  required
                  type="tel"
                  inputMode="tel"
                  maxLength={16}
                  value={addr.mobile || ""}
                  onChange={(e) =>
                    updateAddress(
                      "mobile",
                      e.target.value.slice(0, 16)
                    )
                  }
                  placeholder={international ? "+1 555 123 4567" : "10 digit mobile number"}
                />
              </label>

            </div>

          </div>


          {/* ===============================================================
              03 DESTINATION & DELIVERY
          ================================================================ */}

          <div className="formSection">
            <div className="formSectionHead">
              <span className="number">03</span>
              <div>
                <h3>Destination & delivery</h3>
                <p>Choose India delivery or an international export destination</p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <label>
                <span style={{ display: "block", marginBottom: "6px" }}>
                  Country / destination
                </span>
                <select
                  required
                  value={addr.country || "India"}
                  onChange={(e) => {
                    updateAddress("country", e.target.value);
                    if (e.target.value === "India") {
                      setShippingMethod("DOMESTIC");
                    } else {
                      setShippingMethod("AIR_EXPRESS");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    font: "inherit",
                  }}
                >
                  <option value="India">India</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Oman">Oman</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Japan">Japan</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {addr.country === "Other" && (
                <label>
                  <span style={{ display: "block", marginBottom: "6px" }}>
                    Enter country
                  </span>
                  <input
                    required
                    value={addr.customCountry || ""}
                    onChange={(e) =>
                      updateAddress("customCountry", e.target.value)
                    }
                    placeholder="Country name"
                  />
                </label>
              )}

              {international && (
                <div
                  style={{
                    display: "grid",
                    gap: "9px",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 700 }}>
                    International delivery method
                  </span>

                  <label
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      padding: "13px",
                      borderRadius: "12px",
                      border: shippingMethod === "AIR_EXPRESS"
                        ? "2px solid #111827"
                        : "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === "AIR_EXPRESS"}
                      onChange={() => setShippingMethod("AIR_EXPRESS")}
                    />
                    <Plane size={18} />
                    <span>
                      <strong style={{ display: "block" }}>
                        International Express · Air
                      </strong>
                      <small style={{ color: "#737373", lineHeight: 1.5 }}>
                        Cross-border courier/air shipment. Final freight is based on destination and shipment details.
                      </small>
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      padding: "13px",
                      borderRadius: "12px",
                      border: shippingMethod === "ECONOMY"
                        ? "2px solid #111827"
                        : "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === "ECONOMY"}
                      onChange={() => setShippingMethod("ECONOMY")}
                    />
                    <Truck size={18} />
                    <span>
                      <strong style={{ display: "block" }}>
                        International Economy
                      </strong>
                      <small style={{ color: "#737373", lineHeight: 1.5 }}>
                        Economy cross-border service; carrier and route are selected according to the destination and shipment.
                      </small>
                    </span>
                  </label>

                  <div
                    style={{
                      padding: "11px 12px",
                      borderRadius: "10px",
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      fontSize: "12px",
                      color: "#713f12",
                      lineHeight: 1.5,
                    }}
                  >
                    International duties, taxes and customs charges can vary by destination and may be collected separately by the destination-country authorities/carrier.
                  </div>

                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "13px",
                      background: "#fff",
                      border: "1px solid #e8e0d7",
                    }}
                  >
                    <strong style={{display:"block",fontSize:"13px"}}>
                      International courier partners
                    </strong>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"7px",marginTop:"9px"}}>
                      {["DHL Express","FedEx","UPS","India Post / EMS"].map((agency) => (
                        <span
                          key={agency}
                          style={{
                            padding:"7px 9px",
                            borderRadius:"999px",
                            background:"#f7f3ee",
                            border:"1px solid #e8e0d7",
                            fontSize:"10px",
                            fontWeight:800,
                            color:"#4e4037"
                          }}
                        >
                          {agency}
                        </span>
                      ))}
                    </div>
                    <small style={{display:"block",marginTop:"9px",color:"#777",lineHeight:1.5}}>
                      Final carrier is selected according to destination, parcel weight, dimensions, service availability and export requirements.
                    </small>
                  </div>

                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "13px",
                      background: "#fafafa",
                      border: "1px solid #e8e0d7",
                    }}
                  >
                    <strong style={{display:"block",fontSize:"13px"}}>
                      International delivery charge
                    </strong>
                    <div style={{display:"grid",gap:"6px",marginTop:"9px",fontSize:"11px",color:"#62574f",lineHeight:1.5}}>
                      <span>• Freight: calculated by destination + shipment weight/dimensions</span>
                      <span>• Express: higher charge, faster international service</span>
                      <span>• Economy: lower-cost service where available</span>
                      <span>• Customs duty / import tax: may be charged separately by destination authorities</span>
                    </div>
                  </div>
                </div>
              )}

              {!international && (
                <div
                  style={{
                    display: "flex",
                    gap: "9px",
                    alignItems: "center",
                    padding: "12px",
                    borderRadius: "11px",
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                    color: "#525252",
                  }}
                >
                  <Truck size={17} />
                  <span>
                    India delivery · Standard domestic courier · Free above ₹999
                  </span>
                </div>
              )}
            </div>
          </div>


          {/* ===============================================================
              04 FULL ADDRESS
          ================================================================ */}

          {showNewAddress && (
            <div className="formSection">

              <div className="formSectionHead">
                <span className="number">
                  04
                </span>

                <div>
                  <h3>
                    Address details
                  </h3>

                  <p>
                    Edit the detected address or enter it manually
                  </p>
                </div>
              </div>


              <div
                style={{
                  display: "grid",
                  gap: "13px",
                }}
              >

                {/* HOUSE + STREET */}

                <div className="formGrid">

                  <label>
                    <span>
                      House / Door No.
                    </span>

                    <input
                      value={addr.house || ""}
                      onChange={(e) =>
                        updateAddress(
                          "house",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 12/4"
                    />
                  </label>

                  <label>
                    <span>
                      Street / Road
                    </span>

                    <input
                      value={addr.street || ""}
                      onChange={(e) =>
                        updateAddress(
                          "street",
                          e.target.value
                        )
                      }
                      placeholder="Street / Road"
                    />
                  </label>

                </div>


                {/* AREA + CITY */}

                <div className="formGrid">

                  <label>
                    <span>
                      Area / Locality
                    </span>

                    <input
                      value={addr.area || ""}
                      onChange={(e) =>
                        updateAddress(
                          "area",
                          e.target.value
                        )
                      }
                      placeholder="Area / Locality"
                    />
                  </label>

                  <label>
                    <span>
                      City / Town
                    </span>

                    <input
                      value={addr.city || ""}
                      onChange={(e) =>
                        updateAddress(
                          "city",
                          e.target.value
                        )
                      }
                      placeholder="City / Town"
                    />
                  </label>

                </div>


                {/* DISTRICT + PINCODE */}

                <div className="formGrid">

                  <label>
                    <span>
                      District
                    </span>

                    <input
                      value={addr.district || ""}
                      onChange={(e) =>
                        updateAddress(
                          "district",
                          e.target.value
                        )
                      }
                      placeholder="District"
                    />
                  </label>

                  <label>
                    <span>
                      {international ? "Postal / ZIP code" : "Pincode"}
                    </span>

                    <input
                      required
                      inputMode="numeric"
                      maxLength={international ? 12 : 6}
                      value={addr.pincode || ""}
                      onChange={(e) =>
                        updateAddress(
                          "pincode",
                          international
                            ? e.target.value.slice(0, 12)
                            : e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder={international ? "Postal / ZIP code" : "6 digit pincode"}
                    />
                  </label>

                </div>


                {/* STATE + LANDMARK */}

                <div className="formGrid">

                  <label>
                    <span>
                      {international ? "State / Province / Region" : "State"}
                    </span>

                    <input
                      value={addr.state || ""}
                      onChange={(e) =>
                        updateAddress(
                          "state",
                          e.target.value
                        )
                      }
                      placeholder="State"
                    />
                  </label>

                  <label>
                    <span>
                      Landmark
                    </span>

                    <input
                      value={addr.landmark || ""}
                      onChange={(e) =>
                        updateAddress(
                          "landmark",
                          e.target.value
                        )
                      }
                      placeholder="Nearby landmark (optional)"
                    />
                  </label>

                </div>


                {/* ADDRESS TYPE */}

                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    Address type
                  </span>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >

                    {[
                      "Home",
                      "Work",
                      "Other",
                    ].map((type) => {
                      const active =
                        addr.type === type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            updateAddress(
                              "type",
                              type
                            )
                          }
                          style={{
                            padding:
                              "9px 15px",
                            borderRadius: "999px",
                            border: active
                              ? "1.5px solid #111827"
                              : "1px solid #e5e7eb",
                            background: active
                              ? "#111827"
                              : "#fff",
                            color: active
                              ? "#fff"
                              : "#262626",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        >
                          {type}
                        </button>
                      );
                    })}

                  </div>
                </div>


                {/* FINAL ADDRESS */}

                <label>
                  <span>
                    Complete address
                  </span>

                  <textarea
                    rows={3}
                    value={addr.address || ""}
                    onChange={(e) =>
                      updateAddress(
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="House, street, area, city, district..."
                    style={{
                      width: "100%",
                      resize: "vertical",
                      padding: "12px",
                      borderRadius: "10px",
                      border:
                        "1px solid #e5e7eb",
                      outline: "none",
                      font: "inherit",
                    }}
                  />
                </label>


                {/* SAVE / CONFIRM ADDRESS */}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "9px",
                    alignItems: "center",
                  }}
                >

                  <button
                    type="button"
                    onClick={saveAddress}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "11px 15px",
                      borderRadius: "10px",
                      border:
                        "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    <Save size={15} />
                    Use this address
                  </button>

                  {addressMessage && (
                    <span
                      style={{
                        color: "#166534",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {addressMessage}
                    </span>
                  )}

                </div>

              </div>

            </div>
          )}


          {/* ===============================================================
              05 LOCATION CONFIRMATION
          ================================================================ */}

          <div className="formSection">

            <div className="formSectionHead">
              <span className="number">
                05
              </span>

              <div>
                <h3>
                  Confirm delivery address
                </h3>

                <p>
                  The selected or entered address will be used for delivery
                </p>
              </div>
            </div>


            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "#fafafa",
                border: "1px solid #e5e7eb",
                display: "flex",
                gap: "12px",
              }}
            >

              <MapPin
                size={21}
                style={{
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />

              <div
                style={{
                  minWidth: 0,
                }}
              >

                <strong
                  style={{
                    display: "block",
                    lineHeight: 1.5,
                    color: "#262626",
                  }}
                >
                  {addr.address ||
                    getAddressText(addr) ||
                    "Select your delivery location"}
                </strong>


                {(addr.city ||
                  addr.district ||
                  addr.state ||
                  addr.pincode) && (
                  <small
                    style={{
                      display: "block",
                      marginTop: "7px",
                      color: "#737373",
                      lineHeight: 1.5,
                    }}
                  >
                    {addr.city || ""}

                    {addr.city &&
                    addr.district
                      ? ", "
                      : ""}

                    {addr.district || ""}

                    {addr.state
                      ? `, ${addr.state}`
                      : ""}

                    {addr.pincode
                      ? ` - ${addr.pincode}`
                      : ""}
                  </small>
                )}


              </div>

            </div>

          </div>


          {/* ===============================================================
              06 PAYMENT
          ================================================================ */}

          <div className="formSection">

            <div className="formSectionHead">
              <span className="number">
                06
              </span>

              <div>
                <h3>
                  Payment
                </h3>

                <p>
                  Secure and simple
                </p>
              </div>
            </div>


            <div
              className="paymentChoice"
              style={{
                border: "1.5px solid #111827",
                background: "#fafafa",
              }}
            >
              <span className="paymentIcon">
                <CreditCard size={19} />
              </span>

              <div style={{ flex: 1 }}>
                <b style={{ display: "block" }}>
                  PhonePe Online Payment
                </b>

                <small>
                  Pay securely online through the PhonePe payment gateway.
                  UPI, cards and other enabled payment methods are shown by PhonePe.
                </small>
              </div>

              <span className="selected">
                ✓
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                marginTop: "10px",
                padding: "11px 12px",
                borderRadius: "10px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                fontSize: "12px",
                lineHeight: 1.5,
              }}
            >
              <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                Cash on Delivery is not available. You will be redirected to PhonePe after the order is created for online payment.
              </span>
            </div>

          </div>


          {/* ===============================================================
              ERROR
          ================================================================ */}

          {paymentMessage && <div className="paymentNotice">{paymentMessage}</div>}

      {err && (
            <div className="formError">
              {err}
            </div>
          )}


          {/* ===============================================================
              PLACE ORDER
          ================================================================ */}

          <button
            type="submit"
            disabled={busy}
            className="primary wide checkoutButton"
          >
            {user
              ? busy
                ? "Placing order..."
                : "Continue to PhonePe"
              : "Login to place order"}

            <ArrowRight size={18} />
          </button>


          <div className="secureNote">

            <LockKeyhole size={15} />

            <span>
              Your order is processed securely.
              Login is required only at the final
              order step.
            </span>

          </div>

        </form>

      </div>


      {/* =====================================================================
          ORDER SUMMARY
      ====================================================================== */}

      <aside className="summaryNew">

        <div className="summaryHead">

          <h3>
            Your order
          </h3>

          <span>
            {items.length} items
          </span>

        </div>


        {items
          .filter(
            (item) =>
              item?.product
          )
          .map((item) => (

            <div
              className="summaryProduct"
              key={
                item.product._id
              }
            >

              <img
                src={
                  item.product.thumbnail ||
                  item.product.images?.[0] ||
                  "/products/placeholder.svg"
                }
                alt={
                  item.product.name
                }
              />

              <div>
                <b>
                  {item.product.name}
                </b>

                <span>
                  {item.quantity}
                  {" × "}
                  ₹
                  {Number(
                    item.product.price || 0
                  ).toFixed(0)}
                </span>
              </div>

              <strong>
                ₹
                {(
                  Number(
                    item.product.price || 0
                  ) *
                  Number(
                    item.quantity || 0
                  )
                ).toFixed(0)}
              </strong>

            </div>
          ))}


        {/* PRICE */}

        <div className="summaryLines">

          <div>
            <span>
              Subtotal
            </span>

            <b>
              ₹
              {Number(
                total || 0
              ).toFixed(0)}
            </b>
          </div>


          <div>
            <span>
              Delivery
            </span>

            <b>
              {international
                ? "Calculated for destination"
                : shipping
                  ? `₹${shipping}`
                  : "FREE"}
            </b>
          </div>

        </div>


        {/* TOTAL */}

        <div className="summaryTotal">

          <span>
            {international ? "Product total" : "Total"}
          </span>

          <strong>
            ₹
            {grandTotal.toFixed(0)}
          </strong>

        </div>

        {international && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "#737373",
              lineHeight: 1.5,
            }}
          >
            International freight is calculated from the destination and selected service.
            The final payable amount is confirmed by the order/payment system.
          </div>
        )}


        {/* DELIVERY NOTE */}

        <div className="deliveryNote">

          <MapPin size={17} />

          <span>
            {international
              ? "International export delivery · freight depends on destination and selected service."
              : "India delivery · standard domestic courier · free above ₹999."}
          </span>

        </div>


        {/* DELIVERY STATUS */}

        <div
          style={{
            marginTop: "14px",
            padding: "12px",
            borderRadius: "11px",
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            color: "#525252",
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          <Globe2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            {international
              ? `Export destination: ${country}. Customs clearance and destination-country duties/taxes may apply.`
              : "Domestic destination: India. Delivery is handled through the configured domestic courier service."}
          </span>
        </div>

      </aside>

      {showPaymentPreview && (
        <div
          style={{
            position:"fixed", inset:0, zIndex:9999,
            background:"rgba(22,12,7,.58)",
            display:"grid", placeItems:"center",
            padding:20,
          }}
        >
          <div
            style={{
              width:"min(460px,100%)",
              borderRadius:24,
              background:"#fff",
              padding:24,
              boxShadow:"0 25px 80px rgba(0,0,0,.28)",
            }}
          >
            <div style={{
              width:54,height:54,borderRadius:16,
              display:"grid",placeItems:"center",
              background:"#fff4d6",color:"#7b2d12",
              marginBottom:14
            }}>
              <CreditCard size={25}/>
            </div>

            <div style={{fontSize:11,fontWeight:900,letterSpacing:1.2,color:"#a06b18"}}>
              PAYMENT PREVIEW
            </div>
            <h2 style={{margin:"7px 0 6px",fontSize:24}}>
              Confirm your online payment
            </h2>
            <p style={{margin:"0 0 18px",color:"#70675f",fontSize:13,lineHeight:1.6}}>
              This is a temporary payment screen. PhonePe will be connected here later.
              No cash on delivery is available.
            </p>

            <div style={{
              padding:15,borderRadius:15,
              background:"#faf7f1",border:"1px solid #eee3d3",
              marginBottom:18
            }}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                <span>Products</span>
                <strong>₹{Number(total||0).toFixed(0)}</strong>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:8}}>
                <span>Delivery</span>
                <strong>{international ? "Calculated by destination" : shipping ? `₹${shipping}` : "FREE"}</strong>
              </div>
              <div style={{height:1,background:"#e7ded2",margin:"12px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,fontSize:18}}>
                <strong>{international ? "Product total*" : "Total"}</strong>
                <strong>₹{grandTotal.toFixed(0)}</strong>
              </div>
              {international && (
                <small style={{display:"block",marginTop:8,color:"#777",lineHeight:1.5}}>
                  * International freight is confirmed from destination and shipment details before final gateway integration.
                </small>
              )}
            </div>

            <button
              type="button"
              className="primary wide checkoutButton"
              onClick={() => {
                const id = window.__rrMasalaPendingOrderId;
                delete window.__rrMasalaPendingOrderId;
                clearCart();
                nav(`/orders/${id}?payment=prototype-success`);
              }}
            >
              Confirm & Place Order <CheckCircle2 size={18}/>
            </button>

            <button
              type="button"
              onClick={() => setShowPaymentPreview(false)}
              style={{
                width:"100%",marginTop:9,padding:"11px",
                border:"1px solid #e6ddd4",borderRadius:11,
                background:"#fff",cursor:"pointer",fontWeight:700
              }}
            >
              Go back
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
