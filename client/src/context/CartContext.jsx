import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { API } from "../api/http.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

const STORAGE_KEY = "RR MASALA_guest_cart";

function isValidCartItem(item) {
  return Boolean(
    item &&
      item.product &&
      item.product._id &&
      Number(item.quantity) > 0
  );
}

function normalizeItem(item) {
  if (!item?.product?._id) return null;

  const quantity = Math.floor(Number(item.quantity));

  if (!Number.isFinite(quantity) || quantity < 1) {
    return null;
  }

  return {
    product: item.product,
    quantity,
  };
}

function cleanItems(items) {
  if (!Array.isArray(items)) return [];

  const map = new Map();

  for (const raw of items) {
    const item = normalizeItem(raw);
    if (!item) continue;

    const id = String(item.product._id);
    const existing = map.get(id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(id, item);
    }
  }

  return Array.from(map.values());
}

function readGuestCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    return cleanItems(JSON.parse(saved));
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }

    return [];
  }
}

function getProductId(product) {
  return String(product?._id || product?.id || "");
}

function getServerCartItems(response) {
  const items =
    response?.data?.data?.cart?.items ||
    response?.data?.cart?.items ||
    response?.data?.items ||
    [];

  return cleanItems(items);
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [items, setItems] = useState(() => readGuestCart());
  const [syncing, setSyncing] = useState(false);

  /*
   * One source of truth:
   *
   * ProductCard
   * ProductDetails
   * Cart
   * Checkout
   * Header count
   *
   * all read/write through this context.
   */

  const syncServerQuantity = useCallback(
    async (productId, quantity) => {
      if (!user || !productId) return null;

      const response = await API.put("/cart", {
        productId,
        quantity,
      });

      return getServerCartItems(response);
    },
    [user]
  );

  /*
   * Load server cart after login.
   *
   * Guest cart is merged instead of silently disappearing.
   */
  useEffect(() => {
    let active = true;

    if (!user) {
      setItems(readGuestCart());
      setSyncing(false);
      return () => {
        active = false;
      };
    }

    const load = async () => {
      setSyncing(true);

      try {
        const guestItems = readGuestCart();
        const response = await API.get("/cart");
        const serverItems = getServerCartItems(response);

        /*
         * Merge guest cart into server cart by product id.
         * Existing server quantity + guest quantity.
         */
        const mergedMap = new Map();

        for (const item of serverItems) {
          mergedMap.set(String(item.product._id), item);
        }

        for (const item of guestItems) {
          const id = String(item.product._id);
          const existing = mergedMap.get(id);

          if (existing) {
            mergedMap.set(id, {
              ...existing,
              quantity:
                Number(existing.quantity) +
                Number(item.quantity),
            });
          } else {
            mergedMap.set(id, item);
          }
        }

        const merged = Array.from(mergedMap.values());

        if (!active) return;

        setItems(merged);

        /*
         * Persist the merged guest quantities to the server.
         * Existing /cart API is reused.
         */
        if (guestItems.length) {
          await Promise.allSettled(
            guestItems.map((item) => {
              const id = String(item.product._id);
              const mergedItem = mergedMap.get(id);

              return API.put("/cart", {
                productId: id,
                quantity: Number(mergedItem?.quantity || 0),
              });
            })
          );

          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            // Ignore storage errors.
          }
        }
      } catch (error) {
        console.error("Failed to load cart:", error);

        /*
         * Do not destroy a valid guest cart if server loading fails.
         */
        if (active) {
          setItems(readGuestCart());
        }
      } finally {
        if (active) setSyncing(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user]);

  /*
   * Persist guest cart on every change.
   */
  useEffect(() => {
    if (user) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cleanItems(items))
      );
    } catch (error) {
      console.error("Failed to save guest cart:", error);
    }
  }, [items, user]);

  /*
   * Central quantity setter.
   *
   * quantity <= 0 => remove
   *
   * This is the ONLY function components need to call for
   * increasing/decreasing/removing a product.
   */
  const setQty = useCallback(
    async (product, requestedQuantity) => {
      const productId = getProductId(product);

      if (!productId) {
        throw new Error("Invalid product.");
      }

      let nextQuantity = Math.floor(Number(requestedQuantity));

      if (!Number.isFinite(nextQuantity)) {
        throw new Error("Invalid quantity.");
      }

      nextQuantity = Math.max(0, nextQuantity);

      /*
       * Client-side stock check only when exact stock is actually
       * present. Public APIs may intentionally hide exact stock.
       */
      const stock = Number(product?.stock);

      if (
        nextQuantity > 0 &&
        Number.isFinite(stock) &&
        stock >= 0 &&
        nextQuantity > stock
      ) {
        throw new Error("Insufficient stock.");
      }

      let previousItems = [];

      setItems((current) => {
        previousItems = cleanItems(current);

        const next = cleanItems(current).filter(
          (item) =>
            String(item.product._id) !== productId
        );

        if (nextQuantity > 0) {
          const existing = previousItems.find(
            (item) =>
              String(item.product._id) === productId
          );

          next.push({
            product: product || existing?.product,
            quantity: nextQuantity,
          });
        }

        return next;
      });

      /*
       * Guest cart is complete after local state update.
       */
      if (!user) {
        return;
      }

      try {
        const serverItems = await syncServerQuantity(
          productId,
          nextQuantity
        );

        /*
         * If backend returned a cart, use it as the final source.
         * Otherwise keep the optimistic state.
         */
        if (Array.isArray(serverItems)) {
          setItems(serverItems);
        }
      } catch (error) {
        /*
         * Roll back only this operation if the server rejects it.
         */
        setItems(previousItems);
        throw (
          error?.response?.data?.message ||
          error?.message ||
          new Error("Could not update cart.")
        );
      }
    },
    [syncServerQuantity, user]
  );

  const getQty = useCallback(
    (productOrId) => {
      const id =
        typeof productOrId === "object"
          ? getProductId(productOrId)
          : String(productOrId || "");

      if (!id) return 0;

      const item = items.find(
        (entry) =>
          String(entry?.product?._id) === id
      );

      return Number(item?.quantity || 0);
    },
    [items]
  );

  const increase = useCallback(
    async (product) => {
      return setQty(product, getQty(product) + 1);
    },
    [getQty, setQty]
  );

  const decrease = useCallback(
    async (product) => {
      return setQty(product, getQty(product) - 1);
    },
    [getQty, setQty]
  );

  const remove = useCallback(
    async (product) => {
      return setQty(product, 0);
    },
    [setQty]
  );

  const clearCart = useCallback(async () => {
    const currentItems = cleanItems(items);

    setItems([]);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }

    if (!user || !currentItems.length) return;

    await Promise.allSettled(
      currentItems.map((item) =>
        API.put("/cart", {
          productId: item.product._id,
          quantity: 0,
        })
      )
    );
  }, [items, user]);

  const count = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item?.quantity || 0),
        0
      ),
    [items]
  );

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item?.product?._id) return sum;

        const price =
          Number(item.product.price) || 0;
        const quantity =
          Number(item.quantity) || 0;

        return sum + price * quantity;
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      syncing,
      setQty,
      getQty,
      increase,
      decrease,
      remove,
      clearCart,
    }),
    [
      items,
      count,
      total,
      syncing,
      setQty,
      getQty,
      increase,
      decrease,
      remove,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
}
