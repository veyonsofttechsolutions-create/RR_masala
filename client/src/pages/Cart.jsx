import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext.jsx";

const PLACEHOLDER = "/products/placeholder.svg";

function getProductImage(product) {
  const first = Array.isArray(product?.images)
    ? product.images[0]
    : "";

  if (first && typeof first === "object") {
    return (
      first.url ||
      first.src ||
      first.path ||
      product?.thumbnail ||
      product?.image ||
      product?.imageUrl ||
      PLACEHOLDER
    );
  }

  return (
    (typeof first === "string" && first.trim()
      ? first
      : "") ||
    product?.thumbnail ||
    product?.image ||
    product?.imageUrl ||
    PLACEHOLDER
  );
}

export default function Cart() {
  const {
    items,
    total,
    getQty,
    setQty,
    syncing,
  } = useCart();

  const navigate = useNavigate();
  const [busyId, setBusyId] = useState("");

  const itemCount = items.reduce(
    (sum, item) =>
      sum + Number(item?.quantity || 0),
    0
  );

  const shipping =
    total >= 999 || total === 0
      ? 0
      : 50;

  const grandTotal = total + shipping;

  const updateQuantity = async (
    product,
    next
  ) => {
    const id = String(product?._id || "");

    if (!id || busyId) return;

    try {
      setBusyId(id);
      await setQty(product, next);
    } catch (error) {
      window.alert(
        error?.message || "Could not update cart."
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="rrCartPage">
      <div className="rrCartShell">
        <header className="rrCartHeader">
          <div>
            <Link
              to="/products"
              className="rrCartBack"
            >
              <ArrowLeft size={15} />
              Continue shopping
            </Link>

            <span className="rrCartEyebrow">
              YOUR BAG
            </span>

            <h1>Shopping cart</h1>

            <p>
              {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}{" "}
              in your bag
            </p>
          </div>

          {items.length > 0 && (
            <div className="rrCartBadge">
              <ShoppingBag size={15} />
              {itemCount} items
            </div>
          )}
        </header>

        {!items.length ? (
          <section className="rrCartEmpty">
            <div className="rrEmptyIcon">
              <ShoppingBag size={30} />
            </div>

            <span className="rrCartEyebrow">
              YOUR BAG IS EMPTY
            </span>

            <h2>Your cart is waiting.</h2>

            <p>
              Discover something delicious for your
              pantry and bring authentic Indian
              flavours home.
            </p>

            <Link
              className="rrPrimaryButton"
              to="/products"
            >
              Start shopping
              <ArrowRight size={16} />
            </Link>

            <div className="rrEmptyBenefits">
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
          <div className="rrCartLayout">
            <section className="rrCartItemsPanel">
              <div className="rrCartPanelHead">
                <div>
                  <span className="rrCartEyebrow">
                    ITEMS
                  </span>
                  <h2>Your selected products</h2>
                </div>

                <span>
                  {itemCount}{" "}
                  {itemCount === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="rrCartItems">
                {items.map((item) => {
                  const product = item?.product;

                  if (!product?._id) return null;

                  const quantity = getQty(product);
                  const lineTotal =
                    Number(product.price || 0) *
                    quantity;

                  const isBusy =
                    busyId === String(product._id);

                  return (
                    <article
                      className="rrCartItem"
                      key={product._id}
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        className="rrCartImage"
                      >
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.src =
                              PLACEHOLDER;
                          }}
                        />
                      </Link>

                      <div className="rrCartMeta">
                        <span>
                          RR MASALA
                        </span>

                        <Link
                          to={`/product/${product.slug}`}
                        >
                          {product.name}
                        </Link>

                        <small>
                          {product.weight
                            ? `${product.weight} ${
                                product.weightUnit || ""
                              }`
                            : "Product"}
                        </small>

                        <strong>
                          ₹
                          {Number(
                            product.price || 0
                          ).toFixed(2)}
                        </strong>
                      </div>

                      <div className="rrCartQuantity">
                        <span>Quantity</span>

                        <div className="rrQtyControl">
                          <button
                            type="button"
                            disabled={
                              isBusy ||
                              quantity <= 1
                            }
                            onClick={() =>
                              updateQuantity(
                                product,
                                quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <strong>
                            {quantity}
                          </strong>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              updateQuantity(
                                product,
                                quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="rrCartLineTotal">
                        <span>Item total</span>

                        <strong>
                          ₹{lineTotal.toFixed(2)}
                        </strong>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            updateQuantity(
                              product,
                              0
                            )
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

              <div className="rrShippingProgress">
                <Truck size={18} />

                <div>
                  <strong>
                    {total >= 999
                      ? "You've unlocked FREE shipping!"
                      : `Add ₹${Math.max(
                          0,
                          999 - total
                        ).toFixed(
                          2
                        )} more for FREE shipping`}
                  </strong>

                  <span>
                    Free delivery on orders of
                    ₹999 or more.
                  </span>
                </div>
              </div>
            </section>

            <aside className="rrCartSummary">
              <span className="rrCartEyebrow">
                SUMMARY
              </span>

              <h2>Order summary</h2>

              <div className="rrSummaryRows">
                <div>
                  <span>Subtotal</span>
                  <strong>
                    ₹{total.toFixed(2)}
                  </strong>
                </div>

                <div>
                  <span>Shipping</span>
                  <strong
                    className={
                      shipping === 0
                        ? "rrFree"
                        : ""
                    }
                  >
                    {shipping
                      ? `₹${shipping.toFixed(2)}`
                      : "FREE"}
                  </strong>
                </div>
              </div>

              <div className="rrSummaryDivider" />

              <div className="rrGrandTotal">
                <div>
                  <span>Total</span>
                  <small>
                    Inclusive of applicable
                    charges
                  </small>
                </div>

                <strong>
                  ₹{grandTotal.toFixed(2)}
                </strong>
              </div>

              <button
                type="button"
                className="rrPrimaryButton rrCheckoutButton"
                disabled={syncing || !items.length}
                onClick={() =>
                  navigate("/checkout")
                }
              >
                Continue to checkout
                <ArrowRight size={17} />
              </button>

              <div className="rrCheckoutNote">
                <ShieldCheck size={14} />
                <span>
                  Your cart stays synchronized
                  across product pages and
                  checkout.
                </span>
              </div>

              <div className="rrSummaryBenefits">
                <div>
                  <Truck size={15} />
                  Reliable delivery
                </div>
                <div>
                  <ShieldCheck size={15} />
                  Secure online payment
                </div>
                <div>
                  <Sparkles size={15} />
                  Authentic products
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <style>{`
        .rrCartPage {
          min-height: 100vh;
          background: #faf7f1;
          color: #241812;
          padding: 38px 20px 90px;
        }

        .rrCartShell {
          width: min(1260px, 100%);
          margin: 0 auto;
        }

        .rrCartHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 28px;
        }

        .rrCartBack {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #766c64;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
          margin-bottom: 18px;
        }

        .rrCartBack:hover {
          color: #6e2b14;
        }

        .rrCartEyebrow {
          display: block;
          color: #8b4a25;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .16em;
        }

        .rrCartHeader h1 {
          margin: 7px 0 5px;
          color: #3c1b10;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .rrCartHeader p {
          margin: 0;
          color: #766c64;
          font-size: 14px;
        }

        .rrCartBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid #e7d8ca;
          border-radius: 999px;
          background: #fff;
          color: #5d2a17;
          font-size: 12px;
          font-weight: 850;
        }

        .rrCartLayout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 350px;
          gap: 22px;
          align-items: start;
        }

        .rrCartItemsPanel,
        .rrCartSummary,
        .rrCartEmpty {
          background: #fff;
          border: 1px solid #e9ded4;
          border-radius: 20px;
          box-shadow: 0 12px 34px rgba(61,31,12,.06);
        }

        .rrCartPanelHead {
          padding: 21px 22px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          border-bottom: 1px solid #eee4db;
        }

        .rrCartPanelHead h2,
        .rrCartSummary h2 {
          margin: 6px 0 0;
          color: #3b1b10;
          font-size: 20px;
        }

        .rrCartPanelHead > span {
          color: #766c64;
          font-size: 12px;
          font-weight: 750;
        }

        .rrCartItems {
          padding: 0 22px;
        }

        .rrCartItem {
          display: grid;
          grid-template-columns: 92px minmax(0,1fr) 132px 120px;
          gap: 17px;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee4db;
        }

        .rrCartItem:last-child {
          border-bottom: 0;
        }

        .rrCartImage {
          width: 92px;
          height: 92px;
          border-radius: 14px;
          overflow: hidden;
          background: #f5eee6;
          display: block;
        }

        .rrCartImage img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .rrCartMeta {
          min-width: 0;
        }

        .rrCartMeta > span {
          display: block;
          color: #a18f82;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
          margin-bottom: 6px;
        }

        .rrCartMeta > a {
          display: block;
          color: #2b160d;
          text-decoration: none;
          font-size: 15px;
          line-height: 1.35;
          font-weight: 850;
        }

        .rrCartMeta > a:hover {
          color: #6e2b14;
        }

        .rrCartMeta small {
          display: block;
          margin-top: 6px;
          color: #766c64;
          font-size: 11px;
        }

        .rrCartMeta > strong {
          display: block;
          margin-top: 8px;
          color: #3b1b10;
          font-size: 14px;
        }

        .rrCartQuantity > span,
        .rrCartLineTotal > span {
          display: block;
          margin-bottom: 8px;
          color: #8a7c71;
          font-size: 10px;
          font-weight: 750;
        }

        .rrQtyControl {
          display: inline-flex;
          align-items: center;
          height: 38px;
          border: 1px solid #dfd1c5;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
        }

        .rrQtyControl button {
          width: 34px;
          height: 100%;
          border: 0;
          background: transparent;
          color: #4a2011;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .rrQtyControl button:hover:not(:disabled) {
          background: #f7eee6;
        }

        .rrQtyControl button:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        .rrQtyControl strong {
          min-width: 30px;
          text-align: center;
          color: #2b160d;
          font-size: 13px;
        }

        .rrCartLineTotal {
          text-align: right;
        }

        .rrCartLineTotal > strong {
          display: block;
          color: #35170c;
          font-size: 15px;
        }

        .rrCartLineTotal > button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 9px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #a04439;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
        }

        .rrShippingProgress {
          margin: 0 22px 22px;
          padding: 14px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          border-radius: 12px;
          background: #fff8dc;
          color: #4d2b17;
        }

        .rrShippingProgress svg {
          flex: 0 0 auto;
          color: #8b4a25;
        }

        .rrShippingProgress strong {
          display: block;
          font-size: 12px;
        }

        .rrShippingProgress span {
          display: block;
          margin-top: 3px;
          color: #7b6d61;
          font-size: 11px;
        }

        .rrCartSummary {
          position: sticky;
          top: 20px;
          padding: 23px;
        }

        .rrSummaryRows {
          display: grid;
          gap: 13px;
          margin-top: 22px;
        }

        .rrSummaryRows > div {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .rrSummaryRows span {
          color: #766c64;
          font-size: 13px;
        }

        .rrSummaryRows strong {
          font-size: 13px;
        }

        .rrFree {
          color: #2f7a3c;
        }

        .rrSummaryDivider {
          height: 1px;
          margin: 18px 0;
          background: #e9ded4;
        }

        .rrGrandTotal {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .rrGrandTotal span {
          display: block;
          font-size: 14px;
          font-weight: 850;
        }

        .rrGrandTotal small {
          display: block;
          margin-top: 4px;
          color: #766c64;
          font-size: 10px;
        }

        .rrGrandTotal > strong {
          color: #35170c;
          font-size: 23px;
        }

        .rrPrimaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 46px;
          padding: 0 20px;
          border: 0;
          border-radius: 12px;
          background: #6e2b14;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
        }

        .rrPrimaryButton:hover {
          background: #51200e;
        }

        .rrPrimaryButton:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .rrCheckoutButton {
          width: 100%;
        }

        .rrCheckoutNote {
          display: flex;
          gap: 7px;
          align-items: flex-start;
          margin-top: 13px;
          color: #766c64;
          font-size: 10px;
          line-height: 1.5;
        }

        .rrSummaryBenefits {
          display: grid;
          gap: 11px;
          margin-top: 20px;
          padding-top: 17px;
          border-top: 1px solid #e9ded4;
        }

        .rrSummaryBenefits div {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #766c64;
          font-size: 11px;
        }

        .rrCartEmpty {
          max-width: 760px;
          margin: 20px auto 0;
          padding: 60px 30px;
          text-align: center;
        }

        .rrEmptyIcon {
          width: 70px;
          height: 70px;
          margin: 0 auto 18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #fff3d2;
          color: #6e2b14;
        }

        .rrCartEmpty h2 {
          margin: 9px 0 8px;
          color: #3b1b10;
          font-size: 30px;
        }

        .rrCartEmpty p {
          max-width: 520px;
          margin: 0 auto 22px;
          color: #766c64;
          font-size: 14px;
          line-height: 1.7;
        }

        .rrEmptyBenefits {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 30px;
        }

        .rrEmptyBenefits div {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #766c64;
          font-size: 11px;
        }

        @media (max-width: 1000px) {
          .rrCartLayout {
            grid-template-columns: 1fr;
          }

          .rrCartSummary {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .rrCartPage {
            padding: 25px 14px 60px;
          }

          .rrCartHeader {
            align-items: flex-start;
          }

          .rrCartBadge {
            display: none;
          }

          .rrCartItem {
            grid-template-columns: 76px minmax(0,1fr);
            gap: 12px;
          }

          .rrCartImage {
            width: 76px;
            height: 76px;
          }

          .rrCartQuantity {
            grid-column: 2;
          }

          .rrCartLineTotal {
            grid-column: 2;
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
          }

          .rrCartLineTotal > span {
            display: none;
          }

          .rrCartLineTotal > button {
            margin-top: 0;
            margin-left: auto;
          }
        }
      `}</style>
    </main>
  );
}
