import dotenv from "dotenv";
dotenv.config();
const split = (value) => String(value || "").split(",").map(v => v.trim()).filter(Boolean);
export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5174",
  clientUrls: [...new Set([process.env.CLIENT_URL || "http://localhost:5174", ...split(process.env.CLIENT_URLS)])],
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  secureCookie: process.env.COOKIE_SECURE === "true",
  storeName: process.env.STORE_NAME || "RR MASALA",
  currency: process.env.CURRENCY || "INR",
  shippingFee: Number(process.env.DOMESTIC_SHIPPING_FEE ?? process.env.SHIPPING_FEE ?? 50),
  freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD || 999),
  internationalAirShippingFee: Number(process.env.INTERNATIONAL_AIR_SHIPPING_FEE || 0),
  internationalSeaShippingFee: Number(process.env.INTERNATIONAL_SEA_SHIPPING_FEE || 0),
  returnWindowDays: Number(process.env.RETURN_WINDOW_DAYS || 7),
  whatsappAdmin: process.env.WHATSAPP_ADMIN_NUMBER || "",
  phonePe: {
    env: process.env.PHONEPE_ENV || "sandbox",
    merchantId: process.env.PHONEPE_MERCHANT_ID || "",
    saltKey: process.env.PHONEPE_SALT_KEY || "",
    saltIndex: process.env.PHONEPE_SALT_INDEX || "1",
    redirectUrl: process.env.PHONEPE_REDIRECT_URL || "",
    callbackUrl: process.env.PHONEPE_CALLBACK_URL || "",
  },
  allowManualUpi: process.env.ALLOW_MANUAL_UPI === "true",
  storeUpiId: process.env.STORE_UPI_ID || "",
};
