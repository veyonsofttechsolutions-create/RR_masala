import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function Cart() {
  const { items, setQty, total } = useCart();
  const nav = useNavigate();

  const ship = total >= 999 || !total ? 0 : 50;
  const grandTotal = total + ship;

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main className="premiumCartPage">
      {/* HEADER */}
      <header className="cartHeader">
        <div>
          <Link to="/products" className="cartBack">
            <ArrowLeft size={15} />
            Continue shopping
          </Link>

          <span className="eyebrow">YOUR BAG</span>

          <h1>Shopping cart</h1>

          <p>
            {itemCount} {itemCount === 1 ? "item" : "items"} in
            your bag
          </p>
        </div>

        {items.length > 0 && (
          <div className="cartHeaderBadge">
            <ShoppingBag size={15} />
            {itemCount} items
          </div>
        )}
      </header>

      {!items.length ? (
        /* EMPTY CART */
        <section className="cartEmpty">
          <div className="emptyBagIcon">
            <ShoppingBag size={30} />
          </div>

          <span className="eyebrow">YOUR BAG IS EMPTY</span>

          <h2>Your cart is waiting.</h2>

          <p>
            Discover something delicious for your pantry and
            bring authentic Indian flavours home.
          </p>

          <Link className="primary emptyShopButton" to="/products">
            Start shopping
            <ArrowRight size={16} />
          </Link>

          <div className="emptyBenefits">
            <div>
              <Truck size={17} />
              <span>Reliable delivery</span>
            </div>

            <div>
              <ShieldCheck size={17} />
              <span>Secure checkout</span>
            </div>

            <div>
              <Sparkles size={17} />
              <span>Quality products</span>
            </div>
          </div>
        </section>
      ) : (
        <div className="premiumCartLayout">
          {/* CART ITEMS */}
          <section className="cartItemsPanel">
            <div className="cartPanelHead">
              <div>
                <span className="eyebrow">ITEMS</span>
                <h2>Your selected products</h2>
              </div>

              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="premiumCartItems">
              {items.map((i) => {
                const product = i.product;
                const lineTotal =
                  Number(product.price || 0) * i.quantity;

                return (
                  <article
                    className="premiumCartItem"
                    key={product._id}
                  >
                    {/* IMAGE */}
                    <Link
                      to={"/product/" + product.slug}
                      className="cartProductImage"
                    >
                      <img
                        src={
                          product.thumbnail ||
                          "/products/placeholder.svg"
                        }
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/products/placeholder.svg";
                        }}
                      />
                    </Link>

                    {/* PRODUCT INFO */}
                    <div className="premiumCartMeta">
                      <span className="cartProductLabel">
                        RR MASALA
                      </span>

                      <Link
                        to={"/product/" + product.slug}
                        className="cartProductName"
                      >
                        {product.name}
                      </Link>

                      <small>
                        {product.weight}{" "}
                        {product.weightUnit}
                      </small>

                      <strong>
                        ₹{Number(product.price || 0).toFixed(2)}
                      </strong>
                    </div>

                    {/* QUANTITY */}
                    <div className="cartQuantity">
                      <span>Quantity</span>

                      <div className="qtyControl">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            setQty(
                              product,
                              i.quantity - 1
                            )
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <b>{i.quantity}</b>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            setQty(
                              product,
                              i.quantity + 1
                            )
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div className="cartLineTotal">
                      <span>Item total</span>

                      <strong>
                        ₹{lineTotal.toFixed(2)}
                      </strong>

                      <button
                        type="button"
                        className="removeCartItem"
                        onClick={() =>
                          setQty(product, 0)
                        }
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* SHIPPING MESSAGE */}
            <div className="shippingProgress">
              <Truck size={18} />

              <div>
                <strong>
                  {total >= 999
                    ? "You've unlocked FREE shipping!"
                    : `Add ₹${Math.max(
                        0,
                        999 - total
                      ).toFixed(2)} more for FREE shipping`}
                </strong>

                <span>
                  Free delivery on orders of ₹999 or more.
                </span>
              </div>
            </div>
          </section>

          {/* SUMMARY */}
          <aside className="premiumCartSummary">
            <div className="summaryHeader">
              <span className="eyebrow">SUMMARY</span>
              <h2>Order summary</h2>
            </div>

            <div className="summaryRows">
              <div>
                <span>Subtotal</span>
                <strong>
                  ₹{total.toFixed(2)}
                </strong>
              </div>

              <div>
                <span>Shipping</span>

                <strong className={ship === 0 ? "freeText" : ""}>
                  {ship ? `₹${ship.toFixed(2)}` : "FREE"}
                </strong>
              </div>
            </div>

            <div className="summaryDivider" />

            <div className="grandTotal">
              <div>
                <span>Total</span>
                <small>Inclusive of applicable charges</small>
              </div>

              <strong>
                ₹{grandTotal.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              className="primary wide checkoutButton"
              onClick={() => nav("/checkout")}
            >
              Continue to checkout
              <ArrowRight size={17} />
            </button>

            <div className="checkoutNote">
              <ShieldCheck size={14} />

              <span>
                Login is required only when placing your
                order. Your cart is safe.
              </span>
            </div>

            <div className="summaryBenefits">
              <div>
                <Truck size={15} />
                <span>Reliable delivery</span>
              </div>

              <div>
                <ShieldCheck size={15} />
                <span>Secure payment</span>
              </div>

              <div>
                <Sparkles size={15} />
                <span>Authentic products</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style>
        {`
          .premiumCartPage {
            max-width: 1450px;
            margin: auto;
            padding: 35px clamp(18px, 5vw, 70px) 90px;
          }

          /* HEADER */

          .cartHeader {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 20px;
            margin-bottom: 27px;
          }

          .cartBack {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--muted);
            text-decoration: none;
            font-size: 9px;
            font-weight: 850;
            margin-bottom: 17px;
          }

          .cartBack:hover {
            color: var(--text);
          }

          .cartHeader h1 {
            margin: 5px 0 4px;
            font-size: clamp(28px, 4vw, 38px);
            letter-spacing: -.7px;
          }

          .cartHeader p {
            margin: 0;
            color: var(--muted);
            font-size: 10px;
          }

          .cartHeaderBadge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 9px;
            padding: 8px 10px;
            color: var(--text);
            font-size: 8px;
            font-weight: 850;
          }

          /* EMPTY */

          .cartEmpty {
            min-height: 530px;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
          }

          .emptyBagIcon {
            width: 65px;
            height: 65px;
            border-radius: 19px;
            background: #f7f4df;
            display: grid;
            place-items: center;
            margin-bottom: 20px;
          }

          .cartEmpty h2 {
            margin: 8px 0 7px;
            font-size: 22px;
          }

          .cartEmpty p {
            max-width: 370px;
            color: var(--muted);
            font-size: 10px;
            line-height: 1.6;
            margin: 0 0 20px;
          }

          .emptyShopButton {
            display: inline-flex;
            align-items: center;
            gap: 7px;
          }

          .emptyBenefits {
            display: flex;
            gap: 25px;
            margin-top: 35px;
            padding-top: 20px;
            border-top: 1px solid var(--line);
          }

          .emptyBenefits div {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--muted);
            font-size: 8px;
            font-weight: 750;
          }

          /* LAYOUT */

          .premiumCartLayout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 350px;
            align-items: start;
            gap: 16px;
          }

          .cartItemsPanel,
          .premiumCartSummary {
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 15px;
          }

          .cartItemsPanel {
            min-width: 0;
            overflow: hidden;
          }

          .cartPanelHead {
            padding: 19px 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 15px;
            border-bottom: 1px solid var(--line);
          }

          .cartPanelHead h2 {
            margin: 5px 0 0;
            font-size: 15px;
          }

          .cartPanelHead > span {
            color: var(--muted);
            font-size: 8px;
            font-weight: 750;
          }

          /* ITEMS */

          .premiumCartItems {
            padding: 0 20px;
          }

          .premiumCartItem {
            display: grid;
            grid-template-columns: 82px minmax(0, 1fr) 125px 125px;
            align-items: center;
            gap: 15px;
            padding: 18px 0;
            border-bottom: 1px solid var(--line);
          }

          .premiumCartItem:last-child {
            border-bottom: 0;
          }

          .cartProductImage {
            width: 82px;
            height: 82px;
            border-radius: 11px;
            overflow: hidden;
            background: #f5f4ee;
            display: block;
          }

          .cartProductImage img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .2s ease;
          }

          .cartProductImage:hover img {
            transform: scale(1.04);
          }

          .premiumCartMeta {
            min-width: 0;
          }

          .cartProductLabel {
            display: block;
            color: var(--muted);
            font-size: 7px;
            letter-spacing: .8px;
            font-weight: 900;
            margin-bottom: 5px;
          }

          .cartProductName {
            display: block;
            color: var(--text);
            text-decoration: none;
            font-size: 11px;
            font-weight: 850;
            line-height: 1.35;
          }

          .cartProductName:hover {
            text-decoration: underline;
          }

          .premiumCartMeta small {
            display: block;
            color: var(--muted);
            font-size: 8px;
            margin-top: 5px;
          }

          .premiumCartMeta > strong {
            display: block;
            margin-top: 7px;
            font-size: 10px;
          }

          .cartQuantity > span,
          .cartLineTotal > span {
            display: block;
            color: var(--muted);
            font-size: 7px;
            margin-bottom: 7px;
          }

          .qtyControl {
            width: fit-content;
            display: flex;
            align-items: center;
            border: 1px solid var(--line);
            border-radius: 8px;
            overflow: hidden;
            background: #fafaf7;
          }

          .qtyControl button {
            width: 29px;
            height: 29px;
            border: 0;
            background: transparent;
            display: grid;
            place-items: center;
            cursor: pointer;
            color: var(--text);
          }

          .qtyControl button:hover {
            background: #f0efdf;
          }

          .qtyControl b {
            min-width: 25px;
            text-align: center;
            font-size: 9px;
          }

          .cartLineTotal {
            text-align: right;
          }

          .cartLineTotal > strong {
            display: block;
            font-size: 11px;
          }

          .removeCartItem {
            border: 0;
            background: transparent;
            color: #a04439;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 0;
            margin-top: 7px;
            cursor: pointer;
            font: inherit;
            font-size: 7px;
            font-weight: 800;
          }

          .removeCartItem:hover {
            text-decoration: underline;
          }

          /* SHIPPING */

          .shippingProgress {
            margin: 0 20px 20px;
            padding: 13px;
            border-radius: 10px;
            background: #f8f6e7;
            display: flex;
            align-items: flex-start;
            gap: 9px;
          }

          .shippingProgress svg {
            flex-shrink: 0;
          }

          .shippingProgress strong {
            display: block;
            font-size: 9px;
          }

          .shippingProgress span {
            display: block;
            color: var(--muted);
            font-size: 7px;
            margin-top: 3px;
          }

          /* SUMMARY */

          .premiumCartSummary {
            padding: 21px;
            position: sticky;
            top: 20px;
          }

          .summaryHeader {
            margin-bottom: 21px;
          }

          .summaryHeader h2 {
            margin: 5px 0 0;
            font-size: 17px;
          }

          .summaryRows {
            display: grid;
            gap: 12px;
          }

          .summaryRows > div {
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }

          .summaryRows span {
            color: var(--muted);
            font-size: 9px;
          }

          .summaryRows strong {
            font-size: 9px;
          }

          .freeText {
            color: var(--green);
          }

          .summaryDivider {
            height: 1px;
            background: var(--line);
            margin: 17px 0;
          }

          .grandTotal {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            align-items: center;
            margin-bottom: 20px;
          }

          .grandTotal span {
            display: block;
            font-size: 11px;
            font-weight: 850;
          }

          .grandTotal small {
            display: block;
            color: var(--muted);
            font-size: 7px;
            margin-top: 3px;
          }

          .grandTotal > strong {
            font-size: 20px;
          }

          .checkoutButton {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
          }

          .checkoutNote {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            color: var(--muted);
            font-size: 7px;
            line-height: 1.5;
            margin-top: 12px;
          }

          .checkoutNote svg {
            flex-shrink: 0;
          }

          .summaryBenefits {
            border-top: 1px solid var(--line);
            margin-top: 18px;
            padding-top: 15px;
            display: grid;
            gap: 9px;
          }

          .summaryBenefits div {
            display: flex;
            align-items: center;
            gap: 7px;
            color: var(--muted);
            font-size: 8px;
          }

          @media (max-width: 1050px) {
            .premiumCartLayout {
              grid-template-columns: minmax(0, 1fr) 300px;
            }

            .premiumCartItem {
              grid-template-columns: 72px minmax(0, 1fr) 105px;
            }

            .cartLineTotal {
              grid-column: 3;
              grid-row: 1;
            }

            .cartQuantity {
              grid-column: 2;
              grid-row: 2;
            }
          }

          @media (max-width: 800px) {
            .premiumCartLayout {
              grid-template-columns: 1fr;
            }

            .premiumCartSummary {
              position: static;
            }

            .cartHeaderBadge {
              display: none;
            }
          }

          @media (max-width: 600px) {
            .premiumCartPage {
              padding: 25px 15px 60px;
            }

            .cartHeader {
              align-items: flex-start;
            }

            .premiumCartItems {
              padding: 0 14px;
            }

            .cartPanelHead {
              padding: 16px;
            }

            .premiumCartItem {
              grid-template-columns: 70px minmax(0, 1fr);
              gap: 11px;
              align-items: start;
            }

            .cartProductImage {
              width: 70px;
              height: 70px;
            }

            .cartLineTotal {
              grid-column: 2;
              grid-row: 2;
              text-align: left;
              display: flex;
              align-items: center;
              gap: 9px;
            }

            .cartLineTotal > span {
              display: none;
            }

            .cartLineTotal > strong {
              font-size: 10px;
            }

            .removeCartItem {
              margin: 0;
              margin-left: auto;
            }

            .cartQuantity {
              grid-column: 2;
              grid-row: 3;
            }

            .shippingProgress {
              margin: 0 14px 14px;
            }

            .premiumCartSummary {
              padding: 17px;
            }

            .emptyBenefits {
              flex-direction: column;
              gap: 11px;
              align-items: flex-start;
            }
          }

          @media (max-width: 380px) {
            .premiumCartItem {
              grid-template-columns: 58px minmax(0, 1fr);
            }

            .cartProductImage {
              width: 58px;
              height: 58px;
            }

            .cartProductName {
              font-size: 10px;
            }
          }
        `}
      </style>
    </main>
  );
}