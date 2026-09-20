import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/* =========================================================
   Helpers
========================================================= */

const CANCELLED_STATUSES = [
  "CANCELLED",
  "CANCELED",
  "cancelled",
  "canceled",
];

const FAILED_PAYMENT_STATUSES = [
  "FAILED",
  "failed",
];

const getValidDays = (value) => {
  const days = Number(value || 30);

  if (!Number.isFinite(days)) {
    return 30;
  }

  return Math.min(Math.max(Math.floor(days), 1), 90);
};

const isSuccessfulOrderMatch = {
  orderStatus: {
    $nin: CANCELLED_STATUSES,
  },
  paymentStatus: {
    $nin: FAILED_PAYMENT_STATUSES,
  },
};

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export async function dashboard(req, res, next) {
  try {
    const [
      sales,
      orders,
      customers,
      products,
      pending,
      lowStock,
      recent,
      internationalOrders,
      domesticOrders,
    ] = await Promise.all([
      /* -----------------------------------------------
         Total Revenue
      ------------------------------------------------ */
      Order.aggregate([
        {
          $match: isSuccessfulOrderMatch,
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $ifNull: ["$grandTotal", 0],
              },
            },
          },
        },
      ]),

      /* -----------------------------------------------
         Total Orders
      ------------------------------------------------ */
      Order.countDocuments(),

      /* -----------------------------------------------
         Customers
      ------------------------------------------------ */
      User.countDocuments({
        role: "CUSTOMER",
      }),

      /* -----------------------------------------------
         Active Products
      ------------------------------------------------ */
      Product.countDocuments({
        isActive: true,
      }),

      /* -----------------------------------------------
         Pending Orders
      ------------------------------------------------ */
      Order.countDocuments({
        orderStatus: "PENDING",
      }),

      /* -----------------------------------------------
         Low Stock
         Admin can see actual stock.
      ------------------------------------------------ */
      Product.countDocuments({
        isActive: true,
        $expr: {
          $lte: [
            "$stock",
            {
              $ifNull: ["$lowStockThreshold", 10],
            },
          ],
        },
      }),

      /* -----------------------------------------------
         Recent Orders
      ------------------------------------------------ */
      Order.find()
        .populate("customer", "name email mobile")
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean(),

      /* -----------------------------------------------
         International Orders
      ------------------------------------------------ */
      Order.countDocuments({
        "shippingAddress.country": {
          $exists: true,
          $nin: ["", "India", "IN", "IND"],
        },
      }),

      /* -----------------------------------------------
         Domestic Orders
      ------------------------------------------------ */
      Order.countDocuments({
        $or: [
          {
            "shippingAddress.country": "India",
          },
          {
            "shippingAddress.country": "IN",
          },
          {
            "shippingAddress.country": "IND",
          },
        ],
      }),
    ]);

    const totalRevenue = sales[0]?.total || 0;

    return res.json({
      success: true,
      data: {
        sales: totalRevenue,

        revenue: totalRevenue,

        orders,

        customers,

        products,

        pending,

        lowStock,

        internationalOrders,

        domesticOrders,

        recent,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================================
   BUSINESS ANALYTICS
========================================================= */

export async function analytics(req, res, next) {
  try {
    const days = getValidDays(req.query.days);

    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    );

    /* =====================================================
       1. SALES / REVENUE TREND
    ===================================================== */

    const trend = await Order.aggregate([
      {
        $match: {
          ...isSuccessfulOrderMatch,

          createdAt: {
            $gte: since,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          revenue: {
            $sum: {
              $ifNull: ["$grandTotal", 0],
            },
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    /* =====================================================
       2. ORDER STATUS
    ===================================================== */

    const statuses = await Order.aggregate([
      {
        $group: {
          _id: {
            $ifNull: ["$orderStatus", "UNKNOWN"],
          },

          value: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          value: -1,
        },
      },
    ]);

    /* =====================================================
       3. TOP PRODUCTS
    ===================================================== */

    const topProducts = await Order.aggregate([
      {
        $match: isSuccessfulOrderMatch,
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: {
            name: "$items.name",
            sku: "$items.sku",
          },

          quantity: {
            $sum: {
              $ifNull: ["$items.quantity", 0],
            },
          },

          revenue: {
            $sum: {
              $multiply: [
                {
                  $ifNull: ["$items.price", 0],
                },
                {
                  $ifNull: ["$items.quantity", 0],
                },
              ],
            },
          },
        },
      },

      {
        $sort: {
          quantity: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    /* =====================================================
       4. COUNTRY ANALYTICS
    ===================================================== */

    const countries = await Order.aggregate([
      {
        $match: isSuccessfulOrderMatch,
      },

      {
        $group: {
          _id: {
            $ifNull: [
              "$shippingAddress.country",
              "Unknown",
            ],
          },

          orders: {
            $sum: 1,
          },

          revenue: {
            $sum: {
              $ifNull: ["$grandTotal", 0],
            },
          },
        },
      },

      {
        $sort: {
          orders: -1,
        },
      },

      {
        $limit: 15,
      },
    ]);

    /* =====================================================
       5. DOMESTIC VS INTERNATIONAL
    ===================================================== */

    const marketBreakdown = await Order.aggregate([
      {
        $match: isSuccessfulOrderMatch,
      },

      {
        $project: {
          grandTotal: {
            $ifNull: ["$grandTotal", 0],
          },

          country: {
            $ifNull: [
              "$shippingAddress.country",
              "Unknown",
            ],
          },
        },
      },

      {
        $group: {
          _id: {
            $cond: [
              {
                $in: [
                  "$country",
                  ["India", "IN", "IND"],
                ],
              },

              "Domestic",

              "International",
            ],
          },

          orders: {
            $sum: 1,
          },

          revenue: {
            $sum: "$grandTotal",
          },
        },
      },

      {
        $sort: {
          revenue: -1,
        },
      },
    ]);

    /* =====================================================
       6. SHIPPING METHOD
       AIR / SEA
    ===================================================== */

    const shippingMethods = await Order.aggregate([
      {
        $match: isSuccessfulOrderMatch,
      },

      {
        $group: {
          _id: {
            $toUpper: {
              $ifNull: [
                "$shippingMethod",
                "UNKNOWN",
              ],
            },
          },

          orders: {
            $sum: 1,
          },

          revenue: {
            $sum: {
              $ifNull: ["$grandTotal", 0],
            },
          },
        },
      },

      {
        $sort: {
          orders: -1,
        },
      },
    ]);

    /* =====================================================
       7. PAYMENT STATUS
    ===================================================== */

    const paymentBreakdown = await Order.aggregate([
      {
        $group: {
          _id: {
            $ifNull: [
              "$paymentStatus",
              "UNKNOWN",
            ],
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          orders: -1,
        },
      },
    ]);

    /* =====================================================
       8. LOW STOCK PRODUCTS
    ===================================================== */

    const lowStockProducts = await Product.find({
      isActive: true,

      $expr: {
        $lte: [
          "$stock",
          {
            $ifNull: [
              "$lowStockThreshold",
              10,
            ],
          },
        ],
      },
    })
      .select(
        "name sku stock lowStockThreshold price thumbnail images"
      )
      .sort({
        stock: 1,
      })
      .limit(20)
      .lean();

    /* =====================================================
       9. RESPONSE NORMALISATION
    ===================================================== */

    return res.json({
      success: true,

      data: {
        period: {
          days,
          from: since,
          to: new Date(),
        },

        salesTrend: trend.map((item) => ({
          label: item._id,

          value: Number(
            item.revenue || 0
          ),

          orders: Number(
            item.orders || 0
          ),
        })),

        orderStatus: statuses.map((item) => ({
          label: item._id,

          value: Number(
            item.value || 0
          ),
        })),

        topProducts: topProducts.map((item) => ({
          label:
            item._id?.name ||
            "Unknown Product",

          value: Number(
            item.quantity || 0
          ),

          revenue: Number(
            item.revenue || 0
          ),

          sku:
            item._id?.sku ||
            "",
        })),

        countries: countries.map((item) => ({
          label:
            item._id ||
            "Unknown",

          value: Number(
            item.orders || 0
          ),

          revenue: Number(
            item.revenue || 0
          ),
        })),

        marketBreakdown:
          marketBreakdown.map((item) => ({
            label: item._id,

            orders: Number(
              item.orders || 0
            ),

            revenue: Number(
              item.revenue || 0
            ),
          })),

        shippingMethods:
          shippingMethods.map((item) => ({
            label: item._id,

            orders: Number(
              item.orders || 0
            ),

            revenue: Number(
              item.revenue || 0
            ),
          })),

        paymentBreakdown:
          paymentBreakdown.map((item) => ({
            label: item._id,

            orders: Number(
              item.orders || 0
            ),
          })),

        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
}