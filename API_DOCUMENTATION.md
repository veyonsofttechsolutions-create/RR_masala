# API Documentation

Base: `/api`

## Auth
POST `/auth/register` — customer registration
POST `/auth/login` — login
POST `/auth/logout` — logout
GET `/auth/me` — current session

## Catalog
GET `/products` — paginated product search/filter
GET `/products/:slug` — product details
GET `/categories` — active categories

Admin catalog: GET `/products/admin/all`, POST `/products`, PUT `/products/:id`, DELETE `/products/:id`; GET `/categories/admin/all`, POST/PUT/DELETE category.

## Cart
GET `/cart`, PUT `/cart` with `{productId,quantity}`, DELETE `/cart`.

## Orders
POST `/orders` — authenticated customer checkout
GET `/orders/mine` — customer order history
GET `/orders/:id` — authorized order detail
POST `/orders/:id/cancel` — customer cancellation; server blocks shipped/terminal states
POST `/orders/:id/return` — delivered return request
Admin: GET `/orders/admin/all`, PATCH `/orders/:id/status`, PATCH `/orders/returns/:id`.

## Admin
GET `/admin/dashboard`, product/customer/category/banner/coupon/audit endpoints under `/api/admin` or corresponding resources.

## Realtime
Socket events: `join:user`, `join:admin`, `order:created`, `order:updated`, `order:statusChanged`, `order:cancelled`, `order:returnUpdated`.
