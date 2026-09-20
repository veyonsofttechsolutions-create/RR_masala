import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/*
  RR MASALA - Location Picker

  Expected props:
    <LocationPicker
      value={location}
      onChange={(location) => ...}
    />

  onChange returns:
  {
    lat,
    lng,
    address,
    displayAddress,
    house,
    street,
    area,
    city,
    district,
    state,
    pincode,
    raw
  }

  IMPORTANT:
  This file intentionally uses a DEFAULT EXPORT because Checkout.jsx imports:
    import LocationPicker from "../components/LocationPicker.jsx";
*/

const DEFAULT_CENTER = [10.8505, 78.6500]; // Tamil Nadu fallback
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

const markerIcon = L.divIcon({
  className: "rr-location-marker-wrap",
  html: `
    <div class="rr-location-marker">
      <div class="rr-location-marker-pin">●</div>
    </div>
  `,
  iconSize: [42, 50],
  iconAnchor: [21, 45],
});

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function extractAddress(result) {
  const a = result?.address || {};

  return {
    house: cleanText(a.house_number),
    street: cleanText(a.road || a.pedestrian || a.footway),
    area: cleanText(
      a.suburb ||
      a.neighbourhood ||
      a.residential ||
      a.village ||
      a.hamlet
    ),
    city: cleanText(
      a.city ||
      a.town ||
      a.municipality ||
      a.city_district
    ),
    district: cleanText(
      a.state_district ||
      a.county
    ),
    state: cleanText(a.state),
    pincode: cleanText(a.postcode),
  };
}

function formatDisplayAddress(result) {
  if (!result) return "";

  if (result.display_name) {
    return result.display_name;
  }

  const parts = [
    result.address?.house_number,
    result.address?.road,
    result.address?.suburb,
    result.address?.neighbourhood,
    result.address?.city,
    result.address?.town,
    result.address?.district,
    result.address?.state,
    result.address?.postcode,
  ].filter(Boolean);

  return parts.join(", ");
}

async function reverseGeocode(lat, lng, signal) {
  const url =
    `${NOMINATIM_URL}/reverse?format=jsonv2` +
    `&lat=${encodeURIComponent(lat)}` +
    `&lon=${encodeURIComponent(lng)}` +
    `&zoom=18&addressdetails=1`;

  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch the address for this location.");
  }

  return response.json();
}

async function searchGeocode(query, signal) {
  const url =
    `${NOMINATIM_URL}/search?format=jsonv2` +
    `&q=${encodeURIComponent(query)}` +
    `&limit=1&addressdetails=1`;

  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to search this location.");
  }

  const data = await response.json();

  if (!Array.isArray(data) || !data.length) {
    throw new Error("Location not found. Try a more specific address.");
  }

  return data[0];
}

function buildLocation(result, fallbackLat, fallbackLng) {
  const lat = safeNumber(result?.lat ?? fallbackLat);
  const lng = safeNumber(result?.lon ?? fallbackLng);

  if (lat == null || lng == null) {
    throw new Error("Invalid map coordinates.");
  }

  const parts = extractAddress(result);
  const displayAddress = formatDisplayAddress(result);

  return {
    lat,
    lng,
    address: displayAddress,
    displayAddress,
    ...parts,
    raw: result?.address || {},
  };
}

