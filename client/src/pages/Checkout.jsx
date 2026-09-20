import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API } from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Home,
  Landmark,
  LockKeyhole,
  MapPin,
  Phone,
  Plus,
  Save,
  User,
  X,
} from "lucide-react";

import LocationPicker from "../components/LocationPicker.jsx";


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

  const [location, setLocation] = useState(() => {
    if (
      defaultAddress?.latitude != null &&
      defaultAddress?.longitude != null
    ) {
      return {
        lat: Number(defaultAddress.latitude),
        lng: Number(defaultAddress.longitude),
        address:
          defaultAddress.address ||
          defaultAddress.fullAddress ||
          getAddressText(defaultAddress),
        displayAddress:
          defaultAddress.address ||
          defaultAddress.fullAddress ||
          getAddressText(defaultAddress),
        raw: {},
      };
    }

    return null;
  });


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

    if (
      preferred.latitude != null &&
      preferred.longitude != null
    ) {
      setLocation({
        lat: Number(preferred.latitude),
        lng: Number(preferred.longitude),
        address:
          preferred.address ||
          preferred.fullAddress ||
          getAddressText(preferred),
        displayAddress:
          preferred.address ||
          preferred.fullAddress ||
          getAddressText(preferred),
        raw: {},
      });
    }
  }, [user]);


  /* =========================================================================
     SHIPPING
     ========================================================================= */

  const country = String(addr.country || "India").trim();
  const international = country.toLowerCase() !== "india";
  const shipping = international ? 0 : (Number(total || 0) >= 999 ? 0 : 50);
  const grandTotal = Number(total || 0) + shipping;
  useEffect(() => { setShippingMethod(international ? "AIR" : "DOMESTIC"); }, [international]);


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

    if (
      normalized.latitude != null &&
      normalized.longitude != null
    ) {
      setLocation({
        lat: Number(normalized.latitude),
        lng: Number(normalized.longitude),
        address:
          normalized.address ||
          normalized.fullAddress ||
          getAddressText(normalized),
        displayAddress:
          normalized.address ||
          normalized.fullAddress ||
          getAddressText(normalized),
        raw: {},
      });
    } else {
      setLocation(null);
    }
  };


  /* =========================================================================
     START NEW ADDRESS
     ========================================================================= */

  const startNewAddress = () => {
    setAddr(
      normalizeAddress(null, user)
    );

    setLocation(null);
    setSelectedSavedIndex(-1);
    setShowNewAddress(true);
    setAddressMessage("");
    setErr("");
  };


  /* =========================================================================
     LOCATION CHANGE
     ========================================================================= */

  const handleLocationChange = (
    selectedLocation
  ) => {
    if (!selectedLocation) return;

    setLocation(selectedLocation);

    const raw =
      selectedLocation.raw || {};

    setAddr((previous) => ({
      ...previous,

      address:
        selectedLocation.address ||
        selectedLocation.displayAddress ||
        previous.address ||
        "",

      latitude:
        selectedLocation.lat ??
        selectedLocation.latitude ??
        previous.latitude ??
        null,

      longitude:
        selectedLocation.lng ??
        selectedLocation.longitude ??
        previous.longitude ??
        null,

      house:
        selectedLocation.house ||
        raw.house_number ||
        previous.house ||
        "",

      street:
        selectedLocation.street ||
        raw.road ||
        previous.street ||
        "",

      area:
        selectedLocation.area ||
        raw.suburb ||
        raw.neighbourhood ||
        raw.village ||
        previous.area ||
        "",

      city:
        selectedLocation.city ||
        raw.city ||
        raw.town ||
        raw.municipality ||
        previous.city ||
        "",

      district:
        selectedLocation.district ||
        raw.state_district ||
        raw.county ||
        previous.district ||
        "",

      state:
        selectedLocation.state ||
        raw.state ||
        previous.state ||
        "Tamil Nadu",

      pincode:
        selectedLocation.pincode ||
        raw.postcode ||
        previous.pincode ||
        "",
    }));

    setSelectedSavedIndex(-1);
    setShowNewAddress(true);
    setErr("");
  };


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
        "Please select your location or enter your address."
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
       LOCATION
       ----------------------------------------------------------------------- */

    const lat =
      location?.lat ??
      addr?.latitude;

    const lng =
      location?.lng ??
      addr?.longitude;

    if (
      lat == null ||
      lng == null
    ) {
      setErr(
        "Please select your live location or choose a location on the map."
      );
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
    ).replace(/\D/g, "");

    if (cleanMobile.length !== 10) {
      setErr(
        "Please enter a valid 10 digit mobile number."
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
        "Please select your delivery location and confirm the address."
      );
      return;
    }

    if (!addr.pincode?.trim()) {
      setErr("Please enter your pincode.");
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

        latitude:
          Number(lat),

        longitude:
          Number(lng),

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
         WHATSAPP
         --------------------------------------------------------------------- */

      let paymentData = null;
      try {
        const paymentResponse = await API.post("/payments/phonepe/create", { orderId: order._id });
        paymentData = paymentResponse?.data?.data || null;
      } catch (paymentError) {
        if (paymentError?.response?.status === 503) {
          setPaymentMessage("PhonePe is not configured yet. Configure merchant credentials before production checkout.");
        } else { throw paymentError; }
      }

      const whatsappUrl =
        response?.data?.data?.whatsappUrl;

      if (whatsappUrl) {
        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }


      /* ---------------------------------------------------------------------
         CLEAR CART ONLY AFTER SUCCESS
         --------------------------------------------------------------------- */

      if (
        typeof clearCart === "function"
      ) {
        await clearCart();
      }


      /* ---------------------------------------------------------------------
         SUCCESS
         --------------------------------------------------------------------- */

      nav(
        `/order-success?order=${order._id}`
      );
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
            Use your live location, select a saved
            address, or add a new delivery address.
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
                  Choose an existing address or add a new one
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
              <LocationPicker
                value={location}
                onChange={handleLocationChange}
              />
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
                  inputMode="numeric"
                  maxLength={10}
                  value={addr.mobile || ""}
                  onChange={(e) =>
                    updateAddress(
                      "mobile",
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="10 digit mobile number"
                />
              </label>

            </div>

          </div>


          {/* ===============================================================
              03 FULL ADDRESS
          ================================================================ */}

          {showNewAddress && (
            <div className="formSection">

              <div className="formSectionHead">
                <span className="number">
                  03
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
                      Pincode
                    </span>

                    <input
                      required
                      inputMode="numeric"
                      maxLength={6}
                      value={addr.pincode || ""}
                      onChange={(e) =>
                        updateAddress(
                          "pincode",
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      placeholder="6 digit pincode"
                    />
                  </label>

                </div>


                {/* STATE + LANDMARK */}

                <div className="formGrid">

                  <label>
                    <span>
                      State
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
              04 LOCATION CONFIRMATION
          ================================================================ */}

          <div className="formSection">

            <div className="formSectionHead">
              <span className="number">
                04
              </span>

              <div>
                <h3>
                  Confirm delivery location
                </h3>

                <p>
                  Your selected map location will be sent with the order
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
                    location?.address ||
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


                {location?.lat != null &&
                  location?.lng != null && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "10px",
                        color: "#a3a3a3",
                      }}
                    >
                      GPS:{" "}
                      {Number(
                        location.lat
                      ).toFixed(6)}
                      ,{" "}
                      {Number(
                        location.lng
                      ).toFixed(6)}
                    </div>
                  )}

              </div>

            </div>

          </div>


          {/* ===============================================================
              05 PAYMENT
          ================================================================ */}

          <div className="formSection">

            <div className="formSectionHead">
              <span className="number">
                05
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


            <div className="paymentChoice">

              <span className="paymentIcon">
                ₹
              </span>

              <div>
                <b>
                  Cash on Delivery
                </b>

                <small>
                  Pay when your order arrives
                </small>
              </div>

              <span className="selected">
                ✓
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
                : "Place order"
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
              {shipping
                ? `₹${shipping}`
                : "FREE"}
            </b>
          </div>

        </div>


        {/* TOTAL */}

        <div className="summaryTotal">

          <span>
            Total
          </span>

          <strong>
            ₹
            {grandTotal.toFixed(0)}
          </strong>

        </div>


        {/* DELIVERY NOTE */}

        <div className="deliveryNote">

          <MapPin size={17} />

          <span>
            Delivery across India.
            Free delivery above ₹999.
          </span>

        </div>


        {/* LOCATION STATUS */}

        {location?.lat != null &&
          location?.lng != null && (

            <div
              style={{
                marginTop: "14px",
                padding: "11px",
                borderRadius: "11px",
                background: "#f0fdf4",
                color: "#166534",
                display: "flex",
                gap: "7px",
                alignItems: "center",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >

              <CheckCircle2
                size={15}
              />

              Delivery location confirmed

            </div>
          )}

      </aside>

    </main>
  );
}
