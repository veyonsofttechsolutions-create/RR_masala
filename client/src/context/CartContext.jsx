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

function cleanItems(items) {
  if (!Array.isArray(items)) return [];
  const map = new Map();
  for (const raw of items) {
    if (!raw?.product?._id) continue;
    const quantity = Math.floor(Number(raw.quantity));
    if (!Number.isFinite(quantity) || quantity < 1) continue;
    const id = String(raw.product._id);
    const existing = map.get(id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      map.set(id, { product: raw.product, quantity });
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
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

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
              quantity: Number(existing.quantity) + Number(item.quantity),
            });
          } else {
            mergedMap.set(id, item);
          }
        }

        const merged = Array.from(mergedMap.values());
        if (!active) return;
        setItems(merged);

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
          } catch {}
        }
      } catch (error) {
        if (active) setItems(readGuestCart());
      } finally {
        if (active) setSyncing(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (user) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanItems(items)));
    } catch {}
  }, [items, user]);

  const setQty = useCallback(
    async (product, requestedQuantity) => {
      const productId = getProductId(product);
      if (!productId) throw new Error("Invalid product.");

      let nextQuantity = Math.floor(Number(requestedQuantity));
      if (!Number.isFinite(nextQuantity)) throw new Error("Invalid quantity.");
      nextQuantity = Math.max(0, nextQuantity);

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
          (item) => String(item.product._id) !== productId
        );

        if (nextQuantity > 0) {
          const existing = previousItems.find(
            (item) => String(item.product._id) === productId
          );
          next.push({
            product: product || existing?.product,
            quantity: nextQuantity,
          });
        }
        return next;
      });

      // Show toast message when item added or updated
      if (nextQuantity > 0) {
        const productName = product?.name || "Product";
        showToast(`${productName} added to cart successfully! 🛒`);
      }

      if (!user) return;

      try {
        const serverItems = await syncServerQuantity(productId, nextQuantity);
        if (Array.isArray(serverItems)) setItems(serverItems);
      } catch (error) {
        setItems(previousItems);
        throw (
          error?.response?.data?.message ||
          error?.message ||
          new Error("Could not update cart.")
        );
      }
    },
    [syncServerQuantity, user, showToast]
  );

  const getQty = useCallback(
    (productOrId) => {
      const id =
        typeof productOrId === "object"
          ? getProductId(productOrId)
          : String(productOrId || "");
      if (!id) return 0;
      const item = items.find((entry) => String(entry?.product?._id) === id);
      return Number(item?.quantity || 0);
    },
    [items]
  );

  const increase = useCallback(
    async (product) => setQty(product, getQty(product) + 1),
    [getQty, setQty]
  );
  const decrease = useCallback(
    async (product) => setQty(product, getQty(product) - 1),
    [getQty, setQty]
  );
  const remove = useCallback(
    async (product) => setQty(product, 0),
    [setQty]
  );

  const clearCart = useCallback(async () => {
    const currentItems = cleanItems(items);
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    if (!user || !currentItems.length) return;
    await Promise.allSettled(
      currentItems.map((item) =>
        API.put("/cart", { productId: item.product._id, quantity: 0 })
      )
    );
  }, [items, user]);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0),
    [items]
  );

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item?.product?._id) return sum;
        return sum + (Number(item.product.price) || 0) * (Number(item.quantity) || 0);
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      syncing,
      toast,
      setQty,
      getQty,
      increase,
      decrease,
      remove,
      clearCart,
    }),
    [items, count, total, syncing, toast, setQty, getQty, increase, decrease, remove, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}