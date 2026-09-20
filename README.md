# RR MASALA  — Production MERN E-commerce

A production-oriented MERN food commerce foundation with guest browsing, authentication, catalog management, cart, COD checkout, order lifecycle, realtime Socket.IO status updates, cancellation rules, return workflow, admin dashboard, WhatsApp fallback, inventory control and deployment configuration.

## Stack
React + Vite, Express, MongoDB/Mongoose, JWT HTTP-only cookie, Socket.IO, Axios, Lucide, Framer Motion-ready architecture.

## Run locally
1. Install Node 20+.
2. Copy `.env.example` to `server/.env` and configure `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.
3. `cd server && npm install && npm run seed && npm run dev`
4. In another terminal: `cd client && npm install && npm run dev`
5. Or from root after installing root dependencies: `npm run dev`.

## Seed
Default admin: `admin@RR MASALA.com` / `Admin@12345`. Change this before production. You can override with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_MOBILE` during seed.

## WhatsApp
If Cloud API credentials are not configured, the server produces a WhatsApp click-to-chat fallback URL using `WHATSAPP_ADMIN_NUMBER`. External WhatsApp failure never blocks order creation. For production Cloud API templates, implement the approved template payload in `server/src/services/whatsappService.js`.

## Images
Actual user-provided image binaries were not available in the build workspace, so a safe SVG placeholder is included. Put real images under `client/public/products/` and update `src/constants/productImageMap.js` or product records. See `IMAGE_MAPPING.md`.

## Deployment
Frontend: Vercel/Netlify with `VITE_API_URL` and `VITE_SOCKET_URL`. Backend: Render/Railway with MongoDB Atlas, `CLIENT_URL`, secure cookies and HTTPS.

## Important
This project intentionally does not implement ratings/reviews. Do not expose secrets in frontend. Use HTTPS in production. Set `COOKIE_SECURE=true` when deployed over HTTPS and configure cross-site cookie/CORS settings correctly.

## Frontend UX update

The customer storefront is intentionally guest-first: visitors can browse categories, search products, open product details, add to a local guest cart and reach checkout without logging in. Authentication is requested only when the visitor presses **Place order**. After login/register, the app returns to checkout.

The storefront includes local product artwork for all seeded products so the catalogue remains visual even before real product photographs are supplied.
