import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { API } from "../api/http.js";
import { useAuth } from "./AuthContext.jsx";

const C = createContext(null);

const key = "RR MASALA_guest_cart";

/* =========================================================================
   PUBLIC STOCK STATE

   Customer-facing APIs should expose:
     inStock: true / false
     stockStatus: "in_stock" / "out_of_stock"

   They should NOT expose the exact stock quantity.
   ========================================================================= */

function isProductInStock(product) {
  if (!product) return false;

  // If the API supplied an explicit public status, trust it.
  if (
    product.inStock !== undefined ||
    product.stockStatus !== undefined
  ) {
    return (
      product.inStock === true ||
      product.stockStatus === "in_stock"
    );
  }

  // Backward compatibility only.
  const stock = Number(product.stock);
  return Number.isFinite(stock) && stock > 0;
}

/* =========================================================================
   SAFE LOCAL STORAGE
   ========================================================================= */

function getGuestCart() {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        item.product &&
        item.product._id &&
        Number(item.quantity) > 0
    );
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

/* =========================================================================
   CART PROVIDER
   ========================================================================= */

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [items, setItems] = useState(() =>
    getGuestCart()
  );

  /* =========================================================================
     LOAD CART
     ========================================================================= */

  useEffect(() => {
    let active = true;

    if (!user) {
      setItems(getGuestCart());
      return () => {
        active = false;
      };
    }

    API.get("/cart")
      .then((response) => {
        if (!active) return;

        const serverItems =
          response?.data?.data?.cart?.items || [];

        const validItems = serverItems
          .filter(
            (item) =>
              item &&
              item.product &&
              item.product._id &&
              Number(item.quantity) > 0
          )
          .map((item) => ({
            product: item.product,
            quantity: Number(item.quantity),
          }));

        setItems(validItems);
      })
      .catch((error) => {
        if (!active) return;

        console.error(
          "Failed to load cart:",
          error
        );

        setItems([]);
      });

    return () => {
      active = false;
    };
  }, [user]);

  /* =========================================================================
     SAVE GUEST CART
     ========================================================================= */

  useEffect(() => {
    if (user) return;

    try {
      const validItems = items.filter(
        (item) =>
          item &&
          item.product &&
          item.product._id &&
          Number(item.quantity) > 0
      );

      localStorage.setItem(
        key,
        JSON.stringify(validItems)
      );
    } catch (error) {
      console.error(
        "Failed to save guest cart:",
        error
      );
    }
  }, [items, user]);

  /* =========================================================================
     SET QUANTITY

     IMPORTANT:
     We do NOT compare against product.stock on the
     customer side because the public API hides exact stock.

     The server must perform the authoritative quantity
     validation against MongoDB stock.
     ========================================================================= */

  const setQty = async (product, quantity) => {
    if (!product || !product._id) {
      console.warn(
        "Invalid product passed to cart."
      );
      return;
    }

    const productId = product._id;
    const nextQuantity = Math.floor(
      Number(quantity)
    );

    if (!Number.isFinite(nextQuantity)) {
      throw new Error("Invalid quantity");
    }

    /* -----------------------------------------------------------------------
       REMOVE PRODUCT
       ----------------------------------------------------------------------- */

    if (nextQuantity < 1) {
      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            String(item?.product?._id) !==
            String(productId)
        )
      );

      if (user) {
        try {
          await API.put("/cart", {
            productId,
            quantity: 0,
          });
        } catch (error) {
          console.error(
            "Failed to remove product from server cart:",
            error
          );
        }
      }

      return;
    }

    /* -----------------------------------------------------------------------
       PUBLIC STOCK CHECK

       If the product is explicitly unavailable, do not allow
       the customer to add/update it.
       ----------------------------------------------------------------------- */

    if (!isProductInStock(product)) {
      throw new Error(
        "This product is currently out of stock."
      );
    }

    /* -----------------------------------------------------------------------
       UPDATE LOCAL STATE
       ----------------------------------------------------------------------- */

    setItems((currentItems) => {
      const cleanedItems = currentItems.filter(
        (item) =>
          item &&
          item.product &&
          item.product._id
      );

      const index = cleanedItems.findIndex(
        (item) =>
          String(item.product._id) ===
          String(productId)
      );

      if (index < 0) {
        return [
          ...cleanedItems,
          {
            product,
            quantity: nextQuantity,
          },
        ];
      }

      const nextItems = [...cleanedItems];

      nextItems[index] = {
        ...nextItems[index],
        product,
        quantity: nextQuantity,
      };

      return nextItems;
    });

    /* -----------------------------------------------------------------------
       UPDATE SERVER CART

       The backend must validate actual stock here.
       ----------------------------------------------------------------------- */

    if (user) {
      try {
        await API.put("/cart", {
          productId,
          quantity: nextQuantity,
        });
      } catch (error) {
        /*
         * Roll back is handled by reloading the server cart.
         * This prevents the UI from permanently showing an
         * invalid server quantity.
         */

        console.error(
          "Failed to update server cart:",
          error
        );

        try {
          const response = await API.get("/cart");

          const serverItems =
            response?.data?.data?.cart?.items || [];

          const validItems = serverItems
            .filter(
              (item) =>
                item &&
                item.product &&
                item.product._id &&
                Number(item.quantity) > 0
            )
            .map((item) => ({
              product: item.product,
              quantity: Number(item.quantity),
            }));

          setItems(validItems);
        } catch (reloadError) {
          console.error(
            "Failed to reload cart after update error:",
            reloadError
          );
        }

        throw new Error(
          error?.response?.data?.message ||
            error?.message ||
            "Could not update cart."
        );
      }
    }
  };

  /* =========================================================================
     CLEAR CART
     ========================================================================= */

  const clearCart = async () => {
    const currentItems = Array.isArray(items)
      ? items
      : [];

    setItems([]);

    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore localStorage errors.
    }

    if (user) {
      const validItems = currentItems.filter(
        (item) =>
          item &&
          item.product &&
          item.product._id
      );

      await Promise.allSettled(
        validItems.map((item) =>
          API.put("/cart", {
            productId: item.product._id,
            quantity: 0,
          })
        )
      );
    }
  };

  /* =========================================================================
     COUNT
     ========================================================================= */

  const count = items.reduce(
    (sum, item) => {
      if (
        !item ||
        !item.product ||
        !item.product._id
      ) {
        return sum;
      }

      return (
        sum +
        Number(item.quantity || 0)
      );
    },
    0
  );

  /* =========================================================================
     TOTAL
     ========================================================================= */

  const total = items.reduce(
    (sum, item) => {
      if (
        !item ||
        !item.product ||
        !item.product._id
      ) {
        return sum;
      }

      const price = Number(
        item.product.price || 0
      );

      const quantity = Number(
        item.quantity || 0
      );

      return sum + price * quantity;
    },
    0
  );

  return (
    <C.Provider
      value={{
        items,
        setQty,
        clearCart,
        count,
        total,
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useCart = () => {
  const context = useContext(C);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};