function MapController({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (
      selected?.lat == null ||
      selected?.lng == null
    ) {
      return;
    }

    map.flyTo(
      [Number(selected.lat), Number(selected.lng)],
      Math.max(map.getZoom(), 16),
      {
        duration: 0.7,
      }
    );
  }, [map, selected?.lat, selected?.lng]);

  return null;
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export default function LocationPicker({ value = null, onChange }) {
  const initial = useMemo(() => {
    const lat = safeNumber(value?.lat ?? value?.latitude);
    const lng = safeNumber(value?.lng ?? value?.longitude);

    if (lat != null && lng != null) {
      return [lat, lng];
    }

    return DEFAULT_CENTER;
  }, [value?.lat, value?.lng, value?.latitude, value?.longitude]);

  const [selected, setSelected] = useState(() => {
    const lat = safeNumber(value?.lat ?? value?.latitude);
    const lng = safeNumber(value?.lng ?? value?.longitude);

    return lat != null && lng != null
      ? {
          ...value,
          lat,
          lng,
          address:
            value?.address ||
            value?.displayAddress ||
            "",
        }
      : null;
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const lat = safeNumber(value?.lat ?? value?.latitude);
    const lng = safeNumber(value?.lng ?? value?.longitude);

    if (lat == null || lng == null) {
      return;
    }

    setSelected((previous) => ({
      ...(previous || {}),
      ...(value || {}),
      lat,
      lng,
      address:
        value?.address ||
        value?.displayAddress ||
        previous?.address ||
        "",
    }));
  }, [
    value?.lat,
    value?.lng,
    value?.latitude,
    value?.longitude,
    value?.address,
    value?.displayAddress,
  ]);

  const notifyParent = (nextLocation) => {
    setSelected(nextLocation);
    setError("");
    setMessage("Delivery location selected.");

    if (typeof onChange === "function") {
      onChange(nextLocation);
    }
  };

  const pickCoordinates = async (lat, lng) => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError("");
      setMessage("Finding the address...");

      const result = await reverseGeocode(
        Number(lat),
        Number(lng),
        controller.signal
      );

      const nextLocation = buildLocation(
        result,
        lat,
        lng
      );

      notifyParent(nextLocation);
    } catch (err) {
      if (err?.name === "AbortError") return;

      /*
        Even if reverse geocoding fails, preserve the coordinates.
        Checkout can still use lat/lng and the customer can enter
        the address fields manually.
      */
      const fallback = {
        lat: Number(lat),
        lng: Number(lng),
        address: "",
        displayAddress: "",
        house: "",
        street: "",
        area: "",
        city: "",
        district: "",
        state: "Tamil Nadu",
        pincode: "",
        raw: {},
      };

      setSelected(fallback);

      if (typeof onChange === "function") {
        onChange(fallback);
      }

      setError(
        "Location selected, but address lookup failed. Please enter the address details manually."
      );
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (event) => {
    event?.preventDefault();

    const query = search.trim();

    if (!query) {
      setError("Enter an address, area, city or pincode to search.");
      return;
    }

    const controller = new AbortController();

    try {
      setLoading(true);
      setError("");
      setMessage("Searching location...");

      const result = await searchGeocode(
        query,
        controller.signal
      );

      const nextLocation = buildLocation(result);

      notifyParent(nextLocation);
    } catch (err) {
      if (err?.name === "AbortError") return;

      setMessage("");
      setError(
        err?.message ||
        "Could not find this location."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedPosition =
    selected?.lat != null && selected?.lng != null
      ? [Number(selected.lat), Number(selected.lng)]
      : null;

  return (
    <section className="rrLocationPicker">
      <style>{`
        .rrLocationPicker {
          width: 100%;
          border: 1px solid #e7ded5;
          border-radius: 18px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(54, 27, 10, .07);
        }

        .rrLocationTop {
          padding: 16px;
          background: linear-gradient(135deg, #fffaf0, #fff);
          border-bottom: 1px solid #eee5dc;
        }

        .rrLocationTitle {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 12px;
        }

        .rrLocationTitle h4 {
          margin: 0;
          color: #29150d;
          font-size: 15px;
          font-weight: 850;
        }

        .rrLocationTitle p {
          margin: 4px 0 0;
          color: #81766e;
          font-size: 11px;
          line-height: 1.55;
        }


        .rrLocationSearch {
          display: flex;
          gap: 8px;
        }

        .rrLocationSearch input {
          flex: 1;
          min-width: 0;
          height: 43px;
          padding: 0 13px;
          border: 1px solid #ded4ca;
          border-radius: 10px;
          outline: 0;
          color: #2a1a12;
          background: #fff;
          font-size: 12px;
        }

        .rrLocationSearch input:focus {
          border-color: #c58b20;
          box-shadow: 0 0 0 3px rgba(197,139,32,.10);
        }

        .rrSearchButton {
          height: 43px;
          padding: 0 15px;
          border: 0;
          border-radius: 10px;
          background: #f6b71c;
          color: #20150d;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .rrSearchButton:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .rrMapShell {
          position: relative;
          width: 100%;
          height: 340px;
          background: #eee;
        }

        .rrMap {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .rrMapHint {
          position: absolute;
          z-index: 500;
          left: 12px;
          top: 12px;
          padding: 8px 11px;
          border-radius: 9px;
          background: rgba(255,255,255,.94);
          border: 1px solid rgba(80,50,30,.10);
          color: #5f5148;
          box-shadow: 0 4px 14px rgba(0,0,0,.10);
          font-size: 10px;
          font-weight: 700;
          pointer-events: none;
        }

        .rrLocationStatus {
          padding: 13px 16px;
          border-top: 1px solid #eee5dc;
          background: #fff;
        }

        .rrLocationStatus strong {
          display: block;
          margin-bottom: 4px;
          color: #2b180e;
          font-size: 11px;
        }

        .rrLocationAddress {
          color: #74685f;
          font-size: 11px;
          line-height: 1.55;
          word-break: break-word;
        }

        .rrLocationCoords {
          margin-top: 5px;
          color: #998d84;
          font-size: 9px;
        }

        .rrLocationMessage {
          margin-top: 8px;
          color: #24703d;
          font-size: 10px;
          font-weight: 700;
        }

        .rrLocationError {
          margin-top: 8px;
          padding: 9px 10px;
          border-radius: 9px;
          background: #fff4f3;
          border: 1px solid #f2d0cc;
          color: #a52b22;
          font-size: 10px;
          line-height: 1.5;
          font-weight: 700;
        }

        .rr-location-marker-wrap {
          background: transparent;
          border: 0;
        }

        .rr-location-marker {
          width: 42px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          filter: drop-shadow(0 5px 4px rgba(0,0,0,.24));
        }

        .rr-location-marker-pin {
          width: 32px;
          height: 32px;
          margin-top: 3px;
          display: grid;
          place-items: center;
          border: 4px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: #7b2d12;
          color: #f6b71c;
          font-size: 10px;
        }

        .rr-location-marker-pin::first-letter {
          transform: rotate(45deg);
        }

        @media (max-width: 620px) {
          .rrLocationTitle {
            flex-direction: column;
          }

          .rrLocationSearch {
            flex-direction: column;
          }

          .rrSearchButton {
            width: 100%;
          }

          .rrMapShell {
            height: 300px;
          }
        }
      `}</style>

      <div className="rrLocationTop">
        <div className="rrLocationTitle">
          <div>
            <h4>Choose delivery location</h4>
            <p>
              Search an address or tap directly on the map to choose
              your delivery location. Live location is not used.
            </p>
          </div>
        </div>

        <form
          className="rrLocationSearch"
          onSubmit={searchLocation}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search area, street, city or pincode"
            aria-label="Search delivery location"
          />

          <button
            type="submit"
            className="rrSearchButton"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      <div className="rrMapShell">
        <div className="rrMapHint">
          Tap the map to choose your exact delivery point
        </div>

        <MapContainer
          center={initial}
          zoom={selectedPosition ? 16 : 7}
          scrollWheelZoom
          className="rrMap"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController selected={selected} />

          <MapClickHandler
            onPick={pickCoordinates}
          />

          {selectedPosition && (
            <Marker
              position={selectedPosition}
              icon={markerIcon}
            />
          )}
        </MapContainer>
      </div>

      <div className="rrLocationStatus">
        <strong>
          {selectedPosition
            ? "Delivery location selected"
            : "No location selected yet"}
        </strong>

        {selected?.address ? (
          <div className="rrLocationAddress">
            {selected.address}
          </div>
        ) : selectedPosition ? (
          <div className="rrLocationAddress">
            Coordinates selected. Enter/confirm your address
            details below.
          </div>
        ) : (
          <div className="rrLocationAddress">
            Search for your address or select a point directly on the map.
          </div>
        )}

        {message && (
          <div className="rrLocationMessage">
            {message}
          </div>
        )}

        {error && (
          <div className="rrLocationError">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
